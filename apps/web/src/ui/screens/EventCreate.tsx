import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LuArrowLeft, LuLoader, LuX } from "react-icons/lu";
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
                    addressZip
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
            </form>
        </div>
    );
}
