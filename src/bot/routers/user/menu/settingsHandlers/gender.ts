import { Composer, InlineKeyboard } from "grammy";

import { BaseContext, State } from "@/utils/fsm";

import { sexEnum as sexEnumSchema } from "@/db/schema/enums";
import { settingsPhoto } from "@/constants/assets";
import { getUserSearchSettings } from "@/db/methods/get";
import { sexEnum } from "@/constants/enums";
import { fmt, b, i } from "@grammyjs/parse-mode";
import { settingsKb } from "../settings";
import { updateSearchGender } from "@/db/methods/update";

const router = new Composer<BaseContext>();

router.callbackQuery(/gender_select:(.+)$/, async (ctx, next) => {
  await ctx.deleteMessage();
  if (ctx.session.state != State.settings_gender) return next();

  const data = ctx.match[0].split(":");
  const gender = data[1] as (typeof sexEnumSchema.enumValues)[number];

  ctx.session.state = undefined;
  await updateSearchGender(ctx.from.id, gender);

  const searchSettings = await getUserSearchSettings(ctx.from!.id);

  if (!searchSettings) {
    await ctx.reply("Произошла какая-то ошибка. Обратитесь к администрации.\nВы небыли найдены в базе.");
    return;
  }

  const searchCity = searchSettings.city ? searchSettings.city : "Не указан";
  const text = fmt`🚹 ${b}Искать:${b} ${i}${sexEnum[searchSettings.searchSex][1]}${i}
👦 ${b}Диапазон:${b} ${i}${searchSettings.ageFrom}-${searchSettings.ageTo}${i}
🏙 ${b}Город:${b} ${i}${searchCity}${i}`;

  const msg = await ctx.replyWithPhoto(settingsPhoto, {
    reply_markup: settingsKb,
    caption: text.caption,
    caption_entities: text.caption_entities,
  });

  ctx.session.message = { chat_id: ctx.chat!.id, message_id: msg.message_id };
});

export default router;
