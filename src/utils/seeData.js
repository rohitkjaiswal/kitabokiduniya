 // src/utils/seedData.js
 import { collection, addDoc } from "firebase/firestore";
 import { db } from "../firebase"; // adjust path
 import authorsData from "../data/authorsData";
 import booksByGenre from "../data/booksByGenre";

 const seedFirestoreData = async() => {
     try {
         // 👨‍🎓 Push authors
         for (const author of authorsData) {
             await addDoc(collection(db, "authors"), author);
         }

         // 📚 Push books with genres
         for (const genre in booksByGenre) {
             for (const book of booksByGenre[genre]) {
                 await addDoc(collection(db, "books"), {
                     ...book,
                     genre,
                 });
             }
         }

         console.log("✅ Firestore data seeded successfully");
     } catch (error) {
         console.error("🔥 Error seeding data:", error);
     }
 };

 export default seedFirestoreData;