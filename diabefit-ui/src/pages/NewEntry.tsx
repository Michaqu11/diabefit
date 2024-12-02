import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import {
  calculateGlucose,
  roundUnits,
} from "../shared/calculator/glucose-calculator";
import ListBasedView from "../components/elements/products/productsList/new-entry/ListBasedView";
import { GlucoseInput } from "../components/common/share/GlucoseInput";
import { encodeShortDate } from "../components/common/share/MomentFunctions";
import {
  clearTemporaryStore,
  getTemporaryMeals,
  readCustomMealDay,
  saveCustomMeal,
} from "../store/customMealsStorage";
import { IDay } from "../types/days";
import { calculateCarbsForAllMeals } from "../shared/calculator/carbohydrate-exchange-calculator";
import { useNavigate } from "react-router-dom";

const NewEntry = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const [glucose, setGlucose] = useState<number | string>("");
  const [carbs, setCarbs] = useState<number | string>("");
  const [foodInsulin, setFoodInsulin] = useState<number | string>("");
  const [correctionInsulin, setCorrectionInsulin] = useState<number | string>(
    "",
  );
  const [alertOpen, setAlertOpen] = useState(false);

  const foodInsulinMetric = useRef<number>(0);
  const correctionInsulinMetric = useRef<number>(0);

  let unixDay = encodeShortDate();
  const { enqueueSnackbar } = useSnackbar();

  const allDayMeals = readCustomMealDay(unixDay.toString());
  const id = allDayMeals?.length ?? 1;

  const navigate = useNavigate();

  const [customMeal, setCustomMeal] = React.useState<IDay>({
    id: allDayMeals?.length ?? 1,
    name: `Custom ${id + 1}`,
    meals: getTemporaryMeals(),
    calculatorData: null,
  });

  const calculateGlucoseEmit = () => {
    if (glucose && carbs) {
      const [food, correction] = calculateGlucose(
        glucose as number,
        carbs as number,
      );
      foodInsulinMetric.current = food;
      correctionInsulinMetric.current = correction;
      setAlertOpen(true);
    } else
      enqueueSnackbar("Sugar and carbs are required!", {
        preventDuplicate: true,
        variant: "warning",
      });
  };

  const handleDateChange = (value: Dayjs | null) => {
    setSelectedDate(value ?? dayjs(new Date()));
  };

  const acceptGlucose = () => {
    setFoodInsulin(foodInsulinMetric.current);
    setCorrectionInsulin(correctionInsulinMetric.current);
    setAlertOpen(false);
  };

  const getResult = () => {
    return roundUnits(
      (foodInsulinMetric.current ?? 0) + (correctionInsulinMetric.current ?? 0),
    );
  };

  const saveCalculation = () => {
    if (foodInsulinMetric.current || correctionInsulinMetric.current) {
      saveCustomMeal(
        {
          ...customMeal,
          calculatorData: {
            units: {
              short: roundUnits(
                (Number(foodInsulin) || 0) + (Number(correctionInsulin) || 0),
              ),
            },
            glucose: Number(glucose),
            date: selectedDate.toDate(),
          },
        },
        unixDay,
        customMeal.id,
      );
    } else {
      saveCustomMeal(customMeal, unixDay, customMeal.id);
    }

    clearTemporaryStore();
    navigate("../");
  };

  React.useEffect(() => {
    setCarbs(calculateCarbsForAllMeals(customMeal.meals));
  }, [customMeal]);

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        New entry
      </Typography>
      <Divider />
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            value={selectedDate}
            onChange={handleDateChange}
            ampm={false}
          />
        </LocalizationProvider>

        <GlucoseInput glucose={glucose} setGlucose={setGlucose} />

        <Divider />

        <div className="Products">
          <div>Products: </div>
          <ListBasedView
            customMeal={customMeal}
            setCustomMeal={setCustomMeal}
            dayId={unixDay}
          />
        </div>

        <FormControl variant="outlined">
          <InputLabel htmlFor="component-simple">Carbs</InputLabel>
          <OutlinedInput
            value={carbs}
            label="Carbs"
            type="number"
            inputProps={{
              step: "0.1",
            }}
            onChange={(event) =>
              setCarbs(
                event.target.value === "" ? "" : parseFloat(event.target.value),
              )
            }
            endAdornment={<InputAdornment position="end">WW</InputAdornment>}
          />
        </FormControl>

        <Collapse in={alertOpen}>
          <Alert
            severity="success"
            color="info"
            action={
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button color="inherit" size="small" onClick={acceptGlucose}>
                  Accept
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setAlertOpen(false)}
                >
                  Dismiss
                </Button>
              </div>
            }
          >
            <strong>Bolus advice</strong>
            <AlertTitle>{getResult()} units</AlertTitle>
          </Alert>
        </Collapse>
        <Divider />
        <Card variant="outlined" style={{ marginBottom: "10px" }}>
          <CardContent
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              padding: "10px",
            }}
          >
            <CalculateIcon color="primary" /> Bolus Calculator
          </CardContent>
          <Divider />
          <CardActions
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "0px",
            }}
          >
            <Button variant="text" onClick={calculateGlucoseEmit}>
              Calculate
            </Button>
          </CardActions>
        </Card>

        <FormControl variant="outlined">
          <InputLabel htmlFor="component-simple">Insulin (foods)</InputLabel>
          <OutlinedInput
            value={foodInsulin}
            onChange={(food) =>
              setFoodInsulin(
                food.target.value === "" ? "" : parseFloat(food.target.value),
              )
            }
            label="Insulin (foods)"
            type="number"
            inputProps={{
              step: "0.1",
            }}
          />
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel htmlFor="component-simple">
            Insulin (correction)
          </InputLabel>
          <OutlinedInput
            value={correctionInsulin}
            onChange={(correction) =>
              setCorrectionInsulin(
                correction.target.value === ""
                  ? ""
                  : parseFloat(correction.target.value),
              )
            }
            label="Insulin (correction)"
            type="number"
            inputProps={{
              step: "0.1",
            }}
          />
        </FormControl>

        <Box style={{ display: "flex", justifyContent: "right" }}>
          <Button variant="contained" onClick={saveCalculation}>
            Save
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default NewEntry;
