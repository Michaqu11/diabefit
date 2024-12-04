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
  t: any,
  isElevate?: boolean,
) => {
  if (!meals) return <div></div>;
  const value: IValues = summaryNutritionalValues(meals);
  if (isElevate) {
    return (
      <p className="summary">
        C {value.carbs}g {t("share.isElevateLabel")}
      </p>
    );
  }

  return (
    <p className="summary">
      {width >= 450
        ? units
          ? `${t("share.glucoseInput.fullInsulinUnits")} ${units.short}u ${
              value.kcal
            } ${t("share.nutritionalValues.kcal")} | ${t(
              "share.nutritionalValues.carbs",
            )} ${value.carbs}g`
          : `${value.kcal}  ${t("share.nutritionalValues.kcal")} | ${t(
              "share.nutritionalValues.prot",
            )} ${value.prot}g ${t("share.nutritionalValues.fats")} ${
              value.fats
            }g ${t("share.nutritionalValues.carbs")} ${value.carbs}g`
        : width >= 310
        ? units
          ? ` ${units.short}u | ${value.kcal} ${t(
              "share.nutritionalValues.kcal",
            )}`
          : `${value.kcal} ${t("share.nutritionalValues.kcal")} | ${t(
              "share.nutritionalValues.carbs",
            )} ${value.carbs}g`
        : width >= 250
        ? units
          ? `${units.short}u`
          : `${value.kcal}  ${t("share.nutritionalValues.kcal")}`
        : ""}
    </p>
  );
};

export const elements = (
  elements: IMealElement[] | undefined,
  dayID: string,
  dayIndex: number,
  t: any,
): IElement[] | undefined => {
  if (!elements) return undefined;

  return elements.map((el: IMealElement) => {
    return {
      header: `${el.mealName} ${el.quick ? `${t("share.isQuickLabel")}` : ""}`,
      secondary: `${t("share.nutritionalFullValues.prot")} ${el.prot} ${t(
        "share.nutritionalFullValues.fats",
      )} ${el.fats}g ${t("share.nutritionalFullValues.carbs")} ${el.carbs}g ${
        el.kcal
      } ${t("share.nutritionalFullValues.kcal")}`,
      id: el.id,
      dayIndex: dayIndex,
      dayID: dayID,
    };
  });
};
