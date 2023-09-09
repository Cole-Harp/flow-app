
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
  } from "@mui/material";
  
  type DeleteFlowDialogProps = {
    open: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
    docToDelete: any;
  };
  
  export function DeleteDocDialog({
    open,
    onClose,
    onDelete,
    docToDelete,
  }: DeleteFlowDialogProps) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Delete Doc</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the Doc:{" "}
            {docToDelete ? docToDelete.name : ""}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (docToDelete) {
                onDelete(docToDelete.docId);
              }
            }}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  