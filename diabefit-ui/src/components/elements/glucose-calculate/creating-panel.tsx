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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ICalculatePanel } from "../../../types/days";
import CalculateIcon from "@mui/icons-material/Calculate";
import {
  calculateGlucose,
  roundUnits,
} from "../../../shared/calculator/glucose-calculator";
import { calculateCarbsForAllMeals } from "../../../shared/calculator/carbohydrate-exchange-calculator";
import { useSnackbar } from "notistack";
import "./creating-panel.scss";
import { useEffect, useRef, useState } from "react";
import { GlucoseInput } from "../../common/share/GlucoseInput";

interface CalculatePanelProps {
  openCalculate: ICalculatePanel;
  setOpenCalculate: (value: React.SetStateAction<ICalculatePanel>) => void;
  saveGlucose: (calculatePanel: ICalculatePanel) => void;
}

const CalculatePanel: React.FC<CalculatePanelProps> = (props) => {
  const handleCalculateClickClose = () => {
    props.setOpenCalculate({ open: false, dayId: undefined, day: undefined });
  };

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

  useEffect(() => {
    setCarbs(calculateCarbsForAllMeals(props.openCalculate.day?.meals));
    setFoodInsulin("");
    setCorrectionInsulin("");
  }, [props.openCalculate]);

  const { enqueueSnackbar } = useSnackbar();

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
    const openCalculate = { ...props.openCalculate };
    if (openCalculate.day)
      openCalculate.day.calculatorData = {
        units: {
          short: roundUnits(
            (Number(foodInsulin) || 0) + (Number(correctionInsulin) || 0),
          ),
        },
        glucose: Number(glucose),
        date: selectedDate.toDate(),
      };
    props.saveGlucose(openCalculate);
    handleCalculateClickClose();
  };

  return (
    <Dialog open={props.openCalculate.open} onClose={handleCalculateClickClose}>
      <DialogTitle style={{ textAlign: "center", marginBottom: "10px" }}>
        New entry
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              value={selectedDate}
              onChange={handleDateChange}
              ampm={false}
            />
          </LocalizationProvider>

          <GlucoseInput
            glucose={glucose}
            setGlucose={setGlucose}
            loadGlucose={props.openCalculate.open}
          />

          <FormControl variant="outlined">
            <InputLabel htmlFor="component-simple">Carb Units</InputLabel>
            <OutlinedInput
              value={carbs}
              label="Carb Units"
              type="number"
              inputProps={{
                step: "0.1",
              }}
              onChange={(event) =>
                setCarbs(
                  event.target.value === ""
                    ? ""
                    : parseFloat(event.target.value),
                )
              }
              endAdornment={<InputAdornment position="end">WW</InputAdornment>}
              aria-describedby="outlined-sugar-text"
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
              aria-describedby="outlined-sugar-text"
            />
            <FormHelperText id="outlined-sugar-text"></FormHelperText>
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
              type="number"
              inputProps={{
                step: "0.1",
              }}
              label="Insulin (correction)"
              aria-describedby="outlined-sugar-text"
            />
            <FormHelperText id="outlined-sugar-text"></FormHelperText>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCalculateClickClose}>Cancel</Button>
        <Button onClick={saveCalculation}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalculatePanel;
