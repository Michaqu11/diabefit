import * as React from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ICalculatePanel } from "../../../types/days";
import CalculateIcon from "@mui/icons-material/Calculate";

interface CalculatePanelProps {
  openCalculate: ICalculatePanel;
  setOpenCalculate: (value: React.SetStateAction<ICalculatePanel>) => void;
}

const CalculatePanel: React.FC<CalculatePanelProps> = (props) => {
  const handleCalculateClickClose = () => {
    props.setOpenCalculate({ open: false, day: undefined });
  };

  const saveCalculation = () => {
    console.log("Save..");
    handleCalculateClickClose();
  };

  const [bloodSugar, setBloodSugar] = React.useState(0);
  const [carbs, setCarbs] = React.useState(0);
  return (
    <Dialog open={props.openCalculate.open} onClose={handleCalculateClickClose}>
      <DialogTitle style={{ textAlign: "center", marginBottom: "10px" }}>
        New entry
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "7px",
          }}
        >
          <div></div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              label="Date"
              defaultValue={dayjs(new Date())}
            />
          </LocalizationProvider>

          <FormControl variant="outlined">
            <InputLabel htmlFor="component-simple">Blood sugar</InputLabel>
            <OutlinedInput
              value={bloodSugar}
              onChange={(sugar) => setBloodSugar(Number(sugar.target.value))}
              label="Blood sugar"
              endAdornment={
                <InputAdornment position="end">mg/dL</InputAdornment>
              }
              aria-describedby="outlined-sugar-text"
            />
            <FormHelperText id="outlined-sugar-text"></FormHelperText>
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel htmlFor="component-simple">Carbs</InputLabel>
            <OutlinedInput
              value={carbs}
              label="Carbs"
              onChange={(carb) => setCarbs(Number(carb.target.value))}
              endAdornment={<InputAdornment position="end">WW</InputAdornment>}
              aria-describedby="outlined-sugar-text"
            />
          </FormControl>
          <Divider />

          <Card variant="outlined">
            <CardContent
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                padding: "10px",
              }}
            >
              <CalculateIcon color="primary" /> Bolus Calculator
            </CardContent>
            <Divider />
            <CardActions
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "0px",
              }}
            >
              <Button variant="text">Calculate</Button>
            </CardActions>
          </Card>

          <TextField label="Insulin (foods)" variant="outlined" />
          <TextField label="Insulin (correction)" variant="outlined" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCalculateClickClose}>Cancel</Button>
        <Button onClick={saveCalculation}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalculatePanel;
