"use server";
import prisma_db from "../prisma_db";
import { cache } from 'react'
import { currentUser } from "@clerk/nextjs";
 
// export const revalidate = 3600

export const createDoc = cache(async (title: string, folderId?) => {
    const _id = (await currentUser()).id
    const newDoc = await prisma_db.doc.create({
        data: {
        title,
        folderId: folderId,
        userId: _id,
        content: ""
        }
    });
    return newDoc
})