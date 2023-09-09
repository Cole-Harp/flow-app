"use server";
import prisma_db from "../prisma_db";
 
// export const revalidate = 3600

export async function getFolder(folderId: string) {
  const folder= await prisma_db.folder.findUnique({
    where: { folderId },
  });

  return folder
   
  }