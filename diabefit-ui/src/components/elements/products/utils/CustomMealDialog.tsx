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
import { addedMealNotification } from "./AddedMealNotification";
import { useTranslation } from "react-i18next";

type Props = {
  meal?: IMealElement | undefined;
  setMeal?: (value: React.SetStateAction<IMealElement | undefined>) => void;
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  uncheckMeal?: (mealId: string) => void;
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
  const { t } = useTranslation();

  const [amountInput, setAmountInput] = useState<number | string>(100);
  const [amountInputError, setAmountInputError] = useState(false);

  const reset = () => {
    setAmountInput(100);
    setAmountInputError(false);
    setOpen(false);
  };

  const handleCancel = () => {
    reset();
    meal && uncheckMeal && uncheckMeal(meal.id);
  };

  const handleAccept = () => {
    reset();
    meal && saveMeal(meal);
    addedMealNotification(t);
  };

  const updateMealNutrition = (grams: number) => {
    const newMeal = meal && formatMealToCustomGrams(meal, grams);
    setMeal && setMeal(newMeal);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle sx={{ padding: "8px 24px" }}>
          {t("addProduct.dialog.configureMealLabel")}
        </DialogTitle>
        <DialogContent>
          {meal ? (
            <>
              <DialogContentText>
                {t("addProduct.dialog.header")} <b>{meal.displayName}</b>
              </DialogContentText>
              <Container fixed sx={{ padding: "0px", margin: "10px 0px" }}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    {StyledNutrition(
                      t("addProduct.dialog.nutrition.kcal"),
                      meal.kcal,
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {StyledNutrition(
                      t("addProduct.dialog.nutrition.fats"),
                      meal.fats,
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {StyledNutrition(
                      t("addProduct.dialog.nutrition.carbs"),
                      meal.carbs,
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {StyledNutrition(
                      t("addProduct.dialog.nutrition.prot"),
                      meal.prot,
                    )}
                  </Grid>
                </Grid>
              </Container>
            </>
          ) : null}

          <TextField
            sx={{ width: "100%", margin: "10px 0px  0px  0px" }}
            label={t("addProduct.dialog.grams")}
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
          <Button onClick={handleCancel}>
            {t("addProduct.dialog.cancelButton")}
          </Button>
          <Button onClick={handleAccept}>
            {t("addProduct.dialog.acceptButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default CustomMealDialog;
