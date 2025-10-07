import { msalInstance } from "../utils/msalInstance";
import { loginRequest } from "./authConfig";

const API_BASE = import.meta.env.VITE_API_BASE || "https://app-rag-its-new2.azurewebsites.net";
//const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export interface PreviewResponse {
  url: string;
  expires_in_minutes: number;
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

  console.log("🔍 [PreviewService] Chemin reçu:", path);

  // Fonction pour décoder le chemin s'il est déjà encodé
  const preparePathForSAS = (rawPath: string): string => {
    console.log("🔧 [PreviewService] Préparation du chemin:", rawPath);
    
    let cleanedPath = rawPath;
    
    // Essayer de décoder le chemin s'il semble déjà encodé
    if (rawPath.includes('%')) {
      try {
        // Décoder une première fois
        cleanedPath = decodeURIComponent(rawPath);
        console.log("🔧 [PreviewService] Chemin décodé:", cleanedPath);
        
        // Vérifier s'il reste encore de l'encodage
        if (cleanedPath.includes('%')) {
          // Décoder une seconde fois au cas où
          cleanedPath = decodeURIComponent(cleanedPath);
          console.log("🔧 [PreviewService] Chemin double-décodé:", cleanedPath);
        }
      } catch (e) {
        console.warn("⚠️ [PreviewService] Erreur décodage, utilisation chemin brut");
        cleanedPath = rawPath;
      }
    }
    
    // Nettoyer les caractères problématiques
    cleanedPath = cleanedPath.replace(/[<>:"|?*]/g, "");
    
    console.log("✅ [PreviewService] Chemin préparé:", cleanedPath);
    return cleanedPath;
  };

  const preparedPath = preparePathForSAS(path);
  
  console.log("🚀 [PreviewService] Appel API SAS avec le chemin préparé:", preparedPath);

  try {
    // IMPORTANT: Ne pas encoder le chemin ici - le backend s'en chargera
    const res = await fetch(`${API_BASE}/api/sas?path=${encodeURIComponent(preparedPath)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
    });

    console.log("📡 [PreviewService] Statut réponse:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ [PreviewService] Erreur API:", res.status, errorText);
      throw new Error(`Erreur API Preview: ${res.status} - ${errorText}`);
    }

    const data: PreviewResponse = await res.json();
    console.log("✅ [PreviewService] URL SAS générée:", data.url);
    
    // Vérifier si l'URL contient un double encodage
    if (data.url.includes('%2520')) {
      console.warn("⚠️ [PreviewService] Double encodage détecté dans l'URL SAS");
      // Corriger le double encodage
      const correctedUrl = data.url.replace(/%25([0-9A-Fa-f]{2})/g, '%$1');
      console.log("🔧 [PreviewService] URL corrigée:", correctedUrl);
      return correctedUrl;
    }
    
    return data.url;

  } catch (error) {
    console.error("🚨 [PreviewService] Erreur réseau:", error);
    throw error;
  }
};