'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { reducedMotion, smallScreen, cappedDpr, observeVisible } from './bgUtils';

// Ported from dotted-surface.tsx (TSX -> JS). Removed next-themes (site is dark);
// dots are tinted with `color`. Container-sized, paused when off-screen, lighter on mobile.
export default function DottedSurface({ color = '#ff2b2b', opacity = 0.5 }) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const small = smallScreen();
    const SEP = 150;
    const AX = small ? 26 : 40;
    const AY = small ? 36 : 60;

    const W = () => container.clientWidth || window.innerWidth;
    const H = () => container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W() / H(), 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !small });
    renderer.setPixelRatio(cappedDpr(small ? 1.25 : 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
    container.appendChild(renderer.domElement);

    const positions = [];
    for (let ix = 0; ix < AX; ix++) {
      for (let iy = 0; iy < AY; iy++) {
        positions.push(ix * SEP - (AX * SEP) / 2, 0, iy * SEP - (AY * SEP) / 2);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: small ? 6 : 8,
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const arr = geometry.attributes.position.array;
    let count = 0;
    let raf = 0;
    let visible = true;

    const drawFrame = () => {
      let i = 0;
      for (let ix = 0; ix < AX; ix++) {
        for (let iy = 0; iy < AY; iy++) {
          arr[i * 3 + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!visible) { raf = 0; return; }
      count += 0.1;
      drawFrame();
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const onResize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    };
    window.addEventListener('resize', onResize);
    let ro;
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(onResize); ro.observe(container); }

    let unobserve = () => {};
    if (reducedMotion()) {
      drawFrame(); // single static frame
    } else {
      unobserve = observeVisible(container, (v) => { visible = v; if (v) start(); });
      start();
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
      unobserve();
      if (raf) cancelAnimationFrame(raf);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [color, opacity]);

  return <div ref={ref} aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} />;
}
