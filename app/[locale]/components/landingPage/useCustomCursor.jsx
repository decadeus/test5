import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const useCustomCursor = (cursorText = "See project") => {
  const [showCursor, setShowCursor] = useState(false);
  const [cursorLink, setCursorLink] = useState("");

  useEffect(() => {
    const handleMouseMove = (event) => {
      const cursor = document.querySelector(".cursor-circle");
      if (cursor) {
        const cursorWidth = 80; // Cursor width
        const cursorHeight = 80; // Cursor height
        const offsetY = 20; // Vertical offset

        cursor.style.left = `${event.clientX - cursorWidth / 2}px`;
        cursor.style.top = `${event.clientY - cursorHeight / 2 - offsetY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const CursorComponent = () => {
    return (
      showCursor && cursorLink && (
        <motion.a href={cursorLink} target="_blank" rel="noopener noreferrer">
          <motion.div
            className="cursor-circle"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              pointerEvents: "none",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bolder",
              color: "white",
              fontSize: "16px",
              textAlign: "center",
              margin: 0,
            }}
          >
            {cursorText} {/* Use the cursor text passed to the hook */}
          </motion.div>
        </motion.a>
      )
    );
  };

  return {
    showCursor,
    setShowCursor,
    cursorLink,
    setCursorLink,
    CursorComponent,
  };
};

export default useCustomCursor;
