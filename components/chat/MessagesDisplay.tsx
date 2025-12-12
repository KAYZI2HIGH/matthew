/**
 * Messages Display Component
 * Shows chat messages and loading state
 */

"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage, ChatConversation } from "@/lib/types";

interface MessagesDisplayProps {
  conversation: ChatConversation | undefined;
  isCalculating: boolean;
}

export function MessagesDisplay({
  conversation,
  isCalculating,
}: MessagesDisplayProps) {
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
    <div className="space-y-4">
      {conversation.messages.map((msg) => (
        <MessageBlock
          key={msg.id}
          message={msg}
        />
      ))}
      {isCalculating && <LoadingIndicator />}
    </div>
  );
}

function MessageBlock({ message }: { message: ChatMessage }) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 max-w-lg z-100 relative",
        message.role === "user"
          ? "bg-[#262626] border text-white ml-auto w-md"
          : "bg-[#171717] text-white"
      )}
    >
      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
