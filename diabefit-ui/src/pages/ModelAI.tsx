import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FormControlLabel,
  Switch,
  Typography,
  Button,
  Card,
  Grid,
  Divider,
  Backdrop,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import { trainModel } from "../api/train-model";
import { DotLoader } from "react-spinners";
import { saveModelData } from "../api/save-model-data";
import { enqueueSnackbar } from "notistack";

const ModelAI: React.FC = () => {
  const { t } = useTranslation();

  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem("aiEnabled") === "true";
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    localStorage.setItem("aiEnabled", String(enabled));
  }, [enabled]);

  const handleToggle = () => {
    setEnabled((prev) => !prev);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "csv" | "json",
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (type === "csv") {
        setCsvFile(file);
      } else {
        setJsonFile(file);
      }
    }
  };

  const submit = async () => {
    setIsLoading(true);
    const response = await trainModel(csvFile as File, jsonFile as File);
    setIsLoading(false);
    if (response.status === "success") {
      saveModelData(response.model_data);
      enqueueSnackbar(t("modelAI.notifications.success"), {
        variant: "success",
        autoHideDuration: 3000,
      });
    } else {
      enqueueSnackbar(t("modelAI.notifications.error"), {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {t("modelAI.title")}
        </Typography>
        <FormControlLabel
          control={<Switch checked={enabled} onChange={handleToggle} />}
          label={t("modelAI.enableAI", "Enable AI")}
        />
      </Box>
      <Divider sx={{ pt: 1, pb: 1 }} />
      {enabled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Card sx={{ p: 2, mt: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  {t("modelAI.uploadFreestyleLibreReport")}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button variant="contained" component="label" fullWidth>
                  {csvFile ? csvFile.name : t("modelAI.chooseFile")}
                  <input
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={(e) => handleFileChange(e, "csv")}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  {t("modelAI.uploadJsonData", "Prześlij plik JSON data")}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button variant="contained" component="label" fullWidth>
                  {jsonFile ? jsonFile.name : t("modelAI.chooseFile")}
                  <input
                    type="file"
                    accept=".json"
                    hidden
                    onChange={(e) => handleFileChange(e, "json")}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!csvFile || !jsonFile}
                  onClick={submit}
                >
                  {t("modelAI.submit")}
                </Button>
              </Grid>
            </Grid>
          </Card>
        </motion.div>
      )}
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <DotLoader color="#7bbced" size={80} />
      </Backdrop>
    </>
  );
};

export default ModelAI;
