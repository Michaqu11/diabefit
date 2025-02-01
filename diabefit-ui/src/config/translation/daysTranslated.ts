import { EDays, TranslatedDays } from "../../types/days";

const getDayFromString = (day: String): EDays | undefined => {
  if (Object.values(EDays).includes(day as EDays)) {
    return day as EDays;
  }
  return undefined;
};

export const getTranslatedDay = (dayKey: String, t: any): String => {
  const translatedDays = TranslatedDays(t);

  const dayEnum = getDayFromString(dayKey);

  if (dayEnum && translatedDays.hasOwnProperty(dayEnum)) {
    return translatedDays[dayEnum];
  } else {
    return dayKey;
  }
};
