import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CorrectionData } from "../../../store/storagesTypes";
import {
  readDayCorrection,
  removeCorrection,
} from "../../../store/bolusStorage";
import DividerWithText from "../../common/share/DividerWithText";
import ConfirmDialog from "../../common/share/ConfirmDialog";
import { useState } from "react";

type Props = {
  dayId: number;
};

const CorrectionAccordions: React.FC<Props> = ({ dayId }) => {
  const [corrections, setCorrections] = React.useState<CorrectionData[]>([]);

  React.useEffect(() => {
    const dayCorrections = readDayCorrection(dayId);
    setCorrections(dayCorrections || []);
  }, [dayId]);

  const handleDelete = (correctionId: string) => {
    removeCorrection(dayId, correctionId);
    setCorrections((prev) =>
      prev.filter((correction) => correction.id !== correctionId),
    );
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const [dialogData, setDialogData] = useState<string | null>(null);

  return (
    <div>
      {corrections.length ? <DividerWithText text="Corrections" /> : null}
      {corrections.length
        ? corrections.map((correction, index) => (
            <Accordion
              key={correction.id}
              sx={{
                marginBottom: "5px",
                borderRadius: "10px",
                backgroundColor:
                  "var(--joy-palette-primary-softBg, var(--joy-palette-primary-100, #DDF1FF))",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`correction-content-${correction.id}`}
                id={`correction-${correction.id}`}
              >
                <Typography>
                  {formatDate(correction.time)} | {correction.correctionInsulin}{" "}
                  u
                </Typography>
                <IconButton
                  aria-label="delete"
                  onClick={() => setDialogData(correction.id)}
                  sx={{ marginLeft: "auto" }}
                >
                  <DeleteIcon />
                </IconButton>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: "0px 15px" }}>
                <Typography>
                  <strong>Correction Insulin:</strong>{" "}
                  {correction.correctionInsulin} u
                </Typography>
                <Typography>
                  <strong>Blood Sugar:</strong> {correction.glucose} mg/dL
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        : null}
      <ConfirmDialog
        open={dialogData !== null}
        text="Do you want to remove the correction?"
        setOpen={() => setDialogData(null)}
        onConfirm={() => handleDelete(dialogData ?? "")}
      />
    </div>
  );
};

export default CorrectionAccordions;
