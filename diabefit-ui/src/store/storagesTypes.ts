import { EDays } from "../types/days";
import { IMealElement } from "../types/meal";

export interface AllDay {
  id: number;
  name: string;
  meals: IMealElement[];
}

export interface AllMeal {
  [key: string]: AllDay[];
}

export const mockAllDays = [
  {
    id: 1,
    name: EDays.BREAKFAST,
    meals: [],
  },
  {
    id: 2,
    name: EDays.SNACK_1,
    meals: [],
  },
  {
    id: 3,
    name: EDays.LUNCH,
    meals: [],
  },
  {
    id: 4,
    name: EDays.SNACK_2,
    meals: [],
  },
  {
    id: 5,
    name: EDays.DINNER,
    meals: [],
  },
  {
    id: 6,
    name: EDays.SNACK_3,
    meals: [],
  },
];
