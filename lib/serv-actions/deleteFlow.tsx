"use server";
import prisma_db from "../prisma_db";

export async function deleteFlow(flowId: string) {
  await prisma_db.flowInstance.delete({
    where: { flowId },
  });
   
    }