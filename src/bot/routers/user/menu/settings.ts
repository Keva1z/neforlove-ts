import { Composer, InlineKeyboard } from "grammy";

import { BaseContext } from "@/utils/fsm";

const router = new Composer<BaseContext>();

const settingsKb = new InlineKeyboard()
  .text("🚹 Изменить пол", "change_search:gender")
  .row()
  .text("👦 Изменить возраст", "change_search:age")
  .row()
  .text("🏙 Изменить пол", "change_search:city")
  .row()
  .text("⬅️ Назад", "openStartMenu");

router.callbackQuery("settings", async (ctx, next) => {
  if (ctx.session.state !== undefined) return next();

  await ctx.editMessageReplyMarkup({ reply_markup: settingsKb });
});

export default router;
