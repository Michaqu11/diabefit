import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  ListItem,
  MobileStepper,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { ISettings } from "../../types/settings";
import { useEffect, useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeField } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from "@mui/material/styles";

import "./SettingsList.scss";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { saveSettings } from "../../api/save-settings";
import { VariantType } from "notistack";
import { useTranslation } from "react-i18next";

interface SettingsListProps {
  settings: ISettings;
  saveData: boolean | null;
  setSaveData: (value: React.SetStateAction<boolean | null>) => void;
  saveDataMessage: (variant: VariantType) => void;
}

const SettingsList: React.FC<SettingsListProps> = (props) => {
  const settings = props.settings;
  const { t } = useTranslation();

  const [diabetesTypeError, setDiabetesTypeError] = useState<boolean>(false);
  const [diabetesType, setDiabetesType] = useState<number | null>(
    settings.diabetesType,
  );

  const [insulinCorrectionError, setInsulinCorrectionError] =
    useState<boolean>(false);
  const [insulinCorrection, setInsulinCorrection] = useState<number | null>(
    settings.insulinCorrection,
  );
  const actingTimeFormatter =
    settings?.insulin?.actingTime.split(":") ?? "00:00";
  const [actingTime, setActingTime] = useState<Dayjs | null>(
    dayjs()
      .set("hour", Number(actingTimeFormatter[0]) ?? 0)
      .set("minute", Number(actingTimeFormatter[1]) ?? 0),
  );

  const offsetTimeFormatter =
    settings?.insulin?.offsetTime.split(":") ?? "00:00";
  const [offsetTime, setOffsetTime] = useState<Dayjs | null>(
    dayjs()
      .set("hour", Number(offsetTimeFormatter[0]) ?? 0)
      .set("minute", Number(offsetTimeFormatter[1]) ?? 0),
  );

  const [range, setRange] = useState<number[]>([
    settings.targetRange?.from,
    settings.targetRange?.to,
  ]);

  function rangetext(value: number) {
    return `${value} mg/dL`;
  }

  const [allUnits, setAllUnits] = useState<number[]>(settings.units);
  const [singleUnitError, setsingleUnitError] = useState<boolean>(false);
  const [singleUnit, setSingleUnit] = useState<number | null>(
    settings.units[0],
  );
  const [allDayUnits, setAllDayUnits] = useState<number[]>(Array(24).fill(0.0));

  const singleUnitValidation = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const parsedFloat = parseFloat(e.target.value);
    if (parsedFloat && parsedFloat > 0.0 && parsedFloat < 25.0) {
      setSingleUnit(parsedFloat);
      setsingleUnitError(false);
    } else {
      setsingleUnitError(true);
      setSingleUnit(null);
      return null;
    }
  };

  const saveUnits = () => {
    if (isAllDay && singleUnit) {
      setAllUnits(Array(24).fill(singleUnit));
      handleDialogClose();
    } else if (!isAllDay) {
      const tempUnits = allDayUnits;
      tempUnits[23] = singleUnit ?? 0;
      setAllUnits(tempUnits);
      handleDialogClose();
    } else {
      setsingleUnitError(true);
    }
  };

  const [openUnitsDialog, setOpenUnitsDialog] = useState(false);
  const [isAllDay, setIsAllDay] = useState(true);

  const handleDialogOpen = (allDay: boolean) => {
    setIsAllDay(allDay);
    setOpenUnitsDialog(true);
  };

  const handleDialogClose = () => {
    setOpenUnitsDialog(false);
  };

  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    if (!singleUnitError && singleUnit != null) {
      const tempUnits = allDayUnits;
      tempUnits[activeStep] = singleUnit;
      setAllDayUnits(tempUnits);
      setSingleUnit(allUnits[activeStep + 1]);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setsingleUnitError(true);
    }
  };

  const handleBack = () => {
    if (!singleUnitError) {
      setSingleUnit(allUnits[activeStep - 1]);
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    } else {
      setsingleUnitError(true);
    }
  };

  const stepToTime = () => {
    return `${activeStep < 10 ? `0${activeStep}` : activeStep}:00 - ${
      activeStep + 1 < 10 ? `0${activeStep + 1}` : activeStep + 1
    }:00`;
  };

  useEffect(() => {
    if (
      props.saveData !== null &&
      !diabetesTypeError &&
      !insulinCorrectionError &&
      !singleUnitError
    ) {
      const tempActingTime = `${actingTime?.get("hour")}:${actingTime?.get(
        "minute",
      )}`;
      const tempOffsetTime = `${offsetTime?.get("hour")}:${offsetTime?.get(
        "minute",
      )}`;

      const result: ISettings = {
        diabetesType: diabetesType ?? 1,
        insulin: {
          actingTime: tempActingTime,
          offsetTime: tempOffsetTime,
        },
        insulinCorrection: insulinCorrection ?? 40,
        targetRange: {
          from: range[0],
          to: range[1],
        },
        units: allUnits,
      };
      saveSettings(result);
      props.saveDataMessage("success");
    } else if (props.saveData !== null) {
      props.saveDataMessage("error");
    }
    props.setSaveData(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.saveData]);

  return (
    <>
      <List sx={{ width: "100%" }}>
        <ListItem alignItems="flex-start">
          <TextField
            sx={{ width: "100%" }}
            label={t("yourData.inputs.diabetesType")}
            variant="outlined"
            value={diabetesType}
            type="number"
            inputProps={{
              step: "1",
            }}
            InputLabelProps={{ shrink: true }}
            error={diabetesTypeError}
            onChange={(e) => {
              const parsedNumber = Number(e.target.value);
              if (parsedNumber && [1, 2, 3].includes(parsedNumber)) {
                setDiabetesType(parsedNumber);
                setDiabetesTypeError(false);
              } else {
                setDiabetesType(null);
                setDiabetesTypeError(true);
                return null;
              }
            }}
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <TextField
            sx={{ width: "100%" }}
            label={t("yourData.inputs.insulinCorrection")}
            variant="outlined"
            value={insulinCorrection}
            type="number"
            inputProps={{
              step: "1",
            }}
            InputLabelProps={{ shrink: true }}
            error={insulinCorrectionError}
            onChange={(e) => {
              const parsedNumber = Number(e.target.value);
              if (parsedNumber && parsedNumber > 0 && parsedNumber < 200) {
                setInsulinCorrection(parsedNumber);
                setInsulinCorrectionError(false);
              } else {
                setInsulinCorrection(null);
                setInsulinCorrectionError(true);
                return null;
              }
            }}
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <div className="time-picker">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label={t("yourData.inputs.actingTime")}
                value={actingTime}
                onChange={(newValue) => setActingTime(newValue)}
                format="HH:mm"
              />
            </LocalizationProvider>
          </div>
        </ListItem>
        <ListItem alignItems="flex-start">
          <div className="time-picker">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label={t("yourData.inputs.offsetTime")}
                value={offsetTime}
                onChange={(newValue) => setOffsetTime(newValue)}
                format="HH:mm"
              />
            </LocalizationProvider>
          </div>
        </ListItem>
        <ListItem alignItems="flex-start" sx={{ flexDirection: "column" }}>
          <Typography gutterBottom>
            {t("yourData.inputs.rangeLabel")}
          </Typography>
          <Slider
            value={range}
            onChange={(event: Event, newValue: number | number[]) =>
              setRange(newValue as number[])
            }
            valueLabelDisplay="auto"
            getAriaValueText={rangetext}
            min={50}
            max={250}
            step={1}
            sx={{ margin: "0px 10px", width: "90%" }}
          />
        </ListItem>
        <ListItem sx={{ flexDirection: "column", alignItems: "flex-start" }}>
          <Typography gutterBottom>
            {t("yourData.inputs.unitsLabel")}
          </Typography>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "5px",
            }}
          >
            <Button variant="outlined" onClick={() => handleDialogOpen(true)}>
              {t("yourData.inputs.allDayButton")}
            </Button>
            <Button variant="outlined" onClick={() => handleDialogOpen(false)}>
              {t("yourData.inputs.timeDependentButton")}
            </Button>
          </Grid>
        </ListItem>
      </List>
      <Dialog open={openUnitsDialog} onClose={handleDialogClose}>
        <DialogTitle>{t("yourData.unitsDialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("yourData.unitsDialog.message")}
          </DialogContentText>
          <Grid
            sx={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {isAllDay ? (
              <>
                <TextField
                  label={t("yourData.unitsDialog.units")}
                  variant="outlined"
                  value={singleUnit}
                  type="number"
                  inputProps={{
                    step: "0.1",
                  }}
                  InputLabelProps={{ shrink: true }}
                  onChange={singleUnitValidation}
                  error={singleUnitError}
                />
              </>
            ) : (
              <>
                <MobileStepper
                  variant="progress"
                  steps={24}
                  position="static"
                  activeStep={activeStep}
                  sx={{ padding: "5px 0px" }}
                  nextButton={
                    <Button
                      size="small"
                      onClick={handleNext}
                      disabled={activeStep === 23}
                    >
                      {t("yourData.unitsDialog.nextButton")}
                      {theme.direction === "rtl" ? (
                        <KeyboardArrowLeft />
                      ) : (
                        <KeyboardArrowRight />
                      )}
                    </Button>
                  }
                  backButton={
                    <Button
                      size="small"
                      onClick={handleBack}
                      disabled={activeStep === 0}
                    >
                      {theme.direction === "rtl" ? (
                        <KeyboardArrowRight />
                      ) : (
                        <KeyboardArrowLeft />
                      )}
                      {t("yourData.unitsDialog.backButton")}
                    </Button>
                  }
                />
                <Typography
                  sx={{ textAlign: "center", padding: "2px 0px 10px 0px" }}
                >
                  {stepToTime()}
                </Typography>
                <TextField
                  label={t("yourData.unitsDialog.units")}
                  variant="outlined"
                  value={singleUnit}
                  type="number"
                  inputProps={{
                    step: "0.1",
                  }}
                  InputLabelProps={{ shrink: true }}
                  onChange={singleUnitValidation}
                  error={singleUnitError}
                />
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>
            {t("yourData.unitsDialog.cancelButton")}
          </Button>
          <Button
            onClick={saveUnits}
            disabled={
              (isAllDay && singleUnitError) ||
              (!isAllDay &&
                (activeStep !== 23 || (activeStep === 23 && singleUnitError)))
            }
          >
            {t("yourData.unitsDialog.saveButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default SettingsList;
