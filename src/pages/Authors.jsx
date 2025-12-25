import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadAuthors = async () => {
      const q = query(collection(db, "authors"), orderBy("name"));
      const snap = await getDocs(q);
      setAuthors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    loadAuthors();
  }, []);

  const filtered = authors.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Authors</h2>
        <input
          className="form-control w-50 border-0 border-bottom rounded-0"
          placeholder="Search author"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="row">
        {filtered.map(a => (
          <div key={a.id} className="col-md-3 mb-4">
            <Link
              to={`/author/${a.slug}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={a.photo}
                  alt={a.name}
                  style={{ height: 220, objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h6 className="fw-semibold">{a.name}</h6>
                  <small>{a.booksCount || 0} books</small>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Authors;
