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


export async function deleteFolder(folderId: string) {
    await prisma_db.folder.delete({
        where: { folderId },
    });

}

// export const revalidate = 3600

export async function getFolder(folderId: string) {
    const folder = await prisma_db.folder.findUnique({
        where: { folderId },
    });

    return folder

}