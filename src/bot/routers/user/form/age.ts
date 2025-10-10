import { Composer } from "grammy";

import { BaseContext, State } from "@/utils/fsm";

const router = new Composer<BaseContext>();

// Regex 1-120
router.hears(/^(?:1[01][0-9]|120|[1-9][0-9]?)$/, async (ctx, next) => {
  if (ctx.session.state != State.age) return next();

  const age = Number(ctx.message?.text);

  if (!age || age <= 12 || age > 40) {
    await ctx.reply("Отправьте корректный возраст");
    return;
  }

  ctx.session.formData.age = age;
  ctx.session.state = State.about;

  await ctx.reply("Отправьте описание анкеты");
});

export default router;
