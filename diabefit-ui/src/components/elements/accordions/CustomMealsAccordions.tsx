import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { IDay } from "../../../types/days";
import {
  readCustomMealDay,
  removeCustomMeal,
} from "../../../store/customMealsStorage";
import { details, elements } from "./utils";
import AccordionDetail from "./accordionDetail";
import DividerWithText from "../../common/share/DividerWithText";
import ConfirmDialog from "../../common/share/ConfirmDialog";
import { useState } from "react";

type Props = {
  dayId: number;
  width: number;
};

export const CustomMealAccordions: React.FC<Props> = ({ dayId, width }) => {
  const [meals, setMeals] = React.useState<IDay[]>([]);

  React.useEffect(() => {
    const mealsFromStorage = readCustomMealDay(dayId.toString());
    setMeals(mealsFromStorage || []);
  }, [dayId]);

  const handleDelete = (id: number) => {
    removeCustomMeal(dayId, id);
    const mealsFromStorage = readCustomMealDay(dayId.toString());
    setMeals(mealsFromStorage || []);
  };

  const getHeader = (meal: IDay) => {
    if (meal.calculatorData?.date) {
      const d = new Date(meal.calculatorData?.date);
      return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
    }
    return meal.name;
  };

  const [dialogData, setDialogData] = useState<number | null>(null);

  return (
    <div>
      {meals.length ? <DividerWithText text="Custom meals" /> : null}
      {meals.length
        ? meals.map((meal, index) => (
            <Accordion
              key={meal.id}
              sx={{
                marginBottom: "5px",
                borderRadius: "10px",
                backgroundColor:
                  "var(--joy-palette-primary-softBg, var(--joy-palette-primary-100, #DDF1FF))",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`correction-content-${meal.id}`}
                id={`correction-${meal.id}`}
                sx={{ maxHeight: "50px" }}
              >
                <span
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {getHeader(meal)}
                  <Typography
                    component={"span"}
                    sx={{ color: "text.secondary" }}
                  >
                    {details(
                      meal.meals,
                      meal.calculatorData?.units,
                      width,
                      meal.isElevate,
                    )}
                  </Typography>
                </span>
                <IconButton
                  aria-label="delete"
                  onClick={() => setDialogData(meal.id)}
                  sx={{ marginLeft: "auto", marginTop: "2px" }}
                >
                  <DeleteIcon />
                </IconButton>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: "0px 15px" }}>
                <AccordionDetail
                  elementsProps={elements(
                    meal.meals,
                    dayId.toString(),
                    meal.id,
                  )}
                  removeBackground
                  allowItemRemoval={false}
                />
              </AccordionDetails>
            </Accordion>
          ))
        : null}
      <ConfirmDialog
        open={dialogData !== null}
        text="Do you want to remove the custom meal?"
        setOpen={() => setDialogData(null)}
        onConfirm={() => handleDelete(dialogData ?? 0)}
      />
    </div>
  );
};
