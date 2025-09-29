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

export { router }
