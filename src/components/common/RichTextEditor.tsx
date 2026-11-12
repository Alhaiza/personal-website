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
  Code2,
} from "lucide-react";

/**
 * Komponen RichTextEditor (WYSIWYG)
 *
 * Mendukung 2 Mode:
 * 1. Visual WYSIWYG Mode (Rich editing langsung).
 * 2. HTML Source Code Mode (<> Source Mode) sehingga user bisa paste tag HTML langsung
 *    (h2, p, ul, li, dll) tanpa ter-escape menjadi teks biasa (&lt;h2&gt;).
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
  const [isSourceMode, setIsSourceMode] = useState(false);

  // Inisialisasi konten dari props ke editor DOM jika berbeda
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value, isSourceMode]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (isSourceMode) return;
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePromptLink = () => {
    if (isSourceMode) return;
    const url = window.prompt("Enter link URL (e.g. https://...):");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  return (
    <div className="w-full space-y-1.5 font-sans text-black">
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={id} className="block text-xs font-black uppercase tracking-wider">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => setIsSourceMode(!isSourceMode)}
          className={`px-2 py-0.5 border border-black font-mono text-[10px] font-black uppercase flex items-center gap-1 shadow-neo-sm cursor-pointer transition-colors ${
            isSourceMode ? "bg-black text-white" : "bg-[#bef264] text-black hover:bg-[#a3e635]"
          }`}
          title="Toggle between WYSIWYG view and raw HTML mode"
        >
          <Code2 className="w-3 h-3" />
          <span>{isSourceMode ? "VISUAL EDITOR" : "HTML SOURCE CODE"}</span>
        </button>
      </div>

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
            disabled={isSourceMode}
            onClick={() => executeCommand("bold")}
            title="Bold"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isSourceMode}
            onClick={() => executeCommand("italic")}
            title="Italic"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isSourceMode}
            onClick={() => executeCommand("underline")}
            title="Underline"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <span className="w-[1px] h-5 bg-black mx-1" />

          {/* Headings */}
          <button
            type="button"
            disabled={isSourceMode}
            onClick={() => executeCommand("formatBlock", "<h1>")}
            title="Heading 1"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isSourceMode}
            onClick={() => executeCommand("formatBlock", "<h2>")}
            title="Heading 2"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isSourceMode}
            onClick={() => executeCommand("formatBlock", "<h3>")}
            title="Heading 3"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <span className="w-[1px] h-5 bg-black mx-1" />

          {/* Lists & Quote */}
          <button
            type="button"
            disabled={isSourceMode}
            onClick={() => executeCommand("insertUnorderedList")}
            title="Bullet List"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isSourceMode}
            onClick={() => executeCommand("insertOrderedList")}
            title="Numbered List"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isSourceMode}
            onClick={() => executeCommand("formatBlock", "<blockquote>")}
            title="Blockquote"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isSourceMode}
            onClick={() => executeCommand("formatBlock", "<pre>")}
            title="Code Block"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <span className="w-[1px] h-5 bg-black mx-1" />

          {/* Link & Clear */}
          <button
            type="button"
            disabled={isSourceMode}
            onClick={handlePromptLink}
            title="Insert Link"
            className="p-1.5 border border-black bg-white hover:bg-[#bef264] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isSourceMode}
            onClick={() => executeCommand("removeFormat")}
            title="Clear Formatting"
            className="p-1.5 border border-black bg-white hover:bg-[#fb7185] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              disabled={isSourceMode}
              onClick={() => executeCommand("undo")}
              title="Undo"
              className="p-1.5 border border-black bg-white hover:bg-neutral-200 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={isSourceMode}
              onClick={() => executeCommand("redo")}
              title="Redo"
              className="p-1.5 border border-black bg-white hover:bg-neutral-200 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Editable Area: Source Code vs Visual ContentEditable */}
        {isSourceMode ? (
          <textarea
            value={value || ""}
            onChange={handleSourceChange}
            placeholder="Paste raw HTML here (e.g. <h2>Title</h2>, <p>Text</p>, <ul><li>Item</li></ul>)..."
            style={{ minHeight }}
            className="w-full p-3.5 text-xs font-mono bg-neutral-900 text-neutral-100 focus:outline-none resize-y"
          />
        ) : (
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
        )}
      </div>
    </div>
  );
};

