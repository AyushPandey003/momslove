'use client';

import { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize editor content when component mounts
  useEffect(() => {
    setMounted(true);
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Update external value when editor content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Handle toolbar buttons
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleContentChange();
    editorRef.current?.focus();
  };

  if (!mounted) {
    return <div className="h-64 border rounded-md bg-gray-50"></div>;
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-500 border-b border-gray-300">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 rounded hover:bg-gray-200"
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 rounded hover:bg-gray-200"
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-2 rounded hover:bg-gray-200"
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h1>')}
          className="p-2 rounded hover:bg-gray-200"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="p-2 rounded hover:bg-gray-200"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h3>')}
          className="p-2 rounded hover:bg-gray-200"
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<p>')}
          className="p-2 rounded hover:bg-gray-200"
          title="Paragraph"
        >
          P
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 rounded hover:bg-gray-200"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 rounded hover:bg-gray-200"
          title="Numbered List"
        >
          1. List
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter the URL:');
            if (url) execCommand('createLink', url);
          }}
          className="p-2 rounded hover:bg-gray-200"
          title="Insert Link"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter the image URL:');
            if (url) execCommand('insertImage', url);
          }}
          className="p-2 rounded hover:bg-gray-200"
          title="Insert Image"
        >
          Image
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-64 p-4 focus:outline-none prose max-w-none"
        onInput={handleContentChange}
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
} 