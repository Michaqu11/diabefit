import { ListItem, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";

const EmptyList = ({ info, subInfo }: { info?: string; subInfo?: string }) => {
  const { t } = useTranslation();

  return (
    <ListItem
      component="div"
      disablePadding
      sx={{ marginTop: "10px", display: "flex", flexDirection: "column" }}
    >
      <ListItemText style={{ display: "flex", justifyContent: "center" }}>
        <span style={{ fontSize: "1.5rem" }}>
          {info ?? t("addProduct.emptyListLabel")}
        </span>
      </ListItemText>
      {subInfo ? (
        <ListItemText style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: "1.5rem" }}>{subInfo}</span>
        </ListItemText>
      ) : null}
    </ListItem>
  );
};

export const emptyList = (info?: string, subInfo?: string) => {
  return <EmptyList info={info} subInfo={subInfo} />;
};
