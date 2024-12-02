import { IElement, IValues, UnitsType } from "../../../types/days";
import { IMealElement } from "../../../types/meal";

function format2Decimals(num: number) {
  return Math.round(num * 100) / 100;
}

export const summaryNutritionalValues = (
  elements: IMealElement[] | undefined,
) => {
  let kcal = 0,
    prot = 0,
    fats = 0,
    carbs = 0;

  elements &&
    elements.forEach((element: IMealElement) => {
      kcal += Number(element.kcal);
      prot += Number(element.prot);
      fats += Number(element.fats);
      carbs += Number(element.carbs);
    });

  return {
    kcal: format2Decimals(kcal),
    prot: format2Decimals(prot),
    fats: format2Decimals(fats),
    carbs: format2Decimals(carbs),
  };
};

export const details = (
  meals: IMealElement[] | undefined,
  units: UnitsType | undefined,
  width: number,
  isElevate?: boolean,
) => {
  if (!meals) return <div></div>;
  const value: IValues = summaryNutritionalValues(meals);
  if (isElevate) {
    return <p className="summary">C {value.carbs}g (Elevate)</p>;
  }

  return (
    <p className="summary">
      {width >= 450
        ? units
          ? `Units ${units.short}u ${value.kcal} kcal | C ${value.carbs}g`
          : `${value.kcal} kcal | P ${value.prot}g F ${value.fats}g C ${value.carbs}g`
        : width >= 310
        ? units
          ? ` ${units.short}u | ${value.kcal} kcal`
          : `${value.kcal} kcal | C ${value.carbs}g`
        : width >= 250
        ? units
          ? `${units.short}u`
          : `${value.kcal} kcal`
        : ""}
    </p>
  );
};

export const elements = (
  elements: IMealElement[] | undefined,
  dayID: string,
  dayIndex: number,
): IElement[] | undefined => {
  if (!elements) return undefined;

  return elements.map((el: IMealElement) => {
    return {
      header: `${el.mealName} ${el.quick ? "(Quick)" : ""}`,
      secondary: `Prot. ${el.prot} Fats ${el.fats}g Crabs ${el.carbs}g ${el.kcal} kcal`,
      id: el.id,
      dayIndex: dayIndex,
      dayID: dayID,
    };
  });
};
