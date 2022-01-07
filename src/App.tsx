import React, { useState, useEffect, useRef } from "react";
import "./App.css";

interface Firework {
  x: number;
  y: number;
  color: string;
  size: number;
  explosionRadius: number;
  explosionDuration: number;
  exploded: boolean;
  targetX: number;
  targetY: number;
  particles: Particle[];
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  alpha: number;
}

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [explosionRadius, setExplosionRadius] = useState<number>(30);
  const [explosionDuration, setExplosionDuration] = useState<number>(3);
  const [fireworkColor, setFireworkColor] = useState<string>("#ffffff");
  const [fireworkSize, setFireworkSize] = useState<number>(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const interval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    return () => clearInterval(interval);
  }, [fireworks]);

  const drawFirework = (ctx: CanvasRenderingContext2D, firework: Firework) => {
    ctx.beginPath();
    ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
    ctx.fillStyle = firework.color;
    ctx.fill();
  };

  const drawExplosion = (ctx: CanvasRenderingContext2D, firework: Firework) => {
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1; // Random speed between 1 and 4
      const radius = Math.random() * firework.explosionRadius;

      // Calculate particle position
      const x = firework.x + Math.cos(angle) * radius;
      const y = firework.y + Math.sin(angle) * radius;

      // Random size and color for each particle
      const size = Math.random() * 3 + 1; // Random size between 1 and 4
      const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color

      const newParticle: Particle = {
        x: x,
        y: y,
        size: size,
        color: color,
        speed: speed,
        alpha: 1,
      };

      // Draw the particle
      drawParticle(ctx, newParticle);

      // Store particle properties for animation
      firework.particles.push(newParticle);
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

    fireworks[index] = firework;
    setFireworks([...fireworks]);
  };

  const moveParticles = (firework: Firework, index: number) => {
    const gravity = 10,
      angle = 45;
    for (let i = 0; i < firework.particles.length; i++) {
      const particle = firework.particles[i];

      particle.x += Math.cos(angle) * particle.speed;
      particle.y += Math.sin(angle) * particle.speed;

      particle.y += gravity;

      particle.alpha -= 0.01;

      if (particle.alpha <= 0) {
        firework.particles.splice(i, 1);
        i--;
      }
    }

    if (firework.particles.length === 0) {
      firework.exploded = true;
    }

    fireworks[index] = firework;
    setFireworks([...fireworks]);
  };

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
      explosionRadius: explosionRadius,
      explosionDuration: explosionDuration,
      exploded: false,
      targetX: x,
      targetY: y,
      particles: [],
    };

    setFireworks([...fireworks, newFirework]);
  };

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
