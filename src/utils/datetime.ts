import { DateTime } from "luxon";

export function createTimestamp() {
  const timestamp = DateTime.now().setZone("Europe/Moscow");
  return timestamp.isValid ? timestamp.toISO() : timestamp.toString();
}

export function parseTimestamp(datetime: string) {
  return DateTime.fromISO(datetime, { setZone: true, locale: "ru-RU" }).toFormat("dd LLL yyyy'г' HH:mm");
}
