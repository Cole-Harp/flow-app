"use client"

import React from "react";
import { useState } from "react";
import {
  Button,
  Grid,
  Typography,
} from "@mui/material";
import flow_dashboard_css from "@/app/styles/flow_dashboard.module.css";
import { Folder } from "@prisma/client";
import { CreateFolderDialog } from "./Dialogs/CreateFolderDialog";
import { Folder as FolderComponent } from "../../components/flow_dashboard/Folder";
import { createFolder } from "@/lib/serv-actions/createFolder";
import { deleteFolder } from "@/lib/serv-actions/deleteFolder";
import { createFlow } from "@/lib/serv-actions/createFlow";

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
  initial_docs: Array<{
    docId,
    title,
    folderId,
    userId,
    createdAt,
    updatedAt,

  }>;
}

const Flow_Dashboard: React.FC<FlowDashboardProps> = ({ initial_folders, initial_flows, initial_docs }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);


  const [favoriteFolders, setFavoriteFolders] = useState([]);
  const [folders, setFolders] = useState(initial_folders || []);
  const [flowInstances, setFlowInstances] = useState(initial_flows || []);
  const [docs, setDocs] = useState(initial_docs || []);
  

  const handleConfirmOpen = (folder?: Folder) => {
    if (folder) {
      setFolderToDelete(folder);
      setConfirmOpen(true);
    }
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleFavoriteFolder = (folder) => {
    if (favoriteFolders.some((favFolder) => favFolder.folderId === folder.folderId)) {
      setFavoriteFolders(favoriteFolders.filter((favFolder) => favFolder.folderId !== folder.folderId));
    } else {
      setFavoriteFolders([...favoriteFolders, folder]);
    }
  };


  const handleCreateNewFolder = async (name: string) => {
    const newFolder = await createFolder(name)

    console.log(newFolder);
    setFolders([...folders, newFolder]);

    setFolderDialogOpen(false);
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolder(folderId)
      setFolders(folders.filter((folder) => folder.folderId !== folderId));
        handleConfirmClose();
      
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const handleDeleteFlow = async (flowId: string) => {

    setFlowInstances(flowInstances.filter((flow) => flow.flowId !== flowId));
  };

  return (
    <div>
      <div style={{ marginLeft: "0px", marginRight: "20px", marginTop: "12px" }}>
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
        <div style={{ marginTop: '24px' }}>
        {/* {favoriteFolders.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <Typography variant="h4" component="h1" marginTop="10px">
              Favorite Folders
            </Typography>
            <Grid container spacing={2} style={{ marginTop: '1px' }}>
              {favoriteFolders.map((folder) => {
                const folderFlowInstances = flowInstances.filter(
                  (flowInstance) => flowInstance.folderId === folder.folderId,
                );

                const folderDocs = flowInstances.filter(
                  (doc) => doc.folderId === folder.folderId,
                );

                return (
                  <Grid item xs={12} sm={6} md={4} key={folder.folderId}>
                    <FolderComponent
                      docs={folderDocs}
                      folder={folder}
                      flowInstances={folderFlowInstances}
                      onDeleteFlow={handleDeleteFlow}
                      onConfirmOpen={handleConfirmOpen}
                      onCreate={createFlow}
                      title={''}
                      onDeleteFolder={handleDeleteFolder}
                      onFavoriteFolder={handleFavoriteFolder}                    />
                  </Grid>
                );
              })}
            </Grid>
          </div>
        )} */}
      </div>
          <Typography variant="h4" component="h1" marginTop="10px">
            Folders
          </Typography>
          <Grid container spacing={2} style={{ marginTop: "1px" }}>
            {folders.map((folder) => {
              const folderFlowInstances = flowInstances.filter(
                (flowInstance) => flowInstance.folderId === folder.folderId,
              );

              const folderDocs = docs.filter(
                (doc) => doc.folderId === folder.folderId,
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
                    onFavoriteFolder={handleFavoriteFolder} docs={folderDocs}                  />
                </Grid>
              );
            })}
          </Grid>
        </div>

      </div>
    </div>
  );
}
export default Flow_Dashboard;