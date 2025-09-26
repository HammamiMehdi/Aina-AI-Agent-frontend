import { callApi } from "./apiService";

// const FINANCE_API_BASE = import.meta.env.VITE_API_FINANCE_BASE || "https://app-finance-its.azurewebsites.net";

// export interface FinanceResponse {
//   answer: string;
//   data?: any[];
// }

// export const askFinanceQuestion = async (query: string, top: number = 10): Promise<FinanceResponse> => {
//   const account = msalInstance.getAllAccounts()[0];
//   if (!account) throw new Error("No active account! Trigger login.");

//   const response = await msalInstance.acquireTokenSilent({ ...loginRequest, account });
//   const accessToken = response.accessToken;

//   const res = await fetch(`${FINANCE_API_BASE}/api/finance`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ query, top }),
//   });

//   if (!res.ok) throw new Error(`Finance API error: ${res.status}`);
//   return res.json();
// };

export const askFinanceQuestion = async (query: string, top: number = 10) => {
    return callApi("/api/finance", { query, top });
  };