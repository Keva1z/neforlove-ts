import { Composer, Input } from "telegraf";
import { inlineKeyboard, button } from "telegraf/markup"

import { BaseContext, State } from "@/utils/fsm"
import { generate_phrase } from "@/utils/generate"
import { Texts } from "@/constants/texts";

import { createUser } from "@/db/methods/create"
import { getUserByUserId } from "@/db/methods/get"
import { updateInactive } from "@/db/methods/update"
import { menuKb } from "./menu";

const router = new Composer<BaseContext>();

const startKeyboard = inlineKeyboard([
    [button.callback("Зарегестрироваться", "Registration")], [button.callback("Смотреть анкеты", "Forms-Noreg")]
]).reply_markup

const policyKeyboard = inlineKeyboard([
    [button.callback("Согласен", "Reg_agree"), button.callback("Не согласен", "Reg_disagree")]
]).reply_markup

const menuPhoto = Input.fromLocalFile("assets/NeforLove.png", "Menu")

router.start(async (ctx) => {
    ctx.session.state = undefined

    const result = await getUserByUserId(ctx.from.id)

    if (result?.user?.inactive) { await updateInactive(ctx.from.id, false) }

    if (result?.user?.verified) { 
        await ctx.replyWithPhoto(menuPhoto, {
            reply_markup: menuKb, caption: "💓 >> 💞 Главное меню 💞 << 💓"
        })
        return;
    }

    // Scenario where user on verification
    if (result?.verification?.videonote) {
        await ctx.reply("Вы уже в процессе верификации, дождитесь пока вашу заявку проверит модератор.\n\nПоддержка: @Keva1z");
        return;
    }

    await ctx.reply(Texts.START, {parse_mode: "MarkdownV2", reply_markup: startKeyboard})
})

// Policy before videonote
router.action("Registration", async (ctx, next) => {
    if (ctx.session.state) return next();

    await ctx.deleteMessage(ctx.callbackQuery.message?.message_id)
    await ctx.reply(Texts.POLICY, {parse_mode: "MarkdownV2", reply_markup: policyKeyboard, link_preview_options: {is_disabled: true}})

    ctx.session.state = State.agreePolicy
})

router.action("Reg_agree", async (ctx, next) => {
    if (ctx.session.state != State.agreePolicy) return next();

    await ctx.deleteMessage(ctx.callbackQuery.message?.message_id)
    await ctx.reply("Прекрасно! Продолжаем...")
    await sendRegistration(ctx, next)
})

router.action("Reg_disagree", async (ctx, next) => {
    if (ctx.session.state != State.agreePolicy) return next();

    await ctx.deleteMessage(ctx.callbackQuery.message?.message_id)
    await ctx.reply("К сожалению, далее мы продолжить не можем.\nВы можете попробовать других ботов для знакомств в Telegram!\nВозвращайтесь если передумаете :)")
    ctx.session.state = undefined
})


// Send message with Registration phase
async function sendRegistration(ctx: any, next: () => Promise<void>): Promise<void> {
    if (ctx.session.state != State.agreePolicy) return next();

    const phrase = generate_phrase()
    ctx.session.data.set("RegPhrase", phrase)

    await createUser({userid: ctx.from.id}, phrase)

    await ctx.reply(Texts.REGISTRATION + phrase, {parse_mode: "MarkdownV2"})

    ctx.session.state = State.waitingVideoNote
}


// TODO: Create route on "Forms-Noreg" callback

export { router }
export default router;
