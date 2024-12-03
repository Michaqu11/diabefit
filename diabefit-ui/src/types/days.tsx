import { IMealElement } from "./meal";

enum EDays {
  BREAKFAST = "Breakfast",
  SNACK_1 = "Snack I",
  LUNCH = "Lunch",
  SNACK_2 = "Snack II",
  DINNER = "Dinner",
  SNACK_3 = "Snack III",
}

export const TranslatedDays = (t: any) => ({
  [EDays.BREAKFAST]: t("home.days.breakfast"),
  [EDays.SNACK_1]: t("home.days.snack1"),
  [EDays.LUNCH]: t("home.days.lunch"),
  [EDays.SNACK_2]: t("home.days.snack2"),
  [EDays.DINNER]: t("home.days.dinner"),
  [EDays.SNACK_3]: t("home.days.snack3"),
});

interface IDayElement {
  mealName: string;
  id: string;
  grams: number;
  kcal: number;
  prot: number;
  fats: number;
  carbs: number;
}

type UnitsType = {
  short: number;
  long?: number;
};
interface CalculatorData {
  glucose: number;
  units: UnitsType;
  date: Date;
}

interface IDay {
  id: number;
  name: string;
  displayName?: string;
  meals: IMealElement[];
  calculatorData: CalculatorData | null;
  isElevate?: boolean;
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
  dayId: number | undefined;
  day: IDay | undefined;
}

export type {
  IDayElement,
  IDay,
  IElement,
  IValues,
  ICalculatePanel,
  UnitsType,
  CalculatorData,
};
export { EDays };
