import { useState, useRef, useMemo } from "react";
import { api } from "../../lib/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LuX, LuLoader, LuImage, LuMapPin, LuCalendar, LuType, LuAlignLeft, LuTrash2, LuPlus } from "react-icons/lu";
import { ImageUpload } from "../components/ImageUpload";
import ConfirmModal from "../components/ConfirmModal";

interface EventPhoto {
    id: string;
    url: string;
    type: 'LOCATION' | 'GALLERY';
}

interface ClubEventDetail {
    id: string;
    title: string;
    description: string;
    city: string;
    location: string;
    addressStreet?: string;
    addressNumber?: string;
    addressDistrict?: string;
    addressCity?: string;
    addressState?: string;
    addressZip?: string;
    latitude?: number;
    longitude?: number;
    startAt: string;
    endAt?: string;
    photos: EventPhoto[];
}

interface EventEditModalProps {
    event: ClubEventDetail;
    onClose: () => void;
    onUpdated: () => void;
}

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

export default function EventEditModal({ event, onClose, onUpdated }: EventEditModalProps) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    // Form State
    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description);
    const [city, setCity] = useState(event.city as "FORTALEZA" | "BRASILIA");

    // ISO format for datetime-local input: YYYY-MM-DDThh:mm
    const formatForInput = (iso?: string) => iso ? iso.slice(0, 16) : "";

    const [startAt, setStartAt] = useState(formatForInput(event.startAt));
    const [endAt, setEndAt] = useState(formatForInput(event.endAt));

    const initialLocationPhotos = event.photos.filter(p => p.type === 'LOCATION').map(p => p.url);
    const [locationPhotos, setLocationPhotos] = useState<string[]>(initialLocationPhotos.length > 0 ? initialLocationPhotos : [""]);

    // Address State
    const [locationName, setLocationName] = useState(event.location);
    const [addressStreet, setAddressStreet] = useState(event.addressStreet || "");
    const [addressNumber, setAddressNumber] = useState(event.addressNumber || "");
    const [addressDistrict, setAddressDistrict] = useState(event.addressDistrict || "");
    const [addressCity, setAddressCity] = useState(event.addressCity || (city === "BRASILIA" ? "Brasília" : "Fortaleza"));
    const [addressState, setAddressState] = useState(event.addressState || (city === "BRASILIA" ? "DF" : "CE"));
    const [addressZip, setAddressZip] = useState(event.addressZip || "");

    // Map State
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
        event.latitude && event.longitude ? { lat: event.latitude, lng: event.longitude } : null
    );
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
        event.latitude && event.longitude ? { lat: event.latitude, lng: event.longitude } : (city === "BRASILIA" ? { lat: -15.7975, lng: -47.8919 } : { lat: -3.7319, lng: -38.5267 })
    );

    const [searching, setSearching] = useState(false);

    const handleSearchAddress = async () => {
        if (!locationName) return;
        setSearching(true);
        setError("");

        try {
            const query = `${locationName}, ${city === "BRASILIA" ? "Brasília" : "Fortaleza"}, Brasil`;
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=1`);
            const data = await res.json();

            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);

                setPosition({ lat, lng });
                setMapCenter({ lat, lng });

                const addr = result.address;
                if (addr) {
                    if (addr.road) setAddressStreet(addr.road);
                    if (addr.house_number) setAddressNumber(addr.house_number);
                    if (addr.suburb || addr.neighbourhood) setAddressDistrict(addr.suburb || addr.neighbourhood);
                    if (addr.postcode) setAddressZip(addr.postcode);
                }
            } else {
                setError("Endereço não encontrado. Tente ser mais específico ou use o mapa.");
            }
        } catch (e) {
            setError("Erro ao buscar endereço.");
        } finally {
            setSearching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const body = {
                title,
                description,
                city,
                location: locationName,
                addressStreet,
                addressNumber,
                addressDistrict,
                addressCity,
                addressState,
                addressZip,
                latitude: position?.lat,
                longitude: position?.lng,
                startAt: new Date(startAt).toISOString(),
                endAt: endAt ? new Date(endAt).toISOString() : undefined,
                locationPhotos: locationPhotos.filter(p => !!p),
            };

            await api(`/events/${event.id}`, {
                method: "PUT",
                body: JSON.stringify(body),
            });

            onUpdated();
            onClose();
        } catch (e: any) {
            setError(e.message || "Erro ao atualizar evento");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setSubmitting(true);
        setError("");
        try {
            await api(`/events/${event.id}`, { method: "DELETE" });
            setShowConfirmDelete(false);
            onUpdated(); // This will trigger a refresh or navigate away depending on how the parent handles it
            onClose();
        } catch (e: any) {
            setError(e.message || "Erro ao remover evento");
            setSubmitting(false);
            setShowConfirmDelete(false);
        }
    };

    const handleAddPhotoField = () => {
        setLocationPhotos([...locationPhotos, ""]);
    };

    return (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                <header className="px-8 py-6 border-b border-black/5 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-2xl font-black text-neutral-900 leading-none">Editar Evento</h2>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-2">{event.title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                        <LuX size={24} className="text-neutral-400" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <form onSubmit={handleSubmit} id="event-edit-form" className="space-y-8">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
                                <LuX className="shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Basic Info */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-sun-600 font-black uppercase text-xs tracking-widest">
                                <LuType size={14} />
                                <span>Informações Básicas</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1.5">Título do Evento</label>
                                    <input
                                        required
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Ex: Piquenique Literário no Parque"
                                        className="w-full h-14 px-6 bg-neutral-50 rounded-2xl border border-black/5 text-sm font-bold placeholder:text-neutral-300 focus:outline-none focus:ring-4 focus:ring-sun-500/10 focus:border-sun-500 transition-all shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1.5">Descrição</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Conte mais sobre o encontro..."
                                        className="w-full p-6 bg-neutral-50 rounded-2xl border border-black/5 text-sm font-bold placeholder:text-neutral-300 focus:outline-none focus:ring-4 focus:ring-sun-500/10 focus:border-sun-500 transition-all shadow-sm resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Date & Time */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-sun-600 font-black uppercase text-xs tracking-widest">
                                <LuCalendar size={14} />
                                <span>Data e Horário</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1.5">Início</label>
                                    <input
                                        required
                                        type="datetime-local"
                                        value={startAt}
                                        onChange={e => setStartAt(e.target.value)}
                                        className="w-full h-14 px-6 bg-neutral-50 rounded-2xl border border-black/5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sun-500/10 focus:border-sun-500 transition-all shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1.5">Fim (Opcional)</label>
                                    <input
                                        type="datetime-local"
                                        value={endAt}
                                        onChange={e => setEndAt(e.target.value)}
                                        className="w-full h-14 px-6 bg-neutral-50 rounded-2xl border border-black/5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sun-500/10 focus:border-sun-500 transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Photos */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-sun-600 font-black uppercase text-xs tracking-widest">
                                <LuImage size={14} />
                                <span>Fotos do Local</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {locationPhotos.map((url, idx) => (
                                    <div key={idx} className="relative group/photo">
                                        <ImageUpload
                                            value={url}
                                            onChange={(newUrl) => {
                                                const copy = [...locationPhotos];
                                                copy[idx] = newUrl;
                                                setLocationPhotos(copy);
                                            }}
                                            label={idx === 0 ? "Foto Principal" : `Foto ${idx + 1}`}
                                        />
                                        {idx > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setLocationPhotos(locationPhotos.filter((_, i) => i !== idx))}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/photo:opacity-100 transition-opacity z-10"
                                            >
                                                <LuTrash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddPhotoField}
                                    className="aspect-video rounded-3xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-sun-600 hover:border-sun-500 hover:bg-sun-50 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-neutral-50 group-hover:bg-sun-100 flex items-center justify-center transition-colors">
                                        <LuPlus size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider">Adicionar Foto</span>
                                </button>
                            </div>
                        </section>

                        {/* Location */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-sun-600 font-black uppercase text-xs tracking-widest">
                                <LuMapPin size={14} />
                                <span>Localização</span>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1.5">Cidade</label>
                                        <select
                                            value={city}
                                            onChange={e => setCity(e.target.value as any)}
                                            className="w-full h-14 px-6 bg-neutral-50 rounded-2xl border border-black/5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sun-500/10 focus:border-sun-500 transition-all shadow-sm appearance-none"
                                        >
                                            <option value="FORTALEZA">Fortaleza</option>
                                            <option value="BRASILIA">Brasília</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1.5">Nome do Local</label>
                                        <div className="flex gap-2 min-w-0">
                                            <input
                                                required
                                                value={locationName}
                                                onChange={e => setLocationName(e.target.value)}
                                                placeholder="Ex: Coffee Shop"
                                                className="flex-1 h-14 px-6 bg-neutral-50 rounded-2xl border border-black/5 text-sm font-bold placeholder:text-neutral-300 focus:outline-none focus:ring-4 focus:ring-sun-500/10 focus:border-sun-500 transition-all shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleSearchAddress}
                                                disabled={searching}
                                                className="h-14 w-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 disabled:opacity-50 transition-colors shrink-0 shadow-sm"
                                            >
                                                {searching ? <LuLoader className="animate-spin" size={20} /> : <LuMapPin size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-64 rounded-[2rem] overflow-hidden border border-black/5 shadow-inner relative z-0">
                                    <MapContainer
                                        center={[mapCenter.lat, mapCenter.lng]}
                                        zoom={14}
                                        style={{ height: "100%", width: "100%" }}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker position={position} setPosition={setPosition} />
                                    </MapContainer>
                                </div>

                                <div className="grid grid-cols-12 gap-3">
                                    <div className="col-span-8">
                                        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1.5">Rua</label>
                                        <input
                                            value={addressStreet}
                                            onChange={e => setAddressStreet(e.target.value)}
                                            className="w-full h-12 px-4 bg-neutral-50 rounded-xl border border-black/5 text-xs font-bold"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1.5">Número</label>
                                        <input
                                            value={addressNumber}
                                            onChange={e => setAddressNumber(e.target.value)}
                                            className="w-full h-12 px-4 bg-neutral-50 rounded-xl border border-black/5 text-xs font-bold"
                                        />
                                    </div>
                                    <div className="col-span-6">
                                        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1.5">Bairro</label>
                                        <input
                                            value={addressDistrict}
                                            onChange={e => setAddressDistrict(e.target.value)}
                                            className="w-full h-12 px-4 bg-neutral-50 rounded-xl border border-black/5 text-xs font-bold"
                                        />
                                    </div>
                                    <div className="col-span-6">
                                        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1.5">CEP</label>
                                        <input
                                            value={addressZip}
                                            onChange={e => setAddressZip(e.target.value)}
                                            className="w-full h-12 px-4 bg-neutral-50 rounded-xl border border-black/5 text-xs font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>

                <footer className="p-8 border-t border-black/5 bg-neutral-50/50 flex flex-wrap gap-4">
                    <button
                        type="button"
                        onClick={() => setShowConfirmDelete(true)}
                        disabled={submitting}
                        className="h-12 px-6 rounded-2xl bg-red-50 text-red-500 text-xs font-black border border-red-100 hover:bg-red-100 transition-all flex items-center gap-2"
                    >
                        <LuTrash2 size={18} />
                        <span className="hidden sm:inline">Remover Evento</span>
                    </button>
                    <div className="flex-1 flex gap-4 min-w-[240px]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl text-sm font-black text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            form="event-edit-form"
                            disabled={submitting}
                            className="flex-[2] h-14 bg-neutral-900 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                        >
                            {submitting ? <LuLoader className="animate-spin" /> : "Salvar Alterações"}
                        </button>
                    </div>
                </footer>
            </div>

            <ConfirmModal
                isOpen={showConfirmDelete}
                title="Remover Evento"
                message="Tem certeza que deseja remover este evento? Esta ação não pode ser desfeita."
                confirmLabel="Remover"
                isDestructive
                onConfirm={handleDelete}
                onCancel={() => setShowConfirmDelete(false)}
            />
        </div>
    );
}
