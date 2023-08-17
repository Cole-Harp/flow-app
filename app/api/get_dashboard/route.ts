import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  console.log(id, "HERE");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
    return;
  }

  try {
    const flowInstances = await prisma.flowInstance.findMany({
      where: { userId: Number(id) },
    });

    const folders = await prisma.folder.findMany({
      where: { userId: Number(id) },
    });

    res.json({ flowInstances, folders });
  } catch (error) {
    return res.json({ error: "An error occurred while fetching data." });
  }
}
