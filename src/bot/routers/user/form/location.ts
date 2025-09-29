import { Composer } from "grammy";

import { BaseContext, State } from "@/utils/fsm"

const router = new Composer<BaseContext>();

router.on(":location", async (ctx, next) => {
    if (ctx.session.state != State.location) return next();

    // TODO: Verify location and set it
    // ctx.session.formData.location = {x: 123, y: 123}
    ctx.session.state = State.media

    console.log(ctx.message?.location)
    await ctx.reply("Отправьте медиа") // TODO: Set how much media for different subscriptions
})

export default router
