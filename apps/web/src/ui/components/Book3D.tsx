import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { bookAccentHex, bookInitial } from "../lib/bookVisual";

export type Book3DModel = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string | null;
};

export default function Book3D({
  book,
  href,
  className,
  style,
  ribbonText,
  ribbonColor,
  ribbonTextColor,
}: {
  book: Book3DModel;
  href?: string;
  className?: string;
  style?: CSSProperties;
  ribbonText?: string;
  ribbonColor?: string;
  ribbonTextColor?: string;
}) {
  const accent = bookAccentHex(book.title);
  const initial = bookInitial(book.title);

  // Deterministic random rotation based on ID hash
  const rotSeed = book.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  // Range: -2deg to +2deg approx
  const rotateDeg = (rotSeed % 5) - 2;

  const mergedStyle = {
    ["--book-accent" as any]: accent,
    ["--random-rot" as any]: `${rotateDeg}deg`,
    ...(style || {}),
  } as CSSProperties;
  const cls = `book-3d ${className || ""}`.trim();

  const inner = (
    <div className="book-3d__book" aria-hidden>
      <div className="book-3d__front">
        {book.coverUrl ? (
          <div className="book-3d__image" style={{ backgroundImage: `url(${book.coverUrl})` }} />
        ) : (
          <div className="book-3d__fallback">
            <div className="book-3d__fallbackInitial">{initial}</div>
            <div className="book-3d__fallbackMeta">
              <div className="book-3d__fallbackTitle">{String(book.title || "").slice(0, 60)}</div>
              <div className="book-3d__fallbackAuthor">{String(book.author || "").slice(0, 44)}</div>
            </div>
          </div>
        )}
      </div>
      {ribbonText && (
        <div className="book-3d__ribbon-container">
          <div
            className="book-3d__ribbon"
            style={{
              backgroundColor: ribbonColor || "#ef4444",
              color: ribbonTextColor || "#1a1a1a"
            }}
          >
            {ribbonText.slice(0, 3).toUpperCase().split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className={cls} style={mergedStyle} aria-label={`${book.title} - ${book.author}`}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={cls} style={mergedStyle} role="img" aria-label={`${book.title} - ${book.author}`}>
      {inner}
    </div>
  );
}
