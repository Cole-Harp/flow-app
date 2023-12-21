import { Editor } from "@tiptap/core";

export const getAllText = (editor: Editor) => {
  const doc = editor.state.doc;
  // Get the entire text content from the start to the end of the document
  return doc.textBetween(0, doc.content.size, "\n");
};
