import { Composer } from "telegraf";
import { inlineKeyboard, button } from "telegraf/markup"

import { BaseContext } from "@/utils/fsm"

const router = new Composer<BaseContext>();

import {default as settingsRouter} from "./menu/settings"
import {default as shopRouter} from "./menu/shop"
import {default as profileRouter} from "./menu/profile"
import {default as matchRouter} from "./menu/match"
import {default as searchRouter} from "./menu/search"

export const menuKb = inlineKeyboard([
    [
        button.callback("🔎 Поиск", "Search"),
        button.callback("❤️ Мэтчи", "Matches")
    ],
    [
        button.callback("👤 Профиль", "Profile"),
        button.callback("🛍 Магазин", "Shop")
    ],
    [button.callback("⚙️ Настройки ⚙️", "settings")]
]).reply_markup

// All menu routers
router.use(
    settingsRouter,
    shopRouter,
    profileRouter,
    matchRouter,
    searchRouter
)
