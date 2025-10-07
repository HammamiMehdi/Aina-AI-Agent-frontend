"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { askRagQuestion } from "../../service/ragService";
import { askFinanceQuestion } from "../../service/financeService";
import { callApi, type ApiResponse } from "../../service/apiService";
import { getPreviewUrl } from "../../service/previewService";
import Header from "../../components/Header/Header";
import ChatMsg from "../../components/chat/ChatMsg";
import ChatPreviewModal from "../../components/chat/ChatPreviewModal";
import ChatInput from "../../components/chat/ChatInput";
import { TypedText } from "../../utils/FormattedAnswer";
import ChatSidebar from "../../components/chat/ChatSidebar";
import { chatService, type Conversation } from "../../service/chatService";
import { askSearchQuestion } from "../../service/searchService";


/** --- Types --- */
export type Message = {
  text: string;
  isUser: boolean;
  sources?: { title: string; path: string }[];
  file?: File;
  rows?: Record<string, any>[];
  timestamp?: string;
};

type AgentType = "doc" | "finance" | "vision" | "search";

const agentServiceMap: Record<
  AgentType,
  (query: string, n?: number, file?: File | null, conversationId?: string) => Promise<ApiResponse>
> = {
  doc: (query, _n = 3, _file, conversationId) => askRagQuestion(query, 3, conversationId), // ✅ Supprimé paramètres inutilisés
  finance: (query, _n = 10, _file, conversationId) => askFinanceQuestion(query, 10, conversationId), // ✅ Supprimé paramètres inutilisés
  vision: (query, _n, _file, conversationId) => callApi("/askVisionQuestion", { question: query, conversation_id: conversationId }), // ✅ Supprimé paramètres inutilisés
  search: async (query, _n, _file, conversationId) => { // ✅ Supprimé paramètres inutilisés
    const response = await askSearchQuestion(query, conversationId);
    return {
      answer: response.answer,
      used_docs: response.used_docs,
      conversation_id: response.conversation_id
    };
  },
};

export default function Chat() {
  const { moduleName } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; path: string } | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const recognitionRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);

  // Charger les conversations au démarrage
  useEffect(() => {
    loadConversations();
  }, []);

  // Charger l'historique si une conversation est active
  useEffect(() => {
    if (activeConversation) {
      loadConversationHistory(activeConversation);
    } else {
      setMessages([]);
      setIsInitial(true);
    }
  }, [activeConversation]);

  const loadConversations = async () => {
    try {
      const convs = await chatService.list();
      setConversations(convs);
    } catch (error) {
      console.error("Erreur chargement conversations:", error);
    }
  };

  const loadConversationHistory = async (conversationId: string) => {
    try {
      const history = await chatService.history(conversationId);
      const formattedMessages: Message[] = history.messages.map(msg => ({
        text: msg.message,
        isUser: msg.role === "user",
        sources: msg.meta?.used_docs || msg.meta?.sources,
        rows: msg.meta?.rows,
        timestamp: msg.timestamp_utc,
      }));
      setMessages(formattedMessages);
      setIsInitial(formattedMessages.length === 0);
    } catch (error) {
      console.error("Erreur chargement historique:", error);
    }
  };

  const handleNewConversation = () => {
    setActiveConversation(null);
    setMessages([]);
    setIsInitial(true);
    setInput("");
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await chatService.delete(conversationId);
      if (activeConversation === conversationId) {
        handleNewConversation();
      }
      loadConversations();
    } catch (error) {
      console.error("Erreur suppression conversation:", error);
    }
  };

  const handleRenameConversation = async (conversationId: string, newTitle: string) => {
    try {
      await chatService.rename(conversationId, newTitle);
      loadConversations();
    } catch (error) {
      console.error("Erreur renommage conversation:", error);
    }
  };

  /** --- Envoi d'une question --- */
  const handleSend = async (userQuery: string) => {
    if (!userQuery.trim() && !attachedFile) return;

    const agentKey: AgentType =
      moduleName === "Aïna DOC"
        ? "doc"
        : moduleName === "Aïna Finance"
        ? "finance"
        : moduleName === "Aïna Vision"
        ? "vision"
        : moduleName === "Aïna Search"
        ? "search"
        : "doc";

    const userMessage: Message = {
      text: userQuery,
      isUser: true,
      file: attachedFile || undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachedFile(null);
    setLoading(true);
    setIsInitial(false);

    try {
      const response = await agentServiceMap[agentKey](
        userQuery,
        undefined,
        attachedFile || undefined,
        activeConversation || undefined
      );

      // Mettre à jour la conversation active si c'est une nouvelle conversation
      if (response.conversation_id && !activeConversation) {
        setActiveConversation(response.conversation_id);
      }

      setMessages((prev) => [
        ...prev,
        {
          text: response.answer,
          isUser: false,
          sources: response.used_docs,
          rows: agentKey === "finance" ? response.rows : undefined,
        },
      ]);

      // Recharger la liste des conversations pour avoir les dernières activités
      loadConversations();
    } catch (error) {
      console.error("Erreur API:", error);
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Une erreur est survenue. Veuillez réessayer.", isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /** --- Texte central animé au démarrage --- */
  const typedMessage =
    moduleName === "Aïna DOC"
      ? "Demandez à vos données"
      : moduleName === "Aïna Finance"
      ? "Demandez à vos chiffres"
      : moduleName === "Aïna Vision"
      ? "Demandez à vos images"
      : moduleName === "Aïna Search"
      ? "Demandez à internet"
      : `Sachez plus…`;

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-white via-slate-100 to-sky-100 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 animate-gradient-x transition-colors duration-300">
      <Header />
      
      <div className="relative flex min-h-screen">
        {/* Sidebar des conversations */}
        <ChatSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setSidebarOpen(!isSidebarOpen)}
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={setActiveConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
          onRefresh={loadConversations}
        />

        {/* Zone principale */}
        <div className="flex-1 flex flex-col p-6">
          {/* Zone messages */}
          {!isInitial && (
            <ChatMsg
              messages={messages}
              loading={loading}
              onPreview={async (title: string) => {
                try {
                  console.log("📄 [Chat] Tentative d'ouverture du document:", title);
                  
                  // Essayer différentes méthodes pour extraire le chemin
                  let documentPath = title;
                  
                  // Si le titre contient des métadonnées, essayer d'extraire le chemin réel
                  if (title.includes(" - ") || title.includes("/")) {
                    // Essayer d'extraire le chemin du titre
                    const pathMatch = title.match(/(.+?)(?:\s*-\s*|$)/);
                    if (pathMatch && pathMatch[1]) {
                      documentPath = pathMatch[1].trim();
                      console.log("🔧 [Chat] Chemin extrait du titre:", documentPath);
                    }
                  }
                  
                  const sasUrl = await getPreviewUrl(documentPath);
                  console.log("✅ [Chat] URL SAS obtenue, ouverture du modal");
                  setPreviewDoc({ title, path: sasUrl });
                } catch (error) {
                  console.error("❌ [Chat] Erreur prévisualisation:", error);
                  alert(`Impossible d'ouvrir ce document: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
                }
              }}
            />
          )}

          {/* Modal Preview */}
          {previewDoc && <ChatPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}

          {/* --- Texte animé au centre --- */}
          {isInitial && (
            <motion.div
              className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <TypedText 
                className="text-gray-900 dark:text-white text-2xl sm:text-3xl md:text-4xl font-bold" 
                text={typedMessage} 
                speed={50} 
                start 
              />
            </motion.div>
          )}

          {/* Zone Input */}
          <motion.div
            className="mt-auto w-full max-w-3xl mx-auto px-4 flex flex-col items-center"
            initial={{ y: isInitial ? "-50vh" : 0, opacity: 1 }}
            animate={isInitial ? { y: "-50vh", opacity: 1 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-full flex justify-center">
              <ChatInput
                moduleName={moduleName || ""}
                input={input}
                setInput={setInput}
                onSend={handleSend}
                attachedFile={attachedFile}
                setAttachedFile={setAttachedFile}
                loading={loading}
                recording={recording}
                setRecording={setRecording}
                recognitionRef={recognitionRef}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}