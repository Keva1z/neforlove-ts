import * as dotenv from 'dotenv';
import { exitCode } from 'process';

dotenv.config({debug: false})

const token = process.env.BOT_TOKEN!
const videonote_chat = Number(process.env.VIDEONOTE_CHAT!)

if (!token) {throw new Error("Token must be provided!")}
if (!videonote_chat) {throw new Error("Videonote chat must be provided!")}

export { token, videonote_chat }
