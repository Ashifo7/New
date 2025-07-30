import React, { useRef, useEffect, useState, useCallback } from 'react';

const DotGrid = ({
  dotSize = 10, // Size of each dot (diameter)
  gap = 15,    // Gap between dots
  baseColor = '#1a1a1a', // Color of dots when at rest (very dark gray)
  activeColor = '#5227FF', // Color of dots when active/shocked (vibrant purple)
  proximity = 120, // Distance from mouse to affect dots
  shockRadius = 250, // Max radius of the shockwave effect
  shockStrength = 5, // How much dots move away from the mouse
  resistance = 750, // How quickly dots return to original position
  returnDuration = 1.5, // Duration in seconds for dots to fully return
}) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 }); // Initialize mouse far away
  const dots = useRef([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Function to create and initialize dots
  const initializeDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const newDots = [];
    const numCols = Math.floor(canvas.width / (dotSize + gap));
    const numRows = Math.floor(canvas.height / (dotSize + gap));

    // Calculate offset to center the grid
    const offsetX = (canvas.width - (numCols * (dotSize + gap) - gap)) / 2;
    const offsetY = (canvas.height - (numRows * (dotSize + gap) - gap)) / 2;

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const x = offsetX + j * (dotSize + gap) + dotSize / 2;
        const y = offsetY + i * (dotSize + gap) + dotSize / 2;
        newDots.push({
          x: x,
          y: y,
          originalX: x, // Store original position for return animation
          originalY: y,
          color: baseColor,
          lastShockTime: 0, // Timestamp of last shock
        });
      }
    }
    dots.current = newDots;
  }, [dotSize, gap, baseColor]);

  // Function to draw the dots
  const draw = useCallback((ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas

    dots.current.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dotSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = dot.color;
      ctx.fill();
      ctx.closePath();
    });
  }, [dotSize]);

  // Animation loop
  const animate = useCallback(() => {
    const ctx = canvasRef.current.getContext('2d');
    const currentTime = performance.now();

    dots.current.forEach(dot => {
      const dx = dot.x - mouse.current.x;
      const dy = dot.y - mouse.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Apply shockwave effect if mouse is within proximity
      if (distance < proximity) {
        const angle = Math.atan2(dy, dx);
        const force = Math.max(0, 1 - distance / proximity); // Force decreases with distance
        
        // Calculate target position based on shock strength
        const targetX = dot.originalX + Math.cos(angle) * shockStrength * force;
        const targetY = dot.originalY + Math.sin(angle) * shockStrength * force;

        // Smoothly move towards target
        dot.x += (targetX - dot.x) / resistance;
        dot.y += (targetY - dot.y) / resistance;

        dot.color = activeColor; // Change color when active
        dot.lastShockTime = currentTime;
      } else {
        // Return to original position if not shocked
        const timeSinceShock = (currentTime - dot.lastShockTime) / 1000; // in seconds
        if (timeSinceShock < returnDuration) {
          const progress = timeSinceShock / returnDuration;
          dot.x = dot.originalX + (dot.x - dot.originalX) * (1 - progress);
          dot.y = dot.originalY + (dot.y - dot.originalY) * (1 - progress);
          
          // Interpolate color back to baseColor
          const r1 = parseInt(baseColor.substring(1, 3), 16);
          const g1 = parseInt(baseColor.substring(3, 5), 16);
          const b1 = parseInt(baseColor.substring(5, 7), 16);

          const r2 = parseInt(activeColor.substring(1, 3), 16);
          const g2 = parseInt(activeColor.substring(3, 5), 16);
          const b2 = parseInt(activeColor.substring(5, 7), 16);

          const r = Math.round(r1 + (r2 - r1) * (1 - progress));
          const g = Math.round(g1 + (g2 - g1) * (1 - progress));
          const b = Math.round(b1 + (b2 - b1) * (1 - progress));
          dot.color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

        } else {
          dot.x = dot.originalX;
          dot.y = dot.originalY;
          dot.color = baseColor;
        }
      }
    });

    draw(ctx);
    animationFrameId.current = requestAnimationFrame(animate);
  }, [dotSize, proximity, shockStrength, resistance, returnDuration, baseColor, activeColor, draw]);

  // Effect for canvas initialization and animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      // Set canvas dimensions to match its parent container
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        setDimensions({ width: parent.clientWidth, height: parent.clientHeight });
      }
      initializeDots(); // Re-initialize dots on resize
    };

    // Initial size setup
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Start animation loop
    animationFrameId.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate, initializeDots]);

  // Effect for mouse interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.current.x = -9999; // Move mouse far away when not on canvas
      mouse.current.y = -9999;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []); // Empty dependency array, as mouse ref is stable

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: -1, // Ensure it's behind other content
        pointerEvents: 'auto', // Allow mouse events on canvas itself
      }}
    />
  );
};

export default DotGrid;
