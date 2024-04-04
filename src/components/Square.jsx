import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Html, useProgress, Preload } from "@react-three/drei";
import { Color } from "three";

export function Cube() {
  const laptop = useGLTF("personal.gltf");
  const ref = useRef();
  const { viewport } = useThree();
  const isMobile = viewport.width <= 750;

  return (
    <mesh position={[-0.5, -4, 0]} rotation={[Math.PI / 8, 0, 0]} ref={ref}>
      <primitive scale={3} object={laptop.scene} />
    </mesh>
  );
}

export function Loader() {
  const { progress } = useProgress();
  return (
    <Html as="div" style={{ color: "white" }} center>
      {progress.toFixed(2)} % loaded
    </Html>
  );
}

export default function Square() {
  return (
    <div className="canvas-con">
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        frameloop="demand"
        shadows
        dpr={[1, 2]}
      >
        <ambientLight intensity={4} />
        <directionalLight intensity={10} position={[0, 0, 4]} />
        <Suspense fallback={<Loader />}>
          <Cube />
          <OrbitControls enableZoom={false} />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
}
