import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

export default function Viewer3D({ model }) {
  return (
    <Canvas camera={{ position: [10, 10, 10] }}>
      <ambientLight intensity={1} />
      <OrbitControls />
      <Model path={model} />
    </Canvas>
  );
}