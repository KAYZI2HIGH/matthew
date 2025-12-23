"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Briefcase, Wallet } from "lucide-react";
import { PayeForm } from "./forms/PayeForm";
import { BusinessTaxForm } from "./forms/BusinessTaxForm";
import { CryptoTaxForm } from "./forms/CryptoTaxForm";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface FormTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit: (formData: any, formType: string) => void;
  selectedForm: string | null;
  onSelectForm: (form: string | null) => void;
}

export function FormTypeSelector({
  isOpen,
  onClose,
  onFormSubmit,
  selectedForm,
  onSelectForm,
}: FormTypeSelectorProps) {
  const handleFormSubmit = (formData: any) => {
    onFormSubmit(formData, selectedForm || "");
    onSelectForm(null);
    onClose();
  };

  // Only show form if one is selected
  if (!selectedForm) {
    return null;
  }

  // Show selected form in Dialog
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-2xl! max-h-[80vh]! bg-[#1E1E1E] font-sans z-999">
        <ScrollArea className="h-[80vh]!">
          {selectedForm === "paye" && (
            <PayeForm
              onSubmit={handleFormSubmit}
              onCancel={onClose}
            />
          )}
          {selectedForm === "business" && (
            <BusinessTaxForm
              onSubmit={handleFormSubmit}
              onCancel={onClose}
            />
          )}
          {selectedForm === "crypto" && (
            <CryptoTaxForm
              onSubmit={handleFormSubmit}
              onCancel={onClose}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
