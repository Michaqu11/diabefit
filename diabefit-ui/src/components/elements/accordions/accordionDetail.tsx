import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import "./accordionDetail.scss";
import { IElement } from "./accordions";
import { Divider } from "@mui/material";

type Props = {
  elementsProps: IElement[] | undefined;
};

const CustomizedAccordions: React.FC<Props> = ({ elementsProps }) => {
  return (
    <div>
      <Divider />
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {elementsProps &&
          elementsProps.map((e) => {
            return (
              <ListItem style={{padding: '2px 4px'}} key={e.header}>
                <ListItemText primary={e.header} secondary={e.secondary} />
              </ListItem>
            );
          })}
      </List>
    </div>
  );
};

export default CustomizedAccordions;
