"use client";

import { useEffect, useRef, useState } from "react";

interface NodePoint {
  id: string;
  lat: number;
  lng: number;
}

type ThreeLike = {
  Scene: new () => object;
  PerspectiveCamera: new (
    fov: number,
    aspect: number,
    near: number,
    far: number
  ) => {
    position: { set: (x: number, y: number, z: number) => void };
    aspect: number;
    updateProjectionMatrix: () => void;
  };
  WebGLRenderer: new (opts: { antialias: boolean; alpha: boolean }) => {
    domElement: HTMLCanvasElement;
    setSize: (w: number, h: number) => void;
    setPixelRatio: (v: number) => void;
    render: (scene: object, camera: object) => void;
    dispose: () => void;
  };
  AmbientLight: new (color: number, intensity: number) => object;
  PointLight: new (color: number, intensity: number) => {
    position: { set: (x: number, y: number, z: number) => void };
  };
  Mesh: new (geo: object, mat: object) => {
    position: { set: (x: number, y: number, z: number) => void };
    rotation: { y: number };
  };
  SphereGeometry: new (radius: number, w: number, h: number) => object;
  MeshPhongMaterial: new (opts: Record<string, unknown>) => object;
  MeshBasicMaterial: new (opts: Record<string, unknown>) => {
    opacity?: number;
  };
  Group: new () => { rotation: { y: number }; add: (child: object) => void };
};

declare global {
  interface Window {
    THREE?: unknown;
  }
}

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return { x, y, z };
}

export function ThreeGlobeMap({ nodes }: { nodes: NodePoint[] }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [threeUnavailable, setThreeUnavailable] = useState(false);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    let cleanup: (() => void) | undefined;

    const loadThreeScript = async () => {
      if (window.THREE) return true;

      try {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/three@0.179.1/build/three.min.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("CDN unavailable"));
          document.head.appendChild(script);
        });
      } catch {
        try {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
              "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.min.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("CDN unavailable"));
            document.head.appendChild(script);
          });
        } catch {
          return false;
        }
      }

      return Boolean(window.THREE);
    };

    const boot = async () => {
      const loaded = await loadThreeScript();
      if (!loaded) {
        setThreeUnavailable(true);
        return;
      }

      const THREE = window.THREE as ThreeLike | undefined;
      if (!THREE) {
        setThreeUnavailable(true);
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        50,
        mountEl.clientWidth / mountEl.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 7);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountEl.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0x66d9ff, 0.8);
      const pointLight = new THREE.PointLight(0x3b82f6, 1.4);
      pointLight.position.set(4, 5, 6);
      (scene as { add: (x: object) => void }).add(ambient);
      (scene as { add: (x: object) => void }).add(pointLight);

      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(2.45, 64, 64),
        new THREE.MeshPhongMaterial({ color: 0x061632 })
      );
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.09,
      });
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(2.7, 48, 48),
        glowMaterial
      );
      (scene as { add: (x: object) => void }).add(globe);
      (scene as { add: (x: object) => void }).add(glow);

      const nodeGroup = new THREE.Group();
      nodes.forEach((node) => {
        const pos = latLngToVector3(node.lat, node.lng, 2.5);
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x22d3ee })
        );
        marker.position.set(pos.x, pos.y, pos.z);
        nodeGroup.add(marker);
      });
      (scene as { add: (x: object) => void }).add(nodeGroup);

      let frame = 0;
      let raf = 0;
      const animate = () => {
        frame += 0.01;
        globe.rotation.y += 0.0018;
        glow.rotation.y += 0.0012;
        nodeGroup.rotation.y += 0.0018;
        glowMaterial.opacity = 0.07 + Math.sin(frame) * 0.02;
        renderer.render(scene, camera as unknown as object);
        raf = requestAnimationFrame(animate);
      };
      animate();

      const handleResize = () => {
        const w = mountEl.clientWidth;
        const h = mountEl.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", handleResize);
        if (renderer.domElement.parentNode === mountEl)
          mountEl.removeChild(renderer.domElement);
        renderer.dispose();
      };
    };

    void boot();
    return () => cleanup?.();
  }, [nodes]);

  if (threeUnavailable) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="rounded-xl border border-cyan-500/30 bg-slate-900/60 px-4 py-3 text-xs text-slate-300">
          3D globe temporarily unavailable (network blocked). Retrying on
          refresh.
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className="h-full w-full" />;
}
