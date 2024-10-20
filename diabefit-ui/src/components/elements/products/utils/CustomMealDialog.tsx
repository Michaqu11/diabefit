import React, { useState } from "react";
import { IMealElement } from "../../../../types/meal";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { formatMealToCustomGrams } from "./ProductsListUtils";

type Props = {
  meal: IMealElement | undefined;
  setMeal: (value: React.SetStateAction<IMealElement | undefined>) => void;
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  uncheckMeal: (mealId: string) => void;
  saveMeal: (meal: IMealElement) => void;
};

const StyledNutrition = (title: string, value: number) => {
  return (
    <Paper sx={{ textAlign: "center" }}>
      <div>
        <b>{title}</b>
      </div>
      {value}
    </Paper>
  );
};

const CustomMealDialog: React.FC<Props> = ({
  meal,
  setMeal,
  open,
  setOpen,
  uncheckMeal,
  saveMeal,
}) => {
  const [amountInput, setAmountInput] = useState<number | string>(100);
  const [amountInputError, setAmountInputError] = useState(false);

  const reset = () => {
    setAmountInput(100);
    setAmountInputError(false);
    setOpen(false);
  };

  const handleCancel = () => {
    reset();
    meal && uncheckMeal(meal.id);
  };

  const handleAccept = () => {
    reset();
    meal && saveMeal(meal);
  };

  const updateMealNutrition = (grams: number) => {
    const newMeal = meal && formatMealToCustomGrams(meal, grams);
    setMeal(newMeal);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle sx={{ padding: "8px 24px" }}>
          Configure your meal
        </DialogTitle>
        <DialogContent>
          {meal ? (
            <>
              <DialogContentText>
                Enter the weight for the <b>{meal.displayName}</b> product
              </DialogContentText>
              <Container fixed sx={{ padding: "0px", margin: "10px 0px" }}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    {StyledNutrition("Calories", meal.kcal)}
                  </Grid>
                  <Grid item xs={3}>
                    {StyledNutrition("Fat", meal.fats)}
                  </Grid>
                  <Grid item xs={3}>
                    {StyledNutrition("Carbs", meal.carbs)}
                  </Grid>
                  <Grid item xs={3}>
                    {StyledNutrition("Protein", meal.prot)}
                  </Grid>
                </Grid>
              </Container>
            </>
          ) : null}

          <TextField
            sx={{ width: "100%", margin: "10px 0px  0px  0px" }}
            label="Amount (grams)"
            variant="outlined"
            value={amountInput}
            type="number"
            inputProps={{
              step: "1",
            }}
            error={amountInputError}
            autoFocus
            onChange={(e) => {
              const parsedNumber = Number(e.target.value);
              if (parsedNumber && parsedNumber > 0) {
                setAmountInput(parsedNumber);
                setAmountInputError(false);
                updateMealNutrition(parsedNumber);
              } else {
                setAmountInput("");
                setAmountInputError(true);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleAccept}>Accept</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default CustomMealDialog;
