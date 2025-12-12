"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  BarChart3,
  Wallet,
  CreditCard,
  FileText,
  ArrowUpIcon,
  Paperclip,
  PlusIcon,
  Briefcase,
  Plus,
  Search,
  BookOpen,
  Folder,
  Trash2,
} from "lucide-react";
import { Logo } from "./logo";
import { Button } from "./button";
import { FormTypeSelector } from "@/components/custom-ui/FormTypeSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      // Temporarily shrink to get the right scrollHeight
      textarea.style.height = `${minHeight}px`;

      // Calculate new height
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    // Set initial height
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  // Adjust height on window resize
  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

export function VercelV0Chat() {
  const [value, setValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

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
    adjustHeight(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        // On first message, create initial conversation
        if (!hasStartedChat) {
          setHasStartedChat(true);
          const newConversation: ChatConversation = {
            id: Date.now().toString(),
            title: value.substring(0, 30) + (value.length > 30 ? "..." : ""),
            messages: [
              {
                id: Date.now().toString(),
                role: "user",
                content: value,
                timestamp: new Date(),
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setConversations([newConversation]);
          setCurrentConversationId(newConversation.id);
        } else if (currentConversation) {
          // Add to existing conversation
          const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: value,
            timestamp: new Date(),
          };

          const updatedConversations = conversations.map((conv) => {
            if (conv.id === currentConversationId) {
              return {
                ...conv,
                title:
                  conv.title === "New chat"
                    ? value.substring(0, 30) + (value.length > 30 ? "..." : "")
                    : conv.title,
                messages: [...conv.messages, userMessage],
                updatedAt: new Date(),
              };
            }
            return conv;
          });

          setConversations(updatedConversations);
        }
        setValue("");
        adjustHeight(true);
      }
    }
  };

  const handleFormSubmit = (formData: any, formType: string) => {
    // Prepare summary based on form type
    let summary = "";

    if (formType === "paye") {
      summary = `📋 PAYE Tax Calculation - Monthly Salary: ₦${formData.monthlySalary}`;
    } else if (formType === "business") {
      summary = `📊 Business Tax - Revenue: ₦${formData.revenue}, Expenses: ₦${formData.expenses}`;
    } else if (formType === "crypto") {
      summary = `🪙 Crypto Tax - ${formData.tokenName} | Buy: ₦${formData.buyPrice}, Sell: ₦${formData.sellPrice}`;
    } else if (formType === "document") {
      summary = `📄 Uploaded ${formData.files.length} document(s) for analysis`;
    }

    if (currentConversation) {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: summary,
        timestamp: new Date(),
      };

      const updatedConversations = conversations.map((conv) => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, assistantMessage],
            updatedAt: new Date(),
          };
        }
        return conv;
      });

      setConversations(updatedConversations);
    }
  };

  const deleteConversation = (id: string) => {
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);
    if (currentConversationId === id) {
      if (filtered.length === 0) {
        setHasStartedChat(false);
        setCurrentConversationId(null);
      } else {
        setCurrentConversationId(filtered[0]?.id || null);
      }
      setValue("");
      adjustHeight(true);
    }
  };

  // Show welcome screen if no chat started
  if (!hasStartedChat) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen max-w-4xl mx-auto p-4 space-y-8 relative">
        <h1 className="text-[12rem] tracking-wide font-mooner-outline absolute top-1/2 left-1/2 -translate-1/2 opacity-20">
          MATTHEW
        </h1>
        <div className="flex flex-col justify-center items-center gap-4">
          <Logo size="lg" />
          <h1 className="text-4xl tracking-wide font-semibold text-black dark:text-white">
            Let's Calculate Your Taxes
          </h1>
        </div>

        <div className="w-full">
          <div className="relative bg-neutral-900 rounded-xl border border-neutral-800">
            <div className="overflow-y-auto">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Tell me about your business or investments..."
                className={cn(
                  "w-full px-4 py-3",
                  "resize-none",
                  "bg-transparent",
                  "border-none",
                  "text-white text-sm",
                  "focus:outline-none",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-neutral-500 placeholder:text-sm",
                  "min-h-15"
                )}
                style={{
                  overflow: "hidden",
                }}
              />
            </div>

            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={"ghost"}
                      type="button"
                      className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Paperclip className="w-4 h-4 text-white" />
                      <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">
                        Form
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56"
                    align="start"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedForm("paye");
                        setIsFormOpen(true);
                      }}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-medium font-sans">PAYE Tax</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedForm("business");
                        setIsFormOpen(true);
                      }}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-medium font-sans">
                          Business Tax
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedForm("crypto");
                        setIsFormOpen(true);
                      }}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <Wallet className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-medium font-sans">
                          Crypto Tax
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={"ghost"}
                  type="button"
                  className="px-2 py-1 rounded-lg text-xs text-zinc-400 transition-colors border border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1 cursor-pointer"
                >
                  <PlusIcon className="w-4 h-4" />
                  Upload File
                </Button>
                <Button
                  variant={"ghost"}
                  type="button"
                  className={cn(
                    "px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1 cursor-pointer",
                    value.trim() ? "bg-white text-black" : "text-zinc-400"
                  )}
                >
                  <ArrowUpIcon
                    className={cn(
                      "w-4 h-4",
                      value.trim() ? "text-black" : "text-zinc-400"
                    )}
                  />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Type Selector Modal */}
        <FormTypeSelector
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onFormSubmit={handleFormSubmit}
          selectedForm={selectedForm}
          onSelectForm={setSelectedForm}
        />
      </div>
    );
  }

  // Show chat with sidebar after first message
  return (
    <div className="flex h-screen w-full bg-neutral-950">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={setCurrentConversationId}
        onDeleteConversation={deleteConversation}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {currentConversation &&
            currentConversation.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <h1 className="text-4xl tracking-wide font-semibold text-white">
                  Let's Calculate Your Taxes
                </h1>
                <p className="text-neutral-400 text-sm">
                  Tell me about your business or investments to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentConversation?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "rounded-lg p-4 max-w-2xl",
                      msg.role === "user"
                        ? "bg-neutral-800 text-white ml-auto"
                        : "bg-neutral-900 text-neutral-100"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-neutral-800 p-4 bg-neutral-950">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-neutral-900 rounded-xl border border-neutral-800">
              <div className="overflow-y-auto">
                <Textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    adjustHeight();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Tell me about your business or investments..."
                  className={cn(
                    "w-full px-4 py-3",
                    "resize-none",
                    "bg-transparent",
                    "border-none",
                    "text-white text-sm",
                    "focus:outline-none",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "placeholder:text-neutral-500 placeholder:text-sm",
                    "min-h-15"
                  )}
                  style={{
                    overflow: "hidden",
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"ghost"}
                        type="button"
                        className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Paperclip className="w-4 h-4 text-white" />
                        <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">
                          Form
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="start"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedForm("paye");
                          setIsFormOpen(true);
                        }}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <DollarSign className="w-4 h-4" />
                        <div className="flex flex-col">
                          <span className="font-medium font-sans">
                            PAYE Tax
                          </span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedForm("business");
                          setIsFormOpen(true);
                        }}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Briefcase className="w-4 h-4" />
                        <div className="flex flex-col">
                          <span className="font-medium font-sans">
                            Business Tax
                          </span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedForm("crypto");
                          setIsFormOpen(true);
                        }}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Wallet className="w-4 h-4" />
                        <div className="flex flex-col">
                          <span className="font-medium font-sans">
                            Crypto Tax
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={"ghost"}
                    type="button"
                    className="px-2 py-1 rounded-lg text-xs text-zinc-400 transition-colors border border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1 cursor-pointer"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Upload File
                  </Button>
                  <Button
                    variant={"ghost"}
                    type="button"
                    className={cn(
                      "px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1 cursor-pointer",
                      value.trim() ? "bg-white text-black" : "text-zinc-400"
                    )}
                  >
                    <ArrowUpIcon
                      className={cn(
                        "w-4 h-4",
                        value.trim() ? "text-black" : "text-zinc-400"
                      )}
                    />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Type Selector Modal */}
      <FormTypeSelector
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onFormSubmit={handleFormSubmit}
        selectedForm={selectedForm}
        onSelectForm={setSelectedForm}
      />
    </div>
  );
}

function ChatSidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: {
  conversations: ChatConversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col font-sans">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <Button
          onClick={onNewChat}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-white"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">New chat</span>
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-neutral-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-neutral-500" />
          <Input
            placeholder="Search chats"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-neutral-800 border-neutral-700 text-white text-sm placeholder:text-neutral-500 focus-visible:ring-neutral-600"
          />
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-4 border-b border-neutral-800 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-400 hover:text-white hover:bg-neutral-800"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Library
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-400 hover:text-white hover:bg-neutral-800"
        >
          <Folder className="w-4 h-4 mr-2" />
          Projects
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {filteredConversations.length === 0 ? (
          <p className="text-xs text-neutral-500 px-2 py-4">No chats yet</p>
        ) : (
          <div className="space-y-1">
            <p className="text-xs text-neutral-500 px-2 py-2 font-medium">
              Your chats
            </p>
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm cursor-pointer group flex items-center justify-between transition-colors",
                  currentConversationId === conv.id
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                )}
              >
                <button
                  onClick={() => onSelectConversation(conv.id)}
                  className="flex-1 text-left truncate"
                >
                  {conv.title}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-neutral-700 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
