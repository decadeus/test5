"use client";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

function SpinningModel({ url }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.03;
  });
  const { scene } = useGLTF(url);
  return <primitive object={scene} ref={ref} scale={1.2} />;
}

export default function Loader3D() {
  return (
    <div style={{ width: 48, height: 48 }}>
      <Canvas camera={{ position: [0, 0, 3] }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={0.5} />
        <SpinningModel url="/chatbot.glb" />
      </Canvas>
    </div>
  );
}

// Nécessite le fichier public/chatbot.glb 