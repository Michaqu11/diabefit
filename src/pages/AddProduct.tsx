import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
// import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Page.scss";
import SearchInput from "../components/elements/products/search/SearchInput";
import ProductsList from "../components/elements/products/ProductsList";
import Divider from "@mui/material/Divider";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Button, Grid, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

const AddProduct: React.FC = () => {
  // let { id } = useParams();
  const location = useLocation();
  const { meal } = location.state;
  const { days } = location.state;
  const Mobile = useMediaQuery("(min-width:700px)");

  const [mealName, setMealName] = useState<String>(meal);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchKey, setSearchKey] = useState<string>("");

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const close = (e: String) => {
    setMealName(e);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Paper elevation={0} sx={{ margin: "5px" }}>
        <Grid container justifyContent="flex-start">
          <Grid>
            <IconButton
              color="primary"
              component={Link}
              to={`/`}
              aria-label="back"
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </Grid>
          <Grid sx={{ marginTop: "2px" }}>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              {mealName}
            </Button>
          </Grid>
        </Grid>
        <div className={!Mobile ? "container-mobile" : "container-desktop"}>
          <SearchInput searchKey={searchKey} setSearchKey={setSearchKey} />
          <Divider sx={{ marginTop: "10px" }} />
          <ProductsList searchKey={searchKey} />
        </div>
      </Paper>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {days
          .filter((e: String) => e !== mealName)
          .map((e: String, index: number) => (
            <div key={index}>
              <MenuItem onClick={() => close(e)}>{e}</MenuItem>
            </div>
          ))}
      </Menu>
    </>
  );
};

export default AddProduct;
