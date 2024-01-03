import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import "./accordions.scss";
import AccordionDetail from "./accordionDetail";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import FunctionsOutlinedIcon from "@mui/icons-material/FunctionsOutlined";
import { Link } from "react-router-dom";
import {
  EDays,
  ICalculatePanel,
  IDay,
  IElement,
  IValues,
  UnitsType,
} from "../../../types/days";
import { addUnits, readDayMeal } from "../../../store/mealsStorage";
import { IMealElement } from "../../../types/meal";
import CalculatePanel from "../glucose-calculate/creating-panel";

type Props = {
  dayId: number;
};

const CustomizedAccordions: React.FC<Props> = ({ dayId }) => {
  const [days, setDays] = React.useState<IDay[]>([]);

  React.useEffect(() => {
    setDays(
      readDayMeal(dayId.toString()) ?? [
        {
          id: 1,
          name: EDays.BREAKFAST,
          meals: [],
          units: null,
        },
        {
          id: 2,
          name: EDays.SNACK_1,
          meals: [],
          units: null,
        },
        {
          id: 3,
          name: EDays.LUNCH,
          meals: [],
          units: null,
        },
        {
          id: 4,
          name: EDays.SNACK_2,
          meals: [],
          units: null,
        },
        {
          id: 5,
          name: EDays.DINNER,
          meals: [],
          units: null,
        },
        {
          id: 6,
          name: EDays.SNACK_3,
          meals: [],
          units: null,
        },
      ],
    );
  }, [dayId]);

  const changedData = (id: number) => {
    const meals = readDayMeal(dayId.toString());
    if (meals) {
      setDays(meals);
      if (!meals[id].meals.length)
        setExpanded(
          expanded.map((exp) =>
            exp.id === id ? { ...exp, status: !exp.status } : { ...exp },
          ),
        );
    }
  };

  function format2Decimals(num: number) {
    return Math.round(num * 100) / 100;
  }

  const summaryNutritionalValues = (elements: IMealElement[] | undefined) => {
    let kcal = 0,
      prot = 0,
      fats = 0,
      carbs = 0;

    elements &&
      elements.forEach((element: IMealElement) => {
        kcal += Number(element.kcal);
        prot += Number(element.prot);
        fats += Number(element.fats);
        carbs += Number(element.carbs);
      });

    return {
      kcal: format2Decimals(kcal),
      prot: format2Decimals(prot),
      fats: format2Decimals(fats),
      carbs: format2Decimals(carbs),
    };
  };

  const [width, setWidth] = React.useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const details = (
    meals: IMealElement[] | undefined,
    units: UnitsType | null,
  ) => {
    if (!meals) return <div></div>;
    const value: IValues = summaryNutritionalValues(meals);
    return (
      <p className="summary">
        {width >= 450
          ? units
            ? ` Units ${units.short}u ${value.kcal} kcal | C ${value.carbs}g`
            : `${value.kcal} kcal | P ${value.prot}g F ${value.fats}g C ${value.carbs}g`
          : width >= 310
            ? units
              ? ` ${units.short}u | ${value.kcal} kcal`
              : `${value.kcal} kcal | C ${value.carbs}g`
            : width >= 250
              ? units
                ? `${units.short}u`
                : `${value.kcal} kcal`
              : ""}
      </p>
    );
  };

  const elements = (
    elements: IMealElement[] | undefined,
    dayID: string,
    dayIndex: number,
  ): IElement[] | undefined => {
    if (!elements) return undefined;

    return elements.map((el: IMealElement) => {
      return {
        header: `${el.mealName} (${el.grams}g)`,
        secondary: `Prot. ${el.prot} Fats ${el.fats}g Crabs ${el.carbs}g ${el.kcal} kcal`,
        id: el.id,
        dayIndex: dayIndex,
        dayID: dayID,
      };
    });
  };

  const [expanded, setExpanded] = React.useState<
    { id: number; status: boolean }[]
  >(
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      status: false,
    })),
  );

  const checkStatus = (id: number) => {
    if (expanded.filter((exp) => exp.id === id)[0].status) {
      return true;
    }
    return false;
  };

  const handleChangeExpanded = (id: number) => {
    setExpanded(
      expanded.map((exp) =>
        exp.id === id ? { ...exp, status: !exp.status } : { ...exp },
      ),
    );
  };

  const routeHandler = (dayId: number, element: IDay) => {
    return `add/${dayId}/${Object.values(EDays).indexOf(element.name as unknown as EDays) + 1
      }`;
  };

  const [openCalculate, setOpenCalculate] = React.useState<ICalculatePanel>({
    open: false,
    dayId: undefined,
    day: undefined,
  });

  const saveGlucose = (calculatePanel: ICalculatePanel) => {
    if (
      calculatePanel.day?.id !== undefined &&
      calculatePanel.dayId !== undefined &&
      calculatePanel.day?.units
    )
      addUnits(
        calculatePanel.dayId.toString(),
        calculatePanel.day?.id,
        calculatePanel.day?.units?.short,
      );
  };

  return (
    <div>
      {days.map((day: IDay) => (
        <Accordion
          className="accordianDetailItem"
          expanded={checkStatus(day.id - 1)}
          key={day.id}
          sx={{ marginBottom: "5px", borderRadius: "10px" }}
        >
          <AccordionSummary
            className="accordion-summary"
            sx={{ flexDirection: day.meals.length ? "row" : "" }}
            expandIcon={
              !day.meals.length ? (
                <IconButton
                  component={Link}
                  to={routeHandler(dayId, day)}
                  state={{
                    meal: day.name,
                    days: days.map((e) => e.name),
                  }}
                  aria-label="AddIcon"
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              ) : (
                ""
              )
            }
            aria-controls={day.name + "-content"}
            id={day.name}
          >
            <Typography sx={{ minWidth: '70px' }}>{day.name}</Typography>
            {day.meals.length ? (
              <Grid container justifyContent="space-between">
                <Grid sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography
                    component={"span"}
                    sx={{ color: "text.secondary" }}
                  >
                    {details(day.meals, day.units)}
                  </Typography>
                  <IconButton
                    className={"MyIconButton"}
                    sx={{
                      rotate: checkStatus(day.id - 1) ? "180deg" : "",
                      marginLeft: "2px",
                    }}
                    aria-label="handleChange"
                    size="small"
                    onClick={() => handleChangeExpanded(day.id - 1)}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Grid>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: "2px",
                    marginRight: "3px",
                  }}
                >
                  <IconButton
                    className={"MyIconButton"}
                    aria-label="FunctionsOutlinedIcon"
                    size="small"
                    onClick={() => setOpenCalculate({ open: true, dayId, day })}
                  >
                    <FunctionsOutlinedIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={routeHandler(dayId, day)}
                    state={{
                      meal: day.name,
                      days: days.map((e) => e.name),
                    }}
                    className={"MyIconButton"}
                    aria-label="AddIcon"
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ) : (
              ""
            )}
          </AccordionSummary>
          {day.meals.length ? (
            <AccordionDetails>
              <AccordionDetail
                elementsProps={elements(
                  day.meals,
                  dayId.toString(),
                  Object.values(EDays).indexOf(day.name as unknown as EDays) +
                  1,
                )}
                changedData={changedData}
              />
            </AccordionDetails>
          ) : (
            ""
          )}
        </Accordion>
      ))}
      <CalculatePanel
        openCalculate={openCalculate}
        setOpenCalculate={setOpenCalculate}
        saveGlucose={saveGlucose}
      />
    </div>
  );
};

export default CustomizedAccordions;
