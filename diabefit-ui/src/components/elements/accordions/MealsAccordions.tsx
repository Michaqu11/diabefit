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
  TranslatedDays,
} from "../../../types/days";
import { calculateData, readDayMeal } from "../../../store/mealsStorage";
import CalculatePanel from "../glucose-calculate/creating-panel";
import { details, elements } from "./utils";
import { useTranslation } from "react-i18next";
import { getTranslatedDay } from "../../../config/translation/daysTranslated";

type Props = {
  dayId: number;
  width: number;
};

const CustomizedAccordions: React.FC<Props> = ({ dayId, width }) => {
  const [days, setDays] = React.useState<IDay[]>([]);
  const currentDay = React.useRef(dayId);

  const { t } = useTranslation();

  React.useEffect(() => {
    const translatedDays = TranslatedDays(t);
    setDays(
      readDayMeal(dayId.toString()) ?? [
        {
          id: 1,
          name: EDays.BREAKFAST,
          meals: [],
          calculatorData: null,
        },
        {
          id: 2,
          name: EDays.SNACK_1,
          meals: [],
          calculatorData: null,
        },
        {
          id: 3,
          name: EDays.LUNCH,
          meals: [],
          calculatorData: null,
        },
        {
          id: 4,
          name: EDays.SNACK_2,
          meals: [],
          calculatorData: null,
        },
        {
          id: 5,
          name: EDays.DINNER,
          meals: [],
          calculatorData: null,
        },
        {
          id: 6,
          name: EDays.SNACK_3,
          meals: [],
          calculatorData: null,
        },
      ],
    );

    if (currentDay.current !== dayId)
      setExpanded(
        expanded.map((exp) => {
          return { ...exp, status: false };
        }),
      );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayId, t]);

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
    return `add/${dayId}/${
      Object.values(EDays).indexOf(element.name as unknown as EDays) + 1
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
      calculatePanel.day?.calculatorData !== null
    )
      calculateData(
        calculatePanel.dayId.toString(),
        calculatePanel.day?.id,
        calculatePanel.day?.calculatorData,
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
            <Typography sx={{ minWidth: "70px" }}>
              {getTranslatedDay(day.name, t)}
            </Typography>
            {day.meals.length ? (
              <Grid container justifyContent="space-between">
                <Grid sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography
                    component={"span"}
                    sx={{ color: "text.secondary" }}
                  >
                    {details(day.meals, day.calculatorData?.units, width, t)}
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
                  t,
                )}
                changedData={changedData}
                allowItemRemoval={true}
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
