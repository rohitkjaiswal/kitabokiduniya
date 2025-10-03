import { useState } from "react";
import { Card, CardContent } from "./Card";
import { MoreVertical } from "lucide-react";
import BookMenu from "./BookMenu";
import { color, easeInOut } from "framer-motion";
import userBg from "../assets/userdp.jpg";
import cover from "../assets/cover.webp";
import { div } from "framer-motion/client";
import { motion } from "motion/react";

const BookCard = ({
  book,
  onFavorite,
  onReadLater,
  onDelete,
  onShare,
  onMessage,
  isOwner,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  if (!book) return null;

   const handleShare = (book) => {
  if (navigator.share) {
    navigator.share({
      title: book.title,
      text: `Check out this book: ${book.title} by ${book.author}`,
      url: book.link || window.location.href,
    })
    .then(() => console.log("Shared successfully"))
    .catch((error) => console.error("Error sharing:", error));
  } else {
    alert("Sharing is not supported on this device.");
  }
};

  return (

    <motion.div key={book.id}  initial={{opacity:0,x:-100}} whileInView={{opacity:1,x:0}} transition={{duration:1,property:'easeInOut'}} className="col-md-6 col-lg-4 mb-4">
      <div
        className="card h-100 text-white shadow-sm border-0"
        style={{
          backgroundImage: `url(${book.coverPage || cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          className="card-body"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "1rem",
            height: "100%",
          }}
        >
          <h5
            className="card-title d-flex"
            style={{
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              color: "pink",
            }}
          >
            {book.title || "Unknown Title"}
            <div className="end-0 position-absolute">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="btn btn-sm btn-outline-none  text-white"
                title="Options"
              >
                <MoreVertical size={28} />
              </button>
              {menuOpen && (
                <div className="position-absolute end-0 z-3">
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
          </h5>
          <p className="card-text">
            <strong>Author:</strong> {book.author || "Unknown"}
          </p>

          <p className="card-text">
            <strong>Genre:</strong> {book.genre || "Various"}
          </p>
          {book.description && (
            <p className="card-text">
              {book.description || "No description available."}
            </p>
          )}
          <p>
            <a
              href={book.link}
              className="btn btn-outline-light btn-sm mt-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>

            <button
              className="btn btn-outline-light btn-sm mt-2 ms-2"
              onClick={() => alert(`You chose to read: ${book.title}`)}
            >
              Read
            </button>
            <button
              className="btn btn-outline-light btn-sm mt-2 ms-2"
              onClick={onShare}
            >
              share
            </button>
          </p>
          <p style={{ color: "rgba(22, 243, 29, 0.7)" }}>
            <small>
              Say thanks to:{" "}
              <a href={`mailto:${book.uploaderEmail}`} className="text-light">
                {book.uploaderEmail || "Unknown Contributor"}
              </a>{" "}
              for sharing this book.
            </small>
            visit contributor's profile{" "}
            <a href={`/profile/${book.uploadedBy}`} className="text-light">
              here
            </a>
            
          </p>
        </div>
      </div>
    </motion.div>

  );
};

export default BookCard;
