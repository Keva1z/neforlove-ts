import { Composer, InlineKeyboard } from "grammy";

import { BaseContext, State } from "@/utils/fsm"
import { getSubscriptionByUserId } from "@/db/methods/get";
import { Mutex } from "async-mutex";

// Locking media handlers, to handle media in send order
const locks = new Map<number, Mutex>();

const formStopKb = new InlineKeyboard().text("✅ Завершить", "stopForm")
const formProceedKb = new InlineKeyboard()
                        .text("✅ Да", "proceed_form")
                        .text("❌ Отмена", "cancel_form")

function getMutex(userId: number): Mutex {
  if (!locks.has(userId)) {
    locks.set(userId, new Mutex());
  }
  return locks.get(userId)!;
}

export async function getMediaLimit(userid: number) {
    const subscription = await getSubscriptionByUserId(userid)
    if (!subscription) return 0;

    switch (subscription) {
        case "Free": return 3;
        case "Premium": return 5;
        case "Legend": return 9;
        default: return 0;
    }
}

const router = new Composer<BaseContext>();

router.on(":media", async (ctx, next) => {
    if (ctx.session.state != State.media ||
        !ctx.message ||
        !ctx.session.formData.location) return next();
    const mutex = getMutex(ctx.from.id);
    let reached = false;


    await mutex.runExclusive(async () => {
        if (!ctx.session.formData.media) ctx.session.formData.media = []

        const mediaLimit = await getMediaLimit(ctx.from.id)
        let mediaLength = ctx.session.formData.media?.length
        if (mediaLength && mediaLength >= mediaLimit) return;

        const media = ctx.message.photo?.[0]?.file_id
                    ? `p:${ctx.message.photo[0].file_id}` // Photo
                    : ctx.message.video?.file_id
                    ? `v:${ctx.message.video.file_id}` // Video
                    : undefined; // Other
        if (!media) return;
        ctx.session.formData.media.push(media)

        mediaLength = ctx.session.formData.media?.length

        const markup = mediaLength && mediaLength >= mediaLimit ? undefined : formStopKb

        // const msg = await ctx.reply(`Загружено ${mediaLength}/${mediaLimit}`, {reply_markup: markup})
        try {
            if (ctx.session.message) {
                await ctx.api.deleteMessage(
                    ctx.session.message.chat_id,
                    ctx.session.message.message_id
                )
                const msg = await ctx.reply(`Загружено ${mediaLength}/${mediaLimit}`, {reply_markup: markup})
                ctx.session.message = {chat_id: msg.chat.id, message_id: msg.message_id}
            }
        } catch (error) {}

        if (mediaLength && mediaLength >= mediaLimit) {
            reached = true;
            ctx.session.message = undefined
        }
    })

    

    if (reached) {
        // TODO: Form preview

        const msg = await ctx.reply("Создать анкету?", {reply_markup: formProceedKb})
        ctx.session.state = State.confirmCreateForm
        ctx.session.message = {chat_id: msg.chat.id, message_id: msg.message_id}
    }
})

router.callbackQuery("stopForm", async (ctx, next) => {
    await ctx.deleteMessage()

    if (ctx.session.state != State.media) {
        return;
    }

    const msg = await ctx.reply("Создать анкету?", {reply_markup: formProceedKb})
    ctx.session.state = State.confirmCreateForm
    ctx.session.message = {chat_id: msg.chat.id, message_id: msg.message_id}
})

export default router
