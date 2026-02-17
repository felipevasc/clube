import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LuArrowLeft, LuCalendarDays, LuMapPin, LuClock, LuCheck, LuX, LuCamera, LuLoader, LuUsers, LuChevronLeft, LuChevronRight, LuPencilLine, LuAlignLeft, LuTrash2 } from "react-icons/lu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ImageUpload } from "../components/ImageUpload";
import EventEditModal from "./EventEditModal";
import ConfirmModal from "../components/ConfirmModal";

// Fix for Leaflet icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type Participant = {
    userId: string;
    status: string;
    // In a real app we would have name/avatar here. For now we just have ID.
    // We can fetch user details or just show ID initials?
    // Let's assume we might expand this later.
};

type EventPhoto = {
    id: string;
    url: string;
    caption?: string;
    userId: string;
    type: 'LOCATION' | 'GALLERY';
    createdAt: string;
    user?: {
        name: string;
        avatarUrl: string;
    }
};

type ClubEventDetail = {
    id: string;
    // ... other fields
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
    createdById: string;
    myStatus: string | null;
    participants: Participant[];
    photos: EventPhoto[];
    canEdit?: boolean;
    clubBook?: {
        id: string;
        title: string;
        coverUrl: string;
        book: {
            author: string;
            synopsis: string;
        }
    };
};

function MapAdjuster({ routeCoords, eventLocation }: { routeCoords: [number, number][], eventLocation: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        if (routeCoords.length > 0) {
            const bounds = L.latLngBounds(routeCoords);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            map.flyTo(eventLocation, 15);
        }
    }, [routeCoords, eventLocation, map]);

    return null;
}

export default function EventDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<ClubEventDetail | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [rsvpLoading, setRsvpLoading] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    // Photo Upload State
    const [uploading, setUploading] = useState(false);
    // const [uploadUrl, setUploadUrl] = useState(""); // Removed
    const [showUpload, setShowUpload] = useState(false);

    // Route State
    const [originAddress, setOriginAddress] = useState("");
    const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

    // Lightbox State
    const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);
    const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
    const [routeLoading, setRouteLoading] = useState(false);
    const [showRouteInput, setShowRouteInput] = useState(false);
    const [routeStats, setRouteStats] = useState<{ distance: number; duration: number } | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchEvent = () => {
        api<{ event: ClubEventDetail, currentUserId: string }>(`/events/${id}`)
            .then((res) => {
                setEvent(res.event);
                setCurrentUserId(res.currentUserId);
            })
            .catch((err) => {
                console.error(err);
                if (err.status === 404) navigate("/encontros");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (id) fetchEvent();
    }, [id]);

    const handleRsvp = async (status: string) => {
        if (!event) return;
        setRsvpLoading(true);
        try {
            await api(`/events/${event.id}/participate`, {
                method: "POST",
                body: JSON.stringify({ status }),
            });
            fetchEvent(); // Refresh to get updated list
        } catch (e) {
            console.error(e);
        } finally {
            setRsvpLoading(false);
        }
    };

    const handlePhotoUpload = async (urls: string | string[]) => {
        if (!urls || !event) return;
        setUploading(true);

        const urlList = Array.isArray(urls) ? urls : [urls];
        if (urlList.length === 0) return;

        try {
            await Promise.all(urlList.map(url =>
                api(`/events/${event.id}/photos`, {
                    method: "POST",
                    body: JSON.stringify({ url: url, type: "GALLERY" }),
                })
            ));

            setShowUpload(false);
            fetchEvent();
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handlePhotoDeleteClick = (photoId: string) => {
        setPhotoToDelete(photoId);
    };

    const confirmPhotoDelete = async () => {
        if (!event || !photoToDelete) return;
        try {
            await api(`/events/${event.id}/photos/${photoToDelete}`, {
                method: "DELETE",
            });
            setPhotoToDelete(null);
            setSelectedPhoto(null);
            fetchEvent();
        } catch (error) {
            console.error("Failed to delete photo", error);
            alert("Erro ao excluir foto.");
        }
    };

    const handleCalculateRoute = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!originAddress || !event?.latitude || !event?.longitude) return;
        setRouteLoading(true);
        setRouteCoords([]);

        try {
            // 1. Geocode Origin
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(originAddress)}&limit=1`);
            const geoData = await geoRes.json();
            if (!geoData || geoData.length === 0) {
                alert("Endereço de origem não encontrado.");
                return;
            }
            const originLat = parseFloat(geoData[0].lat);
            const originLon = parseFloat(geoData[0].lon);

            // 2. Fetch Route (OSRM)
            // OSRM expects: {lon},{lat};{lon},{lat}
            const url = `https://router.project-osrm.org/route/v1/driving/${originLon},${originLat};${event.longitude},${event.latitude}?overview=full&geometries=geojson`;
            const routeRes = await fetch(url);
            const routeData = await routeRes.json();

            if (routeData.code !== "Ok" || !routeData.routes || routeData.routes.length === 0) {
                alert("Não foi possível traçar a rota.");
                return;
            }

            // 3. Extract Coordinates (GeoJSON is [lon, lat], Leaflet needs [lat, lon])
            const coords = routeData.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);

            // 4. Extract Stats
            setRouteStats({
                distance: routeData.routes[0].distance, // meters
                duration: routeData.routes[0].duration  // seconds
            });

            setRouteCoords(coords);

        } catch (error) {
            console.error(error);
            alert("Erro ao calcular rota.");
        } finally {
            setRouteLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-neutral-500">Carregando detalhes...</div>;
    if (!event) return <div className="text-center py-20 text-red-500">Evento não encontrado.</div>;

    const startDate = new Date(event.startAt);
    const confirmedCount = event.participants.filter(p => p.status === 'confirmed').length;

    const locationPhotos = event.photos.filter(p => p.type === 'LOCATION');
    const galleryPhotos = event.photos.filter(p => p.type === 'GALLERY' || !p.type); // Fallback if type missing

    return (
        <div className="pb-20">
            {/* Header / Cover Carousel */}
            <div className="relative h-72 w-full bg-neutral-900 overflow-hidden group">
                <div className="absolute top-4 left-4 z-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md shadow-sm flex items-center justify-center hover:bg-black/40 text-white border border-white/10"
                    >
                        <LuArrowLeft />
                    </button>
                </div>

                {event.canEdit && (
                    <div className="absolute top-4 right-4 z-20">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md shadow-sm flex items-center justify-center hover:bg-black/40 text-white border border-white/10 transition-all font-bold"
                            title="Editar Evento"
                        >
                            <LuPencilLine size={18} />
                        </button>
                    </div>
                )}

                {locationPhotos.length > 0 ? (
                    <div className="relative w-full h-full group">
                        <button
                            onClick={() => setSelectedPhoto(locationPhotos[currentPhotoIndex])}
                            className="w-full h-full cursor-zoom-in group/img relative"
                        >
                            <img
                                src={locationPhotos[currentPhotoIndex]?.url}
                                alt={event.title}
                                className="w-full h-full object-cover transition-all duration-500 group-hover/img:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-300" />
                        </button>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                        {/* Navigation Arrows */}
                        {locationPhotos.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentPhotoIndex(prev => (prev > 0 ? prev - 1 : locationPhotos.length - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90 z-20"
                                    aria-label="Foto anterior"
                                >
                                    <LuChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={() => setCurrentPhotoIndex(prev => (prev < locationPhotos.length - 1 ? prev + 1 : 0))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90 z-20"
                                    aria-label="Próxima foto"
                                >
                                    <LuChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Carousel Indicators */}
                        {locationPhotos.length > 1 && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                                {locationPhotos.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPhotoIndex(idx)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentPhotoIndex ? "bg-white w-6 shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-white/40 hover:bg-white/60 w-1.5"}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                        <LuCalendarDays className="w-16 h-16 text-white/10" />
                    </div>
                )}
            </div>


            <div className="px-4 -mt-8 relative z-10 space-y-4">
                {/* Title Card */}
                <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
                    <div className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-black text-neutral-900 leading-tight">{event.title}</h1>
                                <div className="text-sm font-bold text-neutral-500 mt-1 uppercase tracking-wide">{event.city}</div>
                            </div>
                            {/* Calendar Widget */}
                            <div className="shrink-0 flex flex-col items-center bg-neutral-50 border border-neutral-100 rounded-xl p-2 w-14 text-center shadow-sm">
                                <span className="text-[10px] font-bold text-red-500 uppercase">
                                    {format(startDate, "MMM", { locale: ptBR }).replace('.', '')}
                                </span>
                                <span className="text-xl font-black text-neutral-900 leading-none">
                                    {format(startDate, "dd")}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-3 text-neutral-700">
                                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                                    <LuClock className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Horário</div>
                                    <div className="text-sm text-neutral-500 capitalize">
                                        {format(startDate, "EEEE, HH:mm", { locale: ptBR })}
                                        {event.endAt && ` - ${format(new Date(event.endAt), "HH:mm")}`}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-neutral-700">
                                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <LuMapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Local</div>
                                    <div className="text-sm text-neutral-500">{event.location}</div>
                                    {(event.addressStreet) && (
                                        <div className="text-xs text-neutral-400 mt-0.5">
                                            {event.addressStreet}, {event.addressNumber} - {event.addressDistrict}<br />
                                            {event.addressCity}/{event.addressState} - {event.addressZip}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RSVP Buttons */}
                        <div className="mt-6 flex gap-2">
                            {event.myStatus === 'confirmed' ? (
                                <button
                                    onClick={() => handleRsvp('declined')}
                                    disabled={rsvpLoading}
                                    className="flex-1 py-2.5 bg-green-100 text-green-700 rounded-xl font-bold flex items-center justify-center gap-2 border border-green-200"
                                >
                                    <LuCheck /> Confirmado
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleRsvp('confirmed')}
                                    disabled={rsvpLoading}
                                    className="flex-1 py-2.5 bg-neutral-900 text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
                                >
                                    {rsvpLoading ? <LuLoader className="animate-spin" /> : "Confirmar Presença"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <h3 className="font-black text-neutral-900">Sobre</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                </div>

                {/* Map & Route */}
                {event.latitude && event.longitude && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="font-black text-neutral-900">Localização</h3>
                            <div className="h-64 rounded-xl overflow-hidden border border-black/5 shadow-sm relative z-0">
                                <MapContainer
                                    center={[event.latitude, event.longitude]}
                                    zoom={15}
                                    scrollWheelZoom={false}
                                    dragging={true}
                                    zoomControl={false}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[event.latitude, event.longitude]}>
                                        <Popup>{event.location}</Popup>
                                    </Marker>
                                    {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
                                    <MapAdjuster routeCoords={routeCoords} eventLocation={[event.latitude, event.longitude]} />
                                </MapContainer>
                            </div>
                        </div>

                        {/* Route UI */}
                        {!routeCoords.length ? (
                            !showRouteInput ? (
                                <button
                                    onClick={() => setShowRouteInput(true)}
                                    className="w-full py-3 bg-neutral-100 text-neutral-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition"
                                >
                                    <LuMapPin className="w-4 h-4" />
                                    Como chegar aqui
                                </button>
                            ) : (
                                <form onSubmit={handleCalculateRoute} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-sm font-bold text-neutral-700">Traçar rota</div>
                                        <button
                                            type="button"
                                            onClick={() => setShowRouteInput(false)}
                                            className="text-neutral-400 hover:text-neutral-600"
                                        >
                                            <LuX className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={originAddress}
                                            onChange={e => setOriginAddress(e.target.value)}
                                            placeholder="Seu endereço de origem..."
                                            className="flex-1 p-2 text-sm bg-white border border-neutral-300 rounded-lg outline-none focus:border-neutral-900"
                                            autoFocus
                                        />
                                        <button
                                            disabled={routeLoading}
                                            className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-lg whitespace-nowrap"
                                        >
                                            {routeLoading ? <LuLoader className="animate-spin" /> : "Ir"}
                                        </button>
                                    </div>
                                </form>
                            )
                        ) : (
                            <div className="p-4 bg-white rounded-xl border border-black/10 shadow-sm space-y-3 animate-in fade-in zoom-in-95">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sun-600 font-black">
                                        <LuMapPin className="w-5 h-5" />
                                        <span>Rota Encontrada</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setRouteCoords([]);
                                            setRouteStats(null);
                                        }}
                                        className="text-xs font-bold text-neutral-400 hover:text-red-500"
                                    >
                                        Limpar
                                    </button>
                                </div>

                                {routeStats && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 bg-neutral-50 rounded-lg text-center">
                                            <div className="text-xs text-neutral-500 font-bold uppercase tracking-wide">Distância</div>
                                            <div className="text-lg font-black text-neutral-900">
                                                {(routeStats.distance / 1000).toFixed(1)} km
                                            </div>
                                        </div>
                                        <div className="p-3 bg-neutral-50 rounded-lg text-center">
                                            <div className="text-xs text-neutral-500 font-bold uppercase tracking-wide">Tempo</div>
                                            <div className="text-lg font-black text-neutral-900">
                                                {Math.round(routeStats.duration / 60)} min
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="text-sm text-neutral-600 space-y-1 pt-2 border-t border-black/5">
                                    <div className="flex gap-2">
                                        <span className="font-bold text-neutral-400 text-xs uppercase w-8 shrink-0">De</span>
                                        <span className="truncate">{originAddress}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold text-neutral-400 text-xs uppercase w-8 shrink-0">Para</span>
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* Associated Book */}
                {event.clubBook && (
                    <div className="space-y-2">
                        <h3 className="font-black text-neutral-900">Livro do Mês</h3>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-black/5 shadow-sm">
                            <div className="w-16 h-24 bg-neutral-100 rounded-lg overflow-hidden shrink-0 shadow-md">
                                {event.clubBook.coverUrl ? (
                                    <img src={event.clubBook.coverUrl} alt={event.clubBook.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                        <LuAlignLeft />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-neutral-900 leading-tight">{event.clubBook.title}</h4>
                                <p className="text-sm text-neutral-500 mt-1">{event.clubBook.book?.author}</p>
                                {event.clubBook.book?.synopsis && (
                                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{event.clubBook.book.synopsis}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Participants */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-neutral-900 flex items-center gap-2">
                            Participantes <span className="bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded textxs">{confirmedCount}</span>
                        </h3>
                    </div>
                    {event.participants.length === 0 ? (
                        <div className="text-sm text-neutral-500 italic">Seja o primeiro a confirmar!</div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {event.participants.filter(p => p.status === 'confirmed').map((p) => (
                                <div key={p.userId} className="w-10 h-10 rounded-full bg-neutral-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden" title={p.userId}>
                                    {/* Placeholder avatar logic - in real app use user avatar */}
                                    <span className="text-xs font-bold text-neutral-500">{p.userId.slice(0, 2).toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Gallery */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-neutral-900">Galeria</h3>
                        <button
                            onClick={() => setShowUpload(!showUpload)}
                            className="bg-neutral-100 p-2 rounded-full hover:bg-neutral-200"
                        >
                            <LuCamera className="w-4 h-4 text-neutral-700" />
                        </button>
                    </div>

                    {showUpload && (
                        <div className="mb-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                            <h4 className="text-sm font-bold text-neutral-900 mb-2">Adicionar foto à galeria</h4>
                            <ImageUpload
                                onChange={(url) => handlePhotoUpload([url])}
                                onUploads={handlePhotoUpload}
                                label="Escolher fotos"
                                multiple={true}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                        {galleryPhotos.map(photo => (
                            <button
                                key={photo.id}
                                onClick={() => setSelectedPhoto(photo)}
                                className="aspect-square bg-neutral-100 rounded-lg overflow-hidden relative group w-full"
                            >
                                <img src={photo.url} alt="Galeria" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                            </button>
                        ))}
                    </div>
                    {galleryPhotos.length === 0 && !showUpload && (
                        <div className="p-4 bg-neutral-50 rounded-xl text-center text-sm text-neutral-500 border border-dashed border-neutral-200">
                            Nenhuma foto adicionada na galeria.
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Overlay */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <div className="absolute top-4 right-4 flex items-center gap-4 z-50">
                        {/* Delete Button */}
                        {(event.canEdit || selectedPhoto.userId === currentUserId) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePhotoDeleteClick(selectedPhoto.id);
                                }}
                                className="text-white/70 hover:text-red-500 bg-white/10 p-2.5 rounded-full backdrop-blur-md transition-all hover:bg-white/20"
                                title="Excluir foto"
                            >
                                <LuTrash2 className="w-5 h-5" />
                            </button>
                        )}

                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="text-white hover:text-neutral-300 bg-white/10 p-2.5 rounded-full backdrop-blur-md transition-all hover:bg-white/20"
                        >
                            <LuX className="w-6 h-6" />
                        </button>
                    </div>

                    <img
                        src={selectedPhoto.url}
                        alt="Full screen"
                        className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Photo Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                        <div className="max-w-4xl mx-auto flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-700 overflow-hidden border border-white/20 shrink-0">
                                {selectedPhoto.user?.avatarUrl ? (
                                    <img src={selectedPhoto.user.avatarUrl} alt={selectedPhoto.user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-neutral-600">
                                        {selectedPhoto.user?.name?.slice(0, 2).toUpperCase() || "??"}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-sm">{selectedPhoto.user?.name || "Usuário Desconhecido"}</div>
                                <div className="text-xs text-white/60">
                                    Adicionada em {format(new Date(selectedPhoto.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Event Edit Modal */}
            <ConfirmModal
                isOpen={!!photoToDelete}
                title="Excluir foto"
                message="Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita."
                confirmLabel="Excluir"
                isDestructive
                onConfirm={confirmPhotoDelete}
                onCancel={() => setPhotoToDelete(null)}
            />

            {showEditModal && (
                <EventEditModal
                    event={event}
                    onClose={() => setShowEditModal(false)}
                    onUpdated={fetchEvent}
                />
            )}
        </div>
    );
}
