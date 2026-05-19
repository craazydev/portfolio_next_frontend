'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useState, useCallback } from 'react';
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered,
  Heading1, Heading2, Heading3, Quote, Minus, Link2,
  CodeSquare, Undo, Redo, FileCode,
} from 'lucide-react';

const lowlight = createLowlight(common);

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

function ToolbarBtn({
  onClick, active, title, children,
}: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded-lg text-xs transition-all ${
        active
          ? 'bg-cyan-400/20 text-cyan-400'
          : 'text-muted hover:text-light hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichEditor({ value, onChange, placeholder = 'Start writing...', minHeight = 280 }: Props) {
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceHtml, setSourceHtml] = useState(value || '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // replaced by lowlight version
      }),
      Link.configure({ openOnClick: false }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setSourceHtml(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose-editor focus:outline-none',
        style: `min-height:${minHeight}px; padding: 16px;`,
      },
    },
  });

  const syncFromSource = useCallback(() => {
    if (editor && sourceMode) {
      editor.commands.setContent(sourceHtml);
      onChange(sourceHtml);
    }
  }, [editor, sourceMode, sourceHtml, onChange]);

  const toggleSource = () => {
    if (!sourceMode) {
      // entering source mode — snapshot current HTML
      const html = editor?.getHTML() || '';
      setSourceHtml(html);
    } else {
      // leaving source mode — push raw HTML back into editor
      editor?.commands.setContent(sourceHtml);
      onChange(sourceHtml);
    }
    setSourceMode(s => !s);
  };

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (!url) return;
    editor?.chain().focus().setLink({ href: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-[#1a1a2e] bg-[#0a0a14] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-[#1a1a2e] bg-[#080810]">
        {/* Headings */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={14} />
        </ToolbarBtn>

        <div className="w-px h-5 bg-[#1a1a2e] mx-1" />

        {/* Inline formatting */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')} title="Bold">
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')} title="Italic">
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')} title="Inline code">
          <Code size={14} />
        </ToolbarBtn>

        <div className="w-px h-5 bg-[#1a1a2e] mx-1" />

        {/* Lists */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')} title="Bullet list">
          <List size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')} title="Blockquote">
          <Quote size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')} title="Code block">
          <CodeSquare size={14} />
        </ToolbarBtn>

        <div className="w-px h-5 bg-[#1a1a2e] mx-1" />

        <ToolbarBtn onClick={setLink} active={editor.isActive('link')} title="Insert link">
          <Link2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <Minus size={14} />
        </ToolbarBtn>

        <div className="w-px h-5 bg-[#1a1a2e] mx-1" />

        {/* Undo/Redo */}
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={14} />
        </ToolbarBtn>

        {/* Source toggle — right side */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={toggleSource}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              sourceMode
                ? 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                : 'text-muted hover:text-light hover:bg-white/5 border border-transparent'
            }`}
          >
            <FileCode size={13} />
            {sourceMode ? 'Visual' : 'Source'}
          </button>
        </div>
      </div>

      {/* Editor area */}
      {sourceMode ? (
        <textarea
          value={sourceHtml}
          onChange={(e) => setSourceHtml(e.target.value)}
          onBlur={syncFromSource}
          className="w-full bg-[#0a0a14] text-cyan-300/80 font-mono text-xs resize-y focus:outline-none p-4"
          style={{ minHeight: `${minHeight}px` }}
          spellCheck={false}
          placeholder="<p>Raw HTML...</p>"
        />
      ) : (
        <EditorContent editor={editor} />
      )}

      <style>{`
        .prose-editor h1 { font-size: 1.5rem; font-weight: 800; color: #f1f5f9; margin: 0.75rem 0; }
        .prose-editor h2 { font-size: 1.25rem; font-weight: 700; color: #f1f5f9; margin: 0.6rem 0; }
        .prose-editor h3 { font-size: 1.05rem; font-weight: 600; color: #f1f5f9; margin: 0.5rem 0; }
        .prose-editor p  { color: #94a3b8; font-size: 0.875rem; line-height: 1.7; margin: 0.4rem 0; }
        .prose-editor a  { color: #00d4ff; text-decoration: underline; }
        .prose-editor strong { color: #f1f5f9; font-weight: 700; }
        .prose-editor em { font-style: italic; }
        .prose-editor s  { text-decoration: line-through; }
        .prose-editor code { background: #1a1a2e; color: #00d4ff; padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.8em; font-family: monospace; }
        .prose-editor pre { background: #0d0d1a; border: 1px solid #1a1a2e; border-radius: 8px; padding: 1rem; margin: 0.75rem 0; overflow-x: auto; }
        .prose-editor pre code { background: none; color: #a5f3fc; padding: 0; font-size: 0.8rem; }
        .prose-editor ul { list-style: disc; padding-left: 1.25rem; color: #94a3b8; font-size: 0.875rem; }
        .prose-editor ol { list-style: decimal; padding-left: 1.25rem; color: #94a3b8; font-size: 0.875rem; }
        .prose-editor li { margin: 0.2rem 0; }
        .prose-editor blockquote { border-left: 3px solid #00d4ff; padding-left: 1rem; color: #64748b; font-style: italic; margin: 0.75rem 0; }
        .prose-editor hr { border: none; border-top: 1px solid #1a1a2e; margin: 1rem 0; }
        .prose-editor p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #334155; pointer-events: none; float: left; height: 0; }
      `}</style>
    </div>
  );
}
