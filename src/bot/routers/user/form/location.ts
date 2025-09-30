import { Composer } from "grammy";

import { BaseContext, State } from "@/utils/fsm"
import { getLocationData } from "@/services/geoapify";
import { getMediaLimit } from "./media";

const router = new Composer<BaseContext>();

router.on(":location", async (ctx, next) => {
    if (ctx.session.state != State.location || !ctx.message) return next();

    ctx.session.state = State.media

    const lat = ctx.message?.location.latitude
    const lon = ctx.message?.location.longitude

    if (!lat || !lon) return;

    const resp = await getLocationData(lat, lon)
    if (!resp) {
        await ctx.reply("Похоже вы отправили странную геолокацию, попробуйте еще раз немного передвинув метку!")
        return;
    }

    ctx.session.formData.location = resp
    let location = `${resp.city}, ${resp.country}`

    if (!resp.city) location = `${resp.state}, ${resp.country}`;

    await ctx.reply(`Определили вашу локацию как:<b>\n${location}</b>`, {parse_mode: "HTML"})

    await ctx.reply(`Отправьте медиа 0/${await getMediaLimit(ctx.from.id)}`)
})

export default router
