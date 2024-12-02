import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { GlucoseInput } from "../../components/common/share/GlucoseInput";
import AddIcon from "@mui/icons-material/Add";
import {
  readCustomMealDay,
  saveCustomMeal,
} from "../../store/customMealsStorage";
import { emptyMeal, IMealElement } from "../../types/meal";
import { IDay } from "../../types/days";

interface ElevateDialogProps {
  isOpen: boolean;
  setIsOpen: (t: boolean) => void;
  dayId: number;
}

export const ElevateDialog = (props: ElevateDialogProps) => {
  const [carbsUnits, setCarbsUnits] = useState<number | string>("");
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const [glucose, setGlucose] = useState<number | string>("");

  const handleDateChange = (value: Dayjs | null) => {
    setSelectedDate(value ?? dayjs(new Date()));
  };

  const saveElevate = () => {
    const allDayMeals = readCustomMealDay(props.dayId.toString());
    const id = allDayMeals?.length ?? 0;

    const meal: IMealElement = {
      ...emptyMeal,
      id: id.toString(),
      mealName: `Elevate ${id + 1}`,
      displayName: `Elevate ${id + 1}`,
      carbs: typeof carbsUnits == "number" ? carbsUnits * 10 : 0,
    };

    const customMeal: IDay = {
      id,
      name: `Custom ${id}`,
      meals: [meal],
      calculatorData: {
        glucose: typeof glucose == "number" ? glucose : 0,
        units: {
          short: 0,
        },
        date: selectedDate.toDate(),
      },
      isElevate: true,
    };

    saveCustomMeal(customMeal, props.dayId, customMeal.id);
    props.setIsOpen(false);
    window.location.reload();
  };

  return (
    <Dialog open={props.isOpen} onClose={props.setIsOpen}>
      <DialogTitle style={{ textAlign: "center", marginBottom: "10px" }}>
        Elevate blood sugar
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              value={selectedDate}
              onChange={handleDateChange}
              ampm={false}
            />
          </LocalizationProvider>

          <GlucoseInput glucose={glucose} setGlucose={setGlucose} />
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              overflow: "visible !important",
            }}
          >
            <FormControl variant="outlined">
              <InputLabel htmlFor="component-simple">Carb Units</InputLabel>
              <OutlinedInput
                value={carbsUnits}
                label="Carb Units"
                type="number"
                inputProps={{
                  step: "0.1",
                }}
                onChange={(event) =>
                  setCarbsUnits(
                    event.target.value === ""
                      ? ""
                      : parseFloat(event.target.value),
                  )
                }
                endAdornment={
                  <InputAdornment position="end">CU</InputAdornment>
                }
                aria-describedby="outlined-sugar-text"
              />
            </FormControl>
            <div
              style={{ height: "50px", display: "flex", alignItems: "center" }}
            >
              <IconButton
                aria-label="add"
                onClick={() =>
                  setCarbsUnits((prev) =>
                    typeof prev == "number" ? prev + 1 : 1,
                  )
                }
                size="small"
              >
                <AddIcon />
              </IconButton>
            </div>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setIsOpen(false)}>Cancel</Button>
        <Button onClick={saveElevate}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};
