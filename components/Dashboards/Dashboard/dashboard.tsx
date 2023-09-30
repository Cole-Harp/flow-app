"use client"

import React from "react";
import { useState } from "react";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Folder } from "@prisma/client";
import { CreateDialog } from "../Dialogs/CreateDialog";
import { Folder as FolderComponent } from "./Folder";
import { createFolder } from "@/lib/serv-actions/Folder";
import { deleteFolder } from "@/lib/serv-actions/Folder";
import { createFlow } from "@/lib/serv-actions/Flow";
import { deleteDoc } from "@/lib/serv-actions/Doc";
import { CreateFolderDialog } from "../Dialogs/CreateFolderDialog";
import { SearchInput } from "../Dashboard_Ui/search-input";

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
    deleteFolder(folderId)
    setFolders(folders.filter((folder) => folder.folderId !== folderId));
    handleConfirmClose();
  };

  const handleDeleteDoc = async (docId: string) => {
    setDocs(docs.filter((doc) => doc.docId !== docId));
    handleConfirmClose();
  };

  const handleDeleteFlow = async (flowId: string) => {
    setFlowInstances(flowInstances.filter((flow) => flow.flowId !== flowId));
  };

  if (folders.length === 0) {
    return (
      <><div className="flex" >
        <Typography variant="h1">
          Roots
        </Typography>
        <div className="absolute right-6">
          <Button
            variant="contained"

            onClick={() => setFolderDialogOpen(true)}
            className="flex bg-stone-300 font-display text-stone-900"
          >
            New Root
          </Button>
        </div>
      </div><Paper elevation={1} className=" bg-secondary group relative transition ease-in-out delay-150 mt-2" style={{ paddingLeft: "10px", paddingRight: "10px", paddingTop: "8px", paddingBottom: "10px" }}>

          <div className="text-stone-900 font-display" style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="pl-2">

              <Typography variant="h1">No Roots</Typography>

            </div>



          </div>

          <div className="text-stone-900 font-display" style={{ display: "flex", justifyContent: "center" }}>
            <div className=" bg-inherit " style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", position: 'static' }}>
              <Paper elevation={10} className="bg-white pt-4" style={{ paddingRight: "16px", margin: "5px", position: "static" }}>

                <div className="content-center text-center w-full text-stone-900 font-display">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" className="fill-stone-600 content-center text-center w-full pb-2">
                    <path d="M6 21.5C4.067 21.5 2.5 19.933 2.5 18C2.5 16.067 4.067 14.5 6 14.5C7.5852 14.5 8.92427 15.5538 9.35481 16.9991L15 16.9993V15L17 14.9993V9.24332L14.757 6.99932H9V8.99996H3V2.99996H9V4.99932H14.757L18 1.75732L22.2426 5.99996L19 9.24132V14.9993L21 15V21H15V18.9993L9.35499 19.0002C8.92464 20.4458 7.58543 21.5 6 21.5ZM6 16.5C5.17157 16.5 4.5 17.1715 4.5 18C4.5 18.8284 5.17157 19.5 6 19.5C996Z"></path>
                  </svg>
                  <Typography variant="h5" component="div" className="text-center">
                    No recent flows found.
                  </Typography>
                  <Typography variant="subtitle2" component="div" className="text-center">
                    Updated at: Never
                  </Typography>
                  <IconButton

                    edge="end"
                    color="primary"

                  >

                  </IconButton>

                </div>



              </Paper>


            </div>

            <div className="bg-inherit " style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", position: 'static' }}>

              <Paper elevation={10} className="bg-white pt-4" style={{ paddingRight: "16px", margin: "5px", position: "static" }}>

                <div className="content-center text-center w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" className="fill-stone-800 content-center text-center w-full "><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V4H5V20H19ZM7 6H11V10H7V6ZM7 12H17V14H7V12ZM7 16H17V18H7V16ZM13 7H17V9H13V7Z"></path></svg>

                  <Typography variant="h5" component="div" className="text-center text-stone-900 font-display">
                    No recent docs found.
                  </Typography>
                  <Typography variant="subtitle2" component="div" className="text-center text-stone-900 font-display">
                    Updated at: Never
                  </Typography>
                  <IconButton
                    edge="end"
                    color="primary"
                  >
                  </IconButton>

                </div>



              </Paper>



            </div>




          </div></Paper></>)
  }

  return (
    <div>
      <div style={{ marginLeft: "0px", marginRight: "20px", marginTop: "8px" }}>
        <div className="flex" style={{ marginRight: "20px" }}>
          <Typography variant="h1">
            Roots
          </Typography>
          <div className="absolute right-10">
            
            <Button
              variant="contained"

              onClick={() => setFolderDialogOpen(true)}
              className="flex bg-stone-300 font-display text-stone-900"
            >
              New Root
            </Button>
          </div>
        </div>
        <div className="mt-1">
          <div style={{ marginTop: "1px" }}>
            {folders.map((folder) => {
              const folderFlowInstances = flowInstances.filter(
                (flowInstance) => flowInstance.folderId === folder.folderId,
              );

              const folderDocs = docs.filter(
                (doc) => doc.folderId === folder.folderId,
              );

              return (
                <div className="mb-3" key={folder.folderId}>
                  <FolderComponent
                    folder={folder}
                    flowInstances={folderFlowInstances}
                    onDeleteFlow={handleDeleteFlow}
                    onConfirmOpen={handleConfirmOpen}
                    onCreate={createFlow}
                    title={""}
                    onDeleteFolder={handleDeleteFolder}
                    onFavoriteFolder={handleFavoriteFolder}
                    docs={folderDocs} onDeleteDoc={handleDeleteDoc} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <CreateFolderDialog
        open={folderDialogOpen}
        onClose={() => setFolderDialogOpen(false)}
        onCreate={handleCreateNewFolder}
      />
    </div>
  );
}
export default Flow_Dashboard;