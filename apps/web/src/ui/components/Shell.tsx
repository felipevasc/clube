import { NavLink, Outlet } from "react-router-dom";
import { logout } from "../../lib/api";

function Tab({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex-1 text-center py-3 text-sm font-semibold transition ${isActive ? "text-neutral-900" : "text-neutral-500"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Shell() {
  return (
    <div className="min-h-dvh bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,191,15,0.45),transparent_60%),radial-gradient(900px_500px_at_20%_30%,rgba(255,216,79,0.35),transparent_55%)]">
      <header className="sticky top-0 z-10 glass border-b border-black/5">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sun-500 shadow-card grid place-items-center font-black">
            C
          </div>
          <div className="flex-1">
            <div className="text-sm font-black tracking-tight">Clube</div>
            <div className="text-xs text-neutral-600">rede social de leitura</div>
          </div>
          <button
            onClick={async () => {
              try {
                await logout();
              } finally {
                location.href = "/login";
              }
            }}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-white/70 border border-black/5 hover:bg-white transition"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-4 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-black/5">
        <div className="mx-auto max-w-md px-4 flex">
          <Tab to="/" label="Feed" />
          <Tab to="/livros" label="Estante" />
          <Tab to="/mensagens" label="Mensagens" />
          <Tab to="/arquivos" label="Arquivos" />
          <Tab to="/livro-do-mes" label="Livro do mês" />
        </div>
      </nav>
    </div>
  );
}

