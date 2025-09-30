import { Composer } from "grammy";

import { BaseContext, State } from "@/utils/fsm"

const router = new Composer<BaseContext>();

router.command("testStars", async (ctx, next) => {
    const starsAmount = 1
    await ctx.replyWithInvoice(
        '💞 PREMIUM 💞',
        'Привелегия "Premium" на 1 месяц.',
        `${ctx.update.update_id}_${Date.now()}`,
        'XTR', // Telegram Stars currency code
        [{ label: 'XTR', amount: starsAmount}],
  );
})

router.command("testLocation", async (ctx, next) => {
    ctx.session.state = State.location
})

router.command("testMedia", async (ctx, next) => {
    ctx.session.state = State.media

    await ctx.reply("Отправь медиа")
})

router.command("testGetMedia", async (ctx, next) => {
    ctx.session.formData.media?.forEach(async (media, i) => {
        switch (media.slice(0, 1)) {
            case "p":
                await ctx.replyWithPhoto(media.slice(2), {caption: `photo ${i}`})
                break;
            case "v":
                await ctx.replyWithVideo(media.slice(2), {caption: `video ${i}`})
        }
    })

    ctx.session.formData.media = undefined
})

export { router }
