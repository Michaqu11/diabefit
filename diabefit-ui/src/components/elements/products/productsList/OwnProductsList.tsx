import {
  Divider,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import { IMealElement } from "../../../../types/meal";
import {
  readSpecificDayMeal,
  removeMeal,
  saveMeal,
} from "../../../../store/mealsStorage";
import { IDay } from "../../../../types/days";
import { emptyList } from "./emptyList";
import BpCheckbox from "../Checkbox";
import InfiniteScroll from "react-infinite-scroll-component";
import CustomMealDialog from "../utils/CustomMealDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { removeOwnProduct } from "../../../../api/remove-own-product";
import { removeAddedMealNotification } from "../utils/AddedMealNotification";
import {
  addTemporaryMeals,
  getTemporaryMeals,
} from "../../../../store/customMealsStorage";
import { useTranslation } from "react-i18next";

type Props = {
  dayID: string;
  eDayID: string;
  searchKey: string;
  ownProducts: IMealElement[];
  getProducts: () => Promise<void>;
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

const OwnProductsList: React.FC<Props> = ({
  searchKey,
  dayID,
  eDayID,
  ownProducts,
  getProducts,
  isNewEntry,
}) => {
  const { t } = useTranslation();

  const [openCustomizeMealDialog, setOpenCustomizeMealDialog] = useState(false);
  const [customizeMeal, setCustomizeMeal] = useState<IMealElement | undefined>(
    undefined,
  );

  const readData = useCallback(
    () =>
      isNewEntry
        ? { meals: getTemporaryMeals() }
        : (readSpecificDayMeal(dayID, Number(eDayID)) as IDay | undefined),
    [dayID, eDayID, isNewEntry],
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
  }, [dayID, eDayID, readData]);

  const [checked, setChecked] = useState<string[]>(
    checkedData ? checkedData.meals.map((meal: IMealElement) => meal.id) : [],
  );

  const [products, setProducts] = useState<JSX.Element[] | JSX.Element>(
    emptyList(),
  );
  const [allMeals, setAllMeals] = useState<IMealElement[]>([]);
  const [meals, setMeals] = useState<IMealElement[]>([]);

  useEffect(() => setAllMeals(ownProducts), [ownProducts]);

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

  const formatProductsData = useCallback(
    (searchKey: string): IMealElement[] | undefined => {
      if (allMeals) {
        const load_meal = allMeals.filter((meal) =>
          meal.displayName.includes(searchKey),
        );

        return load_meal
          ? load_meal.map((meal: IMealElement) => {
              return {
                ...meal,
                displayName: meal.displayName
                  .slice(0, 30)
                  .concat(meal.displayName.length > 30 ? "..." : ""),
              };
            })
          : undefined;
      }
    },
    [allMeals],
  );

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
    (meal: IMealElement, divider: boolean) => {
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
              <Grid alignContent={"center"}>
                <IconButton
                  onClick={() => {
                    removeOwnProduct(meal.displayName).then(() =>
                      getProducts(),
                    );
                    removeAddedMealNotification(t);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <BpCheckbox
                  edge="end"
                  onChange={handleToggle(meal)}
                  checked={checked.includes(meal.id)}
                  inputProps={{ "aria-labelledby": meal.id }}
                />
              </Grid>
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
    [checked, details, getProducts, handleToggle, t],
  );

  useEffect(() => {
    const products = meals
      ? meals.map((meal: IMealElement, index: number) => {
          return renderRow(meal, index !== meals.length - 1);
        })
      : emptyList();

    setProducts(products);
  }, [allMeals, checked, checkedData, meals, renderRow]);

  useEffect(() => {
    const mealsProps = formatProductsData(searchKey) ?? [];
    setMeals(convertMealToBeUnique(mealsProps));
  }, [formatProductsData, searchKey]);

  return (
    <>
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
          next={() => {}}
          hasMore={false}
          height={600}
          loader={
            <p style={{ textAlign: "center" }}>
              {t("addProduct.list.loading")}
            </p>
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              {meals?.length ? <b>{t("addProduct.list.noMoreData")}</b> : null}
            </p>
          }
        >
          {products}
        </InfiniteScroll>
      </Grid>

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

export default OwnProductsList;
