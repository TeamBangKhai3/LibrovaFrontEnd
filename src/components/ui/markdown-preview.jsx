import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

export function MarkdownPreview({ content, className }) {
    const sanitizedHtml = DOMPurify.sanitize(marked.parse(content || ''));

    return (
        <div 
            className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
        />
    );
}
