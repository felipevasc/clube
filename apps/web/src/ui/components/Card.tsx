export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white shadow-card border border-black/5 overflow-hidden">
      {children}
    </div>
  );
}

