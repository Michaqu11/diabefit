import {
  Button,
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
const YourData: React.FC = () => {
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
      enqueueSnackbar("Data has been successfully saved", { variant });
    else if (variant === "error")
      enqueueSnackbar("There was a problem saving the data", { variant });
  };

  return (
    <Grid container justifyContent="center">
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
              Set your Information
            </Typography>
            <Tabs value={tab} onChange={tabChange} aria-label="tabs">
              <Tab label="Settings" />
              <Tab label="Libre" />
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
    </Grid>
  );
};
export default YourData;
