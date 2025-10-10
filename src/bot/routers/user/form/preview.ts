import { Composer, InlineKeyboard } from "grammy";

import { BaseContext, State, FormData, emptyFormData } from "@/utils/fsm";
import { createForm } from "@/db/methods/create";
import { Form, Location } from "@/db/schema";

const router = new Composer<BaseContext>();

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
