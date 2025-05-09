import { Button, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { ElevateDialog } from "./ElevateDialog";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const BottomButtons = ({ dayId }: { dayId: number }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [openElevateDialog, setOpenElevateDialog] = useState(false);

  return (
    <>
      <Container
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          width: "100%",
          p: "0 !important",
        }}
      >
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            padding: "8px",
          }}
          elevation={3}
        >
          <Button
            variant="text"
            size="small"
            onClick={() => navigate("entry")}
            startIcon={<BloodtypeIcon />}
          >
            {t("home.bottomNavigation.entry")}
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => navigate("bolus")}
            startIcon={<VaccinesIcon />}
          >
            {t("home.bottomNavigation.bolus")}
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => setOpenElevateDialog(true)}
            startIcon={<LocalDrinkIcon />}
          >
            {t("home.bottomNavigation.elevate")}
          </Button>
        </Paper>
      </Container>
      <ElevateDialog
        isOpen={openElevateDialog}
        setIsOpen={setOpenElevateDialog}
        dayId={dayId}
      />
    </>
  );
};
