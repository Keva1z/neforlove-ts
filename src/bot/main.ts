import { Bot, session } from "grammy";
import { run } from "@grammyjs/runner";
import env from "@/env";
import { BaseContext, resetSession } from "@/utils/fsm";

import { updateInactive } from "@/db/methods/update";

// All routers
import * as userRoute from "./routers/user";
import * as moderatorRoute from "./routers/moderator";
import * as ownerRoute from "./routers/owner";

// Define bot and session
const bot = new Bot<BaseContext>(env.TOKEN);
bot.use(session({ initial: resetSession }));

bot.use(async (ctx, next) => {
  // Supress updates not in chat
  if (ctx.chatId && ctx.chat?.type !== "private" && ![env.FORMS_CHAT, env.VIDEONOTE_CHAT].includes(ctx.chatId)) return;

  console.time(`[BOT] Handled update ${ctx.update.update_id} from [${ctx.from?.first_name}](${ctx.from?.id}) in`);
  await next();
  console.timeEnd(`[BOT] Handled update ${ctx.update.update_id} from [${ctx.from?.first_name}](${ctx.from?.id}) in`);
});

// When user block bot this calls
bot.on("my_chat_member", async (ctx, next) => {
  if (ctx.chat.id == ctx.from.id && ctx.myChatMember.new_chat_member.status == "kicked") {
    await updateInactive(ctx.from.id, true);
    return;
  } // Set user as inactive
  return next();
});

bot.use(userRoute.router, moderatorRoute.router, ownerRoute.router);

run(bot);

process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());
