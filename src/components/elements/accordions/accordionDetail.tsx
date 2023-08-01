import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";

import "./accordionDetail.scss";
interface IElement {
  header: string;
  secondary: string;
  image: string;
}

type Props = {
  elementsProps: IElement[] | undefined;
};

const CustomizedAccordions: React.FC<Props> = ({ elementsProps }) => {
  return (
    <div>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {elementsProps &&
          elementsProps.map((e) => {
            return (
              <ListItem key={e.header}>
                <ListItemAvatar>
                  {e.image ? (
                    <Avatar src={e.image} />
                  ) : (
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText primary={e.header} secondary={e.secondary} />
              </ListItem>
            );
          })}
      </List>
    </div>
  );
};

export default CustomizedAccordions;
