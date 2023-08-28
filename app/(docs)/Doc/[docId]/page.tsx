"use client";

import "@/app/styles/prosemirror.css";
import { Handle, Position } from "reactflow";
import Editor from "@/TipTapEditor/editor";
import React, { useEffect, useState } from "react";
import { getDoc } from "@/lib/serv-actions/getDoc";



const EditorComponent = (context: { params: { docId: string; }; }) => {
  const { docId } = context.params;
  const [localContent, setContent] = useState<string>("");

  const handleSave = (content: string) => {
    console.log("BLOCK NODES");

  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedDoc = await getDoc(docId);
      setContent(fetchedDoc.content)
    };

    fetchData();
  }, [docId]);

  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(6vh)]">
      <Editor id={docId} onChange={setContent} onSave={handleSave} defaultContent={localContent} />
    </div>
  );
};

export default EditorComponent;
