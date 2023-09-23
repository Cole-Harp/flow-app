"use server";
"use server";
import prisma_db from "../prisma_db";
 
// export const revalidate = 3600

export async function getMessages(chatId: number) {
    const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { messages: true },
      });
    
      // Map the returned messages to the correct Message type
      return chat?.messages.map((message) => {
        // Ensure the role has a valid value
        const role = ["function", "system", "user", "assistant"].includes(message.role) ? message.role : "user";
    
        return {
          id: message.id.toString(), // Convert the id from number to string
          chatId: message.chatId,
          content: message.content,
          createdAt: message.createdAt,
          role: role as "function" | "user" | "system" | "assistant",
        };
      }) || [];
   
  }
  