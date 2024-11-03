import { ListItem, ListItemText } from "@mui/material";

export const emptyList = (
  info: string = "No products to display",
  subInfo?: string,
) => {
  return (
    <ListItem
      component="div"
      disablePadding
      sx={{ marginTop: "10px", display: "flex", flexDirection: "column" }}
    >
      <ListItemText style={{ display: "flex", justifyContent: "center" }}>
        <span style={{ fontSize: "1.5rem" }}>{info}</span>
      </ListItemText>
      {subInfo ? (
        <ListItemText style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: "1.5rem" }}>{subInfo}</span>
        </ListItemText>
      ) : null}
    </ListItem>
  );
};
