import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { IMealElement } from "../../../../../types/meal";
import { EDays, IDay } from "../../../../../types/days";
import {
  getTemporaryMeals,
  removeTemporaryMeal,
} from "../../../../../store/customMealsStorage";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

type Props = {
  dayId: number;
  customMeal: IDay;
  setCustomMeal: React.Dispatch<React.SetStateAction<IDay>>;
};

const ListBasedView: React.FC<Props> = ({
  customMeal,
  setCustomMeal,
  dayId,
}) => {
  const { t } = useTranslation();

  const summaryNutritionalValues = (elements: IMealElement[] | undefined) => {
    let kcal = 0,
      prot = 0,
      fats = 0,
      carbs = 0;
    elements?.forEach((element) => {
      kcal += Number(element.kcal);
      prot += Number(element.prot);
      fats += Number(element.fats);
      carbs += Number(element.carbs);
    });
    return {
      kcal: Math.round(kcal * 100) / 100,
      prot: Math.round(prot * 100) / 100,
      fats: Math.round(fats * 100) / 100,
      carbs: Math.round(carbs * 100) / 100,
    };
  };

  const handleAddMeal = (day: IDay) => {
    return `../entry/add/${dayId}/${
      Object.values(EDays).indexOf(day.name as EDays) + 1
    }`;
  };

  const summary = summaryNutritionalValues(customMeal.meals);

  return (
    <>
      <Accordion expanded sx={{ margin: "0 !important", boxShadow: "none" }}>
        <AccordionSummary
          expandIcon={
            <IconButton
              component={Link}
              to={handleAddMeal(customMeal)}
              aria-label="add meal"
            >
              <AddIcon />
            </IconButton>
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <ListItemText
            primary={t("newEntry.productsLabel")}
            secondary={
              customMeal.meals.length > 0
                ? `${summary.kcal} ${t("share.nutritionalValues.kcal")} | 
                       ${t("share.nutritionalValues.prot")}: ${summary.prot}g 
                        ${t("share.nutritionalValues.fats")}: ${summary.fats}g 
                        ${t("share.nutritionalValues.carbs")}: ${
                          summary.carbs
                        }g`
                : t("newEntry.emptyProducts")
            }
          />
        </AccordionSummary>
        <AccordionDetails>
          {customMeal.meals.length > 0 ? (
            <>
              <Divider />
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {customMeal.meals.map((meal) => {
                  return (
                    <ListItem
                      style={{ padding: "2px 8px 2px 12px" }}
                      key={meal.id}
                    >
                      <ListItemText
                        primary={meal.mealName}
                        secondary={` ${t("share.nutritionalValues.kcal")}: ${
                          meal.kcal
                        },  ${t("share.nutritionalValues.prot")}: ${
                          meal.prot
                        }g,  ${t("share.nutritionalValues.fats")}: ${
                          meal.fats
                        }g,  ${t("share.nutritionalValues.carbs")}: ${
                          meal.carbs
                        }g`}
                      />
                      <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="close"
                        size="small"
                        className="products-detail-remove-button"
                        onClick={() => {
                          removeTemporaryMeal(meal.id);
                          setCustomMeal((prev: IDay) => ({
                            ...prev,
                            meals: getTemporaryMeals(),
                          }));
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </ListItem>
                  );
                })}
              </List>
            </>
          ) : null}
        </AccordionDetails>
      </Accordion>
      <Divider sx={{ margin: 1 }} />
    </>
  );
};

export default ListBasedView;
