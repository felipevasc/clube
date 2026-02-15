import { useRef, useState } from "react";
import FeedList from "../components/FeedList";
import CreatePostModal from "../components/CreatePostModal";

export default function Feed() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <div className="relative min-h-full">
      <FeedList refreshToken={refreshToken} />

      {/* FAB */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 border-2 border-white/20"
        aria-label="Novo Post"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setRefreshToken(prev => prev + 1);
        }}
      />
    </div>
  );
}
