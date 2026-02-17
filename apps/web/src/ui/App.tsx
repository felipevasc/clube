import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./screens/Login";
import Invite from "./screens/Invite";
import Feed from "./screens/Feed";
import BookOfMonth from "./screens/BookOfMonth";
import BookDetail from "./screens/BookDetail";
import Bookshelf from "./screens/Bookshelf";
import BookEdit from "./screens/BookEdit";
import ClubBookRoom from "./screens/ClubBookRoom";
import Profile from "./screens/Profile";
import Messages from "./screens/Messages";
import MessageThread from "./screens/MessageThread";
import Files from "./screens/Files";
import FilesFolder from "./screens/FilesFolder";
import Polls from "./screens/Polls";
import PollsList from "./screens/PollsList";
import PollDetail from "./screens/PollDetail";
import Events from "./screens/Events";
import EventCreate from "./screens/EventCreate";
import EventDetails from "./screens/EventDetails";
import UserManagement from "./screens/UserManagement";
import Shell from "./components/Shell";
import { apiMaybe } from "../lib/api";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const nav = useNavigate();
  const [state, setState] = useState<"loading" | "authed" | "noauth" | "error">("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      setState("loading");
      // The dev stack may restart (gateway / vite proxy). Retry a couple times to avoid
      // showing a scary error for a transient blip.
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const out = await apiMaybe<{ user: any }>("/me");
          if (!alive) return;
          setState(out?.user ? "authed" : "noauth");
          return;
        } catch {
          if (attempt === 3) throw new Error("session_check_failed");
          await new Promise((r) => setTimeout(r, 600 * attempt));
        }
      }
    })().catch(() => {
      if (!alive) return;
      setState("error");
    });
    return () => {
      alive = false;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-dvh grid place-items-center px-4">
        <div className="text-sm text-neutral-700">Carregando sua sessão...</div>
      </div>
    );
  }
  if (state === "error") {
    return (
      <div className="min-h-dvh grid place-items-center px-4">
        <div className="max-w-md w-full space-y-3 text-center">
          <div className="text-sm text-neutral-700">Não foi possível validar sua sessão agora.</div>
          <div className="text-xs text-neutral-500">
            Isso costuma acontecer quando o servidor reinicia ou o proxy está fora do ar. Tente recarregar.
          </div>
          <button
            onClick={() => location.reload()}
            className="w-full rounded-2xl px-4 py-3 text-sm font-black bg-sun-500 hover:bg-sun-400 transition"
          >
            Recarregar
          </button>
          <button
            onClick={() => nav("/login")}
            className="w-full rounded-2xl px-4 py-3 text-sm font-bold text-neutral-600 hover:bg-neutral-100 transition"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }
  if (state === "noauth") return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/invite/:token" element={<Invite />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Shell />
          </RequireAuth>
        }
      >
        <Route index element={<Feed />} />
        <Route path="feed" element={<Feed />} />
        <Route path="livro-do-mes" element={<BookOfMonth />} />
        <Route path="livros" element={<Bookshelf />} />
        <Route path="livros/:id" element={<ClubBookRoom />} />
        <Route path="mensagens" element={<Messages />} />
        <Route path="mensagens/:id" element={<MessageThread />} />
        <Route path="mensagens/canal/:id" element={<MessageThread />} />
        <Route path="mensagens/dm/:id" element={<MessageThread />} />
        <Route path="arquivos" element={<Files />} />
        <Route path="arquivos/:id" element={<FilesFolder />} />
        <Route path="enquetes" element={<Polls />} />
        <Route path="enquetes/poll/:pollId" element={<PollDetail />} />
        <Route path="groups/*" element={<Navigate to="/" replace />} />
        <Route path="books/:id" element={<BookDetail />} />
        <Route path="books/:id/edit" element={<BookEdit />} />
        <Route path="profile/:userId?" element={<Profile />} />
        <Route path="encontros" element={<Events />} />
        <Route path="encontros/novo" element={<EventCreate />} />
        <Route path="encontros/:id" element={<EventDetails />} />
        <Route path="usuarios" element={<UserManagement />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
