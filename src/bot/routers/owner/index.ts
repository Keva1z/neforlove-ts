import { Composer } from "telegraf";

import { BaseContext, State } from "@/utils/fsm"
import { isRole } from "@/bot/filters/roleFilter";

import * as tests from './test';

const router = new Composer<BaseContext>();

// Role middleware
router.use(async (ctx, next) => {
    if (!ctx.from) { return; }
    if (await isRole(ctx.from.id, ["Owner"])) { return next() }

    try { await ctx.answerCbQuery() } catch {}

    return;
});

router.use(tests.router)

export { router }
