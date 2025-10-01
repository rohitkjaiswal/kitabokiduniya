import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import cover from "../assets/cover.webp"


const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }

        const booksQuery = query(
          collection(db, "books"),
          where("uploadedBy", "==", userId)
        );
        const booksSnap = await getDocs(booksQuery);
        const userBooks = booksSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(userBooks);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-danger">User not found</h3>
        <p>Please check the profile link or try again later.</p>
      </div>
    );
  }

  return (
    <div className="container-xl py-2" style={{maxHeight:"20vh"}}>
      <div className="card shadow-lg border-0 mb-5 p-3 rounded">
        <div className="row g-0">
          <div className="col-md-4 d-flex align-items-center justify-content-center bg-light">
            <img
              src={
                user.photoURL ||
                cover
              }
              alt="User Avatar"
              className="img-fluid rounded-circle p-3"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-8 p-5 text-center">
            <div className="card-body">
              <h4 className="card-title text-primary" style={{fontWeight:'bold'}}>
                {user.displayName || "Anonymous Reader"}
              </h4>
              

              <p style={{fontSize:'2.5rem', color:'green'}}>Current reading : <span style={{color:'red'}}>{user.currentReading}</span></p>
              <p className="card-text text-start">
                <small style={{fontSize:'1.5rem'}}>{`Wish me on ${user.dob
                  ?.toDate()
                  .toLocaleDateString()}`}</small>
              </p>
              <p className="card-text text-start" style={{fontSize:'1.5rem'}}> Uploaded books : <strong>{books.length}</strong></p>
              <p className="card-text text-start" style={{fontSize:'1.5rem'}}> {user.bio}</p>
              <p className="card-text text-start">
                <small className="text-muted" style={{fontSize:'1.2rem'}}>{`Joined on ${user.createdAt
                  ?.toDate()
                  .toLocaleDateString()}`}</small>
              </p>
              <p className="card-text text-end" style={{fontSize:'2.5rem'}}>
                {" "}
                <a
                  className="text-decoration-none"
                  href={`mailto:${user.email}`}
                >
                  send email ...
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container d-flex">
      </div>

      <h5 className="mb-4 text-secondary">
        📚 Books Shared by {user.displayName || "this user"}
      </h5>
      <div className="row">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="col-md-6 col-lg-4 mb-4">
              <div
                className="card h-100 text-white shadow-sm border-0 "
                style={{
                  backgroundImage: `url(${
                    book.coverPage ||
                    cover
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="card-body"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                >
                  <h5
                    className="card-title"
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: "bold",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                      color: "pink",
                    }}
                  >
                    {book.title}
                  </h5>
                  <p className="card-text">
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p>
                    <strong>Genre:</strong> {book.genre}
                  </p>
                  <p className="card-text">
                    {book.description || "No description available."}
                  </p>
                  <p>
                    <a
                      href={book.link}
                      className="btn btn-outline-light btn-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                    <a
                      href={book.link}
                      className="btn btn-outline-light btn-sm ms-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read
                    </a>
                  </p>
                  
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No books uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
