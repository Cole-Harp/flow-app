"use server";

import prisma_db from "../prisma_db";

export async function updateDoc(docId: string, content: string) {
  console.log("UpdateDoc", content, "DOCID", docId)
  const docs = await prisma_db.doc.update({
    where: { docId },
    data: { textEditorContent: content },
  });
  console.log(docs.content)
  return docs;

}
