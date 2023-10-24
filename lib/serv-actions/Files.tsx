import prisma_db from "../prisma_db";
import {  getUser } from "./User";



export async function getUserFiles(docId: string) {
    const userId = (await getUser()).id;
    if (!userId) {
        throw new Error("UNAUTHORIZED NO ID")
      }
    
      const files = await prisma_db.file.findMany({
        where: {
          userId: userId,
        },
      });
    
      return files;
    
}