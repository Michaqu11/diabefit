import { Button, Card } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { exportCSVData, exportJSONData } from "../store/mealsStorage";
import { useTranslation } from "react-i18next";

const Setting: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <h1>{t("settings.title")}</h1>
      <Card sx={{ padding: "20px" }}>
        {t("settings.exportDataLabel")}
        <Button
          color="primary"
          variant="outlined"
          sx={{ margin: "0px 10px" }}
          onClick={exportCSVData}
        >
          <DownloadIcon /> CSV
        </Button>
        <Button
          color="primary"
          variant="outlined"
          sx={{ margin: "0px 10px" }}
          onClick={exportJSONData}
        >
          <DownloadIcon /> JSON
        </Button>
      </Card>
      <br />
      <Card sx={{ p: 2 }}>
        {t("settings.languageLabel")}
        <Button
          variant="outlined"
          sx={{ margin: "0px 10px" }}
          onClick={() => changeLanguage("en")}
        >
          English
        </Button>
        <Button
          variant="outlined"
          sx={{ margin: "0px 10px" }}
          onClick={() => changeLanguage("pl")}
        >
          Polski
        </Button>
      </Card>
    </>
  );
};

export default Setting;
