import axios from "axios";

const API_BASE_URL = "https://matthew-3.onrender.com";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tax Calculation API
export interface TaxCalculationRequest {
  income?: number;
  expenses?: number;
  capitalGains?: number;
  taxableIncome?: number;
  businessProfit?: number;
  [key: string]: any;
}

export interface TaxCalculationResponse {
  totalTax: number;
  breakdown: {
    cit?: number;
    cgt?: number;
    vat?: number;
    developmentLevy?: number;
    digitalAssetsTax?: number;
  };
  summary: string;
  [key: string]: any;
}

export const calculateTax = async (
  data: TaxCalculationRequest
): Promise<TaxCalculationResponse> => {
  console.log("🔗 [API] Making POST request to /tax/calculate");
  console.log("🔗 [API] Request data:", data);

  try {
    const response = await apiClient.post("/tax/calculate", data);
    console.log("🔗 [API] Response received:", response.data);
    console.log("🔗 [API] Response status:", response.status);
    return response.data;
  } catch (error) {
    console.error("🔗 [API] Request failed:", error);
    throw error;
  }
};

// Tax Explanation API
export interface ExplanationRequest {
  taxType: string;
  language: "english" | "pidgin" | "yoruba" | "igbo" | "hausa";
}

export interface ExplanationResponse {
  explanation: string;
  language: string;
  taxType: string;
}

export const explainTax = async (
  data: ExplanationRequest
): Promise<ExplanationResponse> => {
  const response = await apiClient.post("/explain", data);
  return response.data;
};

// Tax Simulation API
export interface SimulationRequest {
  initialInvestment: number;
  annualReturn: number;
  years: number;
  [key: string]: any;
}

export interface SimulationResponse {
  projections: Array<{
    year: number;
    value: number;
    tax: number;
  }>;
  totalTax: number;
  summary: string;
}

export const simulateTax = async (
  data: SimulationRequest
): Promise<SimulationResponse> => {
  const response = await apiClient.post("/tax/simulate", data);
  return response.data;
};

// Report Generation API
export interface ReportRequest {
  title: string;
  data: TaxCalculationRequest;
  [key: string]: any;
}

export interface ReportResponse {
  id: string;
  title: string;
  createdAt: string;
  data: any;
}

export const generateReport = async (
  data: ReportRequest
): Promise<ReportResponse> => {
  const response = await apiClient.post("/report", data);
  return response.data;
};

// Get Report API
export const getReport = async (id: string): Promise<ReportResponse> => {
  const response = await apiClient.get(`/report/${id}`);
  return response.data;
};

// Health Check
export const healthCheck = async (): Promise<{ status: string }> => {
  const response = await apiClient.get("/");
  return response.data;
};

// Chat Message API
export interface ChatMessageRequest {
  message: string;
}

export interface ChatMessageResponse {
  response: string;
  type: string;
  taxType?: string;
  requiresFollowUp?: boolean;
  [key: string]: any;
}

export const sendChatMessage = async (
  data: ChatMessageRequest
): Promise<ChatMessageResponse> => {
  console.log("🔗 [API] Sending chat message");
  console.log("🔗 [API] Request data:", data);

  try {
    const response = await apiClient.post("/tax/calculate", data);
    console.log("🔗 [API] Chat response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("🔗 [API] Chat request failed:", error);
    throw error;
  }
};
