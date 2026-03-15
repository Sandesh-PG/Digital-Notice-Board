import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Full-screen Three.js particle-network background.
 * - ~150 glowing particles drift through 3D space.
 * - Nearby particles are connected by glowing emerald lines.
 * - Mouse movement creates a smooth parallax effect on the camera.
 * - Additive blending gives everything a neon-glow look on the dark bg.
 */
export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Dimensions ────────────────────────────────────────────────
    let W = mount.clientWidth;
    let H = mount.clientHeight;

    // ── Scene / Camera / Renderer ─────────────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 500);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(globalThis.window?.devicePixelRatio ?? 1, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x0d1117); // deep dark background
    mount.appendChild(renderer.domElement);

    // ── Particle data ─────────────────────────────────────────────
    const COUNT = 150;
    const SPREAD_XY = 130;
    const SPREAD_Z = 60;
    const CONNECT_DIST = 26;

    const palette = [
      new THREE.Color(0x10b981), // emerald-500
      new THREE.Color(0x34d399), // emerald-400
      new THREE.Color(0x14b8a6), // teal-500
      new THREE.Color(0x2dd4bf), // teal-400
      new THREE.Color(0x06b6d4), // cyan-500
      new THREE.Color(0xe2f9f1), // near-white
    ];

    const posArr = new Float32Array(COUNT * 3);
    const velArr = new Float32Array(COUNT * 3);
    const colArr = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      posArr[i * 3]     = (Math.random() - 0.5) * SPREAD_XY;
      posArr[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_XY;
      posArr[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;

      velArr[i * 3]     = (Math.random() - 0.5) * 0.05;
      velArr[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      velArr[i * 3 + 2] = (Math.random() - 0.5) * 0.025;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colArr[i * 3]     = c.r;
      colArr[i * 3 + 1] = c.g;
      colArr[i * 3 + 2] = c.b;
    }

    // ── Particle Points ───────────────────────────────────────────
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    pGeo.setAttribute("color",    new THREE.BufferAttribute(colArr, 3));

    const pMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ── Connection Lines ──────────────────────────────────────────
    // Max possible segments = COUNT*(COUNT-1)/2; buffer slightly larger.
    const maxSegments = (COUNT * (COUNT - 1)) / 2;
    const linePos = new Float32Array(maxSegments * 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    // ── Ambient faint fog for depth ───────────────────────────────
    scene.fog = new THREE.FogExp2(0x0d1117, 0.006);

    // ── Mouse parallax ────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX / W - 0.5) * 2;
      mouseY = -(e.clientY / H - 0.5) * 2;
    };
    globalThis.window?.addEventListener("mousemove", onMouseMove);

    // ── Resize handler ────────────────────────────────────────────
    const onResize = () => {
      W = mount.clientWidth;
      H = mount.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    globalThis.window?.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────────
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Drift particles and bounce off bounds
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;

        posArr[ix] += velArr[ix];
        posArr[iy] += velArr[iy];
        posArr[iz] += velArr[iz];

        const halfXY = SPREAD_XY / 2;
        const halfZ  = SPREAD_Z  / 2;

        if (posArr[ix] >  halfXY || posArr[ix] < -halfXY) velArr[ix] *= -1;
        if (posArr[iy] >  halfXY || posArr[iy] < -halfXY) velArr[iy] *= -1;
        if (posArr[iz] >  halfZ  || posArr[iz] < -halfZ)  velArr[iz] *= -1;
      }

      pGeo.attributes.position.needsUpdate = true;

      // Rebuild line segments for nearby pairs
      let lineIdx = 0;

      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = posArr[i * 3]     - posArr[j * 3];
          const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
          const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
          const dist = Math.hypot(dx, dy, dz);

          if (dist < CONNECT_DIST) {
            linePos[lineIdx++] = posArr[i * 3];
            linePos[lineIdx++] = posArr[i * 3 + 1];
            linePos[lineIdx++] = posArr[i * 3 + 2];
            linePos[lineIdx++] = posArr[j * 3];
            linePos[lineIdx++] = posArr[j * 3 + 1];
            linePos[lineIdx++] = posArr[j * 3 + 2];
          }
        }
      }

      lineGeo.setDrawRange(0, lineIdx / 3);
      lineGeo.attributes.position.needsUpdate = true;

      // Smooth camera parallax following the mouse
      camera.position.x += (mouseX * 10 - camera.position.x) * 0.025;
      camera.position.y += (mouseY * 10 - camera.position.y) * 0.025;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ───────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      globalThis.window?.removeEventListener("mousemove", onMouseMove);
      globalThis.window?.removeEventListener("resize", onResize);
      pGeo.dispose();
      lineGeo.dispose();
      pMat.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        renderer.domElement.remove();
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" aria-hidden="true" />;
}
