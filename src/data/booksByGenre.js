// src/data/booksByGenre.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

// 📝 Custom static genres
export const customGenres = {
    Fiction: [
        { title: "Godaan", link: "https://drive.google.com/your-premchand-link-1" },
        { title: "Midnight Masala", link: "https://drive.google.com/your-masala-link" },
    ],
    Poetry: [
        { title: "Dohe of Kabir", link: "https://drive.google.com/your-kabir-link-1" },
        { title: "Rashmirathi", link: "https://drive.google.com/your-business-link-1" },
    ],
    Philosophy: [
        { title: "Kabir's Teachings", link: "https://drive.google.com/your-kabir-link-2" },
        { title: "The Power of Now", link: "https://drive.google.com/your-shayari-link-1" },
    ],
};

// 🔥 Firestore se fetch
export const fetchBooksByGenre = async() => {
    const booksSnapshot = await getDocs(collection(db, "books"));
    const uploadedBooks = booksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    // Group uploaded books by genre
    const genreMap = {};
    uploadedBooks.forEach((book) => {
        if (!genreMap[book.genre]) {
            genreMap[book.genre] = [];
        }
        genreMap[book.genre].push({
            title: book.title,
            link: book.link, // ✅ yahan Firestore ka `link` field use ho raha hai
        });
    });

    // Merge static + firestore genres
    const mergedGenres = {...customGenres };
    for (const [genre, books] of Object.entries(genreMap)) {
        if (!mergedGenres[genre]) mergedGenres[genre] = [];
        mergedGenres[genre] = [...mergedGenres[genre], ...books];
    }

    return mergedGenres;
};

export default customGenres;