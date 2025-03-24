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

export const calculateNutritionalValuesForAllMeals = (
  meals: IMealElement[] | undefined,
) => {
  if (!meals || meals.length === 0) {
    return { carbs: 0, fats: 0, prot: 0 };
  }

  return meals.reduce(
    (acc, meal) => {
      acc.carbs += Number(meal.carbs) || 0;
      acc.fats += Number(meal.fats) || 0;
      acc.prot += Number(meal.prot) || 0;
      return acc;
    },
    { carbs: 0, fats: 0, prot: 0 },
  );
};
