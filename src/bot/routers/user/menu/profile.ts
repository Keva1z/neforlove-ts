import { Composer, InlineKeyboard } from "grammy";

import { createFormData, profileMediaForm } from "@/utils/mediaform";
import { BaseContext, FormData, LocationData } from "@/utils/fsm";
import { parseTimestamp } from "@/utils/datetime";

import { getStatisticsByUserId, getUserByUserId, getUserLocations } from "@/db/methods/get";
import { deleteFormByUserId } from "@/db/methods/delete";

const router = new Composer<BaseContext>();

const profileKb = (mediaCount: number) =>
  new InlineKeyboard()
    .text("📝 Редактировать анкету", "change_form")
    .row()
    .text("❌ Удалить анкету", `delete_form:${mediaCount}`)
    .row()
    .text("⬅️ Назад", `openStartMenu:${mediaCount}`);

router.callbackQuery("Profile", async (ctx, next) => {
  if (ctx.session.state !== undefined) return next();

  const user = await getUserByUserId(ctx.from.id);
  const statistics = await getStatisticsByUserId(ctx.from.id);
  const locations = await getUserLocations(ctx.from.id);

  if (!user || !statistics) {
    await ctx.reply("Что-то пошло не так, напишите /start");
    ctx.session.state = undefined;
    ctx.session.message = undefined;
    await ctx.deleteMessage();
    return;
  }

  if (!user.form || !locations || !locations[0]) {
    await ctx.answerCallbackQuery("У вас не создана анкета!");
    ctx.session.state = undefined;
    ctx.session.message = undefined;
    return;
  }

  const timestamp = parseTimestamp(user.verification.verifiedAt!);
  const form = createFormData(locations[0], user.form);

  const mediaGroup = profileMediaForm(form, statistics, timestamp);
  if (mediaGroup === null) {
    console.log(mediaGroup);
    await ctx.reply("Что-то пошло не так, напишите /start");
    ctx.session.state = undefined;
    ctx.session.message = undefined;
    await ctx.deleteMessage();
    return;
  }

  await ctx.deleteMessage();
  await ctx.replyWithMediaGroup(mediaGroup);
  const msg = await ctx.reply("Выберите пункт:", { reply_markup: profileKb(user.form.media.length) });

  ctx.session.message = { chat_id: ctx.chat!.id, message_id: msg.message_id };
});

router.callbackQuery(/delete_form:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const data = ctx.match[0].split(":");

  ctx.session.message = undefined;

  const messageDeleteCount = parseInt(data[data.length - 1]);
  const msgId = ctx.callbackQuery.message!.message_id;
  let toDelete: number[] = [];

  if (messageDeleteCount > 0) {
    for (let i = msgId - 1; i > msgId - messageDeleteCount - 1; i--) {
      toDelete.push(i);
    }
  }

  await deleteFormByUserId(ctx.from.id);

  try {
    if (toDelete.length > 0) ctx.deleteMessages(toDelete);
  } catch (error) {}
  await ctx.deleteMessage();

  await ctx.reply("Анкета была удалена!\n/start - открыть меню.");
});

export default router;
