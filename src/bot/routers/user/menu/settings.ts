import { Composer, InlineKeyboard, InputMediaBuilder } from "grammy";

import { BaseContext, State } from "@/utils/fsm";
import { getUserByUserId, getUserSearchSettings } from "@/db/methods/get";
import { settingsPhoto } from "@/constants/assets";
import { sexEnum } from "@/constants/enums";

import * as SettingsHandlers from "./settingsHandlers";
import { fmt, b, i } from "@grammyjs/parse-mode";

const router = new Composer<BaseContext>();
router.use(SettingsHandlers.router);

export const settingsKb = new InlineKeyboard()
  .text("🚹 Изменить пол", "change_search:gender")
  .row()
  .text("👦 Изменить возраст", "change_search:age")
  .row()
  .text("🏙 Изменить город", "change_search:city")
  .row()
  .text("⬅️ Назад", "openStartMenu:0");

router.callbackQuery("settings", async (ctx, next) => {
  if (ctx.session.state !== undefined) return next();

  const user = await getUserByUserId(ctx.from.id);
  const searchSettings = await getUserSearchSettings(ctx.from.id);
  if (!user || !searchSettings) {
    await ctx.answerCallbackQuery("Похоже вас нет...");
    return;
  }

  const searchCity = searchSettings.city ? searchSettings.city : "Не указан";
  const text = fmt`🚹 ${b}Пол:${b} ${i}${sexEnum[searchSettings.searchSex][1]}${i}
👦 ${b}Диапазон:${b} ${i}${searchSettings.ageFrom}-${searchSettings.ageTo}${i}
🏙 ${b}Город:${b} ${i}${searchCity}${i}`;

  await ctx.editMessageMedia(
    InputMediaBuilder.photo(settingsPhoto, {
      caption: text.caption,
      caption_entities: text.caption_entities,
    }),
    {
      reply_markup: settingsKb,
    },
  );

  ctx.session.message = { chat_id: ctx.chat!.id, message_id: ctx.callbackQuery.message!.message_id };
});

router.callbackQuery("change_search:age", async (ctx, next) => {
  if (ctx.session.state !== undefined) return next();

  const user = await getUserByUserId(ctx.from.id);
  if (!user || !user.form || !user.form.status || user.form.inactive) {
    await ctx.answerCallbackQuery("Вы не можете изменять настройки возраста без анкеты или с неактивной анкетой!");
    return;
  }

  if (user.form.age < 16) {
    // Автоопределение. +- 1 от возраста в анкете.
    await ctx.answerCallbackQuery("Вы не можете изменять настройки, вы младше 16...");
    return;
  }

  ctx.session.state = State.settings_age;
  await ctx.deleteMessage();

  await ctx.reply("Отправьте возраст от которого будет идти поиск.\n(Минимальный: 16)");

  ctx.session.message = undefined;
});

export default router;
