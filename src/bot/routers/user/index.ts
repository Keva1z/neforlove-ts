import { Composer } from "grammy";

import { BaseContext, State } from "@/utils/fsm";
import { isRole } from "@/bot/filters/roleFilter";

import * as start from "./start";
import * as referral from "./referral";
import * as registration from "./registration";
import * as form from "./form";
import * as menu from "./menu";

const router = new Composer();

// Dont need role middleware

router.use(start.router, referral.router, registration.router, form.router, menu.router);

export { router };
