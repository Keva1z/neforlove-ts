import { Composer} from "telegraf";
import { inlineKeyboard, button } from "telegraf/markup"
import { BaseContext, State } from "../../utils/fsm.js"
import { generate_phrase } from "../../utils/generate.js"
import { Texts } from "../../constants/texts.js";

const router = new Composer<BaseContext>();

const startKeyboard = inlineKeyboard([
    [button.callback("Зарегестрироваться", "Registration")], [button.callback("Смотреть анкеты", "Forms-Noreg")]
]).reply_markup

router.start(async (ctx) => {
    ctx.session.state = undefined
    await ctx.reply(Texts.START, {parse_mode: "MarkdownV2", reply_markup: startKeyboard})
})

router.action("Registration", async (ctx, next) => {
    if (ctx.session.state) return next();

    // TODO: Check user verification state from ORM Model

    const phrase = generate_phrase()

    ctx.session.data.set("RegPhrase", phrase)

    await ctx.deleteMessage(ctx.callbackQuery.message?.message_id)
    await ctx.reply(Texts.REGISTRATION + phrase, {parse_mode: "MarkdownV2"})

    ctx.session.state = State.waitingVideoNote
})

// TODO: Create route on "Forms-Noreg" callback

export { router }
export default router;
