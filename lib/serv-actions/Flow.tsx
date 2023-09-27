
"use server";

import prisma_db from "../prisma_db";
import { currentUser } from "@clerk/nextjs";
import { cache } from 'react'


export const createFlow = cache(async (title: string, folderId?) => {
    const id = (await currentUser()).id;
    const nodes = JSON.stringify([]);
    const edges = JSON.stringify([]);
    const newFlow = await prisma_db.flowInstance.create({
        data: {
            title,
            nodes: nodes,
            edges: edges,
            folderId: folderId,
            userId: id
        },
    });
    return newFlow
});

export async function deleteFlow(flowId: string) {
    await prisma_db.flowInstance.delete({
        where: { flowId },
    });

}

export async function getFlow(flowId: string) {
    const flow = await prisma_db.flowInstance.findUnique({
        where: { flowId },
    });
    console.log("getFlow:", flow)

    return flow

}

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
