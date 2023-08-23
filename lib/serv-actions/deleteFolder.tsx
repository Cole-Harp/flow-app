"use server";
import prisma_db from "../prisma_db";


export async function deleteFolder(folderId: string) {
  await prisma_db.folder.delete({
    where: { folderId },
  });
   
    }