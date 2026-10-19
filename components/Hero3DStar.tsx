"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DStar() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 320;
    let height = container.clientHeight || 320;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    // 2. High-performance WebGL Renderer with Alpha & Antialiasing
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Construct 3D 8-Pointed Geometric Star Geometry (Procedural Blender-Fidelity Model)
    const shape = new THREE.Shape();
    const points = 8;
    const outerRadius = 1.35;
    const innerRadius = 0.52;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.18,
      bevelSize: 0.12,
      bevelSegments: 4
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    // 4. Chrome Cyberpunk Material with Specular Reflections
    const material = new THREE.MeshStandardMaterial({
      color: 0x111116,
      metalness: 0.94,
      roughness: 0.18,
      emissive: 0x550009,
      emissiveIntensity: 0.45
    });

    const starMesh = new THREE.Mesh(geometry, material);
    scene.add(starMesh);

    // Core Glowing Wireframe Halo
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff1a2a,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wireMesh = new THREE.Mesh(geometry, wireMat);
    wireMesh.scale.set(1.02, 1.02, 1.02);
    starMesh.add(wireMesh);

    // 5. Studio Lighting Rig (Cinematic Red & White Rim Lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const crimsonKeyLight = new THREE.PointLight(0xff1a2a, 4.5, 12);
    crimsonKeyLight.position.set(2, 2.5, 3);
    scene.add(crimsonKeyLight);

    const rimLight = new THREE.PointLight(0xff3344, 3.5, 10);
    rimLight.position.set(-2.5, -2, -1);
    scene.add(rimLight);

    const specLight = new THREE.DirectionalLight(0xffffff, 1.8);
    specLight.position.set(0, 3, 4);
    scene.add(specLight);

    // 6. Interactive Mouse / Touch Tilt
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x * 0.75;
      mouse.targetY = y * 0.75;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // 7. Animation Loop with Smooth Damping
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Idle float & rotation
      starMesh.rotation.y += 0.012;
      starMesh.rotation.z = Math.sin(time * 0.8) * 0.08;
      starMesh.position.y = Math.sin(time * 1.5) * 0.06;

      // Mouse interactive tilt inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;
      starMesh.rotation.x = mouse.y + Math.sin(time * 0.6) * 0.05;

      // Pulsing internal core light
      crimsonKeyLight.intensity = 3.5 + Math.sin(time * 3) * 1.2;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 320;
      height = container.clientHeight || 320;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      wireMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-72 sm:w-96 h-72 sm:h-96 mx-auto cursor-grab active:cursor-grabbing pointer-events-auto filter drop-shadow-[0_0_40px_rgba(255,26,42,0.6)]"
      title="Interactive 3D Chrome Star Model - Move mouse to inspect"
    />
  );
}
