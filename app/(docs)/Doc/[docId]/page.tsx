"use client";

import "@/app/styles/prosemirror.css";
import { Handle, Position } from "reactflow";
import Editor from "@/TipTapEditor/editor";
import React, { useEffect, useState } from "react";
import { getDoc } from "@/lib/serv-actions/getDoc";
import { updateDoc } from "@/lib/serv-actions/updateDoc";
import { JsonValue } from "@prisma/client/runtime/library";


const EditorComponent = (context: { params: { docId: string; }; }) => {
  const { docId } = context.params;
  const [localContent, setContent] = useState<JsonValue | null>(null);

  const handleSave = (content: string) => {
    console.log("BLOCK NODES", content);
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

  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(6vh)]">
      <Editor id={docId} onChange={setContent} onSave={handleSave} defaultContent={localContent} />
    </div>
  );
};

export default EditorComponent;