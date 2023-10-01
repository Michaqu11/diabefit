import {
  Divider,
  Grid,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BpCheckbox from "./Checkbox";
import "./ProductsList.scss";
import { searchFood } from "../../../api/fatsecret-api";
import InfiniteScroll from "react-infinite-scroll-component";
import { IMealElement } from "../../../types/meal";
import { addMeal, removeMeal } from "../../../store/mealsStorage";

type Props = {
  searchKey: string;
};

const ProductsList: React.FC<Props> = ({ searchKey }) => {


  const [dayID, eDayID] = window.location.pathname.slice(5).split('/')

  const empty = (info: string = "No products to display") => {
    return (
      <ListItem component="div" disablePadding sx={{ marginTop: "50px" }}>
        <ListItemText style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: "1.5rem" }}>{info}</span>
        </ListItemText>
      </ListItem>
    );
  };

  const [checked, setChecked] = useState<string[]>([]);

  const [products, setProducts] = useState<JSX.Element[] | JSX.Element>(
    empty(),
  );
  const [meals, setMeals] = useState<IMealElement[]>();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  useEffect(() => {
    setProps(meals);
  }, [checked, meals]);

  const handleToggle = (meal: IMealElement) => () => {
    const currentIndex = checked.indexOf(meal.mealName);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(meal.mealName);
      addMeal(dayID, Number(eDayID), meal)
    } else {
      newChecked.splice(currentIndex, 1);
      removeMeal(dayID, Number(eDayID), meal)
    }

    setChecked(newChecked);
  };

  const displayDivider = () => {
    return <Divider />;
  };

  const details = (extension: IMealElement) => {
    return (
      <span>
        P {extension.prot}g F {extension.fats}gC {extension.carbs}g (
        {extension.kcal}kcal)
      </span>
    );
  };

  const renderRow = (meal: IMealElement, divider: boolean) => {
    return (
      <div key={meal.mealName}>
        <ListItem
        style={{backgroundColor: `${checked.includes(meal.mealName) ? 'rgba(30,130,192,0.1)': 'rgb(255,255,255)'}`}}
          secondaryAction={
            <BpCheckbox
              edge="end"
              onChange={handleToggle(meal)}
              checked={checked.includes(meal.mealName)}
              inputProps={{ "aria-labelledby": meal.mealName }}
            />
          }
          disablePadding
        >
          <ListItemButton>
            <ListItemText className="productdetail">
              {meal.displayName}
              <Typography component={"div"} sx={{ color: "text.secondary" }}>
                {details(meal)}
              </Typography>
            </ListItemText>
          </ListItemButton>
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
          const serving = meal.servings.serving[0];
          return {
            mealName: meal.food_name,
            displayName: meal.food_name
              .slice(0, 35)
              .concat(meal.food_name.length > 35 ? "..." : ""),
            id: meal.food_id,
            grams: serving.metric_serving_amount,
            kcal: serving.calories,
            prot: serving.protein,
            fats: serving.fat,
            carbs: serving.carbohydrate,
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
                <b>No more data to load.</b>
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
  );
};

export default ProductsList;
