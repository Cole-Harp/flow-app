"use client";
import {
  Block,
  BlockNoteEditor,
  PartialBlock,
  defaultBlockSchema,
} from "@blocknote/core";
import {
  BlockNoteView,
  getDefaultReactSlashMenuItems,
  ReactSlashMenuItem,
  useBlockNote,
} from "@blocknote/react";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge";
import { relative } from "path";

const configuration = new Configuration({
  apiKey: "YOUR-API-KEY",
});
const openai = new OpenAIApi(configuration);

const insertHelloWorld = (editor: BlockNoteEditor) => {
  const currentBlock: Block = editor.getTextCursorPosition().block;
  const helloWorldBlock: PartialBlock = {
    type: "paragraph",
    content: [{ type: "text", text: "Hello World", styles: { bold: true } }],
  };
  editor.insertBlocks([helloWorldBlock], currentBlock, "after");
  console.log(editor.getBlock(currentBlock));
};

const insertHelloWorldItem: ReactSlashMenuItem = {
  name: "Insert Hello World",
  execute: insertHelloWorld,
  aliases: ["helloworld", "hw"],
  group: "Other",
  icon: <HiOutlineGlobeAlt size={18} />,
  hint: "Used to insert a block with 'Hello World' below.",
};

// const openaiAutocomplete = async (editor: BlockNoteEditor) => {
//   const currentBlock: Block = editor.getTextCursorPosition().block;
//   const prompt = currentBlock.content.map((content) => content).join('');

//   const response = await openai.createChatCompletion({
//     engine: 'davinci-codex',
//     prompt: prompt,
//     max_tokens: 50,
//     n: 1,
//     temperature: 0.5,
//   });

//   const newText = response.data.choices[0].text;

//   const newBlock: PartialBlock = {
//     type: 'paragraph',
//     content: [{ type: 'text', text: newText }],
//   };

//   editor.insertBlocks([newBlock], currentBlock, 'after');
// };

// const openaiAutocompleteItem: ReactSlashMenuItem = {
//   name: 'OpenAI Autocomplete',
//   execute: openaiAutocomplete,
//   aliases: ['autocomplete', 'openai'],
//   group: 'Other',
//   icon: <HiOutlineGlobeAlt size={18} />,
//   hint: 'Used to autocomplete text using OpenAI.',
// };

const customSlashMenuItemList = [
  ...getDefaultReactSlashMenuItems(),
  insertHelloWorldItem,
  // openaiAutocompleteItem,
];

interface BlockNoteProps {
  handleContentChange: (content: Set) => void;
}

const BlockNote: React.FC = () => {
  const editor: BlockNoteEditor = useBlockNote({
    blockSchema: {
      // Adds all default blocks.
      ...defaultBlockSchema,
    },
    theme: "light",
    slashMenuItems: customSlashMenuItemList,
  });
  return (
    <div style={{ position: "relative", width: "590px", minHeight: "200px" }}>
      <BlockNoteView editor={editor} />
    </div>
  );
};

export default BlockNote;
