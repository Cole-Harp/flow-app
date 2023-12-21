
"use server";
import prisma_db from '../prisma_db';
import { FindOrCreateUser } from './Auth';

export const createTask = async (
    newTaskTitle: string,
  ) => {
    if (newTaskTitle) {
      const id = (await FindOrCreateUser()).id;
      const addedTask = await prisma_db.task.create({
        data: {
          userId: id, // Assuming userId should be an integer
          title: newTaskTitle,
          completed: false,
        },
      });
      // Transform addedTask to match TaskItemOptions type if necessary
    return addedTask;
    }
  };

  import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();
  
  export const updateTask = async (
    taskId: string,
    fetchTaskBreakdown?: string
  ) => {
    if (fetchTaskBreakdown !== undefined) {
      const id = (await FindOrCreateUser()).id;
      const updatedTask = await prisma.task.update({
        where: {
          id: taskId,
          userId: id, // Assuming userId should be an integer
        },
        data: {
          breakdown: fetchTaskBreakdown,
        },
      });
  
      // Transform updatedTask to match TaskItemOptions type if necessary
      return updatedTask;
    }
  };
  


export const getTasks = async () => {
    const id = (await FindOrCreateUser()).id;
const tasks = await prisma_db.task.findMany({

    where: {
        userId: id
    }
    // ,
    // orderBy: {
    //   createdAt: "desc",
    // },
});
return tasks;
  };