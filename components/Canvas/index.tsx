"use client";

import React, { useEffect, useRef } from "react";
import render from "./script";

import particleImage from "./textures/particles/1.png";

function Canvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current) {
      render(canvasRef.current, { particleImage });
    }
  }, []);

  return <canvas className="webgl" ref={canvasRef}></canvas>;
}

export default Canvas;
