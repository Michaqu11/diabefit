import { CalculatorData, IDay } from "../types/days";
import { IMealElement } from "../types/meal";
import { AllMeal } from "./storagesTypes";

const createCustomMealDay = (dayID: number): AllMeal => {
  const newMealDay: AllMeal = {};
  newMealDay[dayID] = [];
  return newMealDay;
};

const isCustomMealDayExist = (dayID: number, allMeals: AllMeal) => {
  return dayID in allMeals;
};

const addCustomMeal = (dayID: number, dayIndex: number, meal: IDay) => {
  const mealsFromStore = localStorage.getItem("customMeals");
  let allMeals: AllMeal = {};
  if (mealsFromStore) {
    allMeals = JSON.parse(mealsFromStore) as AllMeal;
    if (!isCustomMealDayExist(dayID, allMeals)) {
      const newDay = createCustomMealDay(dayID);
      allMeals = { ...allMeals, ...newDay };
    }
  } else {
    allMeals = createCustomMealDay(dayID);
  }

  allMeals[dayID][dayIndex] = {
    ...meal,
  };

  const result = allMeals;

  localStorage.setItem("customMeals", JSON.stringify(result));
};

export const saveCustomMeal = (meal: IDay, dayID: number, dayIndex: number) => {
  addCustomMeal(dayID, dayIndex, meal);
};

export const removeCustomMeal = (dayID: number, id: number) => {
  const mealsFromStore = localStorage.getItem("customMeals");
  if (mealsFromStore) {
    const allMeals = JSON.parse(mealsFromStore) as AllMeal;
    if (isCustomMealDayExist(dayID, allMeals)) {
      const updatedMeals = allMeals[dayID].filter((m) => m.id !== id);
      allMeals[dayID] = updatedMeals;
      localStorage.setItem("customMeals", JSON.stringify(allMeals));
    }
  }
};

export const readCustomMealDay = (dayID: string) => {
  const mealsFromStore = localStorage.getItem("customMeals");
  if (mealsFromStore) {
    const allMeals = JSON.parse(mealsFromStore) as AllMeal;
    return allMeals[dayID];
  }
  return [];
};

export const calculateData = (
  dayID: string,
  dayIndex: number,
  calculatorData: CalculatorData,
) => {
  const mealsFromStore = localStorage.getItem("customMeals");
  let allMeals = {} as AllMeal;
  if (mealsFromStore) {
    allMeals = JSON.parse(mealsFromStore) as AllMeal;
    allMeals[dayID][dayIndex - 1].calculatorData = calculatorData;
    localStorage.setItem("customMeals", JSON.stringify(allMeals));
  }
};

export const getNextIndex = (dayID: number) => {
  const mealsFromStore = localStorage.getItem("customMeals");
  if (mealsFromStore) {
    const allMeals = JSON.parse(mealsFromStore) as AllMeal;
    return allMeals[dayID].length;
  }
  return 0;
};

export const addTemporaryMeals = (meal: IMealElement) => {
  const mealsFromStore = sessionStorage.getItem("temporaryMeal");
  let allMeals: IMealElement[] = [];

  if (mealsFromStore) {
    allMeals = JSON.parse(mealsFromStore) as IMealElement[];
  }
  const mealExists = allMeals.some((storeMeal) => storeMeal.id === meal.id);

  if (!mealExists) {
    allMeals.push(meal);
  }

  sessionStorage.setItem("temporaryMeal", JSON.stringify(allMeals));
};

export const removeTemporaryMeal = (mealId: string) => {
  const mealsFromStore = sessionStorage.getItem("temporaryMeal");
  if (mealsFromStore) {
    const allMeals = JSON.parse(mealsFromStore) as IMealElement[];
    const updatedMeals = allMeals.filter((meal) => meal.id !== mealId);
    sessionStorage.setItem("temporaryMeal", JSON.stringify(updatedMeals));
  }
};

export const getTemporaryMeals = (): IMealElement[] => {
  const mealsFromStore = sessionStorage.getItem("temporaryMeal");
  return mealsFromStore ? (JSON.parse(mealsFromStore) as IMealElement[]) : [];
};

export const clearTemporaryStore = () => {
  sessionStorage.removeItem("temporaryMeal");
};
