/**
 * Helper functions for API payload construction
 */

import { TaxApiPayload, FormType } from "@/lib/types";

export function createFormSummary(formData: any, formType: FormType): string {
  if (formType === "paye") {
    return `📋 PAYE Tax - Monthly Salary: ₦${
      formData.monthlySalary?.toLocaleString() || 0
    }`;
  } else if (formType === "business") {
    return `📊 Business Tax - Revenue: ₦${
      formData.revenue?.toLocaleString() || 0
    }, Expenses: ₦${formData.expenses?.toLocaleString() || 0}`;
  } else if (formType === "crypto") {
    return `🪙 Crypto Tax - ${formData.tokenName || "Token"} | Quantity: ${
      formData.quantity || 0
    }, Buy: ₦${formData.buyPrice?.toLocaleString() || 0}, Sell: ₦${
      formData.sellPrice?.toLocaleString() || 0
    }`;
  }
  return "";
}

export function createTaxApiPayload(
  formData: any,
  formType: FormType
): TaxApiPayload {
  if (formType === "paye") {
    return {
      income: formData.monthlySalary * 12,
      taxType: "PAYE",
    };
  } else if (formType === "business") {
    return {
      businessProfit: formData.revenue - formData.expenses,
      income: formData.revenue,
      expenses: formData.expenses,
      taxType: "CIT",
    };
  } else if (formType === "crypto") {
    return {
      capitalGains:
        (formData.sellPrice - formData.buyPrice) * formData.quantity,
      taxableIncome:
        (formData.sellPrice - formData.buyPrice) * formData.quantity,
      taxType: "CGT",
    };
  }
  return { taxType: "" };
}

export function formatTaxResponse(response: any): string {
  return `💰 Tax Calculation Result:\n\nTotal Tax: ₦${
    response.totalTax?.toLocaleString() || 0
  }\n\nBreakdown:\n${
    response.breakdown
      ? Object.entries(response.breakdown)
          .filter(([, value]) => {
            const numValue = value as number;
            return numValue && numValue > 0;
          })
          .map(
            ([key, value]) => `• ${key}: ₦${(value as number).toLocaleString()}`
          )
          .join("\n")
      : "N/A"
  }`;
}
