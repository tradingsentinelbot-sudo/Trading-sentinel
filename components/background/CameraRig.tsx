"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA_WAYPOINTS, CAMERA_PRESENCE } from "@/constants/scene";
import { wander3 } from "@/lib/wander";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * CameraRig — implementa due comportamenti distinti, mai confusi tra loro:
 *
 * 1. Waypoint camera: la posizione "di riferimento" della camera interpola
 *    morbidamente tra i waypoint definiti in constants/scene.ts in base
 *    allo scroll (mai 1:1 con la velocità di scroll).
 * 2. Camera Presence: sopra il waypoint, una deriva continua e deterministica
 *    (somma di sinusoidi, mai casuale) dà alla camera "massa" e "inerzia",
 *    evitando che la scena sembri congelata anche a scroll fermo.
 *
 * Rif. Global Technical Directive — punto 6 (Camera) e Camera Presence.
 */
export function CameraRig({
  pointerParallax = false,
}: {
  pointerParallax?: boolean;
}) {
  const { camera } = useThree();
  const progress = useScrollProgress();
  const targetRef = useRef(new THREE.Vector3());
  const lookAtRef = useRef(new THREE.Vector3());
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!pointerParallax) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerParallax]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Trova i due waypoint tra cui interpolare in base al progresso di scroll.
    const wps = CAMERA_WAYPOINTS;
    let from = wps[0];
    let to = wps[wps.length - 1];
    for (let i = 0; i < wps.length - 1; i++) {
      if (progress >= wps[i].scrollAt && progress <= wps[i + 1].scrollAt) {
        from = wps[i];
        to = wps[i + 1];
        break;
      }
    }
    const span = Math.max(0.0001, to.scrollAt - from.scrollAt);
    const localT = THREE.MathUtils.clamp((progress - from.scrollAt) / span, 0, 1);
    const eased = THREE.MathUtils.smoothstep(localT, 0, 1);

    targetRef.current.set(
      THREE.MathUtils.lerp(from.position[0], to.position[0], eased),
      THREE.MathUtils.lerp(from.position[1], to.position[1], eased),
      THREE.MathUtils.lerp(from.position[2], to.position[2], eased)
    );
    lookAtRef.current.set(
      THREE.MathUtils.lerp(from.lookAt[0], to.lookAt[0], eased),
      THREE.MathUtils.lerp(from.lookAt[1], to.lookAt[1], eased),
      THREE.MathUtils.lerp(from.lookAt[2], to.lookAt[2], eased)
    );

    // Camera Presence: deriva deterministica, ampiezza minima.
    const drift = wander3(t, 0, CAMERA_PRESENCE.positionAmplitude);
    const lookDrift = wander3(t, 100, CAMERA_PRESENCE.lookAtAmplitude);

    const pointerOffsetX = pointerParallax ? pointer.current.x * 0.06 : 0;
    const pointerOffsetY = pointerParallax ? pointer.current.y * -0.04 : 0;

    const desiredPos = targetRef.current
      .clone()
      .add(new THREE.Vector3(drift.x + pointerOffsetX, drift.y + pointerOffsetY, drift.z));
    const desiredLookAt = lookAtRef.current.clone().add(new THREE.Vector3(lookDrift.x, lookDrift.y, lookDrift.z));

    // Smorzamento: la camera "insegue" la posizione desiderata, mai un salto.
    camera.position.lerp(desiredPos, 1 - Math.pow(0.001, state.clock.getDelta() || 0.016));
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    camera.lookAt(desiredLookAt);

    if ("fov" in camera) {
      const targetFov = THREE.MathUtils.lerp(from.fov, to.fov, eased);
      const cam = camera as THREE.PerspectiveCamera;
      if (Math.abs(cam.fov - targetFov) > 0.01) {
        cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, 0.05);
        cam.updateProjectionMatrix();
      }
    }
  });

  return null;
}
