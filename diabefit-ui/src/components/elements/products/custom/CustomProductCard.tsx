import React, { useState } from "react";
import { EMPTY_BASE, IMealElement } from "../../../../types/meal";
import {
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";

import { v4 as uuidv4 } from "uuid";
import { addedMealNotification } from "../utils/AddedMealNotification";

interface CustomProductProps {
  setProduct: (meal: IMealElement) => void;
}

type CustomProductType = {
  mealName: string;
  grams: number;
  kcal: number;
  prot: number;
  fats: number;
  carbs: number;
};

type ErrorFields = {
  [K in keyof CustomProductType as `${K}Error`]: boolean;
};

const validateNumberInput = (
  field: keyof CustomProductType,
  value: string,
  setData: React.Dispatch<
    React.SetStateAction<CustomProductType & ErrorFields>
  >,
) => {
  const parsedNumber = Number(value);

  setData((prevState) => {
    const newFieldError = `${field}Error` as keyof ErrorFields;

    return {
      ...prevState,
      [field]: parsedNumber > 0 ? parsedNumber : "",
      [newFieldError]: !(parsedNumber >= 0),
    } as CustomProductType & ErrorFields;
  });
};

const initialProductData: CustomProductType & ErrorFields = {
  mealName: "",
  mealNameError: false,
  grams: 0,
  gramsError: false,
  kcal: 0,
  kcalError: false,
  prot: 0,
  protError: false,
  fats: 0,
  fatsError: false,
  carbs: 0,
  carbsError: false,
};

export const CustomProductCard: React.FC<CustomProductProps> = ({
  setProduct,
}) => {
  const [productData, setProductData] = useState(initialProductData);

  const reset = () => {
    setProductData(initialProductData);
  };

  const confirm = () => {
    reset();
    setProduct({
      ...productData,
      displayName: productData.mealName,
      id: uuidv4(),
      base: EMPTY_BASE,
    });
    addedMealNotification();
  };

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              padding: "8px 24px",
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}
          >
            Create a custom product
          </Typography>

          <Container fixed sx={{ padding: "0px", margin: "10px 0px" }}>
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
              value={productData.carbs}
              type="number"
              inputProps={{
                step: "1",
              }}
              error={productData.kcalError}
              onChange={(e) =>
                validateNumberInput("carbs", e.target.value, setProductData)
              }
            />

            <TextField
              sx={{ width: "100%", margin: "10px 0" }}
              label="Protein (g)"
              variant="outlined"
              value={productData.prot}
              type="number"
              inputProps={{
                step: "1",
              }}
              error={productData.kcalError}
              onChange={(e) =>
                validateNumberInput("prot", e.target.value, setProductData)
              }
            />

            <TextField
              sx={{ width: "100%", margin: "10px 0" }}
              label="Fats (g)"
              variant="outlined"
              value={productData.fats}
              type="number"
              inputProps={{
                step: "1",
              }}
              error={productData.kcalError}
              onChange={(e) =>
                validateNumberInput("fats", e.target.value, setProductData)
              }
            />

            <TextField
              sx={{ width: "100%", margin: "10px 0" }}
              label="Calories (kcal)"
              variant="outlined"
              value={productData.kcal}
              type="number"
              inputProps={{
                step: "1",
              }}
              error={productData.kcalError}
              onChange={(e) =>
                validateNumberInput("kcal", e.target.value, setProductData)
              }
            />

            <TextField
              sx={{ width: "100%", margin: "10px 0" }}
              label="Amount (g)"
              variant="outlined"
              value={productData.grams}
              type="number"
              inputProps={{
                step: "1",
              }}
              error={productData.gramsError}
              onChange={(e) =>
                validateNumberInput("grams", e.target.value, setProductData)
              }
            />
          </Container>
          <Container sx={{ display: "flex", justifyContent: "right" }}>
            <Button onClick={reset}>Reset</Button>
            <Button onClick={confirm}>Confirm</Button>
          </Container>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
