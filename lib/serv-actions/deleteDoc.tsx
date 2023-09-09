"use server";


import prisma_db from "../prisma_db";

export async function deleteDoc(docId: string) {
  await prisma_db.doc.delete({
    where: { docId: docId },
  });
   
    }