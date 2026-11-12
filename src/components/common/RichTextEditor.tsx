import { useRef, useEffect, useState, type FC } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Eraser,
  Undo,
  Redo,
} from "lucide-react";

/**
 * Komponen RichTextEditor (WYSIWYG)
 *
 * Menggunakan contentEditable browser API native yang ringan, fleksibel,
 * mendukung React 19 tanpa dependensi pihak ketiga yang rentan peer-dep conflict.
 * Menghasilkan markup HTML yang bersih dan aman disimpan ke Cloud Firestore.
 */

interface RichTextEditorProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: FC<RichTextEditorProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = "Write detailed project breakdown, architecture, engineering challenges...",
  minHeight = "200px",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Inisialisasi konten dari props ke editor DOM jika berbeda
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePromptLink = () => {
    const url = window.prompt("Enter link URL (e.g. https://...):");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  return (
    <div className="w-full space-y-1.5 font-sans text-black">
      {label && (
        <label htmlFor={id} className="block text-xs font-black uppercase tracking-wider">
          {label}
        </label>
      )}

      <div
        className={`border-2 border-black bg-white shadow-neo-sm transition-all ${
          isFocused ? "ring-2 ring-black bg-neutral-50/30" : ""
        }`}
      >
        {/* Toolbar WYSIWYG */}
        <div className="flex flex-wrap items-center gap-1 p-1.5 bg-neutral-100 border-b-2 border-black select-none">
          {/* Text Style */}
          <button
            type="button"
            onClick={() => executeCommand("bold")}
            title="Bold"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("italic")}
            title="Italic"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("underline")}
            title="Underline"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <span className="w-[1px] h-5 bg-black mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<h1>")}
            title="Heading 1"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<h2>")}
            title="Heading 2"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<h3>")}
            title="Heading 3"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <span className="w-[1px] h-5 bg-black mx-1" />

          {/* Lists & Quote */}
          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            title="Bullet List"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            title="Numbered List"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<blockquote>")}
            title="Blockquote"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<pre>")}
            title="Code Block"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <span className="w-[1px] h-5 bg-black mx-1" />

          {/* Link & Clear */}
          <button
            type="button"
            onClick={handlePromptLink}
            title="Insert Link"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("removeFormat")}
            title="Clear Formatting"
            className="p-1.5 border border-black bg-white hover:bg-[#fb7185] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => executeCommand("undo")}
              title="Undo"
              className="p-1.5 border border-black bg-white hover:bg-neutral-200 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("redo")}
              title="Redo"
              className="p-1.5 border border-black bg-white hover:bg-neutral-200 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Editable Area */}
        <div
          id={id}
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          data-placeholder={placeholder}
          style={{ minHeight }}
          className="p-3.5 text-xs font-mono focus:outline-none overflow-y-auto prose max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-400 empty:before:pointer-events-none"
        />
      </div>
    </div>
  );
};
