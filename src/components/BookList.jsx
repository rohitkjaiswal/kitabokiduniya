import BookCard from "./BookCard";
import 'bootstrap/dist/css/bootstrap.min.css';

const BookList = ({ books, onFavorite, onReadLater, onDelete, onShare, onMessage, currentUser }) => {
  if (!books || books.length === 0) {
    return <p className="text-center text-gray-500">📭 No books uploaded yet.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-3">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isOwner={book.userId === currentUser?.uid}
          onFavorite={onFavorite}
          onReadLater={onReadLater}
          onDelete={onDelete}
          onShare={onShare}
          onMessage={onMessage}
        />
      ))}
    </div>
  );
};

export default BookList;
