
import { Telegraf, session} from 'telegraf';
import { token } from "./config.js"
import { BaseContext, resetSession } from "../utils/fsm.js"

// All routers
import * as start from './routers/start.js';
import * as registration from './routers/registration.js';


// Define bot and session
const bot = new Telegraf<BaseContext>(token);
bot.use(session({defaultSession: () => resetSession()}))
bot.use(async (ctx, next) => {
  console.time(`[BOT] Handled update ${ctx.update.update_id} in`)
  await next();
  console.timeEnd(`[BOT] Handled update ${ctx.update.update_id} in`)
});

bot.use(start.router, registration.router)


bot.launch(async () => {
    console.log("Bot started")
});


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
