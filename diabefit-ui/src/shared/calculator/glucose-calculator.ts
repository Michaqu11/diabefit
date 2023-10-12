// TODO: get units from user storage
const temp_units = 1.0;
const one_correction_unit = 40;
const temp_range = [100, 140];

export const calculateFood = (carbs: number) => {
  return (carbs / 10) * temp_units;
};

export const calculateCorrection = (sugar: number) => {
  if (sugar > temp_range[1]) {
    return (sugar - temp_range[1]) / one_correction_unit;
  }
  return 0;
};

const roundUnits = (units: number): number => Math.round(units * 10) / 10;

export const calculateGlucose = (sugar: number, carbs: number) => {
  const foods = calculateFood(carbs);
  const correction = calculateCorrection(sugar);

  return [roundUnits(foods), roundUnits(correction)];
};
