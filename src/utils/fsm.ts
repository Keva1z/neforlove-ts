import { Context, SessionFlavor } from "grammy";
import { Message } from "grammy/types";

export enum State {
  // Base states
  agreePolicy = "agreePolicy",
  waitingVideoNote = "waitingVideoNote",

  // Form creation states
  name = "name",
  age = "age",
  about = "about",
  location = "location",
  media = "media",
  confirmCreateForm = "confirm",

  // Settings states
  settings_age = "settings_age",
  settings_gender = "settings_gender",
  settings_city = "settings_city",
}

export interface LocationData {
  country: string;
  state: string;
  city: string | undefined | null;
  lat: number;
  lon: number;
}

export interface FormData {
  name: string | undefined;
  age: number | undefined;
  description: string | undefined;
  location: LocationData | undefined;
  media: string[] | undefined;
}

interface SessionData {
  state: State | undefined;
  data: Map<any, any>;
  formData: FormData;
  message:
    | {
        chat_id: number;
        message_id: number;
      }
    | undefined;
  settings: {
    age: {
      from: number | undefined;
      to: number | undefined;
    };
  };
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
    },
    message: undefined,
    settings: {
      age: {
        from: undefined,
        to: undefined,
      },
    },
  };
}

export function emptyFormData(): FormData {
  return {
    name: undefined,
    age: undefined,
    description: undefined,
    location: undefined,
    media: undefined,
  };
}
