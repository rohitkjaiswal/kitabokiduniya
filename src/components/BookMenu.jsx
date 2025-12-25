import { useEffect, useRef, useState } from "react";
import { Star, Bookmark, Share2, Trash2, MessageCircle } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const BookMenu = ({
  onFavorite,
  onReadLater,
  onDelete,
  onShare,
  onMessage,
  isOwner = false,
  onClose,
  isFavorite: initialFavorite = false,
  isReadLater: initialReadLater = false,
}) => {
  const menuRef = useRef(null);
  const [popup, setPopup] = useState(null);

  // Local state to avoid glitch (sync with props initially)
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isReadLater, setIsReadLater] = useState(initialReadLater);
  
  
  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  useEffect(() => {
    setIsReadLater(initialReadLater);
  }, [initialReadLater]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Show popup for 2 seconds
  const triggerPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(null), 2000);
  };

  return (
    <>
      <div
        ref={menuRef}
        className="w-100 rounded-4 shadow-lg p-2"
        style={{
         
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <ul className="list-unstyled m-0">
          <MenuItem
            icon={<Star size={18} className={isFavorite ? "text-danger" : "text-warning"} />}
            label={isFavorite ? "unfavorites" : "favorites"}
            onClick={() => {
              setIsFavorite(!isFavorite);
              onFavorite?.();
              triggerPopup(isFavorite ? " Removed from Favorites" : " Added to Favorites");
            }}
          />
          <MenuItem
            icon={<Bookmark size={18} className={isReadLater ? "text-danger" : "text-primary"} />}
            label={isReadLater ? "Remove from Read Later" : "Save for Later"}
            onClick={() => {
              setIsReadLater(!isReadLater);
              onReadLater?.();
              triggerPopup(isReadLater ? "❌ Removed from Read Later" : "📚 Saved for Later");
            }}
          />
          <MenuItem
            icon={<Share2 size={18} className="text-success" />}
            label="Share"
            onClick={() => {
              onShare?.();
              triggerPopup(" Link Shared!");
            }}
          />
          {/* <MenuItem
            icon={<MessageCircle size={18} className="text-info" />}
            label="Message"
            onClick={() => {
              onMessage?.();
              triggerPopup(" Message Sent!");
            }}
          /> */}
          {/* {isOwner && (
            <MenuItem
              icon={<Trash2 size={18} className="text-danger" />}
              label="Delete"
              onClick={() => {
                onDelete?.();
                triggerPopup("🗑️ Book Deleted!");
              }}
              danger
            />
          )} */}
        </ul>
      </div>

      {/* Popup Notification */}
      {popup && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 px-3 py-2 rounded-3 shadow-lg text-white fw-semibold text-center"
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            animation: "slideUp 0.4s ease",
            zIndex: 9999,
            maxWidth: "90vw",
          }}
        >
          {popup}
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes slideUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

const MenuItem = ({ icon, label, onClick, danger }) => (
  <li>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`d-flex align-items-center gap-3 w-100 text-start px-3 py-2 rounded-3 border-0 fw-medium ${
        danger ? "text-danger" : "text-dark"
      }`}
      style={{
        backgroundColor: "transparent",
        transition: "all 0.25s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
        e.currentTarget.style.transform = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  </li>
);

export default BookMenu;