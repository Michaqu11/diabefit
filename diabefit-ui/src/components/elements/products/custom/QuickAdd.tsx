import React, { useState } from "react";
import { EMPTY_BASE, IMealElement } from "../../../../types/meal";
import { Button, Container, TextField } from "@mui/material";

import { v4 as uuidv4 } from "uuid";
import {
  addedMealNotification,
  errorAddedMealNotification,
} from "../utils/AddedMealNotification";
import { calculateCalories } from "./calculateCalories";

interface QuickAddProps {
  setProduct: (meal: IMealElement) => void;
}

type CustomProductFields = {
  mealName: string;
  kcal: number;
  prot: number;
  fats: number;
  carbs: number;
};

type ErrorFields = {
  [K in keyof CustomProductFields as `${K}Error`]: boolean;
};

type CustomProductType = CustomProductFields & ErrorFields;

const validateNumberInput = (
  field: keyof CustomProductFields,
  value: string,
  setData: React.Dispatch<React.SetStateAction<CustomProductType>>,
  allowZero: boolean = true,
) => {
  const parsedNumber = Number(value);

  setData((prevState) => {
    const newFieldError = `${field}Error` as keyof ErrorFields;

    const isValid = allowZero ? parsedNumber >= 0 : parsedNumber > 0;

    return {
      ...prevState,
      [field]: isValid ? parsedNumber : "",
      [newFieldError]: !isValid,
    } as CustomProductType;
  });
};

const initialProductData: CustomProductType = {
  mealName: "Quick",
  mealNameError: false,
  kcal: 0,
  kcalError: false,
  prot: 0,
  protError: false,
  fats: 0,
  fatsError: false,
  carbs: 0,
  carbsError: false,
};

export const QuickAdd: React.FC<QuickAddProps> = ({ setProduct }) => {
  const [productData, setProductData] = useState(initialProductData);

  const reset = () => {
    setProductData(initialProductData);
  };

  const confirm = () => {
    const { mealNameError, protError, fatsError, carbsError, ...values } =
      productData;
    if (
      [mealNameError, protError, fatsError, carbsError].some((error) => error)
    ) {
      errorAddedMealNotification();
    } else {
      reset();

      const base = {
        ...EMPTY_BASE,
        ...values,
      };

      const newProduct = {
        ...base,
        displayName: productData.mealName,
        id: uuidv4(),
        base: base,
        kcal: values.kcal === 0 ? calculateCalories(base) : values.kcal,
        quick: true,
      };

      setProduct(newProduct);
      addedMealNotification();
    }
  };

  return (
    <React.Fragment>
      <Container fixed sx={{ p: 0 }}>
        <TextField
          sx={{ width: "100%", margin: "10px 0" }}
          label="Product Name"
          variant="outlined"
          value={productData.mealName}
          onChange={(e) => {
            setProductData((prevState) => ({
              ...prevState,
              mealName: e.target.value,
              mealNameError: e.target.value.length === 0,
            }));
          }}
          error={productData.mealNameError}
        />

        <TextField
          sx={{ width: "100%", margin: "10px 0" }}
          label="Carbohydrates (g)"
          variant="outlined"
          value={productData.carbs === 0 ? "" : productData.carbs}
          type="number"
          inputProps={{
            step: "1",
          }}
          error={productData.carbsError}
          onChange={(e) =>
            validateNumberInput("carbs", e.target.value, setProductData)
          }
        />

        <TextField
          sx={{ width: "100%", margin: "10px 0" }}
          label="Protein (g)"
          variant="outlined"
          value={productData.prot === 0 ? "" : productData.prot}
          type="number"
          inputProps={{
            step: "1",
          }}
          error={productData.protError}
          onChange={(e) =>
            validateNumberInput("prot", e.target.value, setProductData)
          }
        />

        <TextField
          sx={{ width: "100%", margin: "10px 0" }}
          label="Fats (g)"
          variant="outlined"
          value={productData.fats === 0 ? "" : productData.fats}
          type="number"
          inputProps={{
            step: "1",
          }}
          error={productData.fatsError}
          onChange={(e) =>
            validateNumberInput("fats", e.target.value, setProductData)
          }
        />

        <TextField
          sx={{ width: "100%", margin: "10px 0" }}
          label="Calories (kcal)"
          variant="outlined"
          value={productData.kcal === 0 ? "" : productData.kcal}
          type="number"
          inputProps={{
            step: "1",
          }}
          error={productData.kcalError}
          onChange={(e) =>
            validateNumberInput("kcal", e.target.value, setProductData)
          }
        />
      </Container>
      <Container sx={{ display: "flex", justifyContent: "right", p: 0 }}>
        <Button onClick={reset}>Reset</Button>
        <Button onClick={confirm}>Confirm</Button>
      </Container>
    </React.Fragment>
  );
};
