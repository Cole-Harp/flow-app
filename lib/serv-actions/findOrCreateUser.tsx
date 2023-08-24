import { auth, clerkClient } from "@clerk/nextjs";
import prisma_db from "@/lib/prisma_db";

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
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.emailAddresses[0].emailAddress;
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
