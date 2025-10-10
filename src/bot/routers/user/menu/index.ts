import { Composer, InlineKeyboard } from "grammy";

import { BaseContext } from "@/utils/fsm";

const router = new Composer<BaseContext>();

import { default as settingsRouter } from "./settings";
import { default as shopRouter } from "./shop";
import { default as profileRouter } from "./profile";
import { default as matchRouter } from "./match";
import { default as searchRouter } from "./search";

export const menuKb = new InlineKeyboard()
  .text("🔎 Поиск", "Search")
  .text("❤️ Мэтчи", "Matches")
  .row()
  .text("👤 Профиль", "Profile")
  .text("🛍 Магазин", "Shop")
  .row()
  .text("⚙️ Настройки ⚙️", "settings");

// All menu routers
router.use(settingsRouter, shopRouter, profileRouter, matchRouter, searchRouter);
