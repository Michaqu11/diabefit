import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Page.scss";
import SearchInput from "../components/elements/products/search/SearchInput";
import Divider from "@mui/material/Divider";

const AddProduct: React.FC = () => {
  let { id } = useParams();
  const location = useLocation();
  const { meal } = location.state;
  const Mobile = useMediaQuery("(min-width:700px)");
  return (
    <Paper elevation={0} sx={{ margin: "5px" }}>
      <div className={!Mobile ? "container-mobile" : "container-desktop"}>
        <SearchInput />
        <Divider sx={{ marginTop: "10px" }} />
        <h2>
          Using {id} object which is {meal}
        </h2>
      </div>
    </Paper>
  );
};

export default AddProduct;
