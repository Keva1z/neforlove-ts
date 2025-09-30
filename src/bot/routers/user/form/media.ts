import { Composer } from "grammy";

import { BaseContext, State } from "@/utils/fsm"
import { getSubscriptionByUserId } from "@/db/methods/get";
import { Mutex } from "async-mutex";

// Locking media handlers, to handle media in send order
const locks = new Map<number, Mutex>();

function getMutex(userId: number): Mutex {
  if (!locks.has(userId)) {
    locks.set(userId, new Mutex());
  }
  return locks.get(userId)!;
}

export async function getMediaLimit(userid: number) {
    const subscription = await getSubscriptionByUserId(userid)
    if (!subscription) return 0;

    switch (subscription) {
        case "Free": return 3;
        case "Premium": return 5;
        case "Legend": return 9;
        default: return 0;
    }
}

const router = new Composer<BaseContext>();

router.on(":media", async (ctx, next) => {
    if (ctx.session.state != State.media || !ctx.message) return next();
    const mutex = getMutex(ctx.from.id);

    await mutex.runExclusive(async () => {
        if (!ctx.session.formData.media) ctx.session.formData.media = []

        const mediaLimit = await getMediaLimit(ctx.from.id)
        let mediaLength = ctx.session.formData.media?.length
        if (mediaLength && mediaLength >= mediaLimit) return;

        const media = ctx.message.photo?.[0]?.file_id
                    ? `p:${ctx.message.photo[0].file_id}` // Photo
                    : ctx.message.video?.file_id
                    ? `v:${ctx.message.video.file_id}` // Video
                    : undefined; // Other
        if (!media) return;
        ctx.session.formData.media.push(media)

        mediaLength = ctx.session.formData.media?.length

        await ctx.reply(`Загружено ${mediaLength}/${mediaLimit}`)
    })

    // TODO: Create form from ctx.session.formData
})

export default router
