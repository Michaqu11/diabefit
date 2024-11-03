import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import "./accordionDetail.scss";
import { Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { removeMeal } from "../../../store/mealsStorage";
import { IElement } from "../../../types/days";
type Props = {
  elementsProps: IElement[] | undefined;
  changedData: (t: number) => void;
};

const CustomizedAccordions: React.FC<Props> = ({
  elementsProps,
  changedData,
}) => {
  const removeMealElement = (dayID: string, dayIndex: number, id: string) => {
    removeMeal(dayID, dayIndex, id);
    changedData(dayIndex - 1);
  };

  return (
    <div className="productsDetail">
      <Divider />
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {elementsProps &&
          elementsProps.map((e) => {
            return (
              <ListItem style={{ padding: "2px 8px 2px 12px" }} key={e.id}>
                <ListItemText primary={e.header} secondary={e.secondary} />
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="close"
                  size="small"
                  className="products-detail-remove-button"
                  onClick={() => removeMealElement(e.dayID, e.dayIndex, e.id)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItem>
            );
          })}
      </List>
    </div>
  );
};

export default CustomizedAccordions;
