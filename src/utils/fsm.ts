import type {  } from '@grammyjs/parse-mode';
import { Context, SessionFlavor } from 'grammy';

export enum State {
    // Base states
    agreePolicy = "agreePolicy",
    waitingVideoNote = "waitingVideoNote",

    // Form creation states
    name = "name",
    age = "age",
    about = "about",
    location = "location",
    media = "media"
}

interface SessionData {
    state: State | undefined,
    data: Map<any, any>,
    formData: {
        name: string | undefined,
        age: number | undefined,
        description: string | undefined,
        location: { x: number, y: number } | undefined,
        media: string[] | undefined,
    }
}

// FSM Context
export type BaseContext = Context & SessionFlavor<SessionData>; 

export function resetSession(): SessionData {
    return {
        state: undefined,
        data: new Map(),
        formData: {
            name: undefined,
            age: undefined,
            description: undefined,
            location: undefined,
            media: undefined,
        }
    }
}
