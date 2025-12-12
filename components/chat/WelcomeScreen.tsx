/**
 * Welcome Screen Component
 * Shown when no chat has been started yet
 */

"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Wallet,
  Briefcase,
  ArrowUpIcon,
  Paperclip,
  PlusIcon,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { FormTypeSelector } from "@/components/custom-ui/FormTypeSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";

interface WelcomeScreenProps {
  onStartChat: (message: string) => void;
  onFormSelect: (formType: string) => void;
  isLoading?: boolean;
}

export function WelcomeScreen({
  onStartChat,
  onFormSelect,
  isLoading = false,
}: WelcomeScreenProps) {
  const [value, setValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onStartChat(value);
        setValue("");
        adjustHeight(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen max-w-4xl mx-auto p-4 space-y-8 relative">
      <h1 className="text-[12rem] tracking-wide font-mooner-outline absolute top-1/2 left-1/2 -translate-1/2 opacity-20">
        MATTHEW
      </h1>
      <div className="flex flex-col justify-center items-center gap-2">
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
              disabled={isLoading}
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
                    disabled={isLoading}
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
                      <span className="font-medium font-sans">Crypto Tax</span>
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
                disabled={isLoading}
              >
                <PlusIcon className="w-4 h-4" />
                Upload File
              </Button>
              <Button
                variant={"ghost"}
                type="button"
                disabled={isLoading || !value.trim()}
                className={cn(
                  "px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1 cursor-pointer disabled:opacity-50",
                  value.trim() && !isLoading
                    ? "bg-white text-black"
                    : "text-zinc-400"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUpIcon
                    className={cn(
                      "w-4 h-4",
                      value.trim() ? "text-black" : "text-zinc-400"
                    )}
                  />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FormTypeSelector
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onFormSubmit={(formData, formType) => onFormSelect(formType)}
        selectedForm={selectedForm}
        onSelectForm={setSelectedForm}
      />
    </div>
  );
}
