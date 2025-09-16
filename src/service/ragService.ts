
const API_BASE = import.meta.env.VITE_API_BASE || "https://app-rag-its-new2.azurewebsites.net";

// interface RAGRequest {
//   question: string;
//   top_k?: number;
// }

interface SourceDoc {
  filename: string;
  doc_id: string;
  chunk_id: string;
}

interface RAGResponse {
  answer: string;
  used_docs: SourceDoc[];
}

export const askQuestion = async (question: string, top_k: number = 3): Promise<RAGResponse> => {
  if (!question.trim()) {
    throw new Error("Question cannot be empty");
  }

  const response = await fetch(`${API_BASE}/api/rag`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: question.trim(),
      top_k,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  return await response.json();
};