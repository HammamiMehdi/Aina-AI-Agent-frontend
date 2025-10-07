import { callSearchApi } from "./apiService";

export const askSearchQuestion = async (prompt: string, conversationId?: string) => {
    return callSearchApi({ 
      prompt, 
      conversation_id: conversationId 
    });
  };