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
  grams: number;
  kcal: number;
  prot: number;
  fats: number;
  carbs: number;
  image?: string;
}

interface IDay {
  elements?: IDayElement[];
}

interface IDays {
  id: number;
  name: string;
  empty: boolean;
  extension: IDay;
}

export type { IDayElement, IDay, IDays };
export { EDays };
