import { EDays } from "../types/days";
import { IMealElement } from "../types/meal";

export interface UnitsType {
  short: number;
  long: number;
}

export interface AllDay {
  id: number;
  name: string;
  units: UnitsType | undefined;
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
    units: undefined,
  },
  {
    id: 2,
    name: EDays.SNACK_1,
    meals: [],
    units: undefined,
  },
  {
    id: 3,
    name: EDays.LUNCH,
    meals: [],
    units: undefined,
  },
  {
    id: 4,
    name: EDays.SNACK_2,
    meals: [],
    units: undefined,
  },
  {
    id: 5,
    name: EDays.DINNER,
    meals: [],
    units: undefined,
  },
  {
    id: 6,
    name: EDays.SNACK_3,
    meals: [],
    units: undefined,
  },
];
