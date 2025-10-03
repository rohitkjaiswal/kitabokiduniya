// src/components/ReadingLetter.jsx

import React from "react";
import styles from "./ReadingLetter.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "motion/react";

const ReadingLetter = () => {
  return (
    <section className={`${styles.letterSection} py-5`}>
      <div className="container" >
        <div className={`${styles.letterWrapper} p-4 shadow-lg`}>
          <motion.h2 initial={{opacity:0,x:-100}} whileInView={{opacity:1,x:0}} transition={{duration:1,property:'easeInOut'}} className="text-center mb-4 text-dark">A Letter to the Reader 📜</motion.h2>
          <motion.p initial={{opacity:0,y:-10}} whileInView={{opacity:1,y:0}} transition={{duration:2,property:'easeInOut'}} className={`${styles.letterText}`}>
            Dear Seeker,<br /><br />
            In a world that moves faster than thoughts, where noise is abundant and peace feels distant—books offer sanctuary. Every page read is a step inward, a moment stolen for self-reflection. 
            <br /><br />
            Reading is not a habit; it’s a ritual. A quiet rebellion against chaos. It gives us more than knowledge—it gives us **meaning**. It anchors our souls, strengthens empathy, and whispers ancient wisdom that screens never will.
            <br /><br />
            If life is a storm, reading is the shelter.<br />
            If the world is noisy, reading is the silence we deserve.
            <br /><br />
            So read not just to learn, but to feel. To slow down. To heal.<br /><br />
            Yours in the margins,<br />
            <strong className="text-muted">The Living Book</strong>
          </motion.p>
        </div>
      </div> 
    </section>
  );
};

export default ReadingLetter;
