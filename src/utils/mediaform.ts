import { InputMediaBuilder } from "grammy";
import { FormData } from "./fsm";
import { statistics } from "@/db/schema";
import { fmt, FormattedString, b } from "@grammyjs/parse-mode";

function addAdvertisment(caption: string) {
  return caption + "\n\n<b>================</b>\nТУТ БУДЕТ РЕКЛАМА"; // TODO: Get AD text from somewhere
}

function addStatistics(
  caption: FormattedString,
  stats: typeof statistics.$inferSelect,
  verifiedAt: string,
  link: FormattedString,
) {
  return fmt`${caption}\n\n${b}=== ${link} ===${b}\n❤️ ${stats.likesOut} | 💔 ${stats.dislikesOut}\n✅ ${verifiedAt}`;
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

  const media = data.media.map((file, index) => {
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

export function verificationMediaForm(
  data: FormData,
  stats: typeof statistics.$inferSelect,
  verifiedAt: string,
  link: FormattedString,
) {
  if (!data.location || !data.media) return null;

  const captionTemp = createCaption(data);
  const caption = addStatistics(captionTemp, stats, verifiedAt, link);

  console.log(caption.caption_entities);

  const media = data.media.map((file, index) => {
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
