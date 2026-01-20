import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./ChatWindow.css";

const ChatWindow = ({ history, isTyping }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Only scroll if there is a real conversation happening
    if (history && history.length > 1) {
      // Logic: Scroll the parent container, not the whole screen
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end", // This keeps the scroll internal to the div
      });
    }
  }, [history, isTyping]);
  return (
    <div className="chatwindow">
      <div className="messages-list">
        {history.map((msg, index) => (
          <div key={index} className={`message-row ${msg.role}-row`}>
            <div className="message-bubble">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {/* THE LOADING INDICATOR */}
        {isTyping && (
          <div className="message-row assistant-row">
            <div className="message-bubble typing-bubble">
              <div className="dot-flashing"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} style={{ height: "1px" }} />
      </div>
    </div>
  );
};

export default ChatWindow;
