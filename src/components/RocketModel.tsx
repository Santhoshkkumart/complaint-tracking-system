import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import rocketUrl from "../assets/rocket.glb?url";

function Rocket() {
  const { scene } = useGLTF(rocketUrl);
  const rocketRef = useRef();

  useFrame(() => {
    if (rocketRef.current) {
      rocketRef.current.rotation.y += 0.01;
      if (rocketRef.current.position.y < -0.5) {
        rocketRef.current.position.y += 0.02;
      }
    }
  });

  return (
    <primitive
      ref={rocketRef}
      object={scene}
      scale={0.2}
      position={[-1, -6, 0]}
    />
  );
}

export default function RocketModel() {
  return (
    <div className="hidden lg:block absolute right-10 top-0 w-[500px] h-[700px]">
      <Canvas camera={{ position: [-3, 0, 8], fov: 45 }}>
        <ambientLight intensity={1.3} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <Rocket />
      </Canvas>
    </div>
  );
}
