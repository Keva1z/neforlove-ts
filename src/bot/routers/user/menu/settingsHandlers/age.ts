import { Composer } from "grammy";

import { BaseContext, State } from "@/utils/fsm";
import { settingsKb } from "../settings";
import { settingsPhoto } from "@/constants/assets";
import { updateSearchAge } from "@/db/methods/update";

import { getUserSearchSettings } from "@/db/methods/get";
import { sexEnum } from "@/constants/enums";
import { fmt, b, i } from "@grammyjs/parse-mode";

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

  const searchSettings = await getUserSearchSettings(ctx.from!.id);

  if (!searchSettings) {
    await ctx.reply("Произошла какая-то ошибка. Обратитесь к администрации.\nВы небыли найдены в базе.");
    return;
  }

  const searchCity = searchSettings.city ? searchSettings.city : "Не указан";
  const text = fmt`🚹 ${b}Пол:${b} ${i}${sexEnum[searchSettings.searchSex][1]}${i}
👦 ${b}Диапазон:${b} ${i}${searchSettings.ageFrom}-${searchSettings.ageTo}${i}
🏙 ${b}Город:${b} ${i}${searchCity}${i}`;

  const msg = await ctx.replyWithPhoto(settingsPhoto, {
    reply_markup: settingsKb,
    caption: text.caption,
    caption_entities: text.caption_entities,
  });

  ctx.session.message = { chat_id: ctx.chat.id, message_id: msg.message_id };
});

export default router;
