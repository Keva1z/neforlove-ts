import env from "@/env";
import axios from "axios";

import { LocationData } from "@/utils/fsm";

export async function getLocationData(latitude: number, longitude: number) {
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${env.GEOAPIFY_KEY}&lang=ru&type=city`;

  const response = await axios.get(url);

  const data = response.data.features.length ? response.data.features[0].properties : null;

  return await fetchLocationData(data);
}

async function fetchLocationData(data: any): Promise<LocationData | undefined> {
  if (!data) return undefined;

  const LocData: LocationData = {
    country: data.country,
    state: data.state,
    city: undefined,
    lat: data.lat,
    lon: data.lon,
  };

  if (data.rank.popularity < 2.25 && data.rank.importance < 0.25) return LocData;

  LocData.city = data.city;

  return LocData;
}
