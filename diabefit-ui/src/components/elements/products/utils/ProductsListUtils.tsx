import { IMealElement } from "../../../../types/meal";

const HUNDRED_GRAMS = "100.000";

const formatServingToOneHundredGrams = (serving: any) => {

  const multiplier = Number(HUNDRED_GRAMS) / Number(serving.metric_serving_amount ?? 1);
  return {
    metric_serving_amount: Number((serving.metric_serving_amount * multiplier).toFixed(1)),
    calories: Number((serving.calories * multiplier).toFixed(0)),
    protein: Number((serving.protein * multiplier).toFixed(1)),
    fat: Number((serving.fat * multiplier).toFixed(1)),
    carbohydrate: Number((serving.carbohydrate * multiplier).toFixed(1)),
  };
}

export const formatServingToCustomGrams = (serving: any, grams: number) => {

  const multiplier = grams / Number(serving.metric_serving_amount ?? 1);
  return {
    metric_serving_amount: Number((serving.metric_serving_amount * multiplier).toFixed(1)),
    calories: Number((serving.calories * multiplier).toFixed(0)),
    protein: Number((serving.protein * multiplier).toFixed(1)),
    fat: Number((serving.fat * multiplier).toFixed(1)),
    carbohydrate: Number((serving.carbohydrate * multiplier).toFixed(1)),
  };
}

export const setupServingsData = (servings: any) => {

  const hundredGramsSarvingExist = servings.filter((s: any) => s.metric_serving_amount === HUNDRED_GRAMS);
  return formatServingToOneHundredGrams(hundredGramsSarvingExist.length ? hundredGramsSarvingExist[0] : servings[0]);
}


export const formatMealToCustomGrams = (meal: IMealElement, grams: number): IMealElement => {

  const multiplier = grams / Number(meal.base.grams ?? 1);
  return {
    ...meal,
    grams: Number((meal.base.grams * multiplier).toFixed(1)),
    kcal: Number((meal.base.kcal * multiplier).toFixed(0)),
    prot: Number((meal.base.prot * multiplier).toFixed(1)),
    fats: Number((meal.base.fats * multiplier).toFixed(1)),
    carbs: Number((meal.base.carbs * multiplier).toFixed(1)),
  };
}