import { IMealElement } from "../../types/meal";

export const carbohydrateExchangeCalculate = (carbs: number) => {
  return Number((carbs / 10).toFixed(1));
};

export const calculateCarbsForAllMeals = (
  meals: IMealElement[] | undefined,
) => {
  const sum = meals ? meals.map((meal) => Number(meal.carbs)) : [];
  const res = carbohydrateExchangeCalculate(
    sum.reduce((acc, curr) => {
      return acc + curr;
    }, 0),
  );

  return res;
};
