
import { msalInstance } from "../utils/msalInstance";
import { loginRequest } from "./authConfig";


//const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const API_BASE = import.meta.env.VITE_API_BASE || "https://app-rag-its-new2.azurewebsites.net";

export interface Conversation {
  conversation_id: string;
  title: string;
  last_activity_utc: string;
  last_route: string;
}

export interface ChatMessage {
  role: string;
  route: string;
  message: string;
  timestamp_utc: string;
  meta?: any;
}

export const chatService = {
  list: async (): Promise<Conversation[]> => {
    const account = msalInstance.getAllAccounts()[0];
    if (!account) throw new Error("No active account");
    
    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });

    const res = await fetch(`${API_BASE}/api/chat/list`, {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.conversations;
  },

  history: async (conversationId: string): Promise<{messages: ChatMessage[]}> => {
    const account = msalInstance.getAllAccounts()[0];
    if (!account) throw new Error("No active account");
    
    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });

    const res = await fetch(`${API_BASE}/api/chat/history?conversation_id=${encodeURIComponent(conversationId)}`, {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },

  rename: async (conversationId: string, title: string): Promise<void> => {
    const account = msalInstance.getAllAccounts()[0];
    if (!account) throw new Error("No active account");
    
    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });

    const res = await fetch(`${API_BASE}/api/chat/rename`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation_id: conversationId, title }),
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  },

  delete: async (conversationId: string): Promise<void> => {
    const account = msalInstance.getAllAccounts()[0];
    if (!account) throw new Error("No active account");
    
    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });

    const res = await fetch(`${API_BASE}/api/chat/clear?conversation_id=${encodeURIComponent(conversationId)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  },
};