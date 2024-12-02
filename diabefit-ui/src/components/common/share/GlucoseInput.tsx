import {
  Alert,
  Box,
  Collapse,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getLibreData } from "../../../api/libre-api";

const LIBRE_SUCCESS_INFORMATION = {
  message: "Glucose was pasted using Libre API",
  severity: "info",
};

const LIBRE_ERROR_INFORMATION = {
  message: "Failed to retrieve glucose data from Libre API.",
  severity: "error",
};

export const GlucoseInput = ({
  glucose,
  setGlucose,
  loadGlucose,
}: {
  glucose: number | string;
  setGlucose: (t: number | string) => void;
  loadGlucose?: boolean;
}) => {
  const [displayLibreAlert, setDisplayLibreAlert] = useState(false);
  const [libreAlertInformation, setLibreAlertInformation] = useState(
    LIBRE_SUCCESS_INFORMATION,
  );

  const getGlucose = useCallback(async () => {
    try {
      const glucose = await getLibreData();
      setLibreAlertInformation(LIBRE_SUCCESS_INFORMATION);
      setDisplayLibreAlert(true);
      setGlucose(glucose);
      setTimeout(() => setDisplayLibreAlert(false), 5000);
    } catch {
      setDisplayLibreAlert(true);
      setLibreAlertInformation(LIBRE_ERROR_INFORMATION);
      setTimeout(() => setDisplayLibreAlert(false), 5000);
      setGlucose("");
    }
  }, [setGlucose]);

  useEffect(() => {
    setGlucose("");
    if (loadGlucose === undefined || loadGlucose) {
      getGlucose();
    }
  }, [getGlucose, loadGlucose, setGlucose]);

  return (
    <>
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
        <FormControl variant="outlined">
          <InputLabel htmlFor="component-simple">Glucose</InputLabel>
          <OutlinedInput
            value={glucose === 0 ? "" : glucose}
            onChange={(sugar) => setGlucose(Number(sugar.target.value))}
            type="number"
            inputProps={{
              step: "1",
            }}
            label="Glucose"
            endAdornment={<InputAdornment position="end">mg/dL</InputAdornment>}
            aria-describedby="outlined-sugar-text"
          />
          <FormHelperText id="outlined-sugar-text"></FormHelperText>
        </FormControl>

        <div style={{ height: "50px", display: "flex", alignItems: "center" }}>
          <IconButton aria-label="refresh" onClick={getGlucose} size="small">
            <RefreshIcon />
          </IconButton>
        </div>
      </Box>
    </>
  );
};
