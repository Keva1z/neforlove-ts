import { Context, NarrowedContext } from "telegraf";
import { CallbackQuery, Update } from "telegraf/types";

export type ctxCallbackMSG = NarrowedContext<Context, Update.CallbackQueryUpdate>
