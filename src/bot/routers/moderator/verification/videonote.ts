import { Composer, Context } from "telegraf";

import { BaseContext, State } from "@/utils/fsm"

import { updateVideonote, updateVerifiedBy } from "@/db/methods/update"
import { getUserByUserId } from "@/db/methods/get"
import { sexEnum } from "@/db/schema/enums";
import { fmt, mention } from "telegraf/format";
import { DateTime } from "luxon";

const router = new Composer<BaseContext>();

async function defence(userid: number, ctx: Context) {
    await updateVideonote(userid, null)
    if (!ctx.msg.has("text")) {return;}
    await ctx.editMessageText(ctx.msg.text.replace("#Ожидает", "#Защита"), {reply_markup: undefined, entities: ctx.msg.entities})
}

router.action(/verifyVideonote:(.+)$/, async (ctx, next) => {
    await ctx.answerCbQuery()

    const data = ctx.match[0].split(":")
    const gender = data[1] as typeof sexEnum.enumValues[number]
    const userid = Number(data[2])

    const user = await getUserByUserId(userid)

    // Checks on 'Exists', 'banned', 'verified', 'inactive'
    if (!user || user?.user?.banned || user?.user?.verified || user?.user?.inactive) {
        await defence(userid, ctx)
        return;
    }

    try {
        const modLink = mention(ctx.from.first_name, ctx.from);
        let replaceText = `💂🏻 Кем: ${ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.first_name}` }\n   #Верифицирован`
        switch (gender) {
            case "Unknown":
                await ctx.telegram.sendMessage(userid, fmt`Ваша верификация была отклонена!\nМодератор - ${modLink}\nВы можете повторить попытку.\n/start`)
                await updateVerifiedBy(userid, gender, null);
                await updateVideonote(userid, null)
                replaceText = `💂🏻 Кем: ${ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.first_name}` }\n   #Отклонен`
                break;
            default:
                await ctx.telegram.sendMessage(userid, "Вы были верифицированы!\nОткройте меню для последующих действий.\n/start")
                await updateVerifiedBy(userid, gender, ctx.from.id)
                break;
        }

        if (!ctx.msg.has("text")) {return;}
        await ctx.editMessageText(ctx.msg.text.replace("   #Ожидает", replaceText),
                                                {reply_markup: undefined, entities: ctx.msg.entities})
    } catch (error) {
        console.log(`Что то пошло не так при верификации: ${error}`)
        await defence(userid, ctx)
        return;
    }
})

export { router }
