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
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
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

    setValue(summary);
  };

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
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">PAYE Tax</span>
                      <span className="text-xs text-muted-foreground">
                        For salary earners
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
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Business Tax</span>
                      <span className="text-xs text-muted-foreground">
                        For SMEs & companies
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
                    <Wallet className="w-4 h-4 text-orange-600" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Crypto Tax</span>
                      <span className="text-xs text-muted-foreground">
                        For traders & investors
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

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
}

function ActionButton({ icon, label }: ActionButtonProps) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}
