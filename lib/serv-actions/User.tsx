"use server";

import { auth } from "@clerk/nextjs";
import prisma_db from "@/lib/prisma_db";

export async function findOrCreateUser() {
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
    const userEmail = user.emailAddresses[0].toString();
    const userName = user.username;
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
