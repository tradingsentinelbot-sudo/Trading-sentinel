"use client";

const PARTICLES = Array.from({ length: 34 }, (_, i) => ({
  id: i,
  left: `${(i * 37.7) % 100}%`,
  top: `${(i * 61.3) % 100}%`,
  size: `${1 + (i % 3) * 0.55}px`,
  duration: `${12 + (i % 7) * 3}s`,
  delay: `${-(i % 11) * 1.7}s`,
  drift: `${(i % 2 === 0 ? 1 : -1) * (8 + (i % 5) * 5)}px`,
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
