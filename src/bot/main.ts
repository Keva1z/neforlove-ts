
import { Telegraf, session} from 'telegraf';
import env from "@/env"
import { BaseContext, resetSession } from "@/utils/fsm"

// All routers
import * as start from './routers/user/start';
import * as registration from './routers/user/registration';


// Define bot and session
const bot = new Telegraf<BaseContext>(env.TOKEN);
bot.use(session({defaultSession: () => resetSession()}))
bot.use(async (ctx, next) => {
  console.time(`[BOT] Handled update ${ctx.update.update_id} from [${ctx.from?.first_name}](${ctx.from?.id}) in`)
  await next();
  console.timeEnd(`[BOT] Handled update ${ctx.update.update_id} from [${ctx.from?.first_name}](${ctx.from?.id}) in`)
});

bot.use(start.router, registration.router)


bot.launch(async () => {
    console.log("Bot started")
});


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
