import { Composer } from "grammy";

import { BaseContext } from "@/utils/fsm"

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

export { router }
