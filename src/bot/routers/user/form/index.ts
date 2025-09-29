import { Composer, InlineKeyboard } from "grammy";

import { BaseContext, State } from "@/utils/fsm"
import { isVerified } from "@/bot/filters/verifiedFilter";

const router = new Composer<BaseContext>();

import {default as nameRouter} from "./name"
import {default as ageRouter} from "./age"
import {default as aboutRouter} from "./about"
import {default as locationRouter} from "./location"
// import {default as searchRouter} from "../menu/search"

export const formCreateKb = new InlineKeyboard().text("📝 Создать анкету", "CreateForm")

// Verified middleware
router.use(async (ctx, next) => {
    if (!ctx.from) { return; }
    if (await isVerified(ctx.from.id)) { return next() }

    try { await ctx.answerCallbackQuery("Вы не верифицированны!") } catch {}

    return;
});

router.callbackQuery("CreateForm", async (ctx, next) => {
    if (ctx.session.state) return next();

    await ctx.deleteMessage()
    await ctx.reply("Отправьте ваше имя", {parse_mode: "MarkdownV2", link_preview_options: {is_disabled: true}})

    ctx.session.state = State.name
})

// All menu routers
router.use(
    nameRouter,
    ageRouter,
    aboutRouter,
    locationRouter
)

export { router }
