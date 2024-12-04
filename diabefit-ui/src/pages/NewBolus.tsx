import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { saveCorrection } from "../store/bolusStorage";
import { encodeShortDate } from "../components/common/share/MomentFunctions";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import { GlucoseInput } from "../components/common/share/GlucoseInput";
import { useTranslation } from "react-i18next";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const NewBolus: React.FC = () => {
  const { t } = useTranslation();

  const [glucose, setGlucose] = React.useState<number | string>("");
  const [correctionInsulin, setCorrectionInsulin] = React.useState<
    number | string
  >("");
  const [selectedTime, setSelectedTime] = React.useState<Dayjs>(dayjs());

  const navigate = useNavigate();

  const handleSave = () => {
    const correctionData = {
      id: uuidv4(),
      time: selectedTime.toDate(),
      correctionInsulin: Number(correctionInsulin),
      glucose: Number(glucose),
    };

    saveCorrection(correctionData, Number(encodeShortDate()));
    navigate("../");
  };

  const handleTimeChange = (value: Dayjs | null) => {
    setSelectedTime(value ?? dayjs());
  };

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}
    >
      <Grid
        container
        justifyContent="flex-start"
        style={{ justifyContent: "flex-start" }}
      >
        <Grid item xs={1} container justifyContent="flex-start">
          <IconButton
            color="primary"
            component={Link}
            to={"/"}
            aria-label="back"
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Grid>
        <Grid item xs={10} container justifyContent="center">
          <Typography variant="h6" align="center" gutterBottom>
            {t("newBolus.title")}
          </Typography>
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: "20px" }} />
      <Box display="flex" flexDirection="column" gap="10px">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            value={selectedTime}
            onChange={handleTimeChange}
            ampm={false}
          />
        </LocalizationProvider>

        <GlucoseInput glucose={glucose} setGlucose={setGlucose} />

        <FormControl variant="outlined">
          <InputLabel htmlFor="correction-insulin-input">
            {t("newBolus.inputs.correctionInsulin")}
          </InputLabel>
          <OutlinedInput
            id="correction-insulin-input"
            value={correctionInsulin}
            onChange={(e) =>
              setCorrectionInsulin(
                e.target.value === "" ? "" : parseFloat(e.target.value),
              )
            }
            type="number"
            inputProps={{
              step: "0.1",
            }}
            label={t("newBolus.inputs.correctionInsulin")}
            endAdornment={
              <InputAdornment position="end">
                {t("newBolus.inputs.units")}
              </InputAdornment>
            }
          />
        </FormControl>

        <Box display="flex" justifyContent=" flex-end">
          <Button variant="outlined" color="primary" onClick={handleSave}>
            {t("newBolus.inputs.saveButton")}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default NewBolus;
