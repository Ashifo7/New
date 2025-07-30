// src/components/RotatingText.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// This is a simplified mock-up of your RotatingText component
// In a real app, you would have the full implementation here.
const RotatingText = ({ texts, mainClassName, staggerFrom, initial, animate, exit, staggerDuration, splitLevelClassName, transition, rotationInterval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts, rotationInterval]);

  const currentText = texts[currentIndex];
  const words = currentText.split(' ');

  return (
    <div className={`inline-flex items-center ${mainClassName}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentText} // Key is important for AnimatePresence to detect changes
          initial={initial}
          animate={animate}
          exit={exit}
          transition={transition}
          className={splitLevelClassName}
          style={{ display: 'inline-block' }} // Ensure motion.span doesn't interfere with layout
        >
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block"> {/* Ensures each word is animated */}
              {word.split('').map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  initial={{ y: "100%" }} // Apply initial to characters
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  transition={{ ...transition, delay: charIndex * (staggerDuration || 0) }} // Stagger characters
                  className="inline-block" // Ensure character spans don't break words
                >
                  {char}
                </motion.span>
              ))}{" "}
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default RotatingText;