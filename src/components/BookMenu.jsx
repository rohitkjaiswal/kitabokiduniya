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
      className="position-absolute bg-secondary end-0 mt-2 border rounded-4 shadow-lg z-3"
      style={{ width: "220px", animation: "fadeIn 0.3s ease-in-out" }}
    >

      <ul className="list-unstyled m-0 p-2 ">
  <MenuItem 
    icon={<Star size={18} className="text-primary" />}
    label="Add to Favorites"
    onClick={onFavorite}
    
  />
  <MenuItem
    icon={<Bookmark size={18} className="text-primary" />}
    label="Read Later"
    onClick={onReadLater}
  />
  <MenuItem
    icon={<Share2 size={18} className="text-success" />}
    label="Share"
    onClick={onShare}
  />
  <MenuItem
    icon={<MessageCircle size={18} className="text-info" />}
    label="Message"
    onClick={onMessage}
  />
  
  {isOwner && (
    <MenuItem
      icon={<Trash2 size={18} className="text-danger" />}
      label="Delete"
      onClick={onDelete}
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
        e.stopPropagation();
        onClick?.();
      }}
      className={`d-flex align-items-center gap-3 w-100 text-start px-2 py-1 rounded-3 border-0 ${
        danger ? "text-danger" : "text-dark"
      }`}
      style={{
        backgroundColor: "transparent",
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      {icon}
      <span className="fw-medium">{label}</span>
    </button>
  </li>
);

export default BookMenu;