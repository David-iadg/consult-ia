import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  id?: string;
  height?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'align',
  'link', 'image'
];

export function RichTextEditor({
  value,
  onChange,
  className,
  placeholder,
  id,
  height = '300px'
}: RichTextEditorProps) {
  // Quill hooks into the DOM directly, so we need to make sure it's only rendered on the client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className={cn(
          "w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", 
          className
        )}
        style={{ height }}
      >
        {value || placeholder}
      </div>
    );
  }

  return (
    <div className={cn("rich-text-editor-container", className)}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height }}
        id={id}
      />
      <style>{`
        .rich-text-editor-container .ql-container {
          border-bottom-right-radius: 0.375rem;
          border-bottom-left-radius: 0.375rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          min-height: ${height};
        }
        .rich-text-editor-container .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        .rich-text-editor-container .ql-editor {
          min-height: ${height};
          max-height: calc(${height} * 1.5);
          overflow-y: auto;
        }
        .rich-text-editor-container .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}