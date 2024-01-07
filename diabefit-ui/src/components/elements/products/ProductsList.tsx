import {
  Divider,
  Grid,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BpCheckbox from "./Checkbox";
import "./ProductsList.scss";
import { searchFood } from "../../../api/fatsecret-api";
import InfiniteScroll from "react-infinite-scroll-component";
import { IMealElement } from "../../../types/meal";
import {
  addMeal,
  readSpecificDayMeal,
  removeMeal,
} from "../../../store/mealsStorage";
import { IDay } from "../../../types/days";
import { setupServingsData } from "./utils/ProductsListUtils";
import CustomMealDialog from "./utils/CustomMealDialog";
import styled from 'styled-components';

type Props = {
  searchKey: string;
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
`


const ProductsList: React.FC<Props> = ({ searchKey }) => {
  const [dayID, eDayID] = window.location.pathname.slice(5).split("/");
  const [openCustomiseMealDialog, setOpenCustomiseMealDialog] = useState(false);
  const [customiseMeal, setCustomiseMeal] = useState<IMealElement | undefined>(
    undefined,
  );

  const [checkedData, setCheckedData] = useState(readSpecificDayMeal(dayID, Number(eDayID)) as
    | IDay
    | undefined)

  useEffect(() => {
    const newCheckData = readSpecificDayMeal(dayID, Number(eDayID));
    setCheckedData(readSpecificDayMeal(dayID, Number(eDayID)))
    setChecked(newCheckData ? newCheckData.meals.map((meal: IMealElement) => meal.id) : [],)
  }, [dayID, eDayID])


  const [checked, setChecked] = useState<string[]>(
    checkedData ? checkedData.meals.map((meal: IMealElement) => meal.id) : [],
  );

  const empty = (info: string = "No products to display") => {
    return (
      <ListItem component="div" disablePadding sx={{ marginTop: "50px" }}>
        <ListItemText style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: "1.5rem" }}>{info}</span>
        </ListItemText>
      </ListItem>
    );
  };

  const [products, setProducts] = useState<JSX.Element[] | JSX.Element>(
    empty(),
  );
  const [meals, setMeals] = useState<IMealElement[]>();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    setProps(meals);
  }, [checked, checkedData, meals]);

  const handleToggle = (meal: IMealElement) => () => {
    const currentIndex = checked.indexOf(meal.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(meal.id);
      setCustomiseMeal(meal);
      setOpenCustomiseMealDialog(true);
    } else {
      newChecked.splice(currentIndex, 1);
      removeMeal(dayID, Number(eDayID), meal.id);
    }

    setChecked(newChecked);
  };

  const displayDivider = () => {
    return <Divider />;
  };

  const saveMeal = (meal: IMealElement) => {
    addMeal(dayID, Number(eDayID), meal);
  };

  const uncheckMeal = (mealId: string) => {
    const currentIndex = checked.indexOf(mealId);
    const newChecked = [...checked];

    newChecked.splice(currentIndex, 1);
    removeMeal(dayID, Number(eDayID), mealId);
    setChecked(newChecked);
  };

  const details = (extension: IMealElement) => {
    return (
      <span>
        P {extension.prot}g F {extension.fats}g C {extension.carbs}g (
        {extension.kcal}kcal)
      </span>
    );
  };

  const renderRow = (meal: IMealElement, divider: boolean) => {
    return (
      <div key={meal.mealName}>
        <ListItem
          style={{
            backgroundColor: `${checked.includes(meal.id)
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
        {divider && displayDivider()}
      </div>
    );
  };

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

  const setProps = (mealsProps: IMealElement[] | undefined) => {
    const products = mealsProps
      ? mealsProps.map((meal: IMealElement, index: number) => {
        return renderRow(meal, index !== mealsProps.length - 1);
      })
      : empty();
    setProducts(products);
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
              loader={<p style={{ textAlign: "center" }}>Loading...</p>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  {meals?.length ? <b>No more data to load.</b> : null}
                </p>
              }
            >
              {products}
            </InfiniteScroll>
          </Grid>
        ) : (
          empty("Search for products")
        )}
      </div>
      <CustomMealDialog
        meal={customiseMeal}
        setMeal={setCustomiseMeal}
        open={openCustomiseMealDialog}
        setOpen={setOpenCustomiseMealDialog}
        uncheckMeal={uncheckMeal}
        saveMeal={saveMeal}
      />
    </>
  );
};

export default ProductsList;
