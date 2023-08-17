"use server";
import prisma_db from "../prisma_db";
import { cache } from 'react'
import { currentUser } from "@clerk/nextjs";
 
// export const revalidate = 3600

export async function deleteFlow(flowId: string) {
  const flow = await prisma_db.flowInstance.delete({
    where: { flowId },
  });
   
    };