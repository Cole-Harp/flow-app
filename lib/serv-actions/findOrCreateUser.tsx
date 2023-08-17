import { auth } from "@clerk/nextjs";
import prisma_db from "@/lib/prisma_db";

export async function findOrCreateUser(email?, name?) {
  console.log("MADE IT?")
  const userId = auth().userId;
  const existingUser = await prisma_db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  const newUser = await prisma_db.user.create({
    data: {
      clerkUserId: userId,
      email: email || "filler",
      name: name || "Bob",
    },
  });

  return newUser;
}