import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

type CreateFlowDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
  title: string;
  onTitleChange: (value: string) => void;
};

export function CreateFlowDialog({
  open,
  onClose,
  onCreate,
  title,
  onTitleChange,
}: CreateFlowDialogProps) {
  const handleCreateNewFlow = () => {
    onCreate();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Flow</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a title for the new flow.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Flow Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreateNewFlow}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
