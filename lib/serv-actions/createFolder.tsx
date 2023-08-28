"use server";
import prisma_db from "../prisma_db";
import { cache } from 'react'
import { currentUser } from "@clerk/nextjs";
 
// export const revalidate = 3600

export const createFolder = cache(async (name: string) => {
  const id = (await currentUser()).id
    const newFolder = await prisma_db.folder.create({
      data: {
        name,
        userId: id,
      },
    });
    return newFolder
})