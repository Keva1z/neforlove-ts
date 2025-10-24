import { Composer, Context, InlineKeyboard } from "grammy";

import { BaseContext, State } from "@/utils/fsm";

import { updateFormStatus, updateVerifiedBy, updateVideonote, increaseModerator } from "@/db/methods/update";
import { deleteFormByUserId } from "@/db/methods/delete";
import { getUserInactive } from "@/db/methods/get";
import { sexEnum } from "@/db/schema/enums";
import { mentionUser, fmt } from "@grammyjs/parse-mode";
import { DateTime } from "luxon";
import { Texts } from "@/constants/texts";

const router = new Composer<BaseContext>();

enum formStatus {
  VERIFIED = "VERIFIED",
  DECLINED = "DECLINED",
  DELETED = "DELETED",
  DEFENCE = "DEFENCE",
}

const formStatusKb = (status: formStatus, modName: string) => {
  switch (status) {
    case formStatus.VERIFIED:
      return new InlineKeyboard().text(`✅ Одобрена. By ${modName}`, `...`);
    case formStatus.DECLINED:
      return new InlineKeyboard().text(`❌ Отклонена. By ${modName}`, `...`);
    case formStatus.DELETED:
      return new InlineKeyboard().text(`☣️ Удалена. By ${modName}`, `...`);
    case formStatus.DEFENCE:
      return new InlineKeyboard().text(`🛡 Защита 🛡`, `...`);
  }
};

// Одобрить анкету
router.callbackQuery(/ApproveVerifyForm:(.+)$/, async (ctx, next) => {
  await ctx.answerCallbackQuery();

  const data = ctx.match[0].split(":");
  const userid = Number(data[1]);
  await increaseModerator.formCount(ctx.from.id);

  const isInactive = await getUserInactive(userid);
  if (isInactive) {
    await ctx.editMessageReplyMarkup({ reply_markup: formStatusKb(formStatus.DEFENCE, ctx.from.first_name) });
    await deleteFormByUserId(userid);
    return;
  }

  const link = mentionUser(ctx.from.first_name, ctx.from.id);
  const text = Texts.FORM_ACCEPTED;

  await updateFormStatus(userid, true, ctx.from.id);

  try {
    await ctx.api.sendMessage(userid, text.text, { entities: text.entities });
    await ctx.editMessageReplyMarkup({ reply_markup: formStatusKb(formStatus.VERIFIED, ctx.from.first_name) });
  } catch (Error) {
    await ctx.editMessageReplyMarkup({ reply_markup: formStatusKb(formStatus.DEFENCE, ctx.from.first_name) });
  }
});

// Отклонить анкету
router.callbackQuery(/DeclineVerifyForm:(.+)$/, async (ctx, next) => {
  await ctx.answerCallbackQuery();

  const data = ctx.match[0].split(":");
  const userid = Number(data[1]);
  await deleteFormByUserId(userid);
  await increaseModerator.formCount(ctx.from.id);

  const isInactive = await getUserInactive(userid);
  if (isInactive) {
    await ctx.editMessageReplyMarkup({ reply_markup: formStatusKb(formStatus.DEFENCE, ctx.from.first_name) });
    return;
  }

  const link = mentionUser(ctx.from.first_name, ctx.from.id);
  const text = Texts.FORM_DECLINED(link);

  try {
    await ctx.api.sendMessage(userid, text.text, { entities: text.entities });
    await ctx.editMessageReplyMarkup({ reply_markup: formStatusKb(formStatus.DECLINED, ctx.from.first_name) });
  } catch (Error) {
    await ctx.editMessageReplyMarkup({ reply_markup: formStatusKb(formStatus.DEFENCE, ctx.from.first_name) });
  }
});

// Удалить анкету
router.callbackQuery(/DeleteVerifyForm:(.+)$/, async (ctx, next) => {
  await ctx.answerCallbackQuery();

  const data = ctx.match[0].split(":");
  const userid = Number(data[1]);

  const link = mentionUser(ctx.from.first_name, ctx.from.id);
  const text = Texts.FORM_DELETED(link);
  await deleteFormByUserId(userid);
  await updateVerifiedBy(userid, "Unknown", null);
  await updateVideonote(userid, null);

  await increaseModerator.formCount(ctx.from.id);

  const isInactive = await getUserInactive(userid);
  if (isInactive) {
    await ctx.editMessageReplyMarkup({ reply_markup: formStatusKb(formStatus.DEFENCE, ctx.from.first_name) });
    return;
  }

  try {
    await ctx.api.sendMessage(userid, text.text, { entities: text.entities });
    await ctx.editMessageReplyMarkup({ reply_markup: formStatusKb(formStatus.DELETED, ctx.from.first_name) });
  } catch (Error) {
    await ctx.editMessageReplyMarkup({ reply_markup: formStatusKb(formStatus.DEFENCE, ctx.from.first_name) });
  }
});

export { router };
