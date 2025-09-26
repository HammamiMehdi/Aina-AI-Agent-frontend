import { msalInstance } from "../utils/msalInstance";
import { loginRequest } from "./authConfig";


const API_BASE = import.meta.env.VITE_API_BASE || "https://app-rag-its-new2.azurewebsites.net";
export interface ApiResponse<T = any> {
    answer: string;
    rows?: T[];      // ✅ T est maintenant utilisé
    used_docs?: any[];
  }
  
  export const callApi = async <T = any>(
    endpoint: string,
    payload: Record<string, any>
  ): Promise<ApiResponse<T>> => {
    const account = msalInstance.getAllAccounts()[0];
    if (!account) throw new Error("No active account! Trigger login.");
  
    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });
  
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  };
  