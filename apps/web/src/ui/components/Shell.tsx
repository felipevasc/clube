import { NavLink, Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout, api } from "../../lib/api";
import Avatar from "./Avatar";
import {
  LuHouse,
  LuLibrary,
  LuMessageCircle,
  LuFileText,
  LuChartBarBig,
  LuLogOut,
} from "react-icons/lu";

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  cities: string[];
}

interface ClubBook {
  id: string;
  title: string;
  coverUrl?: string;
  city: string;
}

function Tab({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `group flex-1 py-3 flex justify-center transition ${isActive ? "text-neutral-900" : "text-neutral-400"}`
      }
      title={label}
      aria-label={label}
    >
      {({ isActive }) => (
        <span
          className={`relative w-11 h-11 rounded-2xl grid place-items-center transition ${isActive ? "bg-white shadow-sm border border-black/5" : "bg-transparent"
            }`}
        >
          <Icon size={22} />
          <span
            className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition ${isActive ? "bg-sun-500" : "bg-transparent"
              }`}
          />
        </span>
      )}
    </NavLink>
  );
}

export default function Shell() {
  const [user, setUser] = useState<User | null>(null);
  const [activeBooks, setActiveBooks] = useState<ClubBook[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const out = await api<{ user: User }>("/me");
        setUser(out.user);

        if (out.user.cities && out.user.cities.length > 0) {
          const books = await Promise.all(
            out.user.cities.map(async (city) => {
              try {
                const res = await api<{ clubBook: ClubBook | null }>(`/club-books/active?city=${encodeURIComponent(city)}`);
                return res.clubBook;
              } catch {
                return null;
              }
            })
          );
          setActiveBooks(books.filter((b): b is ClubBook => !!b));
        }
      } catch (e) {
        console.error("Failed to fetch current user in shell", e);
      }
    })();
  }, []);

  const subtitle = activeBooks.length > 0
    ? activeBooks.map(b => b.title).join(" & ")
    : "Meu Perfil";

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,191,15,0.45),transparent_60%),radial-gradient(900px_500px_at_20%_30%,rgba(255,216,79,0.35),transparent_55%)]">
      <header className="shrink-0 z-10 glass border-b border-black/5">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer min-w-0 flex-1">
            <Avatar user={user || { id: "?", name: "?" }} size={40} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black tracking-tight truncate">{user?.name || "Clube"}</div>
              <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider truncate">{subtitle}</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {activeBooks.length > 0 && (
              <div className="flex -space-x-3">
                {activeBooks.map((b, i) => (
                  <div key={b.id} className="relative w-10 h-10 rounded-xl overflow-hidden border border-white shadow-sm bg-neutral-100" style={{ zIndex: activeBooks.length - i }}>
                    {b.coverUrl ? (
                      <img src={b.coverUrl} alt={b.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center bg-sun-100 font-black text-[10px] text-sun-600">
                        {b.title.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={async () => {
                try {
                  await logout();
                } finally {
                  location.href = "/login";
                }
              }}
              title="Sair"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/70 border border-black/5 hover:bg-white text-neutral-600 hover:text-red-600 transition"
            >
              <LuLogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-md px-4 py-4">
          <Outlet />
        </div>
      </main>

      <nav className="shrink-0 glass border-t border-black/5 z-20">
        <div className="mx-auto max-w-md px-2 flex justify-between">
          <Tab to="/" icon={LuHouse} label="Feed" />
          <Tab to="/livros" icon={LuLibrary} label="Estante" />
          <Tab to="/mensagens" icon={LuMessageCircle} label="Mensagens" />
          <Tab to="/enquetes" icon={LuChartBarBig} label="Enquetes" />
          <Tab to="/arquivos" icon={LuFileText} label="Arquivos" />

        </div>
      </nav>
    </div>
  );
}
