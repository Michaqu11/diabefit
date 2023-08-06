import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";

type Props = {
  searchKey: string;
  setSearchKey: (state: string) => void;
};

const SearchInput: React.FC<Props> = ({ searchKey, setSearchKey }) => {
  return (
    <Paper
      elevation={1}
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        maxWidth: "700px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Product"
        inputProps={{ "aria-label": "search product" }}
        value={searchKey}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchKey(event.target.value);
        }}
      />
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={() => setSearchKey("")}
      >
        <ClearIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton sx={{ p: "10px" }} aria-label="filter">
        <FilterListOutlinedIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchInput;
