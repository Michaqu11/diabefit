import "./Home.scss";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import DateList from "../../components/common/dateList/DateList";
import CustomizedAccordions from "../../components/elements/accordions/accordions";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { encodeShortDate } from "../../components/common/share/MomentFunctions";

const Home: React.FC = () => {
  const Mobile = useMediaQuery("(min-width:700px)");

  const location = useLocation();
  const navigate = useNavigate();
  let tempId = encodeShortDate();

  if (location.state) {
    const { id } = location.state;
    tempId = Number(id);
  }
  const [dayId, setDayId] = useState(tempId);

  const setDay = (e: number) => {
    setDayId(e);
    navigate(location.pathname, {});
  };

  const clearState = () => {
    navigate(location.pathname, {});
  };

  window.addEventListener("beforeunload", clearState);

  return (
    <Paper elevation={!Mobile ? 0 : 1}>
      <DateList dayId={dayId} setDay={(event) => setDay(event)} />
      <div className={!Mobile ? "container-mobile" : "container-desktop"}>
        <CustomizedAccordions dayId={dayId} />
      </div>
    </Paper>
  );
};

export default Home;
