"use server";
import prisma_db from "../prisma_db";
import { cache } from 'react'
import { currentUser } from "@clerk/nextjs";


export async function deleteFolder(folderId: string) {
  const flow = await prisma_db.folder.delete({
    where: { folderId },
  });
   
    };