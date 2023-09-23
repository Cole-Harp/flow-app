import ChatComponent from "./ChatBox/ChatComponent";
import ChatSideBar from "./ChatBox/ChatSideBar";
import PDFViewer from "./ChatBox/PDFViewer";
// import { prisma_db } from "../../../lib/prisma_db";

// import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
// import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const dummyChats = [
    {
      id: 1,
      pdfName: "Chat 1",
      pdfUrl: "https://example.com/pdf1.pdf",
      createdAt: new Date(),
      userId: "1",
      fileKey: "1",
    },
    {
      id: 2,
      pdfName: "Chat 2",
      pdfUrl: "https://example.com/pdf2.pdf",
      createdAt: new Date(),
      userId: "1",
      fileKey: "1",
    },
  ];

const ChatPage = ({ params: { chatId } }: Props) => {
//   const { userId } = await auth();
//   if (!userId) {
//     return redirect("/sign-in");
//   }
//   const _chats = 
//   await db.select().from(chats).where(eq(chats.userId, userId));
//   if (!_chats) {
//     return redirect("/");
//   }
//   if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
//     return redirect("/");
//   }

  const currentChat = dummyChats.find((chat) => chat.id === parseInt(chatId));
//   const isPro = await checkSubscription();

  return (
    <div className="flex max-h-1/2">
      <div className="flex w-full max-h-fit">
        {/* pdf viewer */}
        <div className="max-h-1/2 p-4 flex-[5]">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;