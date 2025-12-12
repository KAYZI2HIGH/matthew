/**
 * Main Chat Component - VercelV0Chat
 * Orchestrates the chat interface with all sub-components
 * Integrates Gemini AI for chat and calculation detection
 */

"use client";

import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatConversation, ChatMessage } from "@/lib/types";
import { useCalculateTax } from "@/lib/hooks";
import {
  createUserMessage,
  createAssistantMessage,
  createErrorMessage,
  createNewConversation,
  addMessageToConversation,
  updateConversationTitle,
  deleteConversationById,
  getConversationTitle,
} from "@/lib/conversation";
import {
  createFormSummary,
  createTaxApiPayload,
  formatTaxResponse,
} from "@/lib/form-helpers";
import {
  sendMessageToGemini,
  detectCalculationResponse,
} from "@/lib/gemini-client";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { MessagesDisplay } from "@/components/chat/MessagesDisplay";
import { ChatInput } from "@/components/chat/ChatInput";
import { ScrollArea } from "../ui/scroll-area";

const STORAGE_KEY = "matthew_conversations";

export function VercelV0Chat() {
  const [value, setValue] = useState("");
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { mutate: calculateTax } = useCalculateTax();

  // Load conversations from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsedConversations = JSON.parse(stored);
          // Convert date strings back to Date objects
          const conversationsWithDates = parsedConversations.map(
            (conv: any) => ({
              ...conv,
              createdAt: new Date(conv.createdAt),
              updatedAt: new Date(conv.updatedAt),
              messages: conv.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            })
          );

          setConversations(conversationsWithDates);

          // Auto-select the most recent conversation
          if (conversationsWithDates.length > 0) {
            setCurrentConversationId(conversationsWithDates[0].id);
            setHasStartedChat(true);
          }
        } catch (error) {
          console.error(
            "Failed to load conversations from localStorage:",
            error
          );
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations, isLoaded]);

  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  );

  const handleNewChat = () => {
    const newConversation: ChatConversation = {
      id: Date.now().toString(),
      title: "New chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations([newConversation, ...conversations]);
    setCurrentConversationId(newConversation.id);
    setValue("");
  };

  const handleStartChat = (message: string) => {
    const userMessage = createUserMessage(message);

    if (!hasStartedChat) {
      setHasStartedChat(true);
      const newConversation = createNewConversation(
        userMessage,
        getConversationTitle(message)
      );
      setCurrentConversationId(newConversation.id);
      setConversations([newConversation]);
      setValue("");
      handleGeminiChat(newConversation.id, [userMessage]);
    } else {
      const updated = addMessageToConversation(
        conversations,
        currentConversationId!,
        userMessage
      );
      setConversations(updated);
      setValue("");

      const currentConv = conversations.find(
        (c) => c.id === currentConversationId
      )!;
      const historyMessages = currentConv.messages.map((msg) => ({
        role: msg.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: msg.content }],
      }));

      handleGeminiChat(currentConversationId!, [
        ...historyMessages,
        userMessage,
      ]);
    }
  };

  const handleGeminiChat = async (conversationId: string, messages: any[]) => {
    setIsCalculating(true);
    try {
      const historyForGemini = messages.slice(0, -1).map((msg) => {
        let text = "";
        if (typeof msg === "object" && "content" in msg) {
          text = msg.content;
        } else if (typeof msg === "object" && "parts" in msg) {
          text = msg.parts[0]?.text || "";
        } else {
          text = String(msg);
        }

        const role =
          typeof msg === "object" && "role" in msg && msg.role === "assistant"
            ? "model"
            : "user";
        return {
          role: role as "user" | "model",
          parts: [{ text }],
        };
      });

      const lastMessage = messages[messages.length - 1];
      const lastMessageText =
        typeof lastMessage === "object" && "content" in lastMessage
          ? lastMessage.content
          : lastMessage;

      const aiResponse = await sendMessageToGemini(
        historyForGemini,
        lastMessageText
      );

      // Detect if this is a calculation response
      const { isCalculation, data } = detectCalculationResponse(aiResponse);

      const assistantMessage: ChatMessage = createAssistantMessage(aiResponse);
      if (isCalculation && data) {
        assistantMessage.isCalculation = true;
        assistantMessage.calculationData = data;
      }

      setConversations((prev) =>
        addMessageToConversation(prev, conversationId, assistantMessage)
      );
    } catch (error) {
      const errorMessage = createErrorMessage(
        error instanceof Error ? error : new Error(String(error))
      );
      setConversations((prev) =>
        addMessageToConversation(prev, conversationId, errorMessage)
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const handleFormSubmit = (formData: any, formType: string) => {
    if (!currentConversation) return;

    const formMessage = createUserMessage(
      createFormSummary(formData, formType as any)
    );

    let updated = addMessageToConversation(
      conversations,
      currentConversationId!,
      formMessage
    );
    setConversations(updated);
    setIsCalculating(true);

    const apiPayload = createTaxApiPayload(formData, formType as any);

    calculateTax(apiPayload, {
      onSuccess: (response) => {
        const assistantMessage = createAssistantMessage(
          formatTaxResponse(response)
        );
        setConversations((prev) =>
          addMessageToConversation(
            prev,
            currentConversationId!,
            assistantMessage
          )
        );
        setIsCalculating(false);
      },
      onError: (error) => {
        const errorMessage = createErrorMessage(error);
        setConversations((prev) =>
          addMessageToConversation(prev, currentConversationId!, errorMessage)
        );
        setIsCalculating(false);
      },
    });
  };

  const handleDeleteConversation = (id: string) => {
    const updated = deleteConversationById(conversations, id);
    setConversations(updated);

    if (currentConversationId === id) {
      if (updated.length === 0) {
        setHasStartedChat(false);
        setCurrentConversationId(null);
      } else {
        setCurrentConversationId(updated[0]?.id || null);
      }
      setValue("");
    }
  };

  if (!isLoaded) {
    return null; // Wait for localStorage to load
  }

  if (!hasStartedChat) {
    return (
      <WelcomeScreen
        onStartChat={handleStartChat}
        onFormSelect={(formType) => {
          // Form will be handled through FormTypeSelector
        }}
        isLoading={isCalculating}
      />
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-neutral-950 relative">
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={setCurrentConversationId}
          onDeleteConversation={handleDeleteConversation}
        />

        <div className="flex flex-col flex-1 h-full overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1! p-8">
            <ScrollArea className="max-w-4xl mx-auto  flex-1 h-[calc(100vh-200px)]">
              <MessagesDisplay
                conversation={currentConversation}
                isCalculating={isCalculating}
              />
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="border-t border-neutral-800 p-4 bg-neutral-950">
            <div className="max-w-4xl mx-auto">
              <ChatInput
                value={value}
                onChange={setValue}
                onSubmit={handleStartChat}
                onFormSubmit={handleFormSubmit}
                isLoading={isCalculating}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
