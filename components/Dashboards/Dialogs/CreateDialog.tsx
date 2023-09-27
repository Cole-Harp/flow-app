import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
  } from "@mui/material";
  
  type CreateDialogProps = {
    open: boolean;
    onClose: () => void;
    onCreate: () => void;
    title: string;
    label: string;
    onTitleChange: (value: string) => void;
  };
  
  export function CreateDialog({
    open,
    onClose,
    onCreate,
    title,
    label,
    onTitleChange,
  }: CreateDialogProps) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a title for the new {label.toLowerCase()}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label={label}
            type="text"
            fullWidth
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    );
  }