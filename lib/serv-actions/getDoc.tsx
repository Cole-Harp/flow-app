"use server";
import prisma_db from "../prisma_db";
 
// export const revalidate = 3600

export async function getDoc(docId: string) {
  const doc = await prisma_db.doc.findUnique({
    where: { docId },
  });
  console.log("getDoc:", doc.textEditorContent)

  return doc
  }