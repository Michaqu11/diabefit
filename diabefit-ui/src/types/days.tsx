import { IMealElement } from "./meal";

enum EDays {
  BREAKFAST = "Breakfast",
  SNACK_1 = "Snack I",
  LUNCH = "Lunch",
  SNACK_2 = "Snack II",
  DINNER = "Dinner",
  SNACK_3 = "Snack III",
}

interface IDayElement {
  mealName: string;
  id: string;
  grams: number;
  kcal: number;
  prot: number;
  fats: number;
  carbs: number;
}

interface IDay {
  id: number;
  name: string;
  meals: IMealElement[];
}

interface IElement {
  header: string;
  secondary: string;
  id: string;
  dayID: string;
  dayIndex: number;
}
interface IValues {
  kcal: number;
  prot: number;
  fats: number;
  carbs: number;
}
interface ICalculatePanel {
  open: boolean;
  day: IDay | undefined;
}

export type { IDayElement, IDay, IElement, IValues, ICalculatePanel };
export { EDays };
