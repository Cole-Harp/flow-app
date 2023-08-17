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

type CreateFolderDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
};

export function CreateFolderDialog({
  open,
  onClose,
  onCreate,
}: CreateFolderDialogProps) {
  const [name, setName] = useState("");

  const handleCreateNewFolder = () => {
    onCreate(name);
    setName("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Folder</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for the new folder.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Folder Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreateNewFolder}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
