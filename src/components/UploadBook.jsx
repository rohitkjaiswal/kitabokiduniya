import { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

const UploadBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const storageRef = ref(storage, `books/${file.name}`); // Storage path
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Save book details in Firestore
        await addDoc(collection(db, "books"), {
          title,
          author,
          url: downloadURL,
          uploadedAt: new Date(),
        });

        alert("Book uploaded successfully!");
        setTitle("");
        setAuthor("");
        setFile(null);
        setProgress(0);
      }
    );
  };

  return (
    <div>
      <h2>Upload a Book</h2>
      <form onSubmit={handleUpload}>
        <input type="text" placeholder="Book Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit">Upload</button>
        {progress > 0 && <p>Uploading: {progress.toFixed(2)}%</p>}
      </form>
    </div>
  );
};

export default UploadBook;
