"use client";

import React, { useEffect, useState } from "react";
import Editor from "@/TipTapEditor/editor";
import { getDoc } from "@/lib/serv-actions/Doc";
import { updateDoc } from "@/lib/serv-actions/Doc";
import { Navbar } from "@/components/Layout/navbar";
import { Menu } from "lucide-react";
import { JsonValue } from "@prisma/client/runtime/library";


const EditorComponent = (context: { params: { docId: string } }) => {
  const { docId } = context.params;
  const [localContent, setContent] = useState<string | JsonValue | null>(null);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [notecards, setNotecards] = useState<any>();

  const handleSave = (content: string) => {
    updateDoc(docId, content);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedDoc = await getDoc(docId);
      setContent(fetchedDoc.textEditorContent);
    };

    fetchData();
  }, [docId]);

  if (localContent === null) {
    return <div>Loading...</div>;
  }

  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
  };

  return (
    <div className="flex flex-col">
      <div className="border-b-2 border-gray-600">
        <Navbar />
      </div>

      <div className="flex justify-start items-center h-1/4 pt-16 pl-4">
        <button onClick={toggleChatbot} className="m-4">
          <Menu />
        </button>
      </div>

      {/* {chatbotVisible && <div>Chatbot goes here</div>} */}

      <div className="flex-1 flex flex-col items-center sm:px-5 sm:pt-[calc(2vh)] overflow-auto">
        <Editor
          id={docId}
          onChange={setContent}
          onSave={handleSave}
          defaultContent={localContent}
          newQuery={query}
        />
      </div>

      <div className="flex flex-wrap">
</div>
    </div>
  );
};

export default EditorComponent;
