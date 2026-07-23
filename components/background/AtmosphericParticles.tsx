"use client";

const PARTICLES = Array.from({ length: 112 }, (_, i) => ({
  id: i,
  left: `${(i * 37.7) % 100}%`,
  top: `${(i * 61.3) % 100}%`,
  size: `${1 + (i % 4) * 0.6}px`,
  duration: `${10 + (i % 9) * 2.5}s`,
  delay: `${-(i % 17) * 1.15}s`,
  drift: `${(i % 2 === 0 ? 1 : -1) * (12 + (i % 7) * 6)}px`,
}));

export function AtmosphericParticles() {
  return (
    <div className="atmospheric-particles" aria-hidden="true">
      {PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className="atmospheric-particle"
          style={
            {
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
              ["--particle-drift" as string]: particle.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
