import React, { useState, useEffect, useRef } from "react";
import "./App.css";

interface Firework {
  x: number;
  y: number;
  color: string;
  size: number;
  explosionDuration: number;
  exploded: boolean;
  targetX: number;
  targetY: number;
  particles: Particle[];
}

interface Particle {
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
  angle: number;
  alpha: number;
  gravity: number;
}

const App: React.FC = () => {
  // State variables
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [explosionRadius, setExplosionRadius] = useState<number>(30);
  const [explosionDuration, setExplosionDuration] = useState<number>(3);
  const [fireworkColor, setFireworkColor] = useState<string>("#ffffff");
  const [fireworkSize, setFireworkSize] = useState<number>(3);

  // Canvas reference
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation loop effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const interval = setInterval(() => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw fireworks
      fireworks.forEach((firework, index) => {
        if (!firework.exploded) {
          drawFirework(ctx, firework);
          moveFirework(firework, index);
        } else if (firework.explosionDuration > 0) {
          drawExplosion(ctx, firework);
          moveParticles(firework, index);
          firework.explosionDuration -= 0.05;
        } else {
          fireworks.splice(index, 1);
        }
      });
    }, 50);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [fireworks]);

  // Drawing functions
  const drawFirework = (ctx: CanvasRenderingContext2D, firework: Firework) => {
    ctx.beginPath();
    ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
    ctx.fillStyle = firework.color;
    ctx.fill();
  };

  const drawExplosion = (ctx: CanvasRenderingContext2D, firework: Firework) => {
    const explosionParticles = 30;

    if (firework.particles.length === 0) {
      for (let i = 0; i < explosionParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const gravity = Math.random() * 2 + 1;

        const newParticle: Particle = {
          x: firework.x,
          y: firework.y,
          color: firework.color,
          size: Math.random() * 3 + 1,
          speed: speed,
          angle: angle,
          alpha: 1,
          gravity: gravity,
        };

        firework.particles.push(newParticle);
      }
    } else {
      firework.particles.forEach((particle) => drawParticle(ctx, particle));
    }
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.alpha;
    ctx.fill();
    ctx.globalAlpha = 1; // Reset global alpha
  };

  // Movement functions
  const moveFirework = (firework: Firework, index: number) => {
    const dx = firework.targetX - firework.x;
    const dy = firework.targetY - firework.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 3;
    const velocityX = (dx / distance) * speed;
    const velocityY = (dy / distance) * speed;

    if (distance < speed) {
      firework.exploded = true;
      firework.explosionDuration = explosionDuration;
      firework.particles = [];
    } else {
      firework.x += velocityX;
      firework.y += velocityY;
    }

    setFireworks([
      ...fireworks.slice(0, index),
      firework,
      ...fireworks.slice(index + 1),
    ]);
  };

  const moveParticles = (firework: Firework, index: number) => {
    for (let i = 0; i < firework.particles.length; i++) {
      const particle = firework.particles[i];

      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed;

      // Apply gravity
      particle.y += particle.gravity;

      // Reduce alpha (transparency) gradually
      particle.alpha -= 0.02;

      // If the particle's alpha becomes less than or equal to 0, remove it from the array
      if (particle.alpha <= 0) {
        firework.particles.splice(i, 1);
        i--; // Adjust index due to removal of element
      }
    }

    // If all particles have faded away, mark the firework as exploded
    if (firework.particles.length === 0) {
      firework.exploded = true;
    }

    setFireworks([
      ...fireworks.slice(0, index),
      firework,
      ...fireworks.slice(index + 1),
    ]);
  };

  // Event handler for canvas click
  const handleClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newFirework: Firework = {
      x: canvas.width / 2,
      y: canvas.height,
      color: fireworkColor,
      size: fireworkSize,
      explosionDuration: explosionDuration,
      exploded: false,
      targetX: x,
      targetY: y,
      particles: [],
    };

    setFireworks([...fireworks, newFirework]);
  };

  // Render
  return (
    <div className="App">
      <canvas
        className="canvas"
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleClick}
      ></canvas>
      <div className="controls">
        <label htmlFor="fireworkSize">Firework Size:</label>
        <input
          id="fireworkSize"
          type="number"
          value={fireworkSize}
          onChange={(e) => setFireworkSize(parseInt(e.target.value))}
        />
        <br />
        <label htmlFor="fireworkColor">Firework Color:</label>
        <input
          id="fireworkColor"
          type="color"
          value={fireworkColor}
          onChange={(e) => setFireworkColor(e.target.value)}
        />
        <br />
        <label htmlFor="explosionDuration">Explosion Duration:</label>
        <input
          id="explosionDuration"
          type="number"
          value={explosionDuration}
          onChange={(e) => setExplosionDuration(parseInt(e.target.value))}
        />
        <br />
        <label htmlFor="explosionRadius">Explosion Radius:</label>
        <input
          id="explosionRadius"
          type="number"
          value={explosionRadius}
          onChange={(e) => setExplosionRadius(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default App;

