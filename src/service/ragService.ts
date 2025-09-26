import { callApi } from "./apiService";

//const API_BASE = import.meta.env.VITE_API_BASE || "https://app-rag-its-new2.azurewebsites.net";
//const API_BASE = import.meta.env.VITE_API_BASE || "https://app-rag-climmag-prod.azurewebsites.net";
//const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";




// interface SourceDoc {
//   filename: string;
//   doc_id: string;
//   chunk_id: string;
// }

// interface RAGResponse {
//   answer: string;
//   used_docs: SourceDoc[];
// }


// export const askQuestion = async (question: string, top_k: number = 3) => {
//   const account = msalInstance.getAllAccounts()[0];
//   if (!account) throw new Error("No active account! Trigger login.");

//   const response = await msalInstance.acquireTokenSilent({
//     ...loginRequest,
//     account,
//   });

//   const accessToken = response.accessToken;
//   console.log(response);
//   const apiResponse = await fetch(`${API_BASE}/api/rag`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ question, top_k }),
//   });

//   if (!apiResponse.ok) throw new Error(`HTTP error! status: ${apiResponse.status}`);
  
//   return apiResponse.json();
// };

export const askRagQuestion = async (question: string, top_k: number = 3) => {
  return callApi("/api/rag", { question, top: top_k });
};
// /api/finance
// /saspath?
