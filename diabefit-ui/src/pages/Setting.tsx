import { Button, Card } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { exportCSVData, exportJSONData } from "../store/mealsStorage";

const Setting: React.FC = () => (
  <>
    <h1>Setting</h1>
    <Card sx={{ padding: "50px 20px" }}>
      Export data:{" "}
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
  </>
);

export default Setting;
