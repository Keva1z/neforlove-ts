import { Composer } from "telegraf"
import { message } from "telegraf/filters"
import { fmt, mention } from "telegraf/format"
import { inlineKeyboard, button } from "telegraf/markup"

import { BaseContext, State } from "../../utils/fsm.js"
import { videonote_chat } from "../config.js"

const router = new Composer<BaseContext>();

const approveKeyboard = (id: number) => inlineKeyboard([
    [button.callback("✅ Мальчик", `verify:male:${id}`), button.callback("✅ Девочка", `verify:female:${id}`)],
    [button.callback("❌ Отклонить", `verify:decline:${id}`)]
]).reply_markup

// Handle user videonote 
router.on(message("video_note"), async (ctx, next) => {
    if (ctx.session.state != State.waitingVideoNote) return next();

    const uid = ctx.from.id
    const phrase = ctx.session.data.get("RegPhrase")
    const link = mention(ctx.from.first_name, ctx.from)

    const text = fmt`>> ${link}
🆔 ID: ${uid}
💭 Фраза: ${phrase}`

    // TODO: Set user status to 'ON VERIFICATION' in ORM

    // Send videonote with message
    await ctx.copyMessage(videonote_chat)
    await ctx.telegram.sendMessage(videonote_chat, text, {parse_mode: "MarkdownV2", reply_markup: approveKeyboard(uid)})

    await ctx.reply("Ваш кружок был отправлен на модерацию!\nПожалуйста, ожидайте решения.")

    ctx.session.state = undefined
})

export { router }
