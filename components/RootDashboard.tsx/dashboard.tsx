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
import { Folder as FolderComponent } from "../../components/flow_dashboard/Folder";
import { createFolder } from "@/lib/serv-actions/createFolder";
import { deleteFolder } from "@/lib/serv-actions/deleteFolder";
import { createFlow } from "@/lib/serv-actions/createFlow";

interface FlowDashboardProps {
  initial_folder: {
    folderId: string,
    name: string;
    parentId: number;
    userId: string;
  }
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

const RootDashboard: React.FC<FlowDashboardProps> = ({ initial_folder, initial_flows, initial_docs }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);


  const [favoriteFolders, setFavoriteFolders] = useState([]);
  const [folder, setFolders] = useState(initial_folder);
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

  const handleDeleteFlow = async (flowId: string) => {

    setFlowInstances(flowInstances.filter((flow) => flow.flowId !== flowId));
  };

  const handleDeleteDoc = async (docId: string) => {

    setDocs(docs.filter((doc) => doc.docId !== docId));
  };

  const renderFolder = (): JSX.Element => {
    return (
      <div className = "mb-5" key={folder.folderId}>
        <FolderComponent
          folder={folder}
          flowInstances={flowInstances}
          onDeleteFlow={handleDeleteFlow}
          onConfirmOpen={handleConfirmOpen}
          onCreate={createFlow}
          title={""}
          onDeleteFolder={null}
          onFavoriteFolder={handleFavoriteFolder}
          docs={docs} 
          onDeleteDoc={handleDeleteDoc}      />
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginLeft: "0px", marginRight: "20px", marginTop: "12px" }}>
        <div style={{ marginRight: "20px" }}>
        </div>
        <div style={{ marginTop: '24px' }}>
          <Typography variant="h1">
            Root: {folder.name}
          </Typography>
          <div style={{ marginTop: "1px" }}>
            {
              renderFolder()
            }
          </div>
        </div>
      </div>
    </div>
  );
}
export default RootDashboard;