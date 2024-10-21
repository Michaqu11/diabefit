import * as React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Sidebar from "./Sidebar";

interface NavbarProps {
  stateValue: boolean;
  onStateChange: (state: boolean) => void;
};

const Navbar: React.FC<NavbarProps> = ({ stateValue }) => {
  const [state, setState] = React.useState(stateValue);

  React.useEffect(() => {
    setState(stateValue);
  }, [stateValue]);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(open);
    };

  return (
    <SwipeableDrawer
      anchor="left"
      open={state}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <Sidebar toggleDrawer={toggleDrawer} />
    </SwipeableDrawer>
  );
};

export default Navbar;
