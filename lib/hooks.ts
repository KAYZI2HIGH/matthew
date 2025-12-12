import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  calculateTax,
  explainTax,
  simulateTax,
  generateReport,
  getReport,
  sendChatMessage,
  TaxCalculationRequest,
  TaxCalculationResponse,
  ExplanationRequest,
  ExplanationResponse,
  ReportRequest,
  ReportResponse,
  SimulationRequest,
  SimulationResponse,
  ChatMessageRequest,
  ChatMessageResponse,
} from "./api";

// Tax Calculation Hook
export const useCalculateTax = () => {
  return useMutation<TaxCalculationResponse, Error, TaxCalculationRequest>({
    mutationFn: calculateTax,
    onMutate: (variables) => {
      console.log(
        "🎣 [Hook] useCalculateTax mutation started with:",
        variables
      );
    },
    onSuccess: (data, variables) => {
      console.log("🎣 [Hook] useCalculateTax mutation succeeded");
      console.log("🎣 [Hook] Response data:", data);
    },
    onError: (error, variables) => {
      console.error("🎣 [Hook] useCalculateTax mutation failed");
      console.error("🎣 [Hook] Error:", error);
    },
  });
};

// Tax Explanation Hook
export const useExplainTax = () => {
  return useMutation<ExplanationResponse, Error, ExplanationRequest>({
    mutationFn: explainTax,
  });
};

// Tax Simulation Hook
export const useSimulateTax = () => {
  return useMutation<SimulationResponse, Error, SimulationRequest>({
    mutationFn: simulateTax,
  });
};

// Report Generation Hook
export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  return useMutation<ReportResponse, Error, ReportRequest>({
    mutationFn: generateReport,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

// Get Report Hook
export const useGetReport = (id: string) => {
  return useQuery<ReportResponse, Error>({
    queryKey: ["report", id],
    queryFn: () => getReport(id),
    enabled: !!id,
  });
};

// Chat Message Hook
export const useSendChatMessage = () => {
  return useMutation<ChatMessageResponse, Error, ChatMessageRequest>({
    mutationFn: sendChatMessage,
    onMutate: (variables) => {
      console.log(
        "🎣 [Hook] useSendChatMessage mutation started with:",
        variables
      );
    },
    onSuccess: (data, variables) => {
      console.log("🎣 [Hook] useSendChatMessage mutation succeeded");
      console.log("🎣 [Hook] Response data:", data);
    },
    onError: (error, variables) => {
      console.error("🎣 [Hook] useSendChatMessage mutation failed");
      console.error("🎣 [Hook] Error:", error);
    },
  });
};
