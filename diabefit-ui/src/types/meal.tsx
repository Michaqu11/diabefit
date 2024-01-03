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
  }
}
