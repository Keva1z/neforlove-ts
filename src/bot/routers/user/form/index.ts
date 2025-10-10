import { Composer, InlineKeyboard } from "grammy";

import { BaseContext, State } from "@/utils/fsm";
import { isVerified } from "@/bot/filters/verifiedFilter";

const router = new Composer<BaseContext>();

import { default as nameRouter } from "./name";
import { default as ageRouter } from "./age";
import { default as aboutRouter } from "./about";
import { default as locationRouter } from "./location";
import { default as mediaRouter } from "./media";
import { default as previewRouter } from "./preview";

export const formCreateKb = new InlineKeyboard().text("📝 Создать анкету", "CreateForm");
export const formNotVerifiedKb = new InlineKeyboard().text("❗️ Анкета на верификации ❗️", "...");

// Verified middleware
// router.use(async (ctx, next) => {
//   if (!ctx.from) {
//     return;
//   }
//   if (await isVerified(ctx.from.id)) {
//     return next();
//   }

//   try {
//     await ctx.answerCallbackQuery("Вы не верифицированны!");
//   } catch {}

//   return;
// });

router.callbackQuery("CreateForm", async (ctx, next) => {
  if (ctx.session.state) return next();

  await ctx.deleteMessage();
  await ctx.reply("Отправьте ваше имя", { parse_mode: "MarkdownV2", link_preview_options: { is_disabled: true } });

  ctx.session.state = State.name;
});

// All form creation routers
router.use(nameRouter, ageRouter, aboutRouter, locationRouter, mediaRouter, previewRouter);

export { router };
