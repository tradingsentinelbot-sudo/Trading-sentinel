"use client";

const ROCKS = [
  { src: "/hero-composed/background-fragments.png", className: "ambient-rock ambient-rock-a" },
  { src: "/hero-composed/midground.png", className: "ambient-rock ambient-rock-b" },
  { src: "/hero-composed/foreground-lower.png", className: "ambient-rock ambient-rock-c" },
] as const;

export function AmbientRockField() {
  return (
    <div className="ambient-rock-field" aria-hidden="true">
      {ROCKS.map((rock) => <img key={rock.src} src={rock.src} className={rock.className} alt="" />)}
    </div>
  );
}
