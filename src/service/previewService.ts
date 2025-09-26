import { msalInstance } from "../utils/msalInstance";
import { loginRequest } from "./authConfig";

const API_BASE = import.meta.env.VITE_API_BASE || "https://app-rag-its-new2.azurewebsites.net";

export interface PreviewResponse {
  url: string;               // URL SAS vers le fichier
  expires_in_minutes: number; // Durée de validité
}

/**
 * Récupère un lien temporaire (SAS) pour prévisualiser un document
 * @param path Le chemin complet du document (ex: 'folder1/file.pdf')
 */
export const getPreviewUrl = async (path: string): Promise<string> => {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No active account! Trigger login.");

  const tokenResponse = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account,
  });

  const cleanPath = (path: string): string => {
    return path.replace(/\d+$/g, "").trim();
  };
  const safePath = cleanPath(path);

  const res = await fetch(`${API_BASE}/api/sas?path=${encodeURIComponent(safePath)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenResponse.accessToken}`,
    },
  });

  if (!res.ok) throw new Error(`Erreur API Preview: ${res.status}`);
  const data: PreviewResponse = await res.json();
  return data.url;
};