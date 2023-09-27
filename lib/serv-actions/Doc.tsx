"use server";


import prisma_db from "../prisma_db";
import { cache } from 'react'
import { currentUser } from "@clerk/nextjs";

export async function getDoc(docId: string) {
    const doc = await prisma_db.doc.findUnique({
        where: { docId },
    });
    console.log("getDoc:", doc.textEditorContent)

    return doc
}

export const createDoc = cache(async (title: string, folderId?) => {
    const _id = (await currentUser()).id
    const newDoc = await prisma_db.doc.create({
        data: {
            title,
            folderId: folderId,
            userId: _id,
            content: "",
            textEditorContent: "   "
        }
    });
    return newDoc
})

export async function deleteDoc(docId: string) {
    await prisma_db.doc.delete({
        where: { docId: docId },
    });
}

export async function updateDoc(docId: string, content: string) {
    console.log("UpdateDoc", content, "DOCID", docId)
    const docs = await prisma_db.doc.update({
        where: { docId },
        data: { textEditorContent: content },
    });
    console.log(docs.content)
    return docs;

}


