import { Composer } from "telegraf";
import { inlineKeyboard, button } from "telegraf/markup"
import { BaseContext, State } from "../../utils/fsm.js"
import { generate_phrase } from "../../utils/generate.js"
import { Texts } from "../../constants/texts.js";

const router = new Composer<BaseContext>();

const startKeyboard = inlineKeyboard([
    [button.callback("Зарегестрироваться", "Registration")], [button.callback("Смотреть анкеты", "Forms-Noreg")]
]).reply_markup

const policyKeyboard = inlineKeyboard([
    [button.callback("Согласен", "Reg_agree"), button.callback("Не согласен", "Reg_disagree")]
]).reply_markup

router.start(async (ctx) => {
    ctx.session.state = undefined
    await ctx.reply(Texts.START, {parse_mode: "MarkdownV2", reply_markup: startKeyboard})
})

// Policy befor videonote
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

    // TODO: Check user verification state from ORM Model

    const phrase = generate_phrase()
    ctx.session.data.set("RegPhrase", phrase)

    await ctx.reply(Texts.REGISTRATION + phrase, {parse_mode: "MarkdownV2"})

    ctx.session.state = State.waitingVideoNote
}


// TODO: Create route on "Forms-Noreg" callback

export { router }
export default router;
