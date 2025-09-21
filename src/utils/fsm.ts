import { type Context } from 'telegraf';
import type { Update } from "telegraf/types";

export enum State {
    waitingVideoNote = "waitingVideoNote",
}

// FSM Context
export interface BaseContext <U extends Update = Update> extends Context<U> {
	session: {
		state: State | undefined,
        data: Map<any, any>
	},
};

export function resetSession() {
    return {state: undefined, data: new Map()}
}
