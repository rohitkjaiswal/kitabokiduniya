import { useState } from "react";
import { Card, CardContent } from "./Card";
import { MoreVertical } from "lucide-react";
import BookMenu from "./BookMenu";
import { color } from "framer-motion";

const BookCard = ({ book, onFavorite, onReadLater, onDelete, onShare, onMessage, isOwner }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  if (!book) return null;

  const coverImage = book.coverPage || "https://th.bing.com/th/id/OIP.uCiS-n32wWxBCDh-NfoqJAHaEK?w=281&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";

  return (
    <div className="container px-3 py-3">
      <Card
        className="card border-0 shadow-lg rounded-4 overflow-hidden position-relative"
        style={{
          backgroundImage: `url(${coverImage || 'https://th.bing.com/th/id/OIP.uCiS-n32wWxBCDh-NfoqJAHaEK?w=281&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor:"black",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <CardContent
          className="p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "0 0 16px 16px",
            minHeight: "220px",
          }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1 p-3">
              <h3 className="card-title" style={{fontSize: "1.75rem",fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",color:"pink"}}>
                {book.title || "Untitled"}
              </h3>
              <p className="card-text">
                <small>by {book.author || "Unknown"}</small>
              </p>
              <span className=" bg-success-subtle">
                {book.genre || "General"}
              </span>
            </div>

            {/* 3 Dot Menu */}
            <div className="text-end">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="btn btn-sm btn-outline-light rounded-circle"
                title="Options"
              >
                <MoreVertical size={18} />
              </button>
              {menuOpen && (
                <div className="position-absolute end-0 mt-2 z-3">
                  <BookMenu
                    isOwner={isOwner}
                    onFavorite={() => onFavorite(book)}
                    onReadLater={() => onReadLater(book)}
                    onDelete={() => onDelete(book)}
                    onShare={() => onShare(book)}
                    onMessage={() => onMessage(book)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <p className="mt-2 text-white-50" style={{ fontSize: "0.9rem" }}>
              {book.description || 'No description'}
            </p>
            
          )}


          {/* Link */}
          {book.link && (
            <a
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="d-inline-block mt-3 text-decoration-none text-info fw-semibold"
            >
              📖 Read Book
            </a>
          )}

          <p className="text-end">{book.uploadedAt?.toDate().toLocalDateString()}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookCard;