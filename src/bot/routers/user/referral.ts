import { Composer, InputFile, InlineKeyboard } from "grammy";

import { BaseContext, State } from "@/utils/fsm";
import env from "@/env";
import { getReferralByUserId } from "@/db/methods/get";
import { mentionUser, fmt } from "@grammyjs/parse-mode";
import { Texts } from "@/constants/texts";

const router = new Composer<BaseContext>();

const inviteKb = (link: string) => new InlineKeyboard().url("🤍 Присоедениться 🤍", link);

router.command("referral", async (ctx) => {
  const referral = await getReferralByUserId(ctx.from!.id);

  if (!referral) return;

  const text = Texts.REFERRAL_MESSAGE(referral.total, referral.verified);

  await ctx.reply(text.text, { entities: text.entities });
  await ctx.reply("NeforLove", { reply_markup: inviteKb(`https://t.me/${ctx.me.username}?start=${referral?.code}`) });
});

export { router };
