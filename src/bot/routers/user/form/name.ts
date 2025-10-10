import { Composer } from "grammy";

import { BaseContext, State } from "@/utils/fsm";

const router = new Composer<BaseContext>();

// Regex on letters
router.hears(/^[\p{L}\s'-]+$/u, async (ctx, next) => {
  if (ctx.session.state != State.name) return next();

  ctx.session.formData.name = ctx.message?.text;
  ctx.session.state = State.age;

  await ctx.reply("Отправьте ваш возраст");
});

export default router;
