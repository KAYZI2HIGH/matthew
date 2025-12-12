/**
 * Core types for the chat and tax calculation system
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

export interface TaxApiPayload {
  income?: number;
  taxType: string;
  businessProfit?: number;
  expenses?: number;
  capitalGains?: number;
  taxableIncome?: number;
  [key: string]: any;
}

export type FormType = "paye" | "business" | "crypto";
