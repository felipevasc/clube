import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { LuCalendarDays, LuMapPin, LuPlus } from "react-icons/lu";
import Card from "../components/Card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type ClubEvent = {
    id: string;
    title: string;
    description: string;
    city: string;
    location: string;
    startAt: string;
    coverUrl?: string;
    participantsCount: number;
    photosCount: number;
    myStatus: string | null;
};

export default function Events() {
    const [events, setEvents] = useState<ClubEvent[]>([]);
    const [city, setCity] = useState<"FORTALEZA" | "BRASILIA">("FORTALEZA");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [showPast, setShowPast] = useState(false);

    useEffect(() => {
        // Try to get user's city from /me if not set
        api<{ user: { cities: string[] } }>("/me")
            .then(res => {
                if (res.user?.cities?.length > 0) {
                    const userCity = res.user.cities[0] as "FORTALEZA" | "BRASILIA";
                    if (["FORTALEZA", "BRASILIA"].includes(userCity)) {
                        setCity(userCity);
                    }
                }
            })
            .catch(console.warn);
    }, []);

    useEffect(() => {
        setLoading(true);
        api<{ events: ClubEvent[] }>(`/events?city=${city}&upcoming=${!showPast}`)
            .then((res) => setEvents(res.events || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [city, showPast]);

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-black/5 grid place-items-center">
                        <LuCalendarDays className="w-5 h-5 text-neutral-900" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-neutral-900">Encontros</h1>
                        <p className="text-sm text-neutral-600">Reuniões e eventos do clube</p>
                    </div>
                </div>
                <Link
                    to="/encontros/novo"
                    className="w-10 h-10 rounded-full bg-neutral-900 text-white grid place-items-center shadow-lg hover:scale-105 active:scale-95 transition"
                >
                    <LuPlus className="w-6 h-6" />
                </Link>
            </div>
            {/* City Filter */}
            <div className="flex p-1 bg-neutral-100 rounded-xl relative">
                <button
                    onClick={() => setCity("FORTALEZA")}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all relative z-10 ${city === "FORTALEZA" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-neutral-600"
                        }`}
                >
                    FORTALEZA
                </button>
                <button
                    onClick={() => setCity("BRASILIA")}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all relative z-10 ${city === "BRASILIA" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-neutral-600"
                        }`}
                >
                    BRASÍLIA
                </button>
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setShowPast(false)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${!showPast ? 'bg-neutral-900 text-white shadow-lg shadow-black/10' : 'bg-neutral-100 text-neutral-400 hover:text-neutral-600'}`}
                >
                    Próximos
                </button>
                <button
                    onClick={() => setShowPast(true)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${showPast ? 'bg-neutral-900 text-white shadow-lg shadow-black/10' : 'bg-neutral-100 text-neutral-400 hover:text-neutral-600'}`}
                >
                    Encerrados
                </button>
            </div>

            {/* Event List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-10 text-neutral-400">Carregando...</div>
                ) : events.length === 0 ? (
                    <Card>
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                                📅
                            </div>
                            <div className="text-neutral-900 font-bold mb-1">Nenhum evento agendado</div>
                            <p className="text-sm text-neutral-500">Seja o primeiro a criar um encontro!</p>
                        </div>
                    </Card>
                ) : (
                    events.map((event) => (
                        <Card key={event.id} className="overflow-hidden group cursor-pointer" onClick={() => navigate(`/encontros/${event.id}`)}>
                            {/* Cover Image */}
                            {event.coverUrl && (
                                <div className="h-32 w-full bg-neutral-100 relative">
                                    <img
                                        src={event.coverUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {event.myStatus === 'confirmed' && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                                            CONFIRMADO
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="p-4">
                                {/* Date Badge */}
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg leading-tight text-neutral-900 group-hover:text-amber-600 transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                                            <LuCalendarDays className="w-3.5 h-3.5" />
                                            <span className="capitalize">
                                                {format(new Date(event.startAt), "EEEE, d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1 truncate">
                                            <LuMapPin className="w-3.5 h-3.5" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>

                                    {/* Date Box */}
                                    <div className="shrink-0 flex flex-col items-center bg-neutral-50 border border-neutral-100 rounded-xl p-2 w-14 text-center">
                                        <span className="text-[10px] font-bold text-red-500 uppercase">
                                            {format(new Date(event.startAt), "MMM", { locale: ptBR }).replace('.', '')}
                                        </span>
                                        <span className="text-xl font-black text-neutral-900 leading-none">
                                            {format(new Date(event.startAt), "dd")}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer info */}
                                <div className="mt-3 pt-3 border-t border-neutral-50 flex items-center justify-between text-xs text-neutral-500">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-1.5">
                                            {/* Fake avatars for participants count */}
                                            {Array.from({ length: Math.min(3, event.participantsCount) }).map((_, i) => (
                                                <div key={i} className="w-5 h-5 rounded-full bg-neutral-200 border border-white" />
                                            ))}
                                        </div>
                                        <span>{event.participantsCount} confirmados</span>
                                    </div>
                                    {event.photosCount > 0 && (
                                        <span>{event.photosCount} 📷</span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
