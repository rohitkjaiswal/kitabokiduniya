import { useState } from "react";
import { Card, CardContent } from "./Card";
import { MoreVertical } from "lucide-react";
import BookMenu from "./BookMenu";
import { color } from "framer-motion";
import userBg from "../assets/userdp.jpg"
import cover from "../assets/cover.webp"

const BookCard = ({ book, onFavorite, onReadLater, onDelete, onShare, onMessage, isOwner }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  if (!book) return null;

  const coverImage = book.coverPage || cover;

  return (
    <div className="container-fluid d-flex flex-column px-3 py-3">
      
      <Card
        className="card border-0 shadow-lg rounded-5 overflow-hidden position-relative"
        style={{
          backgroundImage: `url(${coverImage || cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor:"black",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <CardContent
          className="p-4 absolute"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "0 0 16px 16px",
            minHeight: "220px",
          }}
        >
          <div className="d-flex flex-row justify-content-center align-items-start">
            <div className="flex-grow-1 p-3">
              <h3 className="card-title text-center" style={{fontSize: "2.75rem",fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",color:"Red"}}>
                {book.title || "Untitled"}
              </h3>
              <p className="card-text bg-secondary text-center text-white" style={{fontSize:'1.5rem'}}>
                <small>by {book.author || "Unknown"}</small>
              </p>
              <span className=" bg-success-subtle" style={{fontSize:'2.0rem'}}>
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
            <p className="mt-2" style={{ fontWeight: "bold", color:'black',fontSize:'1.5rem' ,fontStyle:'italic'}}>
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

          <p className="text-end">upload on {book.uploadedAt?.toDate().toLocalDateString()}</p>
          <p className="text-cenetr">
                <a
                  href={book.link}
                  className="btn btn-primary btn-fluid mx-2 "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
                
                <a
                  href={book.link}
                  className="btn btn-primary btn-fluid mx-2 "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  read book
                </a>
              </p>
              <p className="bg-success rounded-5 p-2" style={{fontSize: "1.875rem"}}><small>Say thanks to: <a href={`mailto:${book.uploaderEmail}`} className="text-light">{book.uploaderEmail || "Unknown Contributor"}</a> for sharing this book.</small>
               <span> </span>Contributor's profile <a href={`/profile/${book.uploadedBy}`} className="text-light">here</a>.
              </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookCard;