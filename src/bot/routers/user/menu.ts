import { Composer, InlineKeyboard } from "grammy";

import { BaseContext } from "@/utils/fsm"

const router = new Composer<BaseContext>();

import {default as settingsRouter} from "./menu/settings"
import {default as shopRouter} from "./menu/shop"
import {default as profileRouter} from "./menu/profile"
import {default as matchRouter} from "./menu/match"
import {default as searchRouter} from "./menu/search"

export const menuKb = new InlineKeyboard()
                          .text("🔎 Поиск", "Search")
                          .text("❤️ Мэтчи", "Matches").row()
                          .text("👤 Профиль", "Profile")
                          .text("🛍 Магазин", "Shop").row()
                          .text("⚙️ Настройки ⚙️", "settings")

// All menu routers
router.use(
    settingsRouter,
    shopRouter,
    profileRouter,
    matchRouter,
    searchRouter
)
