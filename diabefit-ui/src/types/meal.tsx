export interface IMealElement {
  mealName: string;
  displayName: string;
  id: string;
  grams: number;
  kcal: number;
  prot: number;
  fats: number;
  carbs: number;
  base: {
    grams: number;
    kcal: number;
    prot: number;
    fats: number;
    carbs: number;
  };
  quick?: boolean;
}

export const EMPTY_BASE = {
  grams: 0,
  kcal: 0,
  prot: 0,
  fats: 0,
  carbs: 0,
};
