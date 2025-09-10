import { useEffect, useRef } from "react";
import { Star, Bookmark, Share2, Trash2, MessageCircle } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const BookMenu = ({ 
  onFavorite, 
  onReadLater, 
  onDelete, 
  onShare, 
  onMessage, 
  isOwner = false, 
  onClose 
}) => {
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50"
    >
      <ul className="list-unstyled m-0 p-2">
        <MenuItem 
          icon={<Star className="w-4 h-4 text-blue-500" />} 
          label="Add to Favorites" 
          onClick={onFavorite} 
        />
        <MenuItem 
          icon={<Bookmark className="w-4 h-4 text-blue-500" />} 
          label="Read Later" 
          onClick={onReadLater} 
        />
        <MenuItem 
          icon={<Share2 className="w-4 h-4 text-green-500" />} 
          label="Share" 
          onClick={onShare} 
        />
        <MenuItem 
          icon={<MessageCircle className="w-4 h-4 text-purple-500" />} 
          label="Message" 
          onClick={onMessage} 
        />
        {isOwner && (
          <MenuItem
            icon={<Trash2 className="w-4 h-4 text-red-500" />}
            label="Delete"
            onClick={(e) => {
              e.stopPropagation(); // 🔒 Prevents accidental triggers
              onDelete?.();
            }}
            danger
          />
        )}
      </ul>
    </div>
  );
};

const MenuItem = ({ icon, label, onClick, danger }) => (
  <li>
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevents parent click events
        onClick?.();
      }}
      className={`d-flex align-items-center gap-2 w-100 text-start px-3 py-2 rounded transition 
        ${danger 
          ? "text-danger hover-bg-light" 
          : "text-dark hover-bg-light"
        }`}
      style={{ background: "transparent", border: "none" }}
    >
      {icon}
      <span>{label}</span>
    </button>
  </li>
);

export default BookMenu;
