import { Composer } from "telegraf"
import { message } from "telegraf/filters"
import { fmt, mention } from "telegraf/format"
import { inlineKeyboard, button } from "telegraf/markup"

import { BaseContext, State } from "@/utils/fsm"
import env from "@/env"
import { updateVideonote } from "@/db/methods/update"

const router = new Composer<BaseContext>();

const approveKeyboard = (id: number) => inlineKeyboard([
    [button.callback("✅ Мальчик", `verifyVideonote:Male:${id}`), button.callback("✅ Девочка", `verifyVideonote:Female:${id}`)],
    [button.callback("❌ Отклонить", `verifyVideonote:Unknown:${id}`)]
]).reply_markup

// Handle user videonote 
router.on(message("video_note"), async (ctx, next) => {
    if (ctx.session.state != State.waitingVideoNote) return next();

    const uid = ctx.from.id
    const phrase = ctx.session.data.get("RegPhrase")
    const link = mention(ctx.from.first_name, ctx.from)

    const text = fmt`>> ${link}
🆔 ID: ${uid}
💭 Фраза: ${phrase}
   #Ожидает`

    // Set current videonote
    await updateVideonote(uid, ctx.message.video_note.file_id)

    // Send videonote with message
    await ctx.copyMessage(env.VIDEONOTE_CHAT)
    await ctx.telegram.sendMessage(env.VIDEONOTE_CHAT, text, {parse_mode: "MarkdownV2", reply_markup: approveKeyboard(uid)})

    await ctx.reply("Ваш кружок был отправлен на модерацию!\nПожалуйста, ожидайте решения.")

    ctx.session.state = undefined
})

export { router }
