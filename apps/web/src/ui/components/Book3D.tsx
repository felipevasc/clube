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
}: {
  book: Book3DModel;
  href?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const accent = bookAccentHex(book.title);
  const initial = bookInitial(book.title);
  const titleShort = String(book.title || "").slice(0, 44);
  const authorShort = String(book.author || "").split(" ").slice(-1)[0] || "";

  const mergedStyle = { ["--book-accent" as any]: accent, ...(style || {}) } as CSSProperties;
  const cls = `book-3d ${className || ""}`.trim();

  const inner = (
    <>
      <div className="book-cover" aria-hidden>
        {book.coverUrl ? (
          <div className="book-cover__image" style={{ backgroundImage: `url(${book.coverUrl})` }} />
        ) : (
          <div className="book-cover__fallback">
            <div className="book-cover__initial">{initial}</div>
            <div className="book-cover__meta">
              <div className="book-cover__title">{String(book.title || "").slice(0, 60)}</div>
              <div className="book-cover__author">{String(book.author || "").slice(0, 44)}</div>
            </div>
          </div>
        )}
      </div>

      <div className="book-spine" aria-hidden>
        <div className="book-spine__title">{titleShort}</div>
        <div className="book-spine__author">{authorShort}</div>
      </div>

      <div className="book-top" aria-hidden />
    </>
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

