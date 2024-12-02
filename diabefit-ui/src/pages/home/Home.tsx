import "./Home.scss";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import DateList from "../../components/common/dateList/DateList";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { encodeShortDate } from "../../components/common/share/MomentFunctions";
import CustomizedAccordions from "../../components/elements/accordions/MealsAccordions";
import CorrectionAccordions from "../../components/elements/accordions/CorrectionAccordions";
import { BottomButtons } from "./BottomButtons";
import { CustomMealAccordions } from "../../components/elements/accordions/CustomMealsAccordions";
const Home: React.FC = () => {
  const Mobile = useMediaQuery("(min-width:700px)");

  const location = useLocation();
  const navigate = useNavigate();
  let unixDay = encodeShortDate();

  if (location.state) {
    const { id } = location.state;
    unixDay = Number(id);
  }
  const [dayId, setDayId] = useState(unixDay);

  const setDay = (e: number) => {
    setDayId(e);
    navigate(location.pathname, {});
  };

  const clearState = () => {
    navigate(location.pathname, {});
  };

  window.addEventListener("beforeunload", clearState);

  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return (
    <>
      <Paper elevation={!Mobile ? 0 : 1}>
        <DateList dayId={dayId} setDay={(event) => setDay(event)} />
        <div className={!Mobile ? "container-mobile" : "container-desktop"}>
          <CustomizedAccordions dayId={dayId} width={width} />
          <CustomMealAccordions dayId={dayId} width={width} />
          <CorrectionAccordions dayId={dayId} />
        </div>
      </Paper>
      <BottomButtons dayId={dayId} />
    </>
  );
};

export default Home;
