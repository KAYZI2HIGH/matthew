/**
 * Main Chat Component - VercelV0Chat
 * Orchestrates the chat interface with all sub-components
 * Includes localStorage persistence for conversations
 */

"use client";

import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatConversation, ChatMessage } from "@/lib/types";
import { useCalculateTax, useSendChatMessage } from "@/lib/hooks";
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
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { MessagesDisplay } from "@/components/chat/MessagesDisplay";
import { ChatInput } from "@/components/chat/ChatInput";

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
  const { mutate: sendChatMessage } = useSendChatMessage();

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
    } else {
      const updated = addMessageToConversation(
        conversations,
        currentConversationId!,
        userMessage
      );
      setConversations(updated);
    }

    setValue("");
    sendChatMessage(
      { message },
      {
        onSuccess: (response) => {
          const assistantMessage = createAssistantMessage(
            response.response || "No response"
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
      }
    );
    setIsCalculating(true);
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

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              <MessagesDisplay
                conversation={currentConversation}
                isCalculating={isCalculating}
              />
            </div>
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
