import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";
import "./Page.scss";
import SearchInput from "../components/elements/products/search/SearchInput";
import ProductsList from "../components/elements/products/ProductsList";
import Divider from "@mui/material/Divider";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Button, Grid, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { EDays } from "../types/days";
import { useNavigate } from 'react-router-dom';

const AddProduct: React.FC = () => {
  let { id, meal } = useParams();
  const Mobile = useMediaQuery("(min-width:700px)");

  const [mealName, setMealName] = useState<String>(
    Object.values(EDays)[Number(meal) - 1],
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchKey, setSearchKey] = useState<string>("");

  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const close = (e: String) => {
    setMealName(e);
    setAnchorEl(null);
    navigate(`../add/${id}/${Object.values(EDays).indexOf(e as unknown as EDays) + 1
      }`, { replace: true });
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
              state={{
                id: id,
              }}
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
        {Object.values(EDays)
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
