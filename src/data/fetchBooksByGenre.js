// src/data/fetchBooksByGenre.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // apna firebase config se import

// 🔥 Case 1: Agar tumhare paas "books" collection hai aur har document ek book hai
// { title, genre, link, coverPage, description, uploaderEmail, uploadedBy }
export const fetchBooksByGenre = async() => {
    try {
        const snapshot = await getDocs(collection(db, "books"));
        const genreMap = {};

        snapshot.forEach((doc) => {
            const data = doc.data();
            const { title, genre, link, coverPage, description, uploaderEmail, uploadedBy } = data;

            if (!genreMap[genre]) {
                genreMap[genre] = {
                    genre,
                    books: [],
                    link: link || "#",
                };
            }

            // push book object
            const titleStr = typeof title === "string" ? title : "Untitled Book";
            genreMap[genre].books.push({
                title: titleStr,
                link: link || "#",
                coverPage: coverPage || null,
                description: description || "",
                uploaderEmail: uploaderEmail || "Unknown",
                uploadedBy: uploadedBy || "anonymous",
                createdAt: createdAt || 'anonymous',
            });
        });

        return Object.values(genreMap); // array of genres with books
    } catch (err) {
        console.error("❌ Firestore fetch error:", err);
        return [];
    }
};