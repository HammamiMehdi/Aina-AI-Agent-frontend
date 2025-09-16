'use client'

import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Mic, Plus, Send } from "lucide-react";
import Header from "../../components/Header/Header";
import {  motion } from "framer-motion";
import TypedText from "../../components/TypedText/TypedText";
import { askQuestion } from "../../service/ragService";


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
function normalizeDoc(doc: RawSourceDoc): { title: string; path: string } | null {
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
      l = l.replace(/intervention n[°\s]*([\d-]+)/gi, "📝 <strong>Intervention $1</strong>");

      // Mettre en gras les numéros de devis
      l = l.replace(/devis n[°\s]*([\d-]+)/gi, "📄 <strong>Devis $1</strong>");

      // Mettre en gras les numéros de facture
      l = l.replace(/facture n[°\s]*([\d-]+)/gi, "💰 <strong>Facture $1</strong>");

      // Mettre en gras les montants en euro
      l = l.replace(/([\d\s,.]+)\s?€+/g, "<strong>$1€</strong>");

      // Mettre en gras toutes les dates (formats dd/mm/yyyy ou dd.mm.yyyy)
      l = l.replace(/(\b\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4}\b)/g, "📅 <strong>$1</strong>");

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






/** --- Composant --- */
export default function ChatPage() {
  const { moduleName } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isInitial, setIsInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  // --- Nouveauté : état pour la prévisualisation ---
  const [previewDoc, setPreviewDoc] = useState<{ title: string; path: string } | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInput("");
    setLoading(true);
    if (isInitial) setIsInitial(false);

    try {
      const response = await askQuestion(userMessage, 3);
      const rawDocs: RawSourceDoc[] = (response as any).used_docs ?? (response as any).citations ?? [];
      const normalized = (rawDocs || []).map(normalizeDoc).filter((s): s is { title: string; path: string } => s !== null);

      const aiMessage: Message = {
        text: response.answer ?? "Je n'ai pas pu générer de réponse.",
        isUser: false,
        sources: normalized,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Erreur API:", err);
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Une erreur est survenue, veuillez réessayer.", isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [recording, setRecording] = useState(false);
const recognitionRef = useRef<any>(null);

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-white via-slate-100 to-sky-100 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 animate-gradient-x transition-colors duration-300">
      <Header />

      <div className="relative flex flex-col min-h-screen p-6">
        {/* Messages container */}
        {!isInitial && (
          <motion.div
            key="messages"
            className="absolute top-24 bottom-24 left-6 right-6 overflow-y-auto bg-white/10 backdrop-blur rounded-2xl p-4 shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 ${msg.isUser ? "flex justify-start" : "flex justify-end"}`}
              >
                {msg.isUser ? (
                  <div className="flex gap-2 items-end">
                    <div className="flex items-center justify-center w-8 h-8 bg-white/20 text-white rounded-full">
                      👤
                    </div>
                    <div className="bg-indigo-700/80 text-white px-4 py-2 rounded-xl max-w-md break-words text-left">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 items-end w-full max-w-xl">
                    {/* Bloc IA */}
                    <div className="flex gap-2 items-start w-full">
                    <div className="bg-gray-800/90 text-white px-4 py-3 rounded-xl break-words text-left flex-1 max-w-[600px] overflow-x-hidden">
  <TypedText
    text={formatAIResponse(msg.text)}
    speed={20}
    start={true}
    className="whitespace-pre-line"
    asHTML={true}
  />
</div>
                      <img
                        src="/logo-blue.png"
                        alt="Aïna"
                        className="w-8 h-8 rounded-full mt-2"
                      />
                    </div>

                    {/* Bloc Sources avec preview */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 bg-gray-700/80 text-indigo-200 px-4 py-3 rounded-xl w-full text-left">
                        <p className="text-sm font-semibold mb-1">📂 Documents associés :</p>
                        <div className="space-y-1">
                          {msg.sources.map((s, idx) => (
                            <button
                              key={idx}
                              className="block text-left w-full text-sm text-indigo-300 hover:text-indigo-100 underline truncate"
                              title={s.title}
                              onClick={() => setPreviewDoc(s)} // ouvre la preview
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
          </motion.div>
        )}

        {/* Prévisualisation modal */}
        {previewDoc && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-3 border-b border-gray-300 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{previewDoc.title}</h3>
                <button
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setPreviewDoc(null)}
                >
                  ✖
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                {/* PDF ou iframe pour prévisualisation */}
                {previewDoc.path.endsWith(".pdf") ? (
                  <iframe
                    src={previewDoc.path}
                    className="w-full h-full"
                    title={previewDoc.title}
                  />
                ) : (
                  <iframe
                    src={previewDoc.path}
                    className="w-full h-full"
                    title={previewDoc.title}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* initial typed text */}
        {isInitial && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-16 text-center">
            <TypedText
              text={`Demandez à ${moduleName}, sachez plus…`}
              speed={50}
              start={true}
              className="text-white text-lg font-semibold"
            />
          </div>
        )}

        {/* input */}
        {/* input avec audio et upload */}

        <motion.div
  className="w-full flex justify-center mb-5"
  animate={{
    bottom: isInitial ? "40%" : 0,
    top: isInitial ? "auto" : "auto",
    y: isInitial ? "-50%" : 0,
    position: "absolute",
  }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  <div className="flex items-center gap-2 bg-white rounded-xl p-2 shadow-lg w-5/6 max-w-2xl">
    {/* Bouton Plus / ajout fichier */}
    <button className="p-2 rounded-lg bg-transparent text-indigo-700 hover:bg-indigo-50 transition">
      <Plus size={20} />
    </button>

    {/* Input texte */}
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder={`Demandez à ${moduleName}…`}
      className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
      onKeyDown={(e) => e.key === "Enter" && handleSend()}
      disabled={loading}
    />

    {/* Bouton Send */}
    <button
      onClick={handleSend}
      disabled={loading || !input.trim()}
      className="p-2 rounded-lg bg-transparent text-indigo-700 hover:bg-indigo-50 transition disabled:opacity-50"
    >
      <Send size={20} />
    </button>

    {/* Bouton Micro / Arrêt */}
    <button
      onClick={() => {
        if (!recording) {
          // Démarrer enregistrement vocal
          if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Reconnaissance vocale non supportée par votre navigateur.');
            return;
          }

          const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = 'fr-FR';
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          recognitionRef.current = recognition;
          setRecording(true);
          recognition.start();

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
          };

          recognition.onend = () => {
            setRecording(false); // redevient micro automatiquement
          };

          recognition.onerror = (event: any) => {
            console.error('Erreur reconnaissance vocale:', event.error);
            setRecording(false);
          };
        } else {
          // Arrêter enregistrement
          if (recognitionRef.current) recognitionRef.current.stop();
          setRecording(false);
        }
      }}
      className={`p-2 rounded-lg transition ${
        recording ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-transparent text-indigo-700 hover:bg-indigo-50'
      }`}
    >
      {recording ? '⏹' : <Mic size={20} />}
    </button>

    {/* Indicateur enregistrement */}
    {recording && (
      <span className="ml-2 text-sm text-red-600 font-semibold animate-pulse">
        🎤 Enregistrement en cours...
      </span>
    )}
  </div>
</motion.div>


      </div>
    </div>
  );
}
