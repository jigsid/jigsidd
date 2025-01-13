"use client"
import React, { useEffect } from 'react';

const ChatbotIframe = () => {
  useEffect(() => {
    const iframe = document.createElement("iframe");

    const iframeStyles = (styleString: string) => {
      const style = document.createElement('style');
      style.textContent = styleString;
      document.head.append(style);
    };

    iframeStyles(`
      .chat-frame {
        position: fixed;
        bottom: 20px;
        right: 20px;
        border: none;
        z-index: 999;
        max-width: 350px;
        max-height: 646px;
        border-radius: 10px;
      }
    `);

    iframe.src = "https://jj-smartrep.vercel.app/chatbot";
    iframe.classList.add('chat-frame');
    document.body.appendChild(iframe);

    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== "https://jj-smartrep.vercel.app") return null;
      
      try {
        const data = JSON.parse(e.data);
        
        // Handle dimensions update
        if (data.type === 'dimensions') {
          iframe.style.width = data.width + 'px';
          iframe.style.height = data.height + 'px';
        }
        
        // Handle chat reply
        if (data.type === 'reply') {
          iframe.contentWindow?.postMessage({
            type: 'replyContext',
            messageId: data.messageId,
            threadId: data.threadId,
            content: data.content
          }, "https://jj-smartrep.vercel.app");
        }

        // Send initial auth token
        iframe.contentWindow?.postMessage({
          type: 'auth',
          token: "f48ca40d-8e2d-4d61-a558-09f816c711ea"
        }, "https://jj-smartrep.vercel.app");

      } catch (error) {
        console.error('Invalid message data:', e.data);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.body.removeChild(iframe);
    };
  }, []);

  return null;
};

export default ChatbotIframe;
  