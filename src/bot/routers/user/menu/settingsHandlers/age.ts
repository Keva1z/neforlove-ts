import { Composer } from "grammy";

import { BaseContext, State } from "@/utils/fsm";
import { settingsKb } from "../settings";
import { menuPhoto } from "@/constants/assets";
import { updateSearchAge } from "@/db/methods/update";

const router = new Composer<BaseContext>();

// Regex 1-120
router.hears(/^(?:1[01][0-9]|120|[1-9][0-9]?)$/, async (ctx, next) => {
  if (ctx.session.state != State.settings_age) return next();

  const age = Number(ctx.message?.text);

  if (!age || age < 16 || age > 40) {
    await ctx.reply("Отправьте корректный возраст ( 16-40 )");
    return;
  }

  if (ctx.session.settings.age.from === undefined) {
    ctx.session.settings.age.from = age;
    await ctx.reply("Отправьте возраст до которого будет идти поиск.\n(Максимальный: 40)");
    return;
  } else {
    if (age < ctx.session.settings.age.from) {
      await ctx.reply(`Отправьте корректный возраст ( ${ctx.session.settings.age.from}-40 )`);
      return;
    }
    ctx.session.settings.age.to = age;
  }

  await ctx.reply(`Выбранный диапазон: ${ctx.session.settings.age.from}-${ctx.session.settings.age.to}`);
  await updateSearchAge(ctx.from!.id, ctx.session.settings.age.from, ctx.session.settings.age.to);

  ctx.session.state = undefined;
  ctx.session.settings.age = { from: undefined, to: undefined };

  await ctx.replyWithPhoto(menuPhoto, { reply_markup: settingsKb });
});

export default router;
