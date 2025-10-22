import { Composer, InlineKeyboard } from "grammy";

import { BaseContext } from "@/utils/fsm";

import { default as ageSettingsRouter } from "./age";
import { default as citySettingsRouter } from "./city";
import { default as genderSettingsRouter } from "./gender";

const router = new Composer<BaseContext>();

router.use(ageSettingsRouter, citySettingsRouter, genderSettingsRouter);

export { router };
