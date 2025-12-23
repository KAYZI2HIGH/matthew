import posthog from "posthog-js";

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined") {
    posthog.capture(eventName, properties);
  }
};

export const trackTaxCalculation = (taxType: string, totalTax: number) => {
  trackEvent("tax_calculation_completed", {
    taxType,
    totalTax,
    timestamp: new Date().toISOString(),
  });
};

export const trackFormSubmission = (formType: string) => {
  trackEvent("form_submitted", {
    formType,
    timestamp: new Date().toISOString(),
  });
};

export const trackChatMessage = (messageType: "user" | "assistant") => {
  trackEvent("chat_message", {
    messageType,
    timestamp: new Date().toISOString(),
  });
};
