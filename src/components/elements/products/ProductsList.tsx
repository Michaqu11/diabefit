import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import BpCheckbox from "./Checkbox";

type Props = {
  searchKey: string;
};

const ProductsList: React.FC<Props> = ({ searchKey }) => {
  interface IMealElement {
    mealName: string;
    grams: number;
    kcal: number;
    prot: number;
    fats: number;
    carbs: number;
    image?: string;
  }

  const meals: IMealElement[] = [
    {
      mealName: "Kebab",
      grams: 200,
      kcal: 510,
      prot: 28.4,
      fats: 32.4,
      carbs: 28.0,
    },
    {
      mealName: "Frytki",
      grams: 500,
      kcal: 220,
      prot: 0,
      fats: 0,
      carbs: 55.0,
    },
    {
      mealName: "Frytki Karbowane",
      grams: 500,
      kcal: 220,
      prot: 0,
      fats: 0,
      carbs: 55.0,
    },
    {
      mealName: "Frytki Beligjske",
      grams: 500,
      kcal: 220,
      prot: 0,
      fats: 0,
      carbs: 55.0,
    },
    {
      mealName: "Frytki Mrożone",
      grams: 500,
      kcal: 220,
      prot: 0,
      fats: 0,
      carbs: 55.0,
    },
  ];

  const [checked, setChecked] = useState<string[]>([]);

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

  const renderRow = (meal: IMealElement, divider: boolean) => {
    return (
      <>
        <ListItem
          key={meal.mealName}
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
            <ListItemText primary={meal.mealName} />
          </ListItemButton>
        </ListItem>
        {divider && displayDivider()}
      </>
    );
  };

  const empty = (info: string = "No products to display") => {
    return (
      <ListItem component="div" disablePadding sx={{ marginTop: "50px" }}>
        <ListItemText style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: "1.5rem" }}>{info}</span>
        </ListItemText>
      </ListItem>
    );
  };

  const products = () => {
    const products = meals
      .map((meal: IMealElement, index: number) => {
        if (meal.mealName.toLowerCase().includes(searchKey.toLowerCase())) {
          return renderRow(meal, index !== meals.length - 1);
        }
        return undefined;
      })
      .filter(Boolean);
    return products.length ? products : empty();
  };

  return (
    <div>
      {searchKey ? (
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            position: "relative",
            overflow: "auto",
            maxHeight: 500,
            paddingTop: 0,
          }}
        >
          {products()}
        </List>
      ) : (
        empty("Search for products")
      )}
    </div>
  );
};

export default ProductsList;
