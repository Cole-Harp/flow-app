"use client"

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FlowInstance, Folder } from "@prisma/client";
import DeleteIcon from "@mui/icons-material/Delete";
import flow_dashboard_css from "@/app/styles/flow_dashboard.module.css";
import { CreateFlowDialog } from "../../components/flow_dashboard/CreateFlowDialog";
import { DeleteFlowDialog } from "../../components/flow_dashboard/DeleteFlowDialog";
import { CreateFolderDialog } from "../../components/flow_dashboard/CreateFolderDialog";
import { Folder as FolderComponent } from "../../components/flow_dashboard/Folder";
import { useFlowInstances } from "../../components/flow_dashboard/UseFlowInstances";
import { useFolders } from "../../components/flow_dashboard/UserFolders";
import { useRouter } from "next/router";
import { createFolder } from "@/lib/serv-actions/createFolder";

import { deleteFolder } from "@/lib/serv-actions/deleteFolder";
import { createFlow } from "@/lib/serv-actions/createFlow";
import { deleteFlow } from "../../lib/serv-actions/deleteFlow"

interface FlowDashboardProps {
  initial_folders: Array<{
    folderId: string;
    name: string;
    parentId: number;
    userId: string;
  }>;
  initial_flows: Array<{
    flowId,
    createdAt,
    updatedAt,
    title,
    nodes,
    edges,
    userId,
    folderId
  }>;
}


const Flow_Dashboard: React.FC<FlowDashboardProps> = ({ initial_folders, initial_flows }) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState<FlowInstance | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);



  const [folders, setFolders] = useState(initial_folders || []);
  const [flowInstances, setFlowInstances] = useState(initial_flows || []);

  const handleConfirmOpen = (flowInstance?: FlowInstance, folder?: Folder) => {
    if (folder) {
      setFolderToDelete(folder);
      setConfirmOpen(true);
    }
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };


  const handleCreateNewFolder = async (name: string) => {
    const newFolder = await createFolder(name)

    console.log(newFolder);
    setFolders([...folders, newFolder]);

    setFolderDialogOpen(false);
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      const resp = await deleteFolder(folderId)
      setFolders(folders.filter((folder) => folder.folderId !== folderId));
        handleConfirmClose();
      
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const handleDeleteFlow = async (flowId: string) => {

    setFlowInstances(flowInstances.filter((flow) => flow.flowId !== flowId));
  };

  const deleteFlow = async (flowId: string) => {

        // Remove the deleted flow instance from the state
        setFlowInstances(flowInstances.filter((flow) => flow.flowId !== flowId));


  };

  return (
    <div>
      <div style={{ marginLeft: "0px", marginRight: "20px", marginTop: "12px" }}>
        {/* <Typography variant="h4" component="h1" marginLeft="20px">
          Flow Dashboard
        </Typography> */}
        <div style={{ marginRight: "20px" }}>
          <Button
          variant="contained"
          color="primary"
          onClick={() => setFolderDialogOpen(true)}
          className={flow_dashboard_css.folder_button}
        >
          New Folder
        </Button>
        <CreateFolderDialog
          open={folderDialogOpen}
          onClose={() => setFolderDialogOpen(false)}
          onCreate={handleCreateNewFolder}
        />
          <Typography variant="h4" component="h1" marginTop="10px">
            Flow Folders
          </Typography>
          <Grid container spacing={2} style={{ marginTop: "1px" }}>
            {folders.map((folder) => {
              const folderFlowInstances = flowInstances.filter(
                (flowInstance) => flowInstance.folderId === folder.folderId,
              );

              return (
                <Grid item xs={12} sm={6} md={4} key={folder.folderId}>
                  <FolderComponent
                    folder={folder}
                    flowInstances={folderFlowInstances}
                    onDeleteFlow={handleDeleteFlow}
                    onConfirmOpen={handleConfirmOpen}
                    onCreate={createFlow}
                    title={""}
                    onDeleteFolder={handleDeleteFolder}
                  />
                </Grid>
              );
            })}
          </Grid>
        </div>
        <div>
          <Typography variant="h4" component="h1" marginTop="15px">
            Flow's
          </Typography>
          <Grid container spacing={2} style={{ marginTop: "1px" }}>
            {flowInstances
              .filter((flowInstance) => flowInstance.folderId === null)
              .map((flowInstance) => (
                <Grid item xs={12} sm={6} md={4} key={flowInstance.flowId}>
                  <Paper elevation={3} style={{ padding: "16px" }}>
                    <Link href={`Dashboard/Flow/${flowInstance.flowId}`} passHref>
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
                  </Paper>
                </Grid>
              ))}
          </Grid>
          {/* <DeleteFlowDialog
            open={confirmOpen}
            onClose={handleConfirmClose}
            onDelete={deleteFlow}
            flowToDelete={flowToDelete}
          /> */}
        </div>
      </div>
    </div>
  );
}
export default Flow_Dashboard;