
import { Telegraf, session} from 'telegraf';
import env from "@/env"
import { BaseContext, resetSession } from "@/utils/fsm"

import { updateInactive } from "@/db/methods/update"

// All routers
import * as userRoute from "./routers/user";
import * as moderatorRoute from "./routers/moderator";


// Define bot and session
const bot = new Telegraf<BaseContext>(env.TOKEN);
bot.use(session({defaultSession: () => resetSession()}))
bot.use(async (ctx, next) => {
  console.time(`[BOT] Handled update ${ctx.update.update_id} from [${ctx.from?.first_name}](${ctx.from?.id}) in`)
  await next();
  console.timeEnd(`[BOT] Handled update ${ctx.update.update_id} from [${ctx.from?.first_name}](${ctx.from?.id}) in`)
});

// When user block bot this calls
bot.on("my_chat_member", async (ctx, next) => {
    if (ctx.chat.id == ctx.from.id && ctx.myChatMember.new_chat_member.status == "kicked") {
        await updateInactive(ctx.from.id, true)
        return;
    } // Set user as inactive
    return next();
})

bot.use(userRoute.router, moderatorRoute.router)


bot.launch(async () => {
    console.log("Bot started")
});


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
