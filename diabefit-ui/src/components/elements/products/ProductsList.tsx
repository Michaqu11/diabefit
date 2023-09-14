import {
  Divider,
  Grid,
  List,
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

type Props = {
  searchKey: string;
};

const ProductsList: React.FC<Props> = ({ searchKey }) => {
  interface IMealElement {
    mealName: string;
    displayName: string;
    id: number;
    grams: number;
    kcal: number;
    prot: number;
    fats: number;
    carbs: number;
    image?: string;
  }
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

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
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
          secondaryAction={
            <BpCheckbox
              edge="end"
              onChange={handleToggle(meal.mealName)}
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
            id: meal.id,
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
