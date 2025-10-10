import { Composer, InlineKeyboard } from "grammy";

import { BaseContext, State, FormData, emptyFormData } from "@/utils/fsm";
import { createForm } from "@/db/methods/create";
import { Form, Location } from "@/db/schema";
import { previewMediaForm } from "@/utils/mediaform";
import env from "@/env";
import { getUserByUserId } from "@/db/methods/get";
import { mentionUser, fmt } from "@grammyjs/parse-mode";

import { parseTimestamp } from "@/utils/datetime";

const router = new Composer<BaseContext>();

const formVerifyKb = new InlineKeyboard()
  .text("✅ Одобрить", "ApproveVerifyForm")
  .text("❌ Отклонить", "DeclineVerifyForm");

async function proceedFormCreation(userid: number, data: FormData) {
  let formData: typeof Form.$inferInsert = {
    userid,
    searchId: 0,
    locationId: 0,
    about: data.description!,
    age: data.age!,
    name: data.name!,
    media: data.media!,
  };

  let locationData: typeof Location.$inferInsert = {
    userid,
    country: data.location!.country,
    state: data.location!.state,
    city: data.location!.city,
    latitude: data.location!.lat,
    longitude: data.location!.lon,
    location: { x: data.location!.lon, y: data.location!.lat },
  };

  return await createForm(formData, locationData);
}

// Create form & send it to verification
router.callbackQuery("proceed_form", async (ctx, next) => {
  if (ctx.session.state != State.confirmCreateForm || !ctx.session.formData.media) {
    await ctx.deleteMessage();
    return next();
  }

  const data = ctx.session.formData;
  let canCreate = true;

  for (const key in data) {
    if (key === undefined) {
      await ctx.reply("Что-то пошло не так. Попробуйте создать анкету заного!");
      canCreate = false;
    }
  }

  if (canCreate) {
    const created = await proceedFormCreation(ctx.from.id, data);
    const message = ctx.session.message;
    if (created) {
      // Create & Send form to chat
      const mediaGroup = previewMediaForm(ctx.session.formData);
      const user = await getUserByUserId(ctx.from.id);
      if (mediaGroup === null || !user) {
        await ctx.reply("Что-то пошло не так, пересоздайте анкету!");
        ctx.session.state = undefined;
        ctx.session.message = undefined;
        ctx.session.formData = emptyFormData();
        return;
      }

      const link = mentionUser(ctx.from.first_name, ctx.from.id);

      const text = fmt`>> ${link}
🆔 ID: ${ctx.from.id}
✅ Верифицирован: ${parseTimestamp(user.verification.verifiedAt!)}`;
      await ctx.api.sendMediaGroup(env.FORMS_CHAT, mediaGroup);
      await ctx.api.sendVideoNote(env.FORMS_CHAT, user.verification.videonote!);
      await ctx.api.sendMessage(env.FORMS_CHAT, text.text, { entities: text.entities, reply_markup: formVerifyKb });

      if (message)
        try {
          await ctx.editMessageText(
            "Анкета успешно создана, отправили её на верификацию модераторам! Ожидайте, это может занять до 12 часов.",
            { reply_markup: undefined },
          );
        } catch (error) {
          try {
            await ctx.deleteMessage();
          } catch (error) {}
          await ctx.reply(
            "Анкета успешно создана, отправили её на верификацию модераторам! Ожидайте, это может занять до 12 часов.",
          );
        }

      // TODO: Send form to channel
    } else {
      try {
        await ctx.deleteMessage();
      } catch (error) {}
      await ctx.reply("Что-то пошло не так при создании анкеты!\nОбратитесь к администраторам");
    }
  }

  ctx.session.state = undefined;
  ctx.session.message = undefined;
  ctx.session.formData = emptyFormData();
});

// Cancel form creation
router.callbackQuery("cancel_form", async (ctx, next) => {
  if (ctx.session.state != State.confirmCreateForm || !ctx.session.formData.media) {
    await ctx.deleteMessage();
    return next();
  }

  ctx.session.state = undefined;
  ctx.session.message = undefined;
  ctx.session.formData = emptyFormData();

  try {
    await ctx.editMessageText("Создание анкеты отменено!", { reply_markup: undefined });
  } catch (error) {
    await ctx.deleteMessage();
    await ctx.reply("Создание анкеты отменено!");
  }
});

export default router;
