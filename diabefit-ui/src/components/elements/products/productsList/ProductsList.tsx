import {
  Divider,
  Grid,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import BpCheckbox from "../Checkbox";
import "./ProductsList.scss";
import { searchFood } from "../../../../api/fatsecret-api";
import InfiniteScroll from "react-infinite-scroll-component";
import { IMealElement } from "../../../../types/meal";
import {
  readSpecificDayMeal,
  removeMeal,
  saveMeal,
} from "../../../../store/mealsStorage";
import { IDay } from "../../../../types/days";
import { setupServingsData } from "../utils/ProductsListUtils";
import CustomMealDialog from "../utils/CustomMealDialog";
import styled from "styled-components";
import { emptyList } from "./emptyList";
import {
  addTemporaryMeals,
  getTemporaryMeals,
} from "../../../../store/customMealsStorage";
import { useTranslation } from "react-i18next";

type Props = {
  dayID: string;
  eDayID: string;
  searchKey: string;
  isNewEntry?: boolean;
};

const ListItemTextWrapper = styled.div`
  max-height: 50px;
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  padding-top: 8px;
  padding-bottom: 8px;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  padding-left: 16px;
  padding-right: 48px;
`;

const ProductsList: React.FC<Props> = ({
  searchKey,
  dayID,
  eDayID,
  isNewEntry,
}) => {
  const { t } = useTranslation();

  const readData = useCallback(
    () =>
      isNewEntry
        ? { meals: getTemporaryMeals() }
        : (readSpecificDayMeal(dayID, Number(eDayID)) as IDay | undefined),
    [dayID, eDayID, isNewEntry],
  );

  const [openCustomizeMealDialog, setOpenCustomizeMealDialog] = useState(false);
  const [customizeMeal, setCustomizeMeal] = useState<IMealElement | undefined>(
    undefined,
  );

  const [checkedData, setCheckedData] = useState(readData());

  useEffect(() => {
    const newCheckData = readData();
    setCheckedData(readData());
    setChecked(
      newCheckData
        ? newCheckData.meals.map((meal: IMealElement) => meal.id)
        : [],
    );
  }, [readData]);

  const [checked, setChecked] = useState<string[]>(
    checkedData ? checkedData.meals.map((meal: IMealElement) => meal.id) : [],
  );

  const [products, setProducts] = useState<JSX.Element[] | JSX.Element>(
    emptyList(),
  );
  const [meals, setMeals] = useState<IMealElement[]>();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleToggle = useCallback(
    (meal: IMealElement) => () => {
      const currentIndex = checked.indexOf(meal.id);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(meal.id);
        setCustomizeMeal(meal);
        setOpenCustomizeMealDialog(true);
      } else {
        newChecked.splice(currentIndex, 1);
        removeMeal(dayID, Number(eDayID), meal.id);
      }

      setChecked(newChecked);
    },
    [checked, dayID, eDayID],
  );

  const uncheckMeal = (mealId: string) => {
    const currentIndex = checked.indexOf(mealId);
    const newChecked = [...checked];

    newChecked.splice(currentIndex, 1);
    removeMeal(dayID, Number(eDayID), mealId);
    setChecked(newChecked);
  };

  const details = useCallback(
    (extension: IMealElement) => {
      return (
        <span>
          {t("share.nutritionalValues.prot")} {extension.prot}g{" "}
          {t("share.nutritionalValues.fats")} {extension.fats}g{" "}
          {t("share.nutritionalValues.carbs")} {extension.carbs}g (
          {extension.kcal}
          {t("share.nutritionalValues.kcal")})
        </span>
      );
    },
    [t],
  );

  const formatProductsData = async (
    searchKey: string,
    pageNumber = 0,
  ): Promise<IMealElement[] | undefined> => {
    const meals = await searchFood(searchKey, pageNumber);
    const total_results = meals.foods_search.total_results ?? 0;
    const result = meals.foods_search.results
      ? meals.foods_search.results.food.map((meal: any) => {
          const serving = setupServingsData(meal.servings.serving);
          return {
            mealName: meal.food_name,
            displayName: meal.food_name
              .slice(0, 30)
              .concat(meal.food_name.length > 30 ? "..." : ""),
            id: meal.food_id,
            grams: serving.metric_serving_amount,
            kcal: serving.calories,
            prot: serving.protein,
            fats: serving.fat,
            carbs: serving.carbohydrate,
            base: {
              grams: serving.metric_serving_amount,
              kcal: serving.calories,
              prot: serving.protein,
              fats: serving.fat,
              carbs: serving.carbohydrate,
            },
          };
        })
      : undefined;
    setHasMore(result && total_results ? result.length < total_results : false);
    return result;
  };

  const loadMore = async () => {
    const res = await formatProductsData(searchKey, pageNumber + 1);

    if (meals && res) setMeals(convertMealToBeUnique([...meals, ...res]));

    setPageNumber(pageNumber + 1);
  };

  const convertMealToBeUnique = (meals: IMealElement[]) => {
    const mealsList: string[] = [];
    return meals.filter((meal) => {
      if (mealsList.includes(meal.mealName)) {
        return false;
      }
      mealsList.push(meal.mealName);
      return true;
    });
  };

  const renderRow = useCallback(
    (t: any, meal: IMealElement, divider: boolean) => {
      return (
        <div key={meal.mealName}>
          <ListItem
            style={{
              backgroundColor: `${
                checked.includes(meal.id)
                  ? "rgba(30,130,192,0.1)"
                  : "rgb(255,255,255)"
              }`,
            }}
            secondaryAction={
              <BpCheckbox
                edge="end"
                onChange={handleToggle(meal)}
                checked={checked.includes(meal.id)}
                inputProps={{ "aria-labelledby": meal.id }}
              />
            }
            disablePadding
          >
            <ListItemTextWrapper>
              <ListItemText className="productdetail">
                <Tooltip
                  title={meal.mealName}
                  enterDelay={1000}
                  leaveDelay={100}
                  placement="bottom-start"
                >
                  <div>{meal.displayName}</div>
                </Tooltip>
                <Typography component={"div"} sx={{ color: "text.secondary" }}>
                  {details(meal)}
                </Typography>
              </ListItemText>
            </ListItemTextWrapper>
          </ListItem>
          {divider && <Divider />}
        </div>
      );
    },
    [checked, details, handleToggle],
  );

  useEffect(() => {
    const products = meals
      ? meals.map((meal: IMealElement, index: number) => {
          return renderRow(t, meal, index !== meals.length - 1);
        })
      : emptyList();
    setProducts(products);
  }, [checked, checkedData, meals, renderRow, t]);

  useEffect(() => {
    const searchFoodProps = async () => {
      const mealsProps = await formatProductsData(searchKey);
      setMeals(mealsProps ? convertMealToBeUnique(mealsProps) : undefined);
    };
    searchFoodProps();
    setPageNumber(0);
  }, [searchKey]);

  return (
    <>
      <div>
        {searchKey ? (
          <Grid
            className="products-list"
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              paddingTop: 0,
            }}
          >
            <InfiniteScroll
              dataLength={meals?.length ?? 0}
              next={loadMore}
              hasMore={hasMore}
              height={600}
              loader={
                <p style={{ textAlign: "center" }}>
                  {t("addProduct.list.loading")}
                </p>
              }
              endMessage={
                <p style={{ textAlign: "center" }}>
                  {meals?.length ? (
                    <b>{t("addProduct.list.noMoreData")}</b>
                  ) : null}
                </p>
              }
            >
              {products}
            </InfiniteScroll>
          </Grid>
        ) : (
          <>{emptyList(t("addProduct.searchLabel"))}</>
        )}
      </div>
      <CustomMealDialog
        meal={customizeMeal}
        setMeal={setCustomizeMeal}
        open={openCustomizeMealDialog}
        setOpen={setOpenCustomizeMealDialog}
        uncheckMeal={uncheckMeal}
        saveMeal={(meal: IMealElement) =>
          isNewEntry ? addTemporaryMeals(meal) : saveMeal(meal, dayID, eDayID)
        }
      />
    </>
  );
};

export default ProductsList;
