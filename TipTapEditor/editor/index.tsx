

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { useDebouncedCallback } from "use-debounce";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";
import DEFAULT_EDITOR_CONTENT from "./default-content";
import { EditorBubbleMenu } from "./components/EditorBubbleMenu";
import { getPrevText } from "./getPrevText";
import { ImageResizer } from "./image-resizer";
import { updateDoc } from "@/lib/serv-actions/Doc";
import { JsonValue } from "@prisma/client/runtime/library";

type TNote = {
  id: string;
  defaultContent: JsonValue;
  newQuery: string;
  onSave: (content: string) => void;
  onChange: (content: string) => void;
};

export default function Editor({ id, defaultContent, newQuery, onSave, onChange }: TNote) {
  const [content, setContent] = useState(defaultContent as string);
  const [query, setQuery] = useState(newQuery || "");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [hydrated, setHydrated] = useState(false);
  const [currApi, setCurrApi] = useState('/api/generate');

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON();
    setSaveStatus("Saving...");
    setContent(json)
    onChange(json);
    onSave(json);
    // await updateDoc(id, json);
    // Simulate a delay in saving.
    setTimeout(() => {
      setSaveStatus("Saved");
    }, 500);
  },1000);

  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
      setSaveStatus("Unsaved");
      const selection = e.editor.state.selection;
      
      // const json_ = JSON.stringify(e.editor.getJSON());
      // updateNodeText(id, json_);
      const lastTwo = getPrevText(e.editor, {
        chars: 2,
      });
      if (lastTwo === "++" && !isLoading) {
        e.editor.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from,
        });
        complete(
          getPrevText(e.editor, {
            chars: 5000,
          }),
        );
        va.track("Autocomplete Shortcut Used");
      } 
      else {
        debouncedUpdates(e);
      }
    },
    autofocus: "end",
    
  });

  const { complete, completion, isLoading, stop } = useCompletion({
    id: id,
    api: currApi,
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: (err) => {
      toast.error(err.message);
      if (err.message === "You have reached your request limit for the day.") {
        va.track("Rate Limit Reached");
      }
    },
  });

  const prev = useRef("");

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

  useEffect(() => {
    // if user presses escape or cmd + z and it's loading,
    // stop the request, delete the completion, and insert back the "++"
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
        stop();
        if (e.key === "Escape") {
          editor?.commands.deleteRange({
            from: editor.state.selection.from - completion.length,
            to: editor.state.selection.from,
          });
        }
        editor?.commands.insertContent("++");
      }
    };
    const mousedownHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stop();
      if (window.confirm("AI writing paused. Continue?")) {
        complete(editor?.getText() || "");
      }
    };
    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("mousedown", mousedownHandler);
    } else {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    };
  }, [stop, isLoading, editor, complete, completion.length]);


  const handleGenerateQuestions = () => {
    if (!editor) return;
    setCurrApi('/api/generateQuestions');
    complete(`${getPrevText(editor, {
        chars: 1000,
      })}`);
  };

  useEffect(() => {
    if (query) {
      setCurrApi('/api/generate');
      complete(query);
      setQuery("");
      va.track("Autocomplete Shortcut Used");
    }
  }, [query]);




  // Hydrate the editor with the content.
  useEffect(() => {
    if (editor && content && !hydrated) {
      editor.commands.setContent(content);
      setHydrated(true);
    }

  }, [ editor, content, hydrated]);

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className="relative h-full w-full border-stone-200 bg-white p-4 px-4  sm:rounded-lg sm:border sm:px-4 sm:shadow-lg "
    >
      <div className="absolute right-5 top-5 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
        {saveStatus}
      </div>
      {editor && <EditorBubbleMenu editor={editor} />}
      {editor?.isActive("image") && <ImageResizer editor={editor} />}
      <EditorContent editor={editor} />
      {id.startsWith("learn-") && (
        <button onClick={handleGenerateQuestions}>Generate Questions</button>
      )}
    </div>
  );
}