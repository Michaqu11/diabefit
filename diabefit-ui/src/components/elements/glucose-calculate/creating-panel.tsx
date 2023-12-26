import * as React from "react";
import dayjs from "dayjs";
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
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ICalculatePanel } from "../../../types/days";
import CalculateIcon from "@mui/icons-material/Calculate";
import {
  calculateGlucose,
  roundUnits,
} from "../../../shared/calculator/glucose-calculator";
import { calculateCarbsForAllMeals } from "../../../shared/calculator/carbohydrate-exchange-calculator";
import { useSnackbar } from "notistack";
import { getLibreData } from "../../../api/libre-api";
import CloseIcon from '@mui/icons-material/Close';

interface CalculatePanelProps {
  openCalculate: ICalculatePanel;
  setOpenCalculate: (value: React.SetStateAction<ICalculatePanel>) => void;
  saveGlucose: (calculatePanel: ICalculatePanel) => void;
}

const CalculatePanel: React.FC<CalculatePanelProps> = (props) => {
  const handleCalculateClickClose = () => {
    props.setOpenCalculate({ open: false, dayId: undefined, day: undefined });
  };

  const [bloodSugar, setBloodSugar] = React.useState<number | string>("");
  const [carbs, setCarbs] = React.useState<number | string>("");

  const [foodInsulin, setFoodInsulin] = React.useState<number | string>("");
  const [correctionInsulin, setCorrectionnsulin] = React.useState<
    number | string
  >("");

  const [alertOpen, setAlertOpen] = React.useState(false);

  const [libreAlertInformation, setLibreAlertInformation] = React.useState(false);

  const tempFoodInsulin = React.useRef<number>(0);
  const tempCorrectionInsulin = React.useRef<number>(0);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const getBloodSugar = await getLibreData();
        setLibreAlertInformation(true)
        setBloodSugar(getBloodSugar);
        setTimeout(() => setLibreAlertInformation(false), 5000);
      } catch {
        setBloodSugar("");
      }
    }
    setBloodSugar("");
    setCarbs(calculateCarbsForAllMeals(props.openCalculate.day?.meals));
    setFoodInsulin("");
    setCorrectionnsulin("");
    if (props.openCalculate.open) {
      fetchData();
    }
  }, [props.openCalculate]);

  const { enqueueSnackbar } = useSnackbar();

  const calculateGlucoseEmit = () => {
    if (bloodSugar && carbs) {
      const [food, correction] = calculateGlucose(
        bloodSugar as number,
        carbs as number,
      );
      tempFoodInsulin.current = food;
      tempCorrectionInsulin.current = correction;
      setAlertOpen(true);
    } else
      enqueueSnackbar("Sugar and carbs are required!", {
        preventDuplicate: true,
        variant: "warning",
      });
  };

  const acceptGlucose = () => {
    setFoodInsulin(tempFoodInsulin.current);
    setCorrectionnsulin(tempCorrectionInsulin.current);
    setAlertOpen(false);
  };

  const getResult = () => {
    return roundUnits(
      (tempFoodInsulin.current ?? 0) + (tempCorrectionInsulin.current ?? 0),
    );
  };
  const saveCalculation = () => {
    const openCalculate = { ...props.openCalculate };
    if (openCalculate.day) openCalculate.day.units = { short: getResult() };
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
          <div></div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              label="Date"
              defaultValue={dayjs(new Date())}
            />
          </LocalizationProvider>

          <Collapse in={libreAlertInformation}>
            <Alert
              icon={false}
              severity="info"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setLibreAlertInformation(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              Sugar was pasted from the Libre app
            </Alert>
          </Collapse>

          <FormControl variant="outlined">
            <InputLabel htmlFor="component-simple">Blood sugar</InputLabel>
            <OutlinedInput
              value={bloodSugar}
              onChange={(sugar) => setBloodSugar(Number(sugar.target.value))}
              label="Blood sugar"
              endAdornment={
                <InputAdornment position="end">mg/dL</InputAdornment>
              }
              aria-describedby="outlined-sugar-text"
            />
            <FormHelperText id="outlined-sugar-text"></FormHelperText>
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel htmlFor="component-simple">Carbs</InputLabel>
            <OutlinedInput
              value={carbs}
              label="Carbs"
              onChange={(carb) => setCarbs(Number(carb.target.value))}
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
                setCorrectionnsulin(Number(food.target.value))
              }
              label="Insulin (foods)"
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
                setCorrectionnsulin(Number(correction.target.value))
              }
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
