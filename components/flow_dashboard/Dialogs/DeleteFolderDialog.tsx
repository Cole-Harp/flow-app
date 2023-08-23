// DeleteFlowDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
// import { Folder } from "@prisma/client";

type DeleteFlowDialogProps = {
  open: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  folderToDelete: any;
};

export function DeleteFolderDialog({
  open,
  onClose,
  onDelete,
  folderToDelete,
}: DeleteFlowDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Flow</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the flow:{" "}
          {folderToDelete ? folderToDelete.name : ""}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (folderToDelete) {
              onDelete(folderToDelete.id);
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
