import type {  } from '@grammyjs/parse-mode';
import { Context, SessionFlavor } from 'grammy';

export enum State {
    agreePolicy = "agreePolicy",
    waitingVideoNote = "waitingVideoNote",
}

interface SessionData {
    state: State | undefined,
    data: Map<any, any>
}

// FSM Context
export type BaseContext = Context & SessionFlavor<SessionData>; 

export function resetSession(): SessionData {
    return {state: undefined, data: new Map()}
}
