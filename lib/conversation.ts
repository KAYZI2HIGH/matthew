/**
 * Helper functions for message and conversation management
 */

import { ChatMessage, ChatConversation } from "@/lib/types";

export function createUserMessage(content: string): ChatMessage {
  return {
    id: Date.now().toString(),
    role: "user",
    content,
    timestamp: new Date(),
  };
}

export function createAssistantMessage(content: string): ChatMessage {
  return {
    id: (Date.now() + 1).toString(),
    role: "assistant",
    content,
    timestamp: new Date(),
  };
}

export function createErrorMessage(error: Error | string): ChatMessage {
  const errorContent = typeof error === "string" ? error : error.message;
  return createAssistantMessage(
    `⚠️ Error: ${errorContent || "Failed to get response. Please try again."}`
  );
}

export function createNewConversation(
  userMessage: ChatMessage,
  title?: string
): ChatConversation {
  return {
    id: Date.now().toString(),
    title:
      title ||
      userMessage.content.substring(0, 30) +
        (userMessage.content.length > 30 ? "..." : ""),
    messages: [userMessage],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function addMessageToConversation(
  conversations: ChatConversation[],
  conversationId: string,
  message: ChatMessage
): ChatConversation[] {
  return conversations.map((conv) => {
    if (conv.id === conversationId) {
      return {
        ...conv,
        messages: [...conv.messages, message],
        updatedAt: new Date(),
      };
    }
    return conv;
  });
}

export function updateConversationTitle(
  conversations: ChatConversation[],
  conversationId: string,
  title: string
): ChatConversation[] {
  return conversations.map((conv) => {
    if (conv.id === conversationId && conv.title === "New chat") {
      return {
        ...conv,
        title,
        updatedAt: new Date(),
      };
    }
    return conv;
  });
}

export function deleteConversationById(
  conversations: ChatConversation[],
  id: string
): ChatConversation[] {
  return conversations.filter((c) => c.id !== id);
}

export function getConversationTitle(message: string): string {
  return message.substring(0, 30) + (message.length > 30 ? "..." : "");
}
