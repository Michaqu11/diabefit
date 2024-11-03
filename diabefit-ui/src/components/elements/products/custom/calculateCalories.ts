type MealValues = {
  mealName: string;
  grams: number;
  prot: number;
  fats: number;
  carbs: number;
};

export function calculateCalories(values: MealValues): number {
  const caloriesFromProtein = values.prot * 4;
  const caloriesFromFats = values.fats * 9;
  const caloriesFromCarbs = values.carbs * 4;

  return caloriesFromProtein + caloriesFromFats + caloriesFromCarbs;
}
