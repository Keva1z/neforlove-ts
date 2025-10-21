import { InputMediaBuilder } from "grammy";
import { FormData, LocationData } from "./fsm";
import { statistics, user as User, Location, Form } from "@/db/schema";
import { fmt, FormattedString, b } from "@grammyjs/parse-mode";

function createMediaGroup(data: FormData, caption: FormattedString) {
  const media = data!.media!.map((file, index) => {
    if (file.slice(0, 1) === "p")
      return InputMediaBuilder.photo(file.slice(2, file.length), {
        caption: index == 0 ? caption.caption : undefined,
        caption_entities: index == 0 ? caption.caption_entities : undefined,
      });
    else
      return InputMediaBuilder.video(file.slice(2, file.length), {
        caption: index == 0 ? caption.caption : undefined,
        caption_entities: index == 0 ? caption.caption_entities : undefined,
      });
  });
  return media;
}

export function createFormData(location: typeof Location.$inferSelect, form: typeof Form.$inferSelect) {
  const locationData: LocationData = {
    city: location.city,
    country: location.country,
    lat: location.latitude,
    lon: location.longitude,
    state: location.state,
  };
  const formData: FormData = {
    age: form.age,
    description: form.about,
    location: locationData,
    media: form.media,
    name: form.name,
  };

  return formData;
}

function addAdvertisment(caption: FormattedString) {
  return caption + "\n\n<b>================</b>\nТУТ БУДЕТ РЕКЛАМА"; // TODO: Get AD text from somewhere
}

function addStatistics(
  caption: FormattedString,
  stats: typeof statistics.$inferSelect,
  verifiedAt: string,
  link: FormattedString,
) {
  return fmt`${caption}\n\n${b}===== ${link} =====${b}\n❤️ ${stats.likesOut} | 💔 ${stats.dislikesOut}\n✅ ${verifiedAt}`;
}

function addProfileStatistics(caption: FormattedString, stats: typeof statistics.$inferSelect, verifiedAt: string) {
  return fmt`${caption}\n\n${b}===== Cтатистика =====${b}\n${b}Отправлено:${b} ❤️ ${stats.likesOut} | 💔 ${stats.dislikesOut}\n${b}Получено:${b} ❤️ ${stats.likesIn} | 💔 ${stats.dislikesIn} \n✅ ${verifiedAt}`;
}

function createCaption(data: FormData) {
  let location = `${data.location!.city}, ${data.location!.country}`;
  if (!data.location!.city) location = `${data.location!.state}, ${data.location!.country}`;
  const caption = fmt`👤 ${b}${data.name!}${b}, ${data.age!}\n${location}\n\n${data.description!}`;

  return caption;
}

export function previewMediaForm(data: FormData) {
  if (!data.location || !data.media) return null;

  const caption = createCaption(data);

  return createMediaGroup(data, caption);
}

export function verificationMediaForm(
  data: FormData,
  stats: typeof statistics.$inferSelect,
  verifiedAt: string,
  link: FormattedString,
) {
  if (!data.location || !data.media) return null;

  const captionTemp = createCaption(data);
  const caption = addStatistics(captionTemp, stats, verifiedAt, link);

  return createMediaGroup(data, caption);
}

export function profileMediaForm(data: FormData, stats: typeof statistics.$inferSelect, verifiedAt: string) {
  if (!data.location || !data.media) return null;

  const captionTemp = createCaption(data);
  const caption = addProfileStatistics(captionTemp, stats, verifiedAt);

  return createMediaGroup(data, caption);
}
