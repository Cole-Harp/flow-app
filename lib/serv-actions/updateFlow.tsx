"use server";
import { FlowInstance } from "@prisma/client";
import prisma_db from "../prisma_db";

export const updateFlow = async (
  flowId: string,
  title: string,
  nodes: any,
  edges: any
) => {
  const updatedFlow = await prisma_db.flowInstance.update({
    where: { flowId },
    data: {
      title,
      nodes: nodes,
      edges: edges,
    },
  });
}
