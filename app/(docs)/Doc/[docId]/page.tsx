"use client";

import React, { useEffect, useState } from "react";
import Editor from "@/TipTapEditor/editor";
import { getDoc } from "@/lib/serv-actions/Doc";
import { updateDoc } from "@/lib/serv-actions/Doc";
import { generateNotecards } from "@/lib/learn/GenerateNotecards";
import { Navbar } from "@/components/Layout/navbar";
import { Menu } from "lucide-react";
import { JsonValue } from "@prisma/client/runtime/library";

export function Notecard({content}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 m-2 w-64 ">

      <p className=" text-base">{content ?? "None"}</p>
    </div>
  );
}


const EditorComponent = (context: { params: { docId: string } }) => {
  const { docId } = context.params;
  const [localContent, setContent] = useState<string | JsonValue | null>(null);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [notecards, setNotecards] = useState<any>();

  const handleSave = (content: string) => {
    updateDoc(docId, content);
  };

  const handleGenerateNotecards = async () => {
    const generatedNotecards = await generateNotecards(localContent);
    setNotecards(generatedNotecards);
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
        <button onClick={handleGenerateNotecards}>Generate Notecards</button>
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
  {Array.isArray(notecards) ? (
    notecards.map((card, index) => (
      <Notecard key={index} content={card.choices[0].text} />
    ))
  ) : (
    <Notecard content={notecards} />
  )}
</div>
    </div>
  );
};

export default EditorComponent;
