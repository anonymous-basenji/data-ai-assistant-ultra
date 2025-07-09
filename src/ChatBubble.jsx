import React from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import './ChatBubble.css';

function ChatBubble({role, message}) {
    const id = Date.now();

    const rawHtml = marked(message, {
        gfm: true,
        breaks: true
    });

    const safeHtml = DOMPurify.sanitize(rawHtml);

    return(
        <div className={role}>
            <p dangerouslySetInnerHTML={{__html: safeHtml}}></p>
        </div>
    )
}

export default ChatBubble;