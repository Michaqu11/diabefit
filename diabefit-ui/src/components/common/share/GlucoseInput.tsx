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
import { useTranslation } from "react-i18next";

const LIBRE_SUCCESS_INFORMATION = (t: any) => ({
  message: t("share.glucoseInput.messages.success"),
  severity: "info",
});

const LIBRE_ERROR_INFORMATION = (t: any) => ({
  message: t("share.glucoseInput.messages.error"),
  severity: "error",
});

export const GlucoseInput = ({
  glucose,
  setGlucose,
  loadGlucose,
}: {
  glucose: number | string;
  setGlucose: (t: number | string) => void;
  loadGlucose?: boolean;
}) => {
  const { t } = useTranslation();

  const [displayLibreAlert, setDisplayLibreAlert] = useState(false);
  const [libreAlertInformation, setLibreAlertInformation] = useState(
    LIBRE_SUCCESS_INFORMATION(t),
  );

  const getGlucose = useCallback(async () => {
    try {
      const glucose = await getLibreData();
      setLibreAlertInformation(LIBRE_SUCCESS_INFORMATION(t));
      setDisplayLibreAlert(true);
      setGlucose(glucose);
      setTimeout(() => setDisplayLibreAlert(false), 5000);
    } catch {
      setDisplayLibreAlert(true);
      setLibreAlertInformation(LIBRE_ERROR_INFORMATION(t));
      setTimeout(() => setDisplayLibreAlert(false), 5000);
      setGlucose("");
    }
  }, [setGlucose, t]);

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
          <InputLabel htmlFor="component-simple">
            {t("share.glucoseInput.glucoseLabel")}
          </InputLabel>
          <OutlinedInput
            value={glucose === 0 ? "" : glucose}
            onChange={(sugar) => setGlucose(Number(sugar.target.value))}
            type="number"
            inputProps={{
              step: "1",
            }}
            label={t("share.glucoseInput.glucoseLabel")}
            endAdornment={
              <InputAdornment position="end">
                {t("share.glucoseInput.glucoseUnits")}
              </InputAdornment>
            }
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
