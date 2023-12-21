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
  initial_folders: any[];
}

const Flow_Dashboard: React.FC<FlowDashboardProps> = ({ initial_folders }) => {


  return (
    <div className="container ">
      Recent Docs
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initial_folders.map((folder) => (
          <FolderComponent
            key={folder.folderId}
            title={folder.name}
            folder={folder}
            flowInstances={folder.flowInstances}
            docs={folder.docs}
            onDeleteFlow={undefined}
            onDeleteDoc={undefined}
            onDeleteFolder={undefined}
            onFavoriteFolder={undefined}
            onConfirmOpen={undefined}
            onCreate={undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default Flow_Dashboard;