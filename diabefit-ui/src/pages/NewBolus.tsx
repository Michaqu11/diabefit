import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import {
    Alert,
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormHelperText,
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
import RefreshIcon from "@mui/icons-material/Refresh";
import { getLibreData } from "../api/libre-api";
import CloseIcon from "@mui/icons-material/Close";
import { saveCorrection } from "../store/bolusStorage";
import { encodeShortDate } from "../components/common/share/MomentFunctions";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";


const LIBRE_SUCCESS_INFORMATION = {
    message: "Glucose was pasted using Libre API",
    severity: "info",
  };
  const LIBRE_ERROR_INFORMATION = {
    message: "Failed to retrieve glucose data from Libre API.",
    severity: "error",
  };

const NewBolus: React.FC = () => {
  const [bloodSugar, setBloodSugar] = React.useState<number | string>("");
  const [correctionInsulin, setCorrectionInsulin] = React.useState<number | string>("");
  const [selectedTime, setSelectedTime] = React.useState<Dayjs>(dayjs());
  const [displayLibreAlert, setDisplayLibreAlert] = React.useState(false);

 const navigate = useNavigate()
    
  const handleSave = () => {
    const correctionData = {
        id: uuidv4(),
        time: selectedTime.toDate(),
        correctionInsulin: Number(correctionInsulin),
        bloodSugar:  Number(bloodSugar)
        }
   
    saveCorrection(correctionData, Number(encodeShortDate()))
    navigate('../');
  };

  const handleTimeChange = (value: Dayjs | null) => {
    setSelectedTime(value ?? dayjs());
  };

  const [libreAlertInformation, setLibreAlertInformation] = React.useState(
    LIBRE_SUCCESS_INFORMATION,
  );

  const getBloodSugar = async () => {
    try {
      const bloodSugar = await getLibreData();
      setLibreAlertInformation(LIBRE_SUCCESS_INFORMATION);
      setDisplayLibreAlert(true);
      setBloodSugar(bloodSugar);
      setTimeout(() => setDisplayLibreAlert(false), 5000);
    } catch {
      setDisplayLibreAlert(true);
      setLibreAlertInformation(LIBRE_ERROR_INFORMATION);
      setTimeout(() => setDisplayLibreAlert(false), 5000);
      setBloodSugar("");
    }
  };

  React.useEffect(()=> {getBloodSugar()}, [])

  return (
    <Paper elevation={3} style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <Typography variant="h6" align="center" gutterBottom>
        Add New Bolus (Insulin Correction)
      </Typography>
      <Divider style={{ marginBottom: "20px" }} />
      <Box display="flex" flexDirection="column" gap="10px">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            value={selectedTime}
            onChange={handleTimeChange}
            ampm={false}
          />
        </LocalizationProvider>

        <Collapse in={displayLibreAlert}>
            <Alert
              icon={false}
              severity={libreAlertInformation.severity as "info" | "error"}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setDisplayLibreAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {libreAlertInformation.message}
            </Alert>
          </Collapse>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              overflow: "visible !important",
            }}
          >
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="blood-sugar-input">Blood sugar</InputLabel>
            <OutlinedInput
              id="blood-sugar-input"
              value={bloodSugar === 0 ? "" : bloodSugar}
              onChange={(e) => setBloodSugar(Number(e.target.value))}
              type="number"
              inputProps={{
                step: "1",
              }}
              label="Blood sugar"
              endAdornment={<InputAdornment position="end">mg/dL</InputAdornment>}
            />
            <FormHelperText id="outlined-sugar-text"></FormHelperText>
          </FormControl>
          <div
              style={{ height: "50px", display: "flex", alignItems: "center" }}
            >
          <IconButton
            aria-label="refresh"
            onClick={getBloodSugar}
            size="small"
            style={{ marginLeft: "10px" }}
          >
            <RefreshIcon />
          </IconButton>
          </div>
        </Box>

        <FormControl variant="outlined">
          <InputLabel htmlFor="correction-insulin-input">Insulin Correction</InputLabel>
          <OutlinedInput
            id="correction-insulin-input"
            value={correctionInsulin}
            onChange={(e) => setCorrectionInsulin(e.target.value === "" ? "" : parseFloat(e.target.value))}
            type="number"
            inputProps={{
              step: "0.1",
            }}
            label="Insulin Correction"
            endAdornment={<InputAdornment position="end">units</InputAdornment>}
          />
        </FormControl>

        <Box display="flex" justifyContent=" flex-end">
          <Button variant="outlined" color="primary" onClick={handleSave}>Save</Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default NewBolus;
