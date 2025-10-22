import { Composer, InputFile, InlineKeyboard, CallbackQueryContext, InputMediaBuilder } from "grammy";

import { BaseContext, State } from "@/utils/fsm";
import { generate_phrase } from "@/utils/generate";
import { Texts } from "@/constants/texts";
import { menuPhoto } from "@/constants/assets";

import { createUser } from "@/db/methods/create";
import { getUserByUserId } from "@/db/methods/get";
import { updateInactive } from "@/db/methods/update";
import { menuKb } from "./menu";

import { formCreateKb, formNotVerifiedKb } from "@/bot/routers/user/form";

const router = new Composer<BaseContext>();

const startKeyboard = new InlineKeyboard()
  .text("Зарегестрироваться", "Registration")
  .row()
  .text("Смотреть анкеты", "Forms-Noreg");

const policyKeyboard = new InlineKeyboard().text("Согласен", "Reg_agree").text("Не согласен", "Reg_disagree");

async function startCommand(ctx: BaseContext) {
  const result = await getUserByUserId(ctx.from!.id);

  // Delete action messages
  if (ctx.session.message) {
    try {
      await ctx.api.deleteMessage(ctx.session.message.chat_id, ctx.session.message.message_id);
    } catch (error) {}

    switch (ctx.session.state) {
      case State.name:
      case State.age:
      case State.about:
      case State.location:
      case State.media:
      case State.confirmCreateForm:
        await ctx.reply("Создание анкеты отменено!");
        break;
    }
  }

  ctx.session.state = undefined;

  // Set as active
  if (result?.inactive) {
    await updateInactive(ctx.from!.id, false);
  }

  // Menu
  if (result?.verified) {
    let kb = menuKb;

    if (!result.form) {
      // Not created form
      kb = formCreateKb.clone().append(kb.inline_keyboard);
    } else if (!result.form.status) {
      // Created but not verified
      kb = formNotVerifiedKb.clone().append(kb.inline_keyboard);
    }

    await ctx.replyWithPhoto(menuPhoto, { reply_markup: kb });
    return;
  }

  // Scenario where user on verification
  if (result?.verification.videonote) {
    await ctx.reply(
      "Вы уже в процессе верификации, дождитесь пока вашу заявку проверит модератор.\n\nПоддержка: @Keva1z",
    );
    return;
  }

  return ctx.reply(Texts.START, { parse_mode: "MarkdownV2", reply_markup: startKeyboard });
}

router.command("start", (ctx) => startCommand(ctx));
router.callbackQuery(/openStartMenu:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const result = await getUserByUserId(ctx.from!.id);
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

  // Menu
  if (result?.verified) {
    let kb = menuKb;

    if (!result.form) {
      // Not created form
      kb = formCreateKb.clone().append(kb.inline_keyboard);
    } else if (!result.form.status) {
      // Created but not verified
      kb = formNotVerifiedKb.clone().append(kb.inline_keyboard);
    }

    try {
      await ctx.editMessageMedia(InputMediaBuilder.photo(menuPhoto), { reply_markup: kb });
      if (toDelete.length > 0) ctx.deleteMessages(toDelete);
    } catch (error) {
      await ctx.deleteMessage();
    }
    return;
  }

  await ctx.deleteMessage();
});

// Policy before videonote
router.callbackQuery("Registration", async (ctx, next) => {
  if (ctx.session.state) return next();

  await ctx.deleteMessage();
  await ctx.reply(Texts.POLICY, {
    parse_mode: "MarkdownV2",
    reply_markup: policyKeyboard,
    link_preview_options: { is_disabled: true },
  });

  ctx.session.state = State.agreePolicy;
});

router.callbackQuery("Reg_agree", async (ctx, next) => {
  if (ctx.session.state != State.agreePolicy) return next();

  await ctx.deleteMessage();
  await ctx.reply("Прекрасно! Продолжаем...");
  await sendRegistration(ctx, next);
});

router.callbackQuery("Reg_disagree", async (ctx, next) => {
  if (ctx.session.state != State.agreePolicy) return next();

  await ctx.deleteMessage();
  await ctx.reply(
    "К сожалению, далее мы продолжить не можем.\nВы можете попробовать других ботов для знакомств в Telegram!\nВозвращайтесь если передумаете :)",
  );
  ctx.session.state = undefined;
});

// Send message with Registration phase
async function sendRegistration(ctx: CallbackQueryContext<BaseContext>, next: () => Promise<void>): Promise<void> {
  if (ctx.session.state != State.agreePolicy) return next();

  const phrase = generate_phrase();
  ctx.session.data.set("RegPhrase", phrase);

  await createUser({ userid: ctx.from.id }, phrase);

  await ctx.reply(Texts.REGISTRATION + phrase, { parse_mode: "MarkdownV2" });

  ctx.session.state = State.waitingVideoNote;
}

// Silence empty data
router.callbackQuery("...", async (ctx) => {
  await ctx.answerCallbackQuery();
});

// TODO: Create route on "Forms-Noreg" callback

export { router };
export default router;
