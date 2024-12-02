import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface ConfirmDialogProps {
  open: boolean;
  text: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const confirm = () => {
    props.onConfirm();
    props.setOpen(false);
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Use Google's location service?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpen(false)}>Cancel</Button>
        <Button onClick={confirm} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
