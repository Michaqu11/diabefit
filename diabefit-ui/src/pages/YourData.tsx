import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import SettingsList from "../components/yourdata/SettingsList";
import LibreList from "../components/yourdata/LibreList";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { getData } from "../store/sessionStorage";
import { VariantType, enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

const YourData: React.FC = () => {
  const { t } = useTranslation();

  const Mobile = useMediaQuery("(min-width:700px)");
  const [tab, setTab] = useState(0);
  const tabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  const data = getData();
  const [saveData, setSaveData] = useState<boolean | null>(null);

  const saveDataClick = (value: boolean) => {
    setSaveData(value);
  };

  const saveDataMessage = (variant: VariantType) => {
    if (variant === "success")
      enqueueSnackbar(t("yourData.snackbars.success"), { variant });
    else if (variant === "error")
      enqueueSnackbar(t("yourData.snackbars.error"), { variant });
  };

  return (
    <Grid container justifyContent="center">
      {data ? (
        <Paper
          elevation={!Mobile ? 0 : 1}
          sx={{
            width: "80%",
            maxWidth: "1000px",
            position: Mobile ? "relative" : "",
          }}
        >
          <div className="save-your-data-button">
            <Button
              size="small"
              sx={{ padding: "0px", minWidth: "0px" }}
              onClick={() => saveDataClick(true)}
            >
              <SaveOutlinedIcon sx={{ fontSize: 30 }} />
            </Button>
          </div>
          <div className={!Mobile ? "container-mobile" : "container-desktop"}>
            <div className="center-card">
              <Typography variant="h5" gutterBottom>
                {t("yourData.title")}
              </Typography>
              <Tabs value={tab} onChange={tabChange} aria-label="tabs">
                <Tab label={t("yourData.tabs.settings")} />
                <Tab label={t("yourData.tabs.libre")} />
              </Tabs>
              {tab === 0 ? (
                <SettingsList
                  settings={data.settings}
                  saveData={saveData}
                  setSaveData={setSaveData}
                  saveDataMessage={saveDataMessage}
                />
              ) : (
                <LibreList
                  libreAPI={data.libreAPI}
                  saveData={saveData}
                  setSaveData={setSaveData}
                  saveDataMessage={saveDataMessage}
                />
              )}
            </div>
          </div>
        </Paper>
      ) : (
        <Container
          sx={{
            width: "100%",
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={80} />
        </Container>
      )}
    </Grid>
  );
};
export default YourData;
