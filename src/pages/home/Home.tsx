import "./Home.scss";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import DateList from "../../components/common/dateList/DateList";
import CustomizedAccordions from "../../components/elements/accordions/accordions";

const Home: React.FC = () => {
  const Mobile = useMediaQuery("(min-width:700px)");
  return (
    <Paper elevation={!Mobile ? 0 : 1}>
      <DateList />
      <div className={!Mobile ? "container-mobile" : "container-desktop"}>
        <CustomizedAccordions />
      </div>
    </Paper>
  );
};

export default Home;
