import { Composer } from "grammy";

import { BaseContext, State } from "@/utils/fsm";
import { isRole } from "@/bot/filters/roleFilter";

import * as videonote from "./verification/videonote";
import * as forms from "./verification/forms";

const router = new Composer<BaseContext>();

// Role middleware
router.use(async (ctx, next) => {
  if (!ctx.from) {
    return;
  }
  if (await isRole(ctx.from.id, ["Moderator", "Senior-Moderator", "Owner"])) {
    return next();
  }

  try {
    await ctx.answerCallbackQuery();
  } catch {}

  return;
});

router.use(videonote.router, forms.router);

export { router };
