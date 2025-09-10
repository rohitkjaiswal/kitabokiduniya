// src/utils/createUserProfile.js
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const createUserProfile = async(user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        email: user.email,
        displayName: user.email.split("@")[0], // fallback
        createdAt: serverTimestamp(),
    }, { merge: true });
};