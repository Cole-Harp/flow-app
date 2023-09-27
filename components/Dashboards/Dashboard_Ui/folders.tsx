"use client";

import { useState } from "react";
import qs from "query-string";
import { Folder } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateFolderDialog } from "../Dialogs/CreateFolderDialog";
import { cn } from "@/lib/utils";
import { createFolder } from "@/lib/serv-actions/Folder";

interface FlowProps {
  data: Folder[];
}

export const Folders = ({ data }: FlowProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);

  const folderId = searchParams.get("folderId");

  const onClick = (id: string | undefined) => {
    const query = { folderId: id };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  const handleCreateFolder = async (name: string) => {
    createFolder(name)
  };

  return (
    <div>
    <div className="marw-full overflow-x-auto space-x-2 flex p-0 my-2">
      <button
        onClick={() => onClick(undefined)}
        className={cn(
          `
          flex 
          items-center 
          text-center 
          text-xs 
          md:text-sm 
          px-2 
          md:px-4 
          py-2 
          md:py-3 
          rounded-md 
          bg-primary/10 
          hover:opacity-75 
          transition
        `,
          !folderId ? "bg-primary/25" : "bg-primary/10"
        )}
      >
        Newest
      </button>
      {data.map((item) => (
        <button
          onClick={() => onClick(item.folderId)}
          className={cn(
            `
            flex 
            items-center 
            text-center 
            text-xs 
            md:text-sm 
            px-2 
            md:px-4 
            py-2 
            md:py-3 
            rounded-md 
            bg-primary/10 
            hover:opacity-75 
            transition
          `,
            item.folderId === folderId ? "bg-primary/25" : "bg-primary/10"
          )}
          key={item.folderId}
        >
          {item.name}
        </button>
      ))}
      <button
        onClick={() => setDialogOpen(true)}
        className="flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition"
      >
        New Folder
      </button>
      <CreateFolderDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onCreate={handleCreateFolder}
        />
    </div>
    </div>
  );
};
