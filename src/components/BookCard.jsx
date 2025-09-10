import { useState } from "react";
import { Card, CardContent } from "./Card";
import { MoreVertical } from "lucide-react";
import BookMenu from "./BookMenu";
import { div } from "framer-motion/client";
import Navbar from "./Navbar";

const BookCard = ({ book, onFavorite, onReadLater, onDelete, onShare, onMessage, isOwner }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!book) return null; // defensive

  return (
    <div className="container w-full bg-light">
    <Card className=" w-100   mb-2 shadow-sm rounded border p-5 hover:shadow-xl transition">
      <CardContent>
        <div className="d-flex flex-row item-start">
          <div style={{display:"flex",flexDirection:"column"}}>
            <h3 className="text-xl font-semibold " style={{color:"blue" }}>{book.title || "Untitled"}</h3>
            <p className="text-sm" style={{color:"green" ,marginRight:"5px" }}>by {book.author || "Unknown"}</p>
            <span className="inline-block text-xs bg-green-100 text-green-700"><h6>{book.genre || "General"}</h6>
            </span>
          </div>

          {/* 3 Dot Menu */}
          <div className="relative mx-5" style={{alignContent:"", justifyContent:"right"}} >
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn"
            >
              <MoreVertical className="w-1 h-2" />
            </button>
            {menuOpen && (
              <BookMenu
                isOwner={isOwner}
                onFavorite={() => onFavorite(book)}
                onReadLater={() => onReadLater(book)}
                onDelete={() => onDelete(book)}
                onShare={() => onShare(book)}
                onMessage={() => onMessage(book)}
              />
            )}
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <p className="text-gray-700 text-sm line-clamp-3">{book.description}</p>
        )}

        {/* Link */}
        {book.link && (
          <><a
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-blue-600 hover:underline text-sm"
            >
              📖 Read Book
            </a></>
        )}
      </CardContent>
    </Card>
    </div>
  );
};

export default BookCard;
