import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

export function Cube() {
  const ref = useRef();

  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[3, 0.1, 30, 30]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
}

export default function Square() {
  return (
    <div className="canvas-con">
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} />
        <Cube />
      </Canvas>
    </div>
  );
}
