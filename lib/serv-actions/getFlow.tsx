"use server";
import prisma_db from "../prisma_db";
 
// export const revalidate = 3600

export async function getFlow(flowId: string) {
  const flow = await prisma_db.flowInstance.findUnique({
    where: { flowId },
  });
  console.log("getFlow:", flow)

  return flow
   
    };