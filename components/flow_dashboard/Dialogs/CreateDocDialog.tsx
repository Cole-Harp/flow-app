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
  
  export function CreateDocDialog({
    open,
    onClose,
    onCreate,
    title,
    onTitleChange,
  }: CreateFlowDialogProps) {
    const handleCreateNewDoc = () => {
      onCreate();
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create New Doc</DialogTitle>
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
          <Button onClick={handleCreateNewDoc}>Create</Button>
        </DialogActions>
      </Dialog>
    );
  }
  