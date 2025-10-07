import { callApi } from "./apiService";


export const askFinanceQuestion = async (query: string, top: number = 10, conversationId?: string) => {
  return callApi("/api/finance", { 
    query, 
    top,
    conversation_id: conversationId 
  });
};