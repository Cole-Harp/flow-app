import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { FlowInstance } from "@prisma/client";

type DeleteFlowDialogProps = {
  open: boolean;
  onClose: () => void;
  onDelete: (flowId: string) => void; // Update the parameter type to 'number'
  flowToDelete: FlowInstance | null;
};

export function DeleteFlowDialog({
  open,
  onClose,
  onDelete,
  flowToDelete,
}: DeleteFlowDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Flow</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the flow:{" "}
          {flowToDelete ? flowToDelete.title : ""}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (flowToDelete) {
              onDelete(flowToDelete.flowId); // Pass the 'id' property instead of the entire 'flowInstance' object
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
