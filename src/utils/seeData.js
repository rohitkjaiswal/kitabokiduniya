 // src/utils/seedData.js
 import { collection, addDoc } from "firebase/firestore";
 import { db } from "../firebase"; // adjust path
 import authorsData from "../data/authorsData";
 import booksByGenre from "../data/booksByGenre";

 const seedFirestoreData = async() => {
     try {
         // Push authors in parallel
         await Promise.all(
             authorsData.map((author) => addDoc(collection(db, "authors"), author))
         );

         // Push books by genre in parallel
         const bookPromises = [];
         for (const genre in booksByGenre) {
             booksByGenre[genre].forEach((book) => {
                 bookPromises.push(addDoc(collection(db, "books"), {...book, genre }));
             });
         }
         await Promise.all(bookPromises);

         console.log("✅ Firestore data seeded successfully");
     } catch (error) {
         console.error("🔥 Error seeding data:", error);
     }
 };


 export default seedFirestoreData;