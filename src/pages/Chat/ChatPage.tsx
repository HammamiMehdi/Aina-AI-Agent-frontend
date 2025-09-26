"use client";

import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Mic, Plus, Send } from "lucide-react";
import Header from "../../components/Header/Header";
import { motion } from "framer-motion";
import TypedText from "../../components/TypedText/TypedText";
import { askRagQuestion } from "../../service/ragService";
import { askFinanceQuestion } from "../../service/financeService";
import { callApi, type ApiResponse } from "../../service/apiService";
import JsonTable from "../../utils/JsonTable";
import { getPreviewUrl } from "../../service/previewService";

/** --- Types locaux --- */
type RawSourceDoc = {
  // champs possibles selon l'API (on couvre les variantes)
  title?: string;
  path?: string;
  filename?: string;
  url?: string;
  id?: string; // parfois c'est un base64 de l'URL
  doc_id?: string;
  chunk_id?: string;
  score?: number;
};

type Message = {
  text: string;
  isUser: boolean;
  sources?: { title: string; path: string }[];
  file?: File;
  rows?: Record<string, any>[]; // ajout pour tableau JSON
};

type AgentType = "doc" | "finance" | "vision";

const agentServiceMap: Record<
  AgentType,
  (query: string, n?: number, file?: File | null) => Promise<ApiResponse>
> = {
  doc: (query, n = 3) => askRagQuestion(query, n),
  finance: (query, n = 10) => askFinanceQuestion(query, n),
  vision: (query) => callApi("/askVisionQuestion", { question: query }),
};

/** --- Helpers --- */
const clean = (s?: string) => (s || "").replace(/\r/g, "").trim();

function tryBase64ToUrl(maybeBase64?: string): string | null {
  if (!maybeBase64) return null;
  try {
    // atob peut lever une exception si ce n'est pas du base64 valide
    const decoded = atob(maybeBase64);
    if (decoded.startsWith("http")) return decoded;
  } catch {
    // ignore
  }
  return null;
}

function decodeSafe(input?: string): string {
  if (!input) return "";
  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

/** Normalise un document brut renvoyé par l'API */
function normalizeDoc(
  doc: RawSourceDoc
): { title: string; path: string } | null {
  const rawTitle = clean(doc.title ?? doc.filename ?? "");
  let title = decodeSafe(rawTitle);

  // si pas de path explicite, regarder url, ou tenter de décoder l'id (base64)
  let path = clean(doc.path ?? doc.url ?? "");

  if (!path && doc.id) {
    const maybeUrl = tryBase64ToUrl(doc.id);
    if (maybeUrl) path = clean(maybeUrl);
  }

  // fallback du titre si absent : extraire le nom de fichier depuis path
  if (!title && path) {
    const parts = path.split("/");
    title = decodeSafe(parts[parts.length - 1] || "Document");
  }

  // si on n'a ni path ni titre correct, on ignore
  if (!path) return null;

  return { title: title || path.split("/").pop() || "Document", path };
}

function formatAIResponse(text: string): string {
  if (!text) return "";

  // Nettoyer retours chariot et tabulations
  let cleanText = text.replace(/\r/g, "").replace(/\t/g, " ").trim();

  // Séparer par lignes pour conserver la structure
  const lines = cleanText.split(/\n+/);

  return lines
    .map((line) => {
      let l = line.trim();
      if (!l) return "";

      // Ajouter une puce si ce n'est pas déjà numéroté ou emoji
      if (!/^\d+\./.test(l) && !/^📝/.test(l) && !/^📅/.test(l)) {
        l = "• " + l;
      }

      // Mettre en gras les numéros en début de ligne (1., 2., ...)
      l = l.replace(/^(\d+)\./, "<strong>$1</strong>.");

      // Mettre en gras les numéros d’intervention
      l = l.replace(
        /intervention n[°\s]*([\d-]+)/gi,
        "📝 <strong>Intervention $1</strong>"
      );

      // Mettre en gras les numéros de devis
      l = l.replace(/devis n[°\s]*([\d-]+)/gi, "📄 <strong>Devis $1</strong>");

      // Mettre en gras les numéros de facture
      l = l.replace(
        /facture n[°\s]*([\d-]+)/gi,
        "💰 <strong>Facture $1</strong>"
      );

      // Mettre en gras les montants en euro
      l = l.replace(/([\d\s,.]+)\s?€+/g, "<strong>$1€</strong>");

      // Mettre en gras toutes les dates (formats dd/mm/yyyy ou dd.mm.yyyy)
      l = l.replace(
        /(\b\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4}\b)/g,
        "📅 <strong>$1</strong>"
      );

      // Remplacer certains mots clés par des emojis
      l = l
        .replace(/durée[:\s]*([\dhm]+)/i, "⏱️ $1")
        .replace(/maintenance/i, "🛠️ Maintenance")
        .replace(/sans remplacement/i, "⚠️ Sans remplacement");

      return l;
    })
    .filter(Boolean)
    .join("\n"); // conserver les sauts de ligne
}

const getFileIcon = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const iconClass = "text-xl"; // ⬅️ avant : text-2xl

  if (!ext) return <span className={iconClass}>📄</span>;

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
    return <span className={iconClass}>🖼️</span>;
  if (["pdf"].includes(ext)) return <span className={iconClass}>📕</span>;
  if (["doc", "docx"].includes(ext))
    return <span className={iconClass}>📘</span>;
  if (["xls", "xlsx", "csv"].includes(ext))
    return <span className={iconClass}>📊</span>;
  if (["mp3", "wav", "ogg"].includes(ext))
    return <span className={iconClass}>🎵</span>;
  if (["mp4", "mov", "avi"].includes(ext))
    return <span className={iconClass}>🎬</span>;

  return <span className={iconClass}>📄</span>;
};

/** --- Composant --- */
export default function ChatPage() {
  const { moduleName } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isInitial, setIsInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  // --- Nouveauté : état pour la prévisualisation ---
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    path: string;
  } | null>(null);

  

  const handleSend = async (userQuery: string) => {
    if (!input.trim() && !attachedFile) return;

    const agentKey: AgentType =
      moduleName === "Aïna DOC"
        ? "doc"
        : moduleName === "Aïna Finance"
        ? "finance"
        : moduleName === "Aïna Vision"
        ? "vision"
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
        attachedFile || undefined
      );

      const aiMessage: Message = {
        text: response.answer,
        isUser: false,
        sources: response.used_docs?.map(normalizeDoc).filter(Boolean) as {
          title: string;
          path: string;
        }[],
        rows: agentKey === "finance" ? response.rows : undefined, // <-- si finance, ajouter le tableau
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erreur API:", error);
      const errorMessage: Message = {
        text: "⚠️ Une erreur est survenue. Veuillez réessayer.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  return (
    <div
      className="min-h-screen w-full
                  bg-gradient-to-r from-white via-slate-100 to-sky-100
                  dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950
                  animate-gradient-x transition-colors duration-300"
    >
      <Header />

      <div className="relative flex flex-col min-h-screen p-6">
        {/* Messages container */}
        {!isInitial && (
          <motion.div
            key="messages"
            className="absolute top-24 bottom-24 left-0 right-0
                     mx-auto flex flex-col items-center gap-6
                     w-full max-w-3xl px-4
                     bg-transparent backdrop-blur
                     rounded-2xl p-6 shadow-md
                     overflow-y-auto scrollbar-thin
                     scrollbar-thumb-indigo-300 scrollbar-track-transparent
                     hover:scrollbar-thumb-indigo-400
                     dark:scrollbar-thumb-indigo-600 dark:hover:scrollbar-thumb-indigo-500"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {messages.map((msg, i) => (
              <div key={i} className="w-full flex justify-center">
                {msg.isUser ? (
                  // ✅ Bloc utilisateur
                  <div className="flex flex-row-reverse items-start gap-2 w-full max-w-xl">
                    {/* Icône utilisateur à droite */}
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-200 text-indigo-900 rounded-full flex items-center justify-center">
                      👤
                    </div>

                    {/* Message utilisateur */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="bg-indigo-700/80 text-white px-4 py-2 rounded-xl max-w-md break-words text-left">
                        {msg.text}
                      </div>

                      {msg.file && (
                        <div className="bg-indigo-100/50 dark:bg-indigo-800/50 px-3 py-1 rounded-md flex items-center gap-2 max-w-sm">
                          {getFileIcon(msg.file.name)}
                          <span className="truncate">{msg.file.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // ✅ Bloc IA
                  <div className="flex flex-col gap-2 items-start w-full max-w-xl">
                    <div className="flex gap-2 items-start w-full">
                      <img
                        src="/logo-blue.png"
                        alt="Aïna"
                        className="w-8 h-8 rounded-full mt-2"
                      />
                      <div
      className="bg-transparent
                 text-gray-900 dark:text-white
                 px-4 py-3 rounded-xl break-words text-left flex-1
                 max-w-[800px] overflow-x-hidden"
    >
      {/* --- TEXTE --- */}
      {msg.text && (
        <TypedText
          text={formatAIResponse(msg.text)}
          speed={20}
          start={true}
          className="whitespace-pre-line mb-2"
          asHTML={true}
        />
      )}

      {/* --- TABLEAU --- */}
      {msg.rows && msg.rows.length > 0 && (
        <JsonTable data={msg.rows} />
      )}
    </div>
  
                    </div>

                    {/* Sources (uniquement pour doc / texte) */}
                    {!msg.rows && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm border border-white/10 text-indigo-900 dark:text-indigo-200 px-4 py-3 rounded-xl w-full text-left shadow-sm">
                        <p className="text-sm font-semibold mb-1">
                          📂 Documents associés :
                        </p>
                        <div className="space-y-1">
                          {msg.sources.map((s, idx) => (
                            <button
                              key={idx}
                              className="block text-left w-full text-sm text-indigo-200 hover:text-black dark:text-indigo-100 dark:hover:text-white underline truncate"
                              title={s.title}
                              onClick={async () => {
                                try {
                                  // 1️⃣ Appel API pour récupérer l’URL SAS
                                  const sasUrl = await getPreviewUrl(s.title);
                                  // 2️⃣ Mise à jour du state avec le lien temporaire
                                  setPreviewDoc({
                                    title: s.title,
                                    path: sasUrl,
                                  });
                                  console.log(s.title)
                                } catch (err) {
                                  console.error("Erreur lors de la prévisualisation :", err);
                                  alert("Impossible d’ouvrir ce document.");
                                }
                              }}
                            >
                              {idx + 1}. 📄 {s.title.replace(/\.pdf$/i, "")}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* --- Loader IA --- */}
            {loading && (
              <div className="flex justify-start items-center gap-2 mt-2 ml-12">
                <img
                  src="/logo-blue.png"
                  alt="Aïna"
                  className="w-8 h-8 rounded-full"
                />
                <div
                  className="bg-gray-100/90 dark:bg-gray-900 text-gray-900 dark:text-white
                    px-4 py-2 rounded-xl flex items-center gap-2 max-w-[300px] animate-pulse"
                >
                  <span> Génération de la réponse...</span>
                  <svg
                    className="w-5 h-5 text-indigo-500 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Prévisualisation modal */}
        {previewDoc && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-3 border-b border-gray-300 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {previewDoc.title}
                </h3>
                <button
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setPreviewDoc(null)}
                >
                  ✖
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <iframe
                  src={previewDoc.path}
                  className="w-full h-full"
                  title={previewDoc.title}
                />
              </div>
            </div>
          </div>
        )}

        {/* === Container regroupant texte + input === */}
        <motion.div
          className="absolute w-full max-w-3xl px-4 flex flex-col items-center"
          initial={{
            top: "50%",
            left: "50%",
            x: "-50%", // centre horizontal
            y: "-50%", // centre vertical
          }}
          animate={
            isInitial
              ? {
                  top: "50%",
                  left: "50%",
                  x: "-50%",
                  y: "-50%", // reste centré
                }
              : {
                  top: "auto",
                  bottom: "2.5rem", // ≈ bottom-10
                  left: "50%",
                  x: "-50%",
                  y: "0%", // annule le centrage vertical
                }
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* --- Typed text --- */}
          {isInitial && (
            <div className="mb-[30px] text-center">
              <TypedText
                text={
                  moduleName === "Aïna DOC"
                    ? "Demandez à vos données"
                    : moduleName === "Aïna Finance"
                    ? "Demandez à vos chiffres"
                    : moduleName === "Aïna Vision"
                    ? "Demandez à vos images"
                    : `Demandez à ${moduleName}, sachez plus…`
                }
                speed={50}
                start={true}
                className="text-gray-900 dark:text-white 
                   text-2xl sm:text-3xl md:text-4xl 
                   font-bold"
              />
            </div>
          )}

          {/* --- Input + boutons --- */}
          <div className="w-full flex justify-center">
            <div
              className="flex items-center gap-2 bg-white dark:bg-gray-900 
                    rounded-xl p-2 shadow-lg w-full max-w-2xl"
            >
              {/* Upload fichier */}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setAttachedFile(file);
                }}
              />
              <button
                onClick={() => document.getElementById("file-upload")?.click()}
                className="p-2 rounded-lg bg-transparent text-indigo-700 
                   hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
              >
                <Plus size={20} />
              </button>

              {/* Champ texte */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Demandez à ${moduleName}…`}
                className="flex-1 bg-transparent outline-none
                   text-gray-900 dark:text-white placeholder-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend(input);
                }}
                disabled={loading}
              />

              {/* === 4️⃣ Micro / Stop === */}
              <button
                onClick={() => {
                  if (!recording) {
                    if (
                      !(
                        "webkitSpeechRecognition" in window ||
                        "SpeechRecognition" in window
                      )
                    ) {
                      alert(
                        "Reconnaissance vocale non supportée par votre navigateur."
                      );
                      return;
                    }

                    const SpeechRecognition =
                      (window as any).SpeechRecognition ||
                      (window as any).webkitSpeechRecognition;
                    const recognition = new SpeechRecognition();
                    recognition.lang = "fr-FR";
                    recognition.interimResults = false;
                    recognition.maxAlternatives = 1;

                    recognitionRef.current = recognition;
                    setRecording(true);
                    recognition.start();

                    recognition.onresult = (event: any) => {
                      const transcript = event.results[0][0].transcript;
                      setInput(transcript);
                    };

                    recognition.onend = () => setRecording(false);
                    recognition.onerror = () => setRecording(false);
                  } else {
                    if (recognitionRef.current) recognitionRef.current.stop();
                    setRecording(false);
                  }
                }}
                className={`p-2 rounded-lg transition ${
                  recording
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-transparent text-indigo-700 hover:bg-indigo-50"
                }`}
              >
                {recording ? "⏹" : <Mic size={20} />}
              </button>

              {/* Envoyer */}
              <button
                onClick={() => handleSend(input)}
                disabled={loading || !input.trim()}
                className="p-2 rounded-lg bg-transparent text-indigo-700 
                   hover:bg-indigo-50 dark:hover:bg-gray-800 
                   transition disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
