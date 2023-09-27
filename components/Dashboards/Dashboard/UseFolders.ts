//HOOK
import { useState } from "react";
import { Folder } from "@prisma/client";

type UseFoldersResult = {
  folders: Folder[];
  setFolders: (folders: Folder[] | null) => void;
};

export function useFolders(initialFolders: Folder[]): UseFoldersResult {
  const [folders, setFolders] = useState(initialFolders);

  const updateFolders = (updatedFolders: Folder[]) => {
    setFolders(updatedFolders);
  };

  return {
    folders,
    setFolders: updateFolders,
  };
}
