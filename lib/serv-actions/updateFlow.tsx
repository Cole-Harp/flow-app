"use server";

import prisma_db from "../prisma_db";

export const updateFlow = async (
  flowId: string,
  nodes: any,
  edges: any,
) => {
  await prisma_db.flowInstance.update({
    where: { flowId },
    data: {
      nodes: nodes,
      edges: edges,
    },
  });
}
