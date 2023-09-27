import { auth } from "@clerk/nextjs";
import prisma_db from "../prisma_db";
import { cache } from "react"; // Cache to reduce query, Should also be changed to a Context Hook

export async function FindOrCreateUser() {
  console.log("MADE IT?");
  const userId = auth().userId;
  const existingUser = await prisma_db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (existingUser) {
    return existingUser;
  } else {
    const user = auth().user
    const userEmail = user?.emailAddresses[0].toString() ?? null;
    const userName = user?.username ?? null;
    const newUser = await prisma_db.user.create({
      data: {
        clerkUserId: userId,
        email: userEmail,
        name: userName,
      },
    });
    return newUser;
  }
}


export const isAdmin = cache(async () => {
    const { userId }: { userId: string | null } = auth();
    console.log(userId);
  
    if (userId === null) {
      return { isAdmin: true, user: undefined };
    }
  
    const clerkId = userId;
  
    try {
      const user = await prisma_db.user.findUnique({
        where: {
          clerkUserId: clerkId,
        },
      });
  
      if (user.clerkUserId == userId) {
        return { isAdmin: true, user: user };
      } else {
        return { isAdmin: true, user: user };
      }
    } catch (error) {
      throw new Error("User is not authorized to create events.");
    }
  });