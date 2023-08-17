"use client";
import { useState } from "react";
// import { Folder as FolderType, FlowInstance } from "@prisma/client";
import {
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import AddIcon from "@mui/icons-material/Add";
import { CreateFlowDialog } from "./CreateFlowDialog";
import { DeleteFlowDialog } from "./DeleteFlowDialog";
import { DeleteFolderDialog } from "./DeleteFolderDialog";
import { deleteFlow } from "@/lib/serv-actions/deleteFlow";
import { createFlow } from "@/lib/serv-actions/createFlow";
import { useRouter } from "next/navigation";
import { redirect } from "next/dist/server/api-utils";

type FolderProps = {
  folder: any;
  flowInstances: any[];
  title: string;
  onDeleteFlow: (id: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onConfirmOpen: (flowInstance: any) => void;
  onCreate: (title: string, folderId: string) => void;
};

export function Folder({
  folder,
  flowInstances,
  onCreate,
  onDeleteFlow,
  onDeleteFolder,
}: FolderProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState<any>(null);
  const [createFlowDialogOpen, setCreateFlowDialogOpen] = useState(false);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);

  const [title, setTitle] = useState("Filler"); // Use the initialTitle prop as the initial state
  const router = useRouter()
  const handleConfirmOpen = (flowInstance: any) => {
    setFlowToDelete(flowInstance);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleDeleteFlow = (flowId: string) => {
    onDeleteFlow(flowId);
    deleteFlow(flowId)
    handleConfirmClose();
  };

  const handleDeleteFolder = () => {
    onDeleteFolder(folder.folderId);
    setDeleteFolderDialogOpen(false);
  };

  const handleCreateNewFlow = async () => {
    setTitle(title);
    const flow = await createFlow(title, folder.folderId);
    setTitle(""); // Reset the title state variable
    setCreateFlowDialogOpen(false); // Close the dialog
    if (!flow) {
      return
      <div>
        Loading
      </div>
    }

    // Redirect to the flows/[flowId] page
    router.push(`/Flow/${flow.flowId}`);

  };


  const middleIndex = Math.ceil(flowInstances.length / 2);
  const leftFlowInstances = flowInstances.slice(0, middleIndex);
  const rightFlowInstances = flowInstances.slice(middleIndex);

  return (
    <Paper elevation={3} style={{ padding: "16px" }}>
      <Typography variant="h6">{folder.name}</Typography>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          {leftFlowInstances.map((flowInstance) => (
            <div key={flowInstance.flowId}>
              <Link href={`/Flow/${flowInstance.flowId}`} passHref>
                <Typography variant="h5" component="div" gutterBottom>
                  Flow Instance: {flowInstance.title}
                </Typography>
              </Link>
              <Typography variant="h6" gutterBottom>
                Created at: {new Date(flowInstance.createdAt).toString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Updated at: {new Date(flowInstance.updatedAt).toString()}
              </Typography>
              <IconButton
                edge="end"
                color="secondary"
                onClick={() => handleConfirmOpen(flowInstance)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          {rightFlowInstances.map((flowInstance) => (
            <div key={flowInstance.flowId}>
              <Link href={`/Flow/${flowInstance.flowId}`} passHref>
                <Typography variant="h5" component="div" gutterBottom>
                  Flow Instance: {flowInstance.title}
                </Typography>
              </Link>
              <Typography variant="body1" gutterBottom>
                Created at: {new Date(flowInstance.createdAt).toString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Updated at: {new Date(flowInstance.updatedAt).toString()}
              </Typography>
              <IconButton
                edge="end"
                color="secondary"
                onClick={() => handleConfirmOpen(flowInstance)}
              >
                <DeleteIcon />
              </IconButton>
              <DeleteFlowDialog
                open={confirmOpen}
                onClose={handleConfirmClose}
                onDelete={handleDeleteFlow}
                flowToDelete={flowToDelete}
              />
            </div>
          ))}
        </div>
      </div>

      <IconButton
        edge="end"
        color="secondary"
        onClick={() => setDeleteFolderDialogOpen(true)}
      >
        <FolderOffIcon />
      </IconButton>
      {/* Add the DeleteFolderDialog component and pass the required props */}
      <DeleteFolderDialog
        open={deleteFolderDialogOpen}
        onClose={() => setDeleteFolderDialogOpen(false)}
        onDelete={handleDeleteFolder}
        folderToDelete={folder}
      />

      <IconButton
        edge="end"
        color="primary"
        onClick={() => setCreateFlowDialogOpen(true)}
      >
        <AddIcon />
      </IconButton>
      <CreateFlowDialog
        open={createFlowDialogOpen}
        onClose={() => setCreateFlowDialogOpen(false)}
        onCreate={handleCreateNewFlow} // Pass the handleCreateNewFlow function
        title={title} // Pass the title state variable as a prop
        onTitleChange={setTitle} // Add a function to update the title state variable
/>
    </Paper>
  );
}
