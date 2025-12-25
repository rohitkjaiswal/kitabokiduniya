import { useState } from "react";
import { MoreVertical, Download, BookOpen, Share2 } from "lucide-react";
import { motion } from "motion/react";
import BookMenu from "./BookMenu";
import cover from "../assets/cover.webp";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import { NavLink } from "react-router-dom";

const BookCard = ({
  book,
  onFavorite,
  onReadLater,
  onDelete,
  onMessage,
  isOwner,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { user } = useAuth();

  if (!book) return null;

  const handleShare = async () => {
    const payload = {
      title: book.title,
      text: `📘 ${book.title} by ${book.author}`,
      url: book.link || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(payload);
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(payload.url);
      alert("🔗 Link copied to clipboard");
    }
  };

  return (
    <motion.div
      className="col-md-6 col-lg-4 mb-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div
        className="card h-100 border-0 shadow-lg text-white position-relative overflow-hidden"
        style={{ borderRadius: "16px" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Book Image */}
        <div
          className="position-relative"
          style={{
            backgroundImage: `url(${book.coverPage || cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "250px",
            borderRadius: "16px 16px 0 0",
          }}
        >
          {/* Overlay on hover */}
          {hovered && (
            <motion.div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center gap-2"
              style={{
                background: "rgba(0,0,0,0.6)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-light btn-sm w-75"
              >
                <Download size={16} className="me-1" /> Download
              </a>
              <button className="btn btn-light btn-sm w-75">
                <BookOpen size={16} className="me-1" /> Read
              </button>
              <button
                className="btn btn-outline-light btn-sm w-75"
                onClick={handleShare}
              >
                <Share2 size={16} /> Share
              </button>
            </motion.div>
          )}
        </div>

       {/* Book Details */}
<div className="card-body d-flex flex-column justify-content-between">
  {/* Header: Title + Menu */}
  <div className="d-flex justify-content-between align-items-start mb-2">
    <h5 className="fw-bold mb-0 text-dark" style={{ lineHeight: 1.3 }}>
      {book.title}
    </h5>

    {user && (
    <button
      className="btn btn-sm btn-link text-muted"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      <MoreVertical />
    </button>
    )}
  </div>
    
  {/* Dropdown Menu */}
  {menuOpen && (
    <div className="w-100 mt-2">
      <BookMenu
        isOwner={isOwner}
        onFavorite={() => onFavorite(book)}
        onReadLater={() => onReadLater(book)}
        onDelete={() => onDelete(book)}
        onShare={handleShare}
        onMessage={() => onMessage(book)}
      />
    </div>
  )}

  {/* Meta Info */}
  <div className="d-flex flex-wrap gap-2 mb-3">
    <span className="badge bg-light text-dark">
      <NavLink
        to={`/author/${book.author}`}
        className="text-decoration-none text-dark"
      >
        ✍️ {book.authorId || "Unknown"}
      </NavLink>
    </span>
    <span className="badge bg-secondary">
      {book.genre || "General"}
    </span>
  </div>

  {/* Description */}
  {book.description && (
    <p
      className="small text-muted mb-3"
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {book.description}
    </p>
  )}

  {/* Footer */}
  <div className="border-top pt-2 small text-muted">
    Shared by{" "}
    <a
      href={`/profile/${book.uploadedBy?.uid}`}
      className="text-decoration-none fw-semibold"
    >
      {book.uploadedBy?.name || "Contributor"}
    </a>
  </div>
</div>
      </div>
    </motion.div>
  );
};

export default BookCard;