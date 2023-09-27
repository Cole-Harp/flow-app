import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
  } from "@mui/material";
  
  type DeleteDialogProps = {
    open: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
    title: string;
    itemToDelete: any;
  };
  
  export function DeleteDialog({
    open,
    onClose,
    onDelete,
    title,
    itemToDelete,
  }: DeleteDialogProps) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the {title}:{" "}
            {itemToDelete ? itemToDelete.name : ""}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (itemToDelete) {
                onDelete(itemToDelete.id);
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