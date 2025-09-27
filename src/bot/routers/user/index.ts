import { Composer } from "grammy";

import { BaseContext, State } from "@/utils/fsm"
import { isRole } from "@/bot/filters/roleFilter";

import * as start from './start';
import * as registration from './registration';

const router = new Composer();

// Dont need role middleware

router.use(start.router, registration.router)

export { router }
