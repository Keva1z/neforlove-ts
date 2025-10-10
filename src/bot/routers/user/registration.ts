import { Composer, InputFile, InlineKeyboard } from "grammy";

import { BaseContext, State } from "@/utils/fsm";
import env from "@/env";
import { updateVideonote } from "@/db/methods/update";
import { mentionUser, fmt } from "@grammyjs/parse-mode";

const router = new Composer<BaseContext>();

const approveKeyboard = (id: number) =>
  new InlineKeyboard()
    .text("✅ Мальчик", `verifyVideonote:Male:${id}`)
    .text("✅ Девочка", `verifyVideonote:Female:${id}`)
    .row()
    .text("❌ Отклонить", `verifyVideonote:Unknown:${id}`);

// Handle user videonote
router.on(":video_note", async (ctx, next) => {
  if (ctx.session.state != State.waitingVideoNote) return next();

  const uid = ctx.from!.id;
  const phrase = ctx.session.data.get("RegPhrase");
  const link = mentionUser(ctx.from!.first_name, ctx.from!.id);

  const text = fmt`>> ${link}
🆔 ID: ${uid}
💭 Фраза: ${phrase}
   #Ожидает`;

  // Set current videonote
  await updateVideonote(uid, ctx.message!.video_note.file_id);

  // Send videonote with message
  await ctx.copyMessage(env.VIDEONOTE_CHAT);
  await ctx.api.sendMessage(env.VIDEONOTE_CHAT, text.text, {
    entities: text.entities,
    reply_markup: approveKeyboard(uid),
  });

  await ctx.reply("Ваш кружок был отправлен на модерацию!\nПожалуйста, ожидайте решения.");

  ctx.session.state = undefined;
});

export { router };
