import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';

const SearchInput: React.FC = () => (
    <Paper
    elevation={1}
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}
    >
       <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Product"
        inputProps={{ 'aria-label': 'search product' }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton sx={{ p: '10px' }} aria-label="filter">
        <FilterListOutlinedIcon />
      </IconButton>
    </Paper>
  );

export default SearchInput;
