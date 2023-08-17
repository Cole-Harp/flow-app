
"use server";

import { FlowInstance } from "@prisma/client";
import prisma_db from "../prisma_db";
import { currentUser } from "@clerk/nextjs";
import { cache } from 'react'


export const createFlow = cache(async(title: string, folderId?) => {
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
  
export const createFolder = cache(async (name: string) => {
    const id = (await currentUser()).id
      const newFolder = await prisma_db.folder.create({
        data: {
          name,
          userId: id,
        },
      });
  })