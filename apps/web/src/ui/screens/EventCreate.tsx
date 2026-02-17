import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LuArrowLeft, LuLoader, LuX, LuBookOpen, LuChevronRight, LuSearch, LuPlus } from "react-icons/lu";
import { ImageUpload } from "../components/ImageUpload";

// Fix for default Leaflet marker icons in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }: { position: { lat: number; lng: number } | null, setPosition: (p: { lat: number; lng: number }) => void }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function EventCreate() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [city, setCity] = useState<"FORTALEZA" | "BRASILIA">("FORTALEZA");
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [locationPhotos, setLocationPhotos] = useState<string[]>([""]);

    // Address State
    const [locationName, setLocationName] = useState("");
    const [addressStreet, setAddressStreet] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [addressDistrict, setAddressDistrict] = useState("");
    const [addressCity, setAddressCity] = useState("Fortaleza");
    const [addressState, setAddressState] = useState("CE");
    const [addressZip, setAddressZip] = useState("");

    // Map State
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: -3.7319, lng: -38.5267 });

    const [searching, setSearching] = useState(false);

    // Club Books State
    const [clubBooks, setClubBooks] = useState<any[]>([]);
    const [selectedClubBookId, setSelectedClubBookId] = useState("");
    const [showBookPicker, setShowBookPicker] = useState(false);

    useEffect(() => {
        api(`/club-books?city=${city}`).then((res: any) => {
            setClubBooks(res.clubBooks || []);
        }).catch(err => console.error("Failed to fetch club books", err));
    }, [city]);

    // Default center based on city
    useMemo(() => {
        if (city === "BRASILIA") {
            setMapCenter({ lat: -15.7975, lng: -47.8919 });
            setAddressCity("Brasília");
            setAddressState("DF");
        } else {
            setMapCenter({ lat: -3.7319, lng: -38.5267 }); // Fortaleza
            setAddressCity("Fortaleza");
            setAddressState("CE");
        }
    }, [city]);

    const handleSearchAddress = async () => {
        if (!locationName) return;
        setSearching(true);
        setError("");

        try {
            // Include city in query to improve accuracy
            const query = `${locationName}, ${city === "BRASILIA" ? "Brasília" : "Fortaleza"}, Brasil`;
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=1`);
            const data = await res.json();

            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);

                setPosition({ lat, lng });
                setMapCenter({ lat, lng });

                // Fill details if available
                const addr = result.address;
                if (addr) {
                    if (addr.road) setAddressStreet(addr.road);
                    if (addr.house_number) setAddressNumber(addr.house_number);
                    if (addr.suburb || addr.neighbourhood) setAddressDistrict(addr.suburb || addr.neighbourhood);
                    if (addr.postcode) setAddressZip(addr.postcode);
                }
            } else {
                setError("Endereço não encontrado.");
            }
        } catch (e) {
            console.error("Geocoding error", e);
            setError("Erro ao buscar endereço.");
        } finally {
            setSearching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !startAt || !locationName) {
            setError("Preencha os campos obrigatórios.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await api("/events", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    description,
                    city,
                    location: locationName,
                    latitude: position?.lat,
                    longitude: position?.lng,
                    startAt: new Date(startAt).toISOString(),
                    endAt: endAt ? new Date(endAt).toISOString() : undefined,
                    locationPhotos: locationPhotos.filter(Boolean),
                    addressStreet,
                    addressNumber,

                    addressDistrict,
                    addressCity,
                    addressState,
                    addressZip,
                    clubBookId: selectedClubBookId || undefined,
                }),
            });
            navigate("/encontros");
        } catch (e: any) {
            setError(e.message || "Erro ao criar evento.");
            setSubmitting(false);
        }
    };

    // Component to update map center programmatically
    function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
        const map = useMapEvents({});
        useMemo(() => {
            map.flyTo(center, 16);
        }, [center, map]);
        return null;
    }

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200"
                >
                    <LuArrowLeft />
                </button>
                <h1 className="text-xl font-bold font-black text-neutral-900">Novo Encontro</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

                {/* City Selection */}
                <div className="flex p-1 bg-neutral-100 rounded-xl relative">
                    <button
                        type="button"
                        onClick={() => { setCity("FORTALEZA"); setPosition(null); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${city === "FORTALEZA" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}
                    >
                        FORTALEZA
                    </button>
                    <button
                        type="button"
                        onClick={() => { setCity("BRASILIA"); setPosition(null); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${city === "BRASILIA" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}
                    >
                        BRASÍLIA
                    </button>
                </div>

                {/* Location Search Section */}
                <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wide">Localização</h3>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Buscar Endereço / Local</label>
                            <input
                                type="text"
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                                className="w-full p-3 bg-neutral-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5 transition"
                                placeholder="Ex: Parque do Cocó"
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchAddress(); } }}
                            />
                        </div>
                        <div className="self-end">
                            <button
                                type="button"
                                onClick={handleSearchAddress}
                                disabled={searching || !locationName}
                                className="h-[46px] px-4 bg-neutral-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-neutral-800 disabled:opacity-50"
                            >
                                {searching ? <LuLoader className="animate-spin" /> : "Buscar"}
                            </button>
                        </div>
                    </div>

                    {/* Address Details (Collapsible or always visible?) - Always visible for verification */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Rua / Logradouro</label>
                            <input type="text" value={addressStreet} onChange={e => setAddressStreet(e.target.value)} className="w-full p-2 bg-neutral-50 text-sm rounded-lg outline-none" placeholder="Rua..." />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Número</label>
                            <input type="text" value={addressNumber} onChange={e => setAddressNumber(e.target.value)} className="w-full p-2 bg-neutral-50 text-sm rounded-lg outline-none" placeholder="123" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Bairro</label>
                            <input type="text" value={addressDistrict} onChange={e => setAddressDistrict(e.target.value)} className="w-full p-2 bg-neutral-50 text-sm rounded-lg outline-none" placeholder="Bairro" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">CEP</label>
                            <input type="text" value={addressZip} onChange={e => setAddressZip(e.target.value)} className="w-full p-2 bg-neutral-50 text-sm rounded-lg outline-none" placeholder="00000-000" />
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden h-48 border border-black/5 relative z-0">
                        <MapContainer
                            key={city}
                            center={mapCenter}
                            zoom={13}
                            scrollWheelZoom={false}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapUpdater center={mapCenter} />
                            <LocationMarker position={position} setPosition={setPosition} />
                        </MapContainer>
                        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur text-[10px] p-1.5 rounded-lg text-center pointer-events-none z-[1000] text-neutral-600">
                            {position ? "Local marcado!" : "Busque um endereço ou toque no mapa"}
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Título</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 bg-neutral-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5 transition font-medium"
                            placeholder="Ex: Leitura no Parque"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Descrição</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 bg-neutral-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5 transition min-h-[100px]"
                            placeholder="Detalhes sobre o encontro..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Início</label>
                            <input
                                type="datetime-local"
                                value={startAt}
                                onChange={(e) => setStartAt(e.target.value)}
                                className="w-full p-3 bg-neutral-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5 transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Fim (Opcional)</label>
                            <input
                                type="datetime-local"
                                value={endAt}
                                onChange={(e) => setEndAt(e.target.value)}
                                className="w-full p-3 bg-neutral-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5 transition"
                            />
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Livro do Mês (Opcional)</label>

                    {!selectedClubBookId ? (
                        <button
                            type="button"
                            onClick={() => setShowBookPicker(!showBookPicker)}
                            className="w-full p-4 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-200 flex items-center justify-center gap-2 text-neutral-400 hover:border-sun-400 hover:bg-sun-50 hover:text-sun-600 transition-all"
                        >
                            <LuBookOpen className="w-5 h-5" />
                            <span className="text-sm font-bold">Selecionar Livro</span>
                        </button>
                    ) : (
                        <div className="space-y-2">
                            {clubBooks.filter(b => b.id === selectedClubBookId).map(book => (
                                <div key={book.id} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-black/5 shadow-sm relative group">
                                    <div className="w-12 h-16 bg-neutral-200 rounded-md overflow-hidden shrink-0 shadow-sm border border-black/5">
                                        {book.coverUrl ? (
                                            <img src={book.coverUrl} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-300">
                                                <LuBookOpen />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-sun-600 uppercase mb-0.5">{book.month}/{book.year}</div>
                                        <div className="font-bold text-neutral-900 leading-tight truncate">{book.title}</div>
                                        <div className="text-xs text-neutral-500 truncate">{book.author}</div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedClubBookId("")}
                                        className="absolute top-2 right-2 w-6 h-6 bg-white text-neutral-400 rounded-full shadow-sm flex items-center justify-center hover:text-red-500 hover:bg-red-50 transition-colors border border-black/5"
                                    >
                                        <LuX size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setShowBookPicker(!showBookPicker)}
                                className="text-xs font-bold text-neutral-400 hover:text-neutral-600 hover:underline px-1"
                            >
                                Trocar livro
                            </button>
                        </div>
                    )}

                    {/* Custom Popover */}
                    {showBookPicker && (
                        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-3 py-2 flex items-center justify-between border-b border-neutral-50 mb-1">
                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Selecione o Livro</span>
                                <button
                                    type="button"
                                    onClick={() => setShowBookPicker(false)}
                                    className="w-5 h-5 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400"
                                >
                                    <LuX size={12} />
                                </button>
                            </div>
                            <div className="space-y-1">
                                {clubBooks.map(b => (
                                    <button
                                        key={b.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedClubBookId(b.id);
                                            setShowBookPicker(false);
                                        }}
                                        className={`w-full text-left p-2 rounded-xl flex items-center gap-3 transition-colors group ${selectedClubBookId === b.id ? 'bg-sun-50' : 'hover:bg-neutral-50'}`}
                                    >
                                        <div className="w-8 h-10 rounded bg-neutral-100 overflow-hidden shrink-0 border border-black/5">
                                            {b.coverUrl ? <img src={b.coverUrl} className="w-full h-full object-cover" /> : null}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className={`text-xs font-bold truncate ${selectedClubBookId === b.id ? 'text-sun-700' : 'text-neutral-900'}`}>{b.title}</div>
                                                <div className="text-[10px] font-black text-neutral-400 bg-neutral-100 px-1.5 rounded">{b.month}/{b.year}</div>
                                            </div>
                                            <div className="text-[10px] text-neutral-500 truncate">{b.author}</div>
                                        </div>
                                    </button>
                                ))}
                                {clubBooks.length === 0 && <div className="p-4 text-center text-xs text-neutral-400 italic">Nenhum livro disponível nesta cidade.</div>}
                            </div>
                        </div>
                    )}
                </div>


                {/* Location Photos */}
                <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Fotos do Local</label>
                    <div className="grid grid-cols-2 gap-3">
                        {locationPhotos.map((url, index) => (
                            <div key={index} className="relative">
                                <ImageUpload
                                    value={url}
                                    onChange={(newUrl) => {
                                        const newPhotos = [...locationPhotos];
                                        newPhotos[index] = newUrl;
                                        setLocationPhotos(newPhotos);
                                    }}
                                    label={`Foto ${index + 1}`}
                                />
                                {locationPhotos.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newPhotos = locationPhotos.filter((_, i) => i !== index);
                                            setLocationPhotos(newPhotos);
                                        }}
                                        className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        <LuX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {locationPhotos.length < 6 && (
                            <button
                                type="button"
                                onClick={() => setLocationPhotos([...locationPhotos, ""])}
                                className="aspect-video rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-1 text-neutral-400 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
                            >
                                <span className="text-2xl font-light">+</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Mais Foto</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {submitting ? <LuLoader className="animate-spin" /> : "Criar Encontro"}
                    </button>
                </div>
            </form >
        </div >
    );
}
