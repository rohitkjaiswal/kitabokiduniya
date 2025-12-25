import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pf from "../assets/pf.webp"
import Feeds from "./Feeds";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

import NewHero from "../components/NewHero";
import TopContributors from "../components/TopContributors";
import ReadingLetter from "../components/ReadingLetter";
import Patrika from "../components/Patrika";
import Faq from "../components/Faq";
import { motion } from "motion/react";

function PreHome() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  const LATEST_AUTHORS_LIMIT = 6;

  const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // remove special chars
    .replace(/\s+/g, "-");      // replace spaces with hyphen


  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const q = query(
          collection(db, "authors"),
          orderBy("lastBookAt", "desc"),
          limit(LATEST_AUTHORS_LIMIT)
        );

        const snap = await getDocs(q);
        setAuthors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load authors:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, []);

  return (
    <>
      <NewHero />
      <TopContributors />

      {/* AUTHORS SECTION */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold"> Featured Authors</h2>
          <Link to="/authors" className="text-decoration-none">
            View all →
          </Link>
        </div>

        {loading ? (
          <p className="text-muted">Loading authors…</p>
        ) : authors.length === 0 ? (
          <p className="text-muted">No authors available yet.</p>
        ) : (
          <div className="row">
            {authors.map((a) => (
              <motion.div
                key={a.id}
                className="col-md-4 mb-4"
                initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
              >
                
                <Link
                  to={`/author/${slugify(a.name)}`}
                  className="text-decoration-none"
                >
                  <div className="card border-0 shadow-sm h-100">
                    <img
                      src={a.photo ||pf }
                      alt={a.name}
                      loading="lazy"
                      style={{ height: 250, objectFit: "cover" }}
                    />
                    <div className="card-body text-center">
                      <h6 className="fw-semibold text-dark">{a.name}</h6>
                      <p className="text-muted">{a.views || 0} views , {a.booksCount || 0} books , {a.ratingAvg || 0} rating</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Feeds/>

      <ReadingLetter />
      <Patrika />
      <Faq />
    </>
  );
}

export default PreHome;
