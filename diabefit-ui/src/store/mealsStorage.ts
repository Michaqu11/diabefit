import { IMealElement } from "../types/meal";
import { AllMeal, mockAllDays } from "./storagesTypes";

const createDay = (dayID: string): AllMeal => {
  const newMeal: AllMeal = {};
  newMeal[dayID] = mockAllDays;

  return newMeal;
};

const isDayExist = (dayID: string, allMeals: AllMeal) => {
  return dayID in allMeals;
};

const putMealIntoDay = (
  dayID: string,
  dayIndex: number,
  meal: IMealElement,
  allMeals: AllMeal,
) => {
  const newDay = allMeals[dayID];
  if (newDay) {
    newDay[dayIndex - 1].meals.push(meal);
    allMeals[dayID] = newDay;
  }

  return allMeals;
};

export const addMeal = (
  dayID: string,
  dayIndex: number,
  meal: IMealElement,
) => {
  const mealsFromStore = localStorage.getItem("meals");
  let allMeals = {} as AllMeal;
  let setItem = true;
  if (mealsFromStore) {
    allMeals = JSON.parse(mealsFromStore) as AllMeal;
    if (!isDayExist(dayID, allMeals)) {
      const newDay = createDay(dayID);
      allMeals = { ...allMeals, ...newDay };
    } else if (
      allMeals[dayID][dayIndex - 1].meals.find((m) => m.id === meal.id)
    ) {
      setItem = false;
    }
  } else {
    allMeals = createDay(dayID);
  }

  if (setItem) {
    const result = putMealIntoDay(dayID, dayIndex, meal, allMeals);
    localStorage.setItem("meals", JSON.stringify(result));
  }
};

export const removeMeal = (dayID: string, dayIndex: number, id: string) => {
  const mealsFromStore = localStorage.getItem("meals");
  if (mealsFromStore) {
    const allMeals = JSON.parse(mealsFromStore) as AllMeal;
    if (isDayExist(dayID, allMeals)) {
      const mealsToRemove = allMeals[dayID];
      const newMeals = mealsToRemove[dayIndex - 1].meals.filter(
        (m) => m.id !== id,
      );
      mealsToRemove[dayIndex - 1].meals = newMeals;
      allMeals[dayID] = mealsToRemove;
      localStorage.setItem("meals", JSON.stringify(allMeals));
    }
  }
};

export const readDayMeal = (dayID: string) => {
  const mealsFromStore = localStorage.getItem("meals");
  if (mealsFromStore) {
    const allMeals = JSON.parse(mealsFromStore) as AllMeal;
    return allMeals[dayID];
  }
  return [];
};

export const readSpecificDayMeal = (dayID: string, dayIndex: number) => {
  const mealsFromStore = localStorage.getItem("meals");
  if (mealsFromStore) {
    const allMeals = JSON.parse(mealsFromStore) as AllMeal;
    return allMeals[dayID] ? allMeals[dayID][dayIndex - 1] : undefined;
  }
  return undefined;
};
