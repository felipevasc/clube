export default function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-3xl bg-white shadow-card border border-black/5 overflow-hidden ${className || ""}`} {...props}>
      {children}
    </div>
  );
}

