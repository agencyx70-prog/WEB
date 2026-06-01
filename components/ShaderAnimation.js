'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { reducedMotion, smallScreen, cappedDpr, observeVisible } from './bgUtils';

// Ported from shader-animation.tsx (TSX -> JS). Fills its parent (position the
// parent `relative`). Red-tinted to match the site's black/red theme.
export default function ShaderAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }

        // Red-tinted output to match the black/red theme.
        float glow = color.r + color.g + color.b;
        vec3 tint = vec3(1.0, 0.16, 0.12);
        gl_FragColor = vec4(glow * tint, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { type: 'f', value: 1.0 },
      resolution: { type: 'v2', value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const small = smallScreen();
    const renderer = new THREE.WebGLRenderer({ antialias: !small });
    renderer.setPixelRatio(cappedDpr(small ? 1.25 : 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };
    onResize();
    window.addEventListener('resize', onResize, false);

    // Re-measure if the section resizes (cards/layout changes)
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(onResize);
      ro.observe(container);
    }

    let raf = 0;
    let visible = true;
    const renderFrame = () => { renderer.render(scene, camera); };
    const animate = () => {
      if (!visible) { raf = 0; return; }
      uniforms.time.value += 0.05;
      renderFrame();
      raf = requestAnimationFrame(animate);
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(animate); };

    let unobserve = () => {};
    if (reducedMotion()) {
      renderFrame(); // single static frame
    } else {
      unobserve = observeVisible(container, (v) => { visible = v; if (v) start(); });
      start();
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
      unobserve();
      if (raf) cancelAnimationFrame(raf);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#000', pointerEvents: 'none' }}
    />
  );
}
