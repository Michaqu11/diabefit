import { EDays, IDay } from "../types/days";

export interface AllMeal {
  [key: string]: IDay[];
}

export const mockAllDays = [
  {
    id: 1,
    name: EDays.BREAKFAST,
    meals: [],
    units: null,
  },
  {
    id: 2,
    name: EDays.SNACK_1,
    meals: [],
    units: null,
  },
  {
    id: 3,
    name: EDays.LUNCH,
    meals: [],
    units: null,
  },
  {
    id: 4,
    name: EDays.SNACK_2,
    meals: [],
    units: null,
  },
  {
    id: 5,
    name: EDays.DINNER,
    meals: [],
    units: null,
  },
  {
    id: 6,
    name: EDays.SNACK_3,
    meals: [],
    units: null,
  },
];
