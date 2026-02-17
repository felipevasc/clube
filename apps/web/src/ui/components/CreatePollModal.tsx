import { useEffect, useRef, useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { api } from "../../lib/api";
import { LuImage, LuBook, LuTrash2, LuPlus, LuX, LuType, LuBookOpen } from "react-icons/lu";

type PollOptionInput = {
  type: "TEXT" | "BOOK";
  text: string;
  imageUrl?: string;
  bookId?: string;
  bookCover?: string;
  bookTitle?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  city: string;
  clubBookId?: string;
  onCreated: () => void;
};

export default function CreatePollModal({ isOpen, onClose, city, clubBookId, onCreated }: Props) {
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [options, setOptions] = useState<PollOptionInput[]>([
    { type: "TEXT", text: "" },
    { type: "TEXT", text: "" }
  ]);
  const [multiChoice, setMultiChoice] = useState(false);
  const [publicVotes, setPublicVotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableBooks, setAvailableBooks] = useState<any[]>([]);
  const [showBookPickerFor, setShowBookPickerFor] = useState<number | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const optionImageRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    if (isOpen) {
      api<{ books: any[] }>("/books").then(res => setAvailableBooks(res.books || [])).catch(() => { });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const uploadAny = async (f: File) => {
    const res = await fetch("/api/uploads", {
      method: "POST",
      headers: { "content-type": f.type || "application/octet-stream" },
      body: f,
      credentials: "include",
    });
    const text = await res.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { raw: text };
    }
    if (!res.ok) throw new Error(String(json?.error || res.statusText));
    return String(json?.url || "");
  };

  const onPickImage = async (f: File | null) => {
    if (!f) return;
    setUploadingImage(true);
    setError("");
    try {
      const url = await uploadAny(f);
      setImageUrl(url);
    } catch (e: any) {
      setError(e?.message || "Erro ao enviar imagem.");
    } finally {
      setUploadingImage(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onPickOptionImage = async (idx: number, f: File | null) => {
    if (!f) return;
    updateOption(idx, { text: options[idx].text + " (Enviando...)" });
    try {
      const url = await uploadAny(f);
      updateOption(idx, {
        imageUrl: url,
        text: options[idx].text.replace(" (Enviando...)", "")
      });
    } catch (e: any) {
      setError(e?.message || "Erro ao enviar imagem da opção.");
      updateOption(idx, { text: options[idx].text.replace(" (Enviando...)", "") });
    }
  };

  const handleAddOption = () => {
    if (options.length < 10) setOptions([...options, { type: "TEXT", text: "" }]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, patch: Partial<PollOptionInput>) => {
    setOptions(prev => prev.map((o, i) => i === index ? { ...o, ...patch } : o));
  };

  const handleSubmit = async () => {
    const validOptions = options.map((o) => {
      if (o.type === "BOOK" && !o.bookId) return null;
      if (o.type === "TEXT" && !o.text.trim() && !o.imageUrl) return null;
      return o;
    }).filter(Boolean);

    if (!question.trim()) {
      setError("Informe a pergunta.");
      return;
    }
    if (validOptions.length < 2) {
      setError("Informe pelo menos 2 opções válidas.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api("/polls", {
        method: "POST",
        body: JSON.stringify({
          city,
          clubBookId,
          question,
          description,
          imageUrl: imageUrl.trim() || undefined,
          multiChoice,
          publicVotes,
          options: validOptions.map((o) => ({
            type: o!.type,
            text: o!.type === "BOOK" ? o!.bookTitle : o!.text,
            imageUrl: o!.imageUrl,
            bookId: o!.bookId,
          })),
        }),
      });
      onCreated();
      onClose();
    } catch (e: any) {
      setError(e?.message || "Erro ao criar enquete.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-[32px] bg-white shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-neutral-900">Nova Enquete</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition">
            <LuX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {error ? (
            <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">
              {error}
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-neutral-400 mb-2 uppercase tracking-widest">Pergunta</label>
              <input
                className="w-full rounded-2xl border-2 border-neutral-100 bg-neutral-50 px-4 py-3 text-sm font-bold focus:border-sun-500 focus:bg-white outline-none transition-all"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="No que você está pensando?"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-neutral-400 mb-2 uppercase tracking-widest">Descrição (opcional)</label>
              <textarea
                className="w-full rounded-2xl border-2 border-neutral-100 bg-neutral-50 px-4 py-3 text-sm font-bold focus:border-sun-500 focus:bg-white outline-none transition-all resize-none"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Dê mais contexto para a votação..."
              />
            </div>

            <div>
              <label className="block text-xs font-black text-neutral-400 mb-2 uppercase tracking-widest">Imagem de Capa (opcional)</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPickImage(e.target.files?.[0] || null)} />

              {imageUrl ? (
                <div className="relative rounded-3xl overflow-hidden border-2 border-neutral-100 bg-neutral-100 group">
                  <img src={imageUrl} alt="" className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setImageUrl("")}
                      className="px-4 py-2 rounded-full bg-white text-red-600 text-xs font-black shadow-xl hover:scale-105 transition"
                      type="button"
                    >
                      Remover Imagem
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingImage}
                  className="w-full rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-6 text-center hover:border-sun-500 hover:bg-sun-50 transition-all disabled:opacity-60 group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-sun-500 transition-colors">
                      <LuImage size={24} />
                    </div>
                    <div className="text-sm font-black text-neutral-500">
                      {uploadingImage ? "Enviando imagem..." : "Adicionar imagem de capa"}
                    </div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Aparece no topo da enquete</div>
                  </div>
                </button>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest">Alternativas</label>

              <div className="space-y-3">
                {options.map((opt, idx) => (
                  <div key={idx} className="group relative">
                    <div className={`p-1 rounded-[24px] border-2 transition-all ${showBookPickerFor === idx ? 'border-sun-500 bg-sun-50' : 'border-neutral-100 bg-neutral-50 hover:border-neutral-200'}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Option Type Switcher */}
                        <div className="flex flex-col gap-1 p-1 pr-0">
                          <button
                            type="button"
                            onClick={() => {
                              updateOption(idx, { type: "TEXT", bookId: undefined, bookCover: undefined, bookTitle: undefined });
                              if (showBookPickerFor === idx) setShowBookPickerFor(null);
                            }}
                            className={`w-10 h-10 rounded-[18px] flex items-center justify-center transition-all ${opt.type === "TEXT" ? 'bg-white shadow-sm text-neutral-900 border border-black/5' : 'text-neutral-400 hover:bg-neutral-100'}`}
                            title="Texto"
                          >
                            <LuType size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateOption(idx, { type: "BOOK" });
                              setShowBookPickerFor(idx);
                            }}
                            className={`w-10 h-10 rounded-[18px] flex items-center justify-center transition-all ${opt.type === "BOOK" ? 'bg-white shadow-sm text-neutral-900 border border-black/5' : 'text-neutral-400 hover:bg-neutral-100'}`}
                            title="Livro"
                          >
                            <LuBookOpen size={18} />
                          </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 min-w-0 bg-white rounded-[20px] p-2 pr-4 flex items-center gap-3 shadow-sm border border-black/[0.03]">
                          {opt.type === "BOOK" ? (
                            <button
                              type="button"
                              onClick={() => setShowBookPickerFor(idx)}
                              className="flex-1 flex items-center gap-3 text-left"
                            >
                              {opt.bookId ? (
                                <>
                                  <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden border border-black/5">
                                    {opt.bookCover ? <img src={opt.bookCover} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-sun-100 text-sun-600 font-bold text-xs">{opt.bookTitle?.[0]}</div>}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-black text-neutral-900 truncate">{opt.bookTitle}</div>
                                    <div className="text-[10px] font-bold text-sun-600 uppercase">Livro Selecionado</div>
                                  </div>
                                </>
                              ) : (
                                <div className="flex-1 text-sm font-bold text-neutral-400 italic px-2">Clique para selecionar um livro...</div>
                              )}
                            </button>
                          ) : (
                            <>
                              <input
                                className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-bold text-neutral-900 placeholder:text-neutral-300 px-2"
                                value={opt.text}
                                onChange={(e) => updateOption(idx, { text: e.target.value })}
                                placeholder={`Alternativa ${idx + 1}`}
                              />

                              <div className="flex items-center gap-1">
                                <input
                                  type="file"
                                  className="hidden"
                                  ref={el => optionImageRefs.current[idx] = el}
                                  onChange={e => onPickOptionImage(idx, e.target.files?.[0] || null)}
                                />

                                {opt.imageUrl ? (
                                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-black/5 group/img">
                                    <img src={opt.imageUrl} className="w-full h-full object-cover" />
                                    <button
                                      onClick={() => updateOption(idx, { imageUrl: undefined })}
                                      className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                                    >
                                      <LuX size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => optionImageRefs.current[idx]?.click()}
                                    className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-colors"
                                    title="Adicionar imagem"
                                  >
                                    <LuImage size={18} />
                                  </button>
                                )}
                              </div>
                            </>
                          )}

                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(idx)}
                              className="p-2 text-neutral-300 hover:text-red-500 transition-colors"
                            >
                              <LuTrash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Simple Book Selector Popover */}
                    {showBookPickerFor === idx && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-10 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-2 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-3 py-2 flex items-center justify-between border-b border-neutral-50 mb-1">
                          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Selecione o Livro</span>
                          <button
                            type="button"
                            onClick={() => setShowBookPickerFor(null)}
                            className="w-5 h-5 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400"
                          >
                            <LuX size={12} />
                          </button>
                        </div>
                        <div className="space-y-1">
                          {availableBooks.map(b => (
                            <button
                              key={b.id}
                              onClick={() => {
                                updateOption(idx, {
                                  bookId: b.id,
                                  bookTitle: b.title,
                                  bookCover: b.coverUrl || undefined,
                                  type: "BOOK"
                                });
                                setShowBookPickerFor(null);
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-sun-50 flex items-center gap-3 transition-colors group"
                            >
                              <div className="w-8 h-10 rounded bg-neutral-100 overflow-hidden shrink-0 border border-black/5">
                                {b.coverUrl ? <img src={b.coverUrl} className="w-full h-full object-cover" /> : null}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-neutral-900 truncate group-hover:text-sun-700">{b.title}</div>
                                <div className="text-[10px] text-neutral-500 truncate">{b.author}</div>
                              </div>
                            </button>
                          ))}
                          {availableBooks.length === 0 && <div className="p-4 text-center text-xs text-neutral-400 italic">Nenhum livro encontrado</div>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 10 && (
                <button
                  onClick={handleAddOption}
                  type="button"
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-neutral-100 text-sm font-black text-neutral-400 hover:border-sun-500 hover:text-sun-600 hover:bg-sun-50 transition-all flex items-center justify-center gap-2 group"
                >
                  <LuPlus size={18} className="group-hover:scale-110 transition-transform" />
                  Adicionar Outra Opção
                </button>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <label className="flex items-center gap-3 p-4 rounded-[20px] bg-neutral-50 border-2 border-transparent hover:border-sun-100 cursor-pointer transition-all">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${multiChoice ? 'bg-sun-500 border-sun-600 text-white' : 'bg-white border-neutral-200'}`}>
                  {multiChoice && <LuPlus size={14} className="stroke-[4]" />}
                </div>
                <input
                  type="checkbox"
                  checked={multiChoice}
                  onChange={(e) => setMultiChoice(e.target.checked)}
                  className="hidden"
                />
                <div className="flex-1">
                  <div className="text-sm font-black text-neutral-900">Múltipla Escolha</div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">Permitir selecionar várias opções</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-[20px] bg-neutral-50 border-2 border-transparent hover:border-sun-100 cursor-pointer transition-all">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${publicVotes ? 'bg-sun-500 border-sun-600 text-white' : 'bg-white border-neutral-200'}`}>
                  {publicVotes && <LuPlus size={14} className="stroke-[4]" />}
                </div>
                <input
                  type="checkbox"
                  checked={publicVotes}
                  onChange={(e) => setPublicVotes(e.target.checked)}
                  className="hidden"
                />
                <div className="flex-1">
                  <div className="text-sm font-black text-neutral-900">Voto Público</div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">Mostrar publicamente quem votou em cada opção</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl text-sm font-black text-neutral-500 hover:bg-neutral-100 transition shadow-sm active:scale-95"
            type="button"
          >
            Cancelar
          </button>
          <div className="flex-[2]">
            <PrimaryButton
              onClick={handleSubmit}
              disabled={loading || uploadingImage}
              className="w-full !py-4 shadow-xl active:scale-95 transition-transform"
            >
              {loading ? "Criando..." : "Lançar Enquete"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
