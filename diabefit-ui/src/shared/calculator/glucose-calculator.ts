import dayjs from "dayjs";
import { getSettings } from "../../store/sessionStorage";

const settings = getSettings();

export const calculateFood = (carbohydrateExchange: number) => {

  const time = dayjs().get('hour')
  return carbohydrateExchange * settings.units[time];
};

export const calculateCorrection = (sugar: number) => {
  if (sugar > settings.targetRange.to) {
    return (sugar - settings.targetRange.to) / settings.insulinCorrection;
  }
  return 0;
};

export const roundUnits = (units: number): number =>
  Math.round(units * 10) / 10;

export const calculateGlucose = (sugar: number, carbs: number) => {
  const foods = calculateFood(carbs);
  const correction = calculateCorrection(sugar);

  return [roundUnits(foods), roundUnits(correction)];
};
