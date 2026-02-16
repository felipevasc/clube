import { useRef, useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { api } from "../../lib/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  clubBookId: string;
  onCreated: () => void;
};

export default function CreatePollModal({ isOpen, onClose, clubBookId, onCreated }: Props) {
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [options, setOptions] = useState(["", ""]);
  const [multiChoice, setMultiChoice] = useState(false);
  const [publicVotes, setPublicVotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement | null>(null);

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

  const handleAddOption = () => {
    if (options.length < 10) setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  const handleChangeOption = (index: number, val: string) => {
    const next = [...options];
    next[index] = val;
    setOptions(next);
  };

  const handleSubmit = async () => {
    const validOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim()) {
      setError("Informe a pergunta.");
      return;
    }
    if (validOptions.length < 2) {
      setError("Informe pelo menos 2 opcoes.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api("/polls", {
        method: "POST",
        body: JSON.stringify({
          clubBookId,
          question,
          description,
          imageUrl: imageUrl.trim() || undefined,
          multiChoice,
          publicVotes,
          options: validOptions.map((text) => ({ text })),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-black mb-4">Nova Enquete</h2>

        {error ? (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
        ) : null}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Pergunta</label>
            <input
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Qual o melhor personagem?"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Descricao (opcional)</label>
            <textarea
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none resize-none"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre a votacao..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase">Imagem (opcional)</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPickImage(e.target.files?.[0] || null)} />

            {imageUrl ? (
              <div className="rounded-3xl overflow-hidden border border-black/10 bg-neutral-100">
                <img src={imageUrl} alt="" className="w-full h-44 object-cover" />
                <div className="p-3 flex items-center justify-between">
                  <div className="text-xs font-bold text-neutral-600 truncate">Imagem anexada</div>
                  <button
                    onClick={() => setImageUrl("")}
                    className="px-3 py-1.5 rounded-full text-xs font-black bg-white border border-black/10 hover:bg-neutral-50 transition"
                    type="button"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploadingImage}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-left hover:bg-black/[0.02] transition disabled:opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-black text-neutral-800">Selecionar imagem</div>
                  <div className="text-xs font-bold text-neutral-500">{uploadingImage ? "Enviando..." : "Abrir"}</div>
                </div>
                <div className="mt-1 text-xs text-neutral-500">A imagem aparece no topo da enquete.</div>
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase">Opcoes</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
                    value={opt}
                    onChange={(e) => handleChangeOption(i, e.target.value)}
                    placeholder={`Opcao ${i + 1}`}
                  />
                  {options.length > 2 ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(i)}
                      className="p-2 text-neutral-400 hover:text-red-500 transition"
                      title="Remover"
                    >
                      x
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            {options.length < 10 ? (
              <button onClick={handleAddOption} type="button" className="mt-2 text-xs font-bold text-sun-600 hover:text-sun-700 transition">
                + Adicionar opcao
              </button>
            ) : null}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={multiChoice}
                onChange={(e) => setMultiChoice(e.target.checked)}
                className="rounded border-gray-300 text-sun-600 focus:ring-sun-500"
              />
              <span className="text-sm text-neutral-700">Permitir selecionar varias opcoes</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={publicVotes}
                onChange={(e) => setPublicVotes(e.target.checked)}
                className="rounded border-gray-300 text-sun-600 focus:ring-sun-500"
              />
              <span className="text-sm text-neutral-700">Mostrar quem votou (voto publico)</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-neutral-500 hover:bg-neutral-100 transition" type="button">
              Cancelar
            </button>
            <PrimaryButton onClick={handleSubmit} disabled={loading || uploadingImage}>
              {loading ? "Criando..." : "Criar Enquete"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
