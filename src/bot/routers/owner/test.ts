import { Composer } from "telegraf";

import { BaseContext } from "@/utils/fsm"

const router = new Composer<BaseContext>();

router.command("testStars", async (ctx, next) => {
    const starsAmount = 1
    await ctx.replyWithInvoice({
        title: '💞 PREMIUM 💞',
        description: 'Привелегия "Premium" на 1 месяц.',
        payload: `${ctx.update.update_id}_${Date.now()}`,
        provider_token: '', // Must be empty for Telegram Stars
        currency: 'XTR', // Telegram Stars currency code
        prices: [{ label: 'XTR', amount: starsAmount}], // Amount in smallest units (e.g., 1 Star = 100)
  });
})

export { router }
