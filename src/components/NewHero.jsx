import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import image1 from '../assets/krishnaji-removebg-preview.png';
import image2 from '../assets/Hanumanji-removebg-preview.png';
import image3 from '../assets/sarswatimata-removebg-preview.png';

const imageData = [
  {
    id: 1,
    image: image1,
    bgGradient: 'linear-gradient(to right, #fdfbfb, #ebedee)',
    text: 'Krishnaji: The Divine Teacher',
    blobColor: 'rgba(255, 105, 180, 0.4)',
  },
  {
    id: 2,
    image: image2,
    bgGradient: 'linear-gradient(to right, #74ebd5, #ACB6E5)',
    text: 'Hanumanji: The Strength of Devotion',
    blobColor: 'rgba(135, 206, 250, 0.4)',
  },
  {
    id: 3,
    image: image3,
    bgGradient: 'linear-gradient(to right, #ffecd2, #fcb69f)',
    text: 'Saraswati Mata: Where Stories Breathe',
    blobColor: 'rgba(255, 200, 100, 0.4)',
  },
];

const CreativeHero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imageData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const { image, bgGradient, text, blobColor } = imageData[current];

  return (
    <div
      className="container-fluid vh-100 w-full   position-relative overflow-hidden d-flex justify-content-center align-items-center p-2 mt-2"
      style={{ background: bgGradient }}
    >
      {/* Overlay */}
      <div
        className="position-absolute w-100 h-100"
        style={{ backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1 }}
      ></div>

      {/* Morphing Blob Background */}
      <motion.div
        key={`blob-${current}`}
        initial={{ x: 500, scale: 0.5, opacity: 0 }}
        animate={{ x: 0, scale: 1, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="position-absolute container-fluid"
        style={{
          width: '500px',
          height: '500px',
          backgroundColor: blobColor,
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          filter: 'blur(60px)',
          zIndex: 2,
        }}
      />

      {/* Text Box */}
      <motion.div
        key={`text-${text}`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 1 }}
        className="position-absolute text-white text-center px-4 py-3 rounded shadow-lg"
        style={{
          zIndex: 4,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          top: '10%',
          fontSize: '1.8rem',
          fontWeight: 'bold',
        }}
      >
        {text}
      </motion.div>

      {/* Glowing Accent Behind Image */}
      <motion.div
        key={`glow-${current}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.4, opacity: 0.2 }}
        transition={{ duration: 1.8 }}
        className="rounded-circle position-absolute"
        style={{
          width: '300px',
          height: '300px',
          backgroundColor: '#fff',
          filter: 'blur(60px)',
          zIndex: 3,
        }}
      />

      {/* Main Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={image}
          src={image}
          alt="hero visual"
          initial={{ y: -300, scale: 0.95, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ opacity: 0, y: 150 }}
          transition={{ duration: 1, type: 'spring', stiffness: 90 }}
          className="position-relative"
          style={{
            width: '300px',
            objectFit: 'contain',
            zIndex: 5,
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
          }}
        />
      </AnimatePresence>
    </div>
  );
};

export default CreativeHero;