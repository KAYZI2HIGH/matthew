/**
 * Chat Sidebar Component
 * Shows conversation history and navigation
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SquarePen, Search, BrickWallShield, Trash2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ChatConversation } from "@/lib/types";
import { AuditDialog } from "../custom-ui/AuditDialog";

interface ChatSidebarProps {
  conversations: ChatConversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar
      variant="floating"
      className="font-sans"
    >
      <SidebarHeader className="border-b border-neutral-800 p-4">
        <Logo
          size="md"
          className="w-fit mx-auto"
        />
      </SidebarHeader>

      <SidebarContent className="px-0">
        {/* Menu Items */}
        <SidebarGroup className="border-b border-neutral-800">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onNewChat}
                  className="cursor-pointer"
                >
                  <SquarePen className="w-4 h-4" />
                  <span>New Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="cursor-pointer">
                  <Search className="w-4 h-4" />
                  <span>Search Chats</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
                <SidebarMenuItem>
              <AuditDialog>
                  <SidebarMenuButton className="cursor-pointer">
                    <BrickWallShield className="w-4 h-4" />
                    <span>Audits</span>
                  </SidebarMenuButton>
              </AuditDialog>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chat History */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-neutral-500">
            Your chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {filteredConversations.length === 0 ? (
              <p className="text-xs text-neutral-500 px-2 py-4">No chats yet</p>
            ) : (
              <SidebarMenu>
                {filteredConversations.map((conv) => (
                  <SidebarMenuItem
                    key={conv.id}
                    className="group flex items-center justify-between"
                  >
                    <SidebarMenuButton
                      isActive={currentConversationId === conv.id}
                      onClick={() => onSelectConversation(conv.id)}
                      className="flex-1 px-2"
                    >
                      <span className="truncate">{conv.title}</span>
                    </SidebarMenuButton>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-neutral-700 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-800 p-4">
        <div className="flex items-center gap-3">
          <Image
            src="/cater-efe.jpg"
            alt="Carter Efe"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Carter Efe
            </p>
            <p className="text-xs text-neutral-400">Free Plan</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
