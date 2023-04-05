import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";

export default function Scene({ children, ...props }: any) {
  return (
    <Canvas
      {...props}
      style={{
        height: "100vh",
        width: "100vw",
        position: "absolute",
        top: 0,
        left: 0,
        background: "#000000",
      }}
      camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 100000 }}
    >
      <Preload all />
      {children}
    </Canvas>
  );
}
