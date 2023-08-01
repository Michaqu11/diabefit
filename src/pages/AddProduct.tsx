import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Page.scss";
import SearchInput from "../components/elements/products/search/SearchInput";
import Divider from "@mui/material/Divider";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Button, Grid, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

const AddProduct: React.FC = () => {
  let { id } = useParams();
  const location = useLocation();
  const { meal } = location.state;
  const { days } = location.state;
  const Mobile = useMediaQuery("(min-width:700px)");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Paper elevation={0} sx={{ margin: "5px" }}>
      <Grid container justifyContent="flex-start">
            <Grid>
              <IconButton color="primary" component={Link} to={`/`} aria-label="back">
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>
            <Grid sx={{marginTop: "2px"}}>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                {meal}
              </Button>
            </Grid>
          </Grid>
        <div className={!Mobile ? "container-mobile" : "container-desktop"}>

          <SearchInput />
          <Divider sx={{ marginTop: "10px" }} />
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
          .filter((e: String) => e !== meal)
          .map((e: String, index: number) => (<div key={index}>
            <MenuItem onClick={handleClose}>{e}</MenuItem>
            </div>
          ))}
      </Menu>
    </>
  );
};

export default AddProduct;
