import { useEffect, useState } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {motion} from 'motion/react'

const TopContributors = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    async function fetchTopContributors() {
      const oneWeekAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
      const booksQuery = query(collection(db, "books"), where("createdAt", ">=", oneWeekAgo));
      const snapshot = await getDocs(booksQuery);

      const counts = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        const uploader = data.uploadedBy || data.uploaderEmail || "Unknown";
        counts[uploader] = (counts[uploader] || 0) + 1;
      });

      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([uploader, count], index) => ({ rank: index + 1, uploader, count }));

      setContributors(sorted);
    }

    fetchTopContributors();
  }, []);

  return (
    <div className="container py-5">
      <motion.h3 initial={{opacity:0,x:-100}} whileInView={{opacity:1,x:0}} transition={{duration:2,property:'easeInOut'}} className="text-center fw-bold text-primary mb-4">🏆 Top 10 Contributors This Week</motion.h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="table-light">
            <tr >
              <th scope="col">Rank</th>
              <th scope="col">Contributor</th>
              <th scope="col">Books Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {contributors.map(({ rank, uploader, count }) => (
              <motion.tr initial={{opacity:0,x:-100}} whileInView={{opacity:1,x:0}} transition={{duration:1,property:'easeInOut'}} key={uploader}>
                <td>{rank}</td>
                <td> <a href={`/profile/${uploader}`}>{uploader.name||"Anonymous"}</a></td>
                <td>{count}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopContributors;