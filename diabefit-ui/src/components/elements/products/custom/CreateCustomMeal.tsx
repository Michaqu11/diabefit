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

interface CustomMealDialogProps {
  setMeal: (meal: IMealElement) => void;
}

type CustomMealType = {
  mealName: string;
  grams: number;
  kcal: number;
  prot: number;
  fats: number;
  carbs: number;
};

type ErrorFields = {
  [K in keyof CustomMealType as `${K}Error`]: boolean;
};

const validateNumberInput = (
  field: keyof CustomMealType,
  value: string,
  setMealData: React.Dispatch<
    React.SetStateAction<CustomMealType & ErrorFields>
  >,
) => {
  const parsedNumber = Number(value);

  setMealData((prevState) => {
    const newFieldError = `${field}Error` as keyof ErrorFields;

    return {
      ...prevState,
      [field]: parsedNumber > 0 ? parsedNumber : "",
      [newFieldError]: !(parsedNumber >= 0),
    } as CustomMealType & ErrorFields;
  });
};

const initialMealData: CustomMealType & ErrorFields = {
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

export const CreateCustomMeal: React.FC<CustomMealDialogProps> = ({
  setMeal,
}) => {
  const [mealData, setMealData] = useState(initialMealData);

  const reset = () => {
    setMealData(initialMealData);
  };

  const confirm = () => {
    reset();
    setMeal({
      ...mealData,
      displayName: mealData.mealName,
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
            Create a custom meal
          </Typography>

          <Container fixed sx={{ padding: "0px", margin: "10px 0px" }}>
            <TextField
              sx={{ width: "100%", margin: "10px 0" }}
              label="Meal Name"
              variant="outlined"
              value={mealData.mealName}
              onChange={(e) => {
                setMealData((prevState) => ({
                  ...prevState,
                  mealName: e.target.value,
                  mealNameError: e.target.value.length === 0,
                }));
              }}
              error={mealData.mealNameError}
            />

            <TextField
              sx={{ width: "100%", margin: "10px 0" }}
              label="Carbohydrates (g)"
              variant="outlined"
              value={mealData.carbs}
              type="number"
              inputProps={{
                step: "1",
              }}
              error={mealData.kcalError}
              onChange={(e) =>
                validateNumberInput("carbs", e.target.value, setMealData)
              }
            />

            <TextField
              sx={{ width: "100%", margin: "10px 0" }}
              label="Calories (kcal)"
              variant="outlined"
              value={mealData.kcal}
              type="number"
              inputProps={{
                step: "1",
              }}
              error={mealData.kcalError}
              onChange={(e) =>
                validateNumberInput("kcal", e.target.value, setMealData)
              }
            />

            <TextField
              sx={{ width: "100%", margin: "10px 0" }}
              label="Protein (g)"
              variant="outlined"
              value={mealData.prot}
              type="number"
              inputProps={{
                step: "1",
              }}
              error={mealData.kcalError}
              onChange={(e) =>
                validateNumberInput("prot", e.target.value, setMealData)
              }
            />

            <TextField
              sx={{ width: "100%", margin: "10px 0" }}
              label="Fats (g)"
              variant="outlined"
              value={mealData.fats}
              type="number"
              inputProps={{
                step: "1",
              }}
              error={mealData.kcalError}
              onChange={(e) =>
                validateNumberInput("fats", e.target.value, setMealData)
              }
            />

            <TextField
              sx={{ width: "100%", margin: "10px 0" }}
              label="Amount (g)"
              variant="outlined"
              value={mealData.grams}
              type="number"
              inputProps={{
                step: "1",
              }}
              error={mealData.gramsError}
              onChange={(e) =>
                validateNumberInput("grams", e.target.value, setMealData)
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
