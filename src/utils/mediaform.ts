import { InputMediaBuilder } from "grammy";
import { FormData } from "./fsm";

function addAdvertisment(caption: string) {
  return caption + "\n\n<b>================</b>\nТУТ БУДЕТ РЕКЛАМА"; // TODO: Get AD text from somewhere
}

function createCaption(data: FormData) {
  let location = `${data.location!.city}, ${data.location!.country}`;
  if (!data.location!.city) location = `${data.location!.state}, ${data.location!.country}`;
  const caption = `👤 <b>${data.name}</b>, ${data.age}\n${location}\n\n${data.description}`;

  return caption;
}

export function previewMediaForm(data: FormData) {
  if (!data.location || !data.media) return null;

  const caption = createCaption(data);

  const media = data.media.map((file) => {
    if (file.slice(0, 1) === "p")
      return InputMediaBuilder.photo(file.slice(2, file.length), { caption: caption, parse_mode: "HTML" });
    else return InputMediaBuilder.video(file.slice(2, file.length), { caption: caption, parse_mode: "HTML" });
  });

  return media;
}
