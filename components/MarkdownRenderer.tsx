import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  isUser: boolean;
}

export const MarkdownRenderer: React.FC<Props> = ({ content, isUser }) => {
  return (
    <div className={`prose prose-sm md:prose-base max-w-none ${
      isUser 
        ? 'prose-invert text-slate-800' // User bubble usually has dark text on light bg, keep standard
        : 'prose-slate'
    } 
    /* Specific overrides for cleaner chat look */
    prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-li:my-0.5
    `}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};