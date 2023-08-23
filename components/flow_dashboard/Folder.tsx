import { useState } from "react";
import {
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import AddIcon from "@mui/icons-material/Add";
import { CreateFlowDialog } from "./Dialogs/CreateFlowDialog";
import { DeleteFlowDialog } from "./Dialogs/DeleteFlowDialog";
import { DeleteFolderDialog } from "./Dialogs/DeleteFolderDialog";
import { deleteFlow } from "@/lib/serv-actions/deleteFlow";
import { createFlow } from "@/lib/serv-actions/createFlow";
import { useRouter } from "next/navigation";
import FavoriteButton from "./FavoriteButton";

type FolderProps = {
  folder: any;
  flowInstances: any[];
  title: string;
  onDeleteFlow: (id: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onConfirmOpen: (flowInstance: any) => void;
  onCreate: (title: string, folderId: string) => void;
  onFavoriteFolder: (folder: string) => void;
};

export function Folder({
  folder,
  flowInstances,
  onDeleteFlow,
  onDeleteFolder,
  onFavoriteFolder,
}: FolderProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState<any>(null);
  const [createFlowDialogOpen, setCreateFlowDialogOpen] = useState(false);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);

  const [title, setTitle] = useState("Filler");
  const router = useRouter();
  const handleConfirmOpen = (flowInstance: any) => {
    setFlowToDelete(flowInstance);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleDeleteFlow = (flowId: string) => {
    onDeleteFlow(flowId);
    deleteFlow(flowId);
    handleConfirmClose();
  };

  const handleFavorite = () => {
    onFavoriteFolder(folder);
  };

  const handleDeleteFolder = () => {
    onDeleteFolder(folder.folderId);
    setDeleteFolderDialogOpen(false);
  };

  const handleCreateNewFlow = async () => {
    setTitle(title);
    const flow = await createFlow(title, folder.folderId);
    setTitle("");
    setCreateFlowDialogOpen(false);
    if (!flow) {
      return <div>Loading</div>;
    }

    router.push(`/Flow/${flow.flowId}`);
  };

  const middleIndex = Math.ceil(flowInstances.length / 2);
  const leftFlowInstances = flowInstances.slice(0, middleIndex);
  const rightFlowInstances = flowInstances.slice(middleIndex);

  return (
    <Paper elevation={3} style={{ padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">{folder.name}</Typography>
        <div>
          <FavoriteButton

            onFavorite={handleFavorite}
          />
          <IconButton
            edge="end"
            color="secondary"
            onClick={() => setDeleteFolderDialogOpen(true)}
          >
            <FolderOffIcon />
          </IconButton>
          <IconButton
            edge="end"
            color="primary"
            onClick={() => setCreateFlowDialogOpen(true)}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          {leftFlowInstances.map((flowInstance) => (
            <div key={flowInstance.flowId}>
              <Link href={`/Flow/${flowInstance.flowId}`} passHref>
                <Typography variant="h5" component="div" gutterBottom>
                  Flow: {flowInstance.title}
                </Typography>
              </Link>
              <Typography variant="body2" gutterBottom>
                Updated at: {new Date(flowInstance.updatedAt).toString().slice(0, 21)}
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
                  Flow: {flowInstance.title}
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
            </div>
          ))}
        </div>
      </div>
      <DeleteFlowDialog
                open={confirmOpen}
                onClose={handleConfirmClose}
                onDelete={handleDeleteFlow}
                flowToDelete={flowToDelete}
              />
      <DeleteFolderDialog
        open={deleteFolderDialogOpen}
        onClose={() => setDeleteFolderDialogOpen(false)}
        onDelete={handleDeleteFolder}
        folderToDelete={folder}
      />
      <CreateFlowDialog
        open={createFlowDialogOpen}
        onClose={() => setCreateFlowDialogOpen(false)}
        onCreate={handleCreateNewFlow}
        title={title}
        onTitleChange={setTitle}
      />
    </Paper>
  );
}