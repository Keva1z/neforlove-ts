import { Composer, Context } from "grammy";

import { BaseContext, State } from "@/utils/fsm"

import { updateVideonote, updateVerifiedBy } from "@/db/methods/update"
import { getUserByUserId } from "@/db/methods/get"
import { sexEnum } from "@/db/schema/enums";
import { mentionUser, fmt,  } from "@grammyjs/parse-mode";
import { DateTime } from "luxon";

const router = new Composer<BaseContext>();

async function defence(userid: number, ctx: BaseContext) {
    await updateVideonote(userid, null)
    if (!ctx.msg!.text) {return;}
    await ctx.editMessageText(ctx.msg!.text.replace("#Ожидает", "#Защита"), {reply_markup: undefined, entities: ctx.msg!.entities})
}

router.callbackQuery(/verifyVideonote:(.+)$/, async (ctx, next) => {
    await ctx.answerCallbackQuery()

    const data = ctx.match[0].split(":")
    const gender = data[1] as typeof sexEnum.enumValues[number]
    const userid = Number(data[2])

    const user = await getUserByUserId(userid)

    // Checks on 'Exists', 'banned', 'verified', 'inactive'
    if (!user || user.banned || user.verified || user.inactive) {
        await defence(userid, ctx)
        return;
    }

    try {
        const modLink = mentionUser(ctx.from.first_name, ctx.from.id);
        let replaceText = `💂🏻 Кем: ${ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.first_name}` }\n   #Верифицирован`
        switch (gender) {
            case "Unknown":
                const declineText = fmt`Ваша верификация была отклонена!\nМодератор - ${modLink}\nВы можете повторить попытку.\n/start`
                await ctx.api.sendMessage(userid, declineText.text, {entities: declineText.entities})
                await updateVerifiedBy(userid, gender, null);
                await updateVideonote(userid, null)
                replaceText = `💂🏻 Кем: ${ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.first_name}` }\n   #Отклонен`
                break;
            default:
                await ctx.api.sendMessage(userid, "Вы были верифицированы!\nОткройте меню для последующих действий.\n/start")
                await updateVerifiedBy(userid, gender, ctx.from.id)
                break;
        }

        if (!ctx.msg!.text) return;
        
        await ctx.editMessageText(ctx.msg!.text.replace("   #Ожидает", replaceText),
                                                {reply_markup: undefined, entities: ctx.msg!.entities})
    } catch (error) {
        console.log(`Что то пошло не так при верификации: ${error}`)
        await defence(userid, ctx)
        return;
    }
})

export { router }
