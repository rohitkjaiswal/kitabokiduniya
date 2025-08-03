import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import image1 from '../assets/myfotoindress-removebg-preview.png';
import image2 from '../assets/Chandan-removebg-preview.png';
import image3 from '../assets/aniket-removebg-preview.png';

const imageData = [
  {
    id: 1,
    image: image1,
    bgColor: 'linear-gradient(to right, #ffecd2, #fcb69f)',
    text: 'Mr Rohit Jaiswal (Founder and CEO)',
    shapeColor: 'rgba(255, 105, 180, 0.4)', // Hot pink
  },
  {
    id: 2,
    image: image2,
    bgColor: 'linear-gradient(to right, #43cea2, #185a9d)',
    text: 'Mr Chandan Kumar (Co-Founder and COO)',
    shapeColor: 'rgba(72, 219, 251, 0.4)', // Cyan-ish
  },
  {
    id: 3,
    image: image3,
    bgColor: 'linear-gradient(to right, #ff4e50, #f9d423)',
    text: 'Mr Aniket Bharti (Co-Founder and CTO)',
    shapeColor: 'rgba(255, 200, 100, 0.4)', // Yellow-orange
  },
];

const DynamicHero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imageData.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % imageData.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + imageData.length) % imageData.length);
  };

  const { image, bgColor, text, shapeColor } = imageData[current];

  return (
    <div
      className="vh-100 vw-100 d-flex justify-content-center align-items-center position-relative overflow-hidden"
      style={{ background: bgColor }}
    >
      {/* Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1 }}></div>

      {/* Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="position-absolute top-0 text-white fw-bold text-center px-3"
          style={{ fontSize: '2rem', marginTop: '3rem', zIndex: 5 }}
        >
          {text}
        </motion.div>
      </AnimatePresence>

      {/* Glow behind everything */}
      <motion.div
        key={`glow-${current}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.25 }}
        transition={{ duration: 1.5 }}
        className="rounded-circle position-absolute"
        style={{
          width: '350px',
          height: '350px',
          backgroundColor: '#ffffff',
          filter: 'blur(60px)',
          zIndex: 2,
        }}
      />

      {/* Sub-background shape behind image, coming from right */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`shape-${current}`}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ opacity: 0, x: 200 }}
          transition={{ duration: 1.2 }}
          className="position-absolute rounded-circle"
          style={{
            width: '250px',
            height: '250px',
            backgroundColor: shapeColor,
            zIndex: 3,
            transform: 'rotate(20deg)',
            borderRadius: '50% 40% 50% 60%',
            top: '50%',
            left: '50%',
            marginTop: '-125px',
            marginLeft: '-125px',
            filter: 'blur(15px)',
          }}
        />
      </AnimatePresence>

      {/* Image coming from top */}
      <AnimatePresence mode="wait">
        <motion.img
          key={image}
          src={image}
          alt="Hero Visual"
          initial={{ y: -300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 1 }}
          className="position-relative"
          style={{
            width: '400px',
            objectFit: 'contain',
            zIndex: 6,
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
          }}
        />
      </AnimatePresence>

      {/* Navigation */}
      <div className="position-absolute bottom-0 mb-4 d-flex gap-3 z-3">
        <button onClick={handlePrev} className="btn btn-light btn-sm rounded-pill px-4 shadow">
          ⬅ Prev
        </button>
        <button onClick={handleNext} className="btn btn-light btn-sm rounded-pill px-4 shadow">
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default DynamicHero;
