import { Composer, Keyboard } from "grammy";

import { BaseContext, State } from "@/utils/fsm"

const router = new Composer<BaseContext>();

const geoKb = new Keyboard()
                .requestLocation("Отправить локацию")
                .oneTime().resized(true)

// Regex on letters & exclude links
router.hears(/^(?!.*(?:https?:\/\/|www\.|t\.me\/))[ \p{L}\p{N}\p{P}\p{S}]+$/u, async (ctx, next) => {
    if (ctx.session.state != State.about) return next();

    ctx.session.formData.description = ctx.message?.text
    ctx.session.state = State.location

    await ctx.reply("Отправьте вашу геолокацию", {reply_markup: geoKb})
})

export default router
