import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, Html, ScreenSpace } from "@react-three/drei";
import { useState } from "react";

export default function Scene({ children, ...props }: any) {
  const [enabled, setEnabled] = useState(false);
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
      <ScreenSpace depth={1}>
        <Html sprite>
          <button
            style={{
              color: "white",
            }}
            onClick={() => setEnabled(!enabled)}
          >
            {/* Toggle Controls */}
          </button>
        </Html>
      </ScreenSpace>
      <Preload all />
      <OrbitControls enabled={enabled} />
      {children}
    </Canvas>
  );
}
