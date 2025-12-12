/**
 * Messages Display Component
 * Shows chat messages and loading state with auto-scroll
 */

"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { ChatMessage, ChatConversation } from "@/lib/types";
import { AuditDialog } from "@/components/custom-ui/AuditDialog";

interface MessagesDisplayProps {
  conversation: ChatConversation | undefined;
  isCalculating: boolean;
}

export function MessagesDisplay({
  conversation,
  isCalculating,
}: MessagesDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, isCalculating]);

  if (!conversation || conversation.messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-4xl tracking-wide font-semibold text-white">
          Let's Calculate Your Taxes
        </h1>
        <p className="text-neutral-400 text-sm">
          Tell me about your business or investments to get started
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full pr-4">
      <div className="space-y-4 flex flex-col p-4">
        {conversation.messages.map((msg) => (
          <MessageBlock
            key={msg.id}
            message={msg}
          />
        ))}
        {isCalculating && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

function MessageBlock({ message }: { message: ChatMessage }) {
  return (
    <div className="space-y-2">
      <div
        className={cn(
          "rounded-lg p-4 max-w-3xl z-100 relative",
          message.role === "user"
            ? "bg-[#262626] border text-white ml-auto w-fit max-w-xl"
            : "bg-[#171717] text-white break-words"
        )}
      >
        {message.role === "assistant" ? (
          <div className="space-y-2 text-sm">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="text-sm text-white mb-2">{children}</p>
                ),
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold text-white mt-3 mb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-bold text-white mt-2 mb-1">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold text-white mt-2 mb-1">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-white mb-2 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-white mb-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-sm text-white ml-2">{children}</li>
                ),
                code: ({ children }) => (
                  <code className="bg-neutral-800 text-blue-300 px-2 py-1 rounded text-xs font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-neutral-800 text-blue-300 p-3 rounded text-xs font-mono overflow-x-auto mb-2">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-3 text-neutral-300 italic mb-2">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-white">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-neutral-200">{children}</em>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}
      </div>

      {message.isCalculation && message.calculationData && (
        <div className="max-w-2xl">
          <AuditDialog calculationData={message.calculationData}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Create Payment Schedule & View Audit Options
            </Button>
          </AuditDialog>
        </div>
      )}
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="rounded-lg p-4 max-w-lg bg-neutral-900 text-neutral-100">
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        <p className="text-sm text-neutral-400">Calculating your taxes...</p>
      </div>
    </div>
  );
}
