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
import {
  calculateCarbsForAllMeals,
  calculateNutritionalValuesForAllMeals,
} from "../../../shared/calculator/carbohydrate-exchange-calculator";
import { useSnackbar } from "notistack";
import "./creating-panel.scss";
import { useEffect, useRef, useState } from "react";
import { GlucoseInput } from "../../common/share/GlucoseInput";
import { useTranslation } from "react-i18next";
import { getModel } from "../../../store/sessionStorage";
import { predictDose } from "../../../api/pedict-dose";

interface CalculatePanelProps {
  openCalculate: ICalculatePanel;
  setOpenCalculate: (value: React.SetStateAction<ICalculatePanel>) => void;
  saveGlucose: (calculatePanel: ICalculatePanel) => void;
}

const CalculatePanel: React.FC<CalculatePanelProps> = (props) => {
  const { t } = useTranslation();

  const handleCalculateClickClose = () => {
    props.setOpenCalculate({ open: false, dayId: undefined, day: undefined });
  };

  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const [glucose, setGlucose] = useState<number | string>("");
  const [carbsUnits, setCarbsUnits] = useState<number | string>("");
  const [foodInsulin, setFoodInsulin] = useState<number | string>("");
  const [correctionInsulin, setCorrectionInsulin] = useState<number | string>(
    "",
  );

  const [alertOpen, setAlertOpen] = useState(false);
  const foodInsulinMetric = useRef<number>(0);
  const correctionInsulinMetric = useRef<number>(0);

  const [alertAIOpen, setAlertAIOpen] = useState(false);
  const [insulinByAI, setInsulinByAI] = useState<number | undefined>(undefined);

  const { enqueueSnackbar } = useSnackbar();

  const predictDoseEmit = React.useCallback(async () => {
    const model = getModel();
    if (
      glucose &&
      carbsUnits &&
      model &&
      localStorage.getItem("aiEnabled") === "true"
    ) {
      const [food, correction] = calculateGlucose(
        glucose as number,
        carbsUnits as number,
      );

      const { carbs, fats, prot } = calculateNutritionalValuesForAllMeals(
        props.openCalculate.day?.meals,
      );
      const result = await predictDose(
        model,
        glucose as number,
        food + correction,
        carbs,
        fats,
        prot,
        selectedDate.toISOString(),
      );

      if (!result) {
        enqueueSnackbar(t("calculatePanel.errorAI"), {
          preventDuplicate: true,
          variant: "error",
        });
        return;
      }

      setInsulinByAI(roundUnits(result.data.suggested_insulin));

      setAlertAIOpen(true);
    }
  }, [
    carbsUnits,
    enqueueSnackbar,
    glucose,
    props.openCalculate.day?.meals,
    selectedDate,
    t,
  ]);

  useEffect(() => {
    setCarbsUnits(calculateCarbsForAllMeals(props.openCalculate.day?.meals));
    setFoodInsulin("");
    setCorrectionInsulin("");
  }, [props.openCalculate]);

  useEffect(() => {
    if (props.openCalculate.open) {
      predictDoseEmit();
    }
  }, [predictDoseEmit, props.openCalculate.open]);

  const calculateGlucoseEmit = () => {
    const [food, correction] = calculateGlucose(
      glucose as number,
      carbsUnits as number,
    );
    if (glucose && carbsUnits) {
      foodInsulinMetric.current = food;
      correctionInsulinMetric.current = correction;
      setAlertOpen(true);
    } else
      enqueueSnackbar(t("calculatePanel.warningMessage"), {
        preventDuplicate: true,
        variant: "warning",
      });
  };

  const handleDateChange = (value: Dayjs | null) => {
    setSelectedDate(value ?? dayjs(new Date()));
  };

  const acceptAIGlucose = () => {
    setFoodInsulin(insulinByAI ?? 0);
    setAlertOpen(false);
    setAlertAIOpen(false);
  };

  const acceptGlucose = () => {
    setFoodInsulin(foodInsulinMetric.current);
    setCorrectionInsulin(correctionInsulinMetric.current);
    setAlertOpen(false);
    setAlertAIOpen(false);
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
        {t("calculatePanel.title")}
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
            <InputLabel htmlFor="component-simple">
              {t("calculatePanel.inputs.carbsUnits")}
            </InputLabel>
            <OutlinedInput
              value={carbsUnits}
              label={t("calculatePanel.inputs.carbsUnits")}
              type="number"
              inputProps={{
                step: "0.1",
              }}
              onChange={(event) =>
                setCarbsUnits(
                  event.target.value === ""
                    ? ""
                    : parseFloat(event.target.value),
                )
              }
              endAdornment={
                <InputAdornment position="end">
                  {t("calculatePanel.inputs.carbsUnitsMetric")}
                </InputAdornment>
              }
              aria-describedby="outlined-sugar-text"
            />
          </FormControl>

          <Collapse in={alertOpen}>
            <Alert
              severity="success"
              color="info"
              icon={false}
              sx={{ px: 2 }}
              action={
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Button color="inherit" size="small" onClick={acceptGlucose}>
                    {t("share.bolusCalculator.acceptButton")}
                  </Button>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setAlertOpen(false);
                    }}
                  >
                    {t("share.bolusCalculator.dismissButton")}
                  </Button>
                </div>
              }
            >
              <strong>{t("share.bolusCalculator.adviceLabel")}</strong>
              <AlertTitle>
                {getResult()} {t("share.bolusCalculator.units")}
              </AlertTitle>
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
              <CalculateIcon color="primary" />{" "}
              {t("share.bolusCalculator.title")}
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
                {t("share.bolusCalculator.calculateButton")}
              </Button>
            </CardActions>
          </Card>

          <Collapse in={alertAIOpen}>
            <Alert
              icon={false}
              severity="success"
              sx={{ backgroundColor: "#f6f4f4", px: 2 }}
            >
              <Box sx={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                <strong>{t("share.modelAI.adviceLabel")}</strong>
                <span>{t("share.modelAI.poweredBy")}</span>
              </Box>
              <AlertTitle
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "5px",
                }}
              >
                <span>
                  {insulinByAI ?? 0} {t("share.modelAI.units")}
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "3px",
                    alignItems: "center",
                  }}
                >
                  <Button
                    color="inherit"
                    size="small"
                    onClick={acceptAIGlucose}
                  >
                    {t("share.modelAI.acceptButton")}
                  </Button>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setAlertAIOpen(false);
                    }}
                  >
                    {t("share.modelAI.dismissButton")}
                  </Button>
                </div>
              </AlertTitle>
            </Alert>
          </Collapse>

          <FormControl variant="outlined">
            <InputLabel htmlFor="component-simple">
              {t("calculatePanel.inputs.foodInsulin")}
            </InputLabel>
            <OutlinedInput
              value={foodInsulin}
              onChange={(food) =>
                setFoodInsulin(
                  food.target.value === "" ? "" : parseFloat(food.target.value),
                )
              }
              label={t("calculatePanel.inputs.foodInsulin")}
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
              {t("calculatePanel.inputs.correctionInsulin")}
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
              label={t("calculatePanel.inputs.correctionInsulin")}
              aria-describedby="outlined-sugar-text"
            />
            <FormHelperText id="outlined-sugar-text"></FormHelperText>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCalculateClickClose}>
          {t("calculatePanel.inputs.cancelButton")}
        </Button>
        <Button onClick={saveCalculation}>
          {t("calculatePanel.inputs.saveButton")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalculatePanel;
