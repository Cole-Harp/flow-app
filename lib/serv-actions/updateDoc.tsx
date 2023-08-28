"use server";

"use server";

import prisma_db from "../prisma_db";

export const updateDoc = async (
  docId: string,

  content: any,

) => {
  prisma_db.doc.update({
    where: { docId },
    data: {
      content: JSON.stringify(content),
    },
  });
}
