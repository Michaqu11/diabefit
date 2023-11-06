import {
  Button,
  ClickAwayListener,
  SvgIconTypeMap,
  Tooltip,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { useState } from "react";

export interface TooltipProps {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  title: string;
}

const ClickTooltip: React.FC<TooltipProps> = (props) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          title={props.title}
          placement="top"
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <Button
            onClick={open ? handleTooltipClose : handleTooltipOpen}
            size="small"
            sx={{ padding: "0px" }}
          >
            <props.icon />
          </Button>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

export default ClickTooltip;
