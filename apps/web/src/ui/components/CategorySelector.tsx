import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Category = {
    id: string;
    name: string;
};

type Props = {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    error?: string;
};

export default function CategorySelector({ selectedIds, onChange, error }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchCategories() {
            setLoading(true);
            try {
                const res = await api<{ categories: Category[] }>("/categories");
                setCategories(res.categories || []);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    const toggleCategory = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((i) => i !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide">
                Categorias <span className="text-red-500">*</span>
            </label>

            {loading ? (
                <div className="flex items-center gap-2 py-2">
                    <div className="w-3 h-3 border-2 border-sun-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-neutral-400 font-medium">Carregando categorias...</span>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedIds.includes(cat.id)
                                    ? "bg-sun-500 border-sun-500 text-black shadow-sm"
                                    : "bg-neutral-100 border-transparent text-neutral-600 hover:bg-neutral-200"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
        </div>
    );
}
