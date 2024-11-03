import { CalculatorData } from "../types/days";
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

const addMeal = (dayID: string, dayIndex: number, meal: IMealElement) => {
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

export const saveMeal = (meal: IMealElement, dayID: string, eDayID: string) => {
  addMeal(dayID, Number(eDayID), meal);
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
  return undefined;
};

export const readSpecificDayMeal = (dayID: string, dayIndex: number) => {
  const mealsFromStore = localStorage.getItem("meals");
  if (mealsFromStore) {
    const allMeals = JSON.parse(mealsFromStore) as AllMeal;
    return allMeals[dayID] ? allMeals[dayID][dayIndex - 1] : undefined;
  }
  return undefined;
};

export const calculateData = (
  dayID: string,
  dayIndex: number,
  calculatorData: CalculatorData,
) => {
  const mealsFromStore = localStorage.getItem("meals");
  let allMeals = {} as AllMeal;
  if (mealsFromStore) {
    allMeals = JSON.parse(mealsFromStore) as AllMeal;
    allMeals[dayID][dayIndex - 1].calculatorData = calculatorData;
    localStorage.setItem("meals", JSON.stringify(allMeals));
  }
};

export const exportCSVData = () => {
  const mealsFromStore = localStorage.getItem("meals");
  if (mealsFromStore) {
    const mealsData: AllMeal = JSON.parse(mealsFromStore);

    let csvContent =
      "ID;Day;Meal Name;Display Name;Grams;Kcal;Protein;Fats;Carbs;Glucose;Units Short;Units Long;Date\n";

    Object.keys(mealsData).forEach((key) => {
      const dayArray = mealsData[key];
      dayArray.forEach((day) => {
        const dayName = day.name;

        day.meals.forEach((meal) => {
          const { mealName, displayName, grams, kcal, prot, fats, carbs } =
            meal;
          const glucose = day.calculatorData?.glucose || "";
          const unitsShort = day.calculatorData?.units.short
            ? `${day.calculatorData.units.short}`
            : "";
          const unitsLong = day.calculatorData?.units.long
            ? `${day.calculatorData.units.long}`
            : "";
          const date = day.calculatorData?.date
            ? new Date(day.calculatorData.date).toLocaleString()
            : "";

          csvContent += `${key};${dayName};${mealName};${displayName};${grams};${kcal};${prot};${fats};${carbs};${glucose};${unitsShort};${unitsLong};${date}\n`;
        });
      });
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportJSONData = () => {
  const mealsFromStore = localStorage.getItem("meals");
  if (mealsFromStore) {
    const blob = new Blob([mealsFromStore], { type: "text/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
