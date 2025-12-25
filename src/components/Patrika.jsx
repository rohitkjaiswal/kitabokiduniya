// src/components/Patrika.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import patrikaMessages from "../data/patrikaMessages";
import styles from "./Patrika.module.css";

const Patrika = () => {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openTimeout = setTimeout(() => setIsOpen(true), 1000);
    const changeTimeout = setInterval(() => {
      setIsOpen(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % patrikaMessages.length);
        setIsOpen(true);
      }, 1000);
    }, 8000);

    return () => {
      clearInterval(changeTimeout);
      clearTimeout(openTimeout);
    };
  }, []);

  return (
    <motion.div initial={{opacity:0}} whileInView={{opacity:1}} transition={{duration:2,property:'easeInOut'}} className={styles.wrapper}>
      <h2 className={styles.title} style={{ fontSize: "2rem", marginBottom: "1rem", color: "purple" }}> Messages for You</h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={index + "patrika"}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: isOpen ? 0 : -90, opacity: isOpen ? 1 : 0 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 1 }}
          className={styles.patrikaBox}
        >
          <h4 className={styles.title}>{patrikaMessages[index].title}</h4>
          <p className={styles.message}>{patrikaMessages[index].message}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Patrika;
