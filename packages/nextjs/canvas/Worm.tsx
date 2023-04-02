import { useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useSpring, animated, config } from "@react-spring/three";

export function Worm() {
  const model = useGLTF("/Worm.glb");
  const [active, setActive] = useState(false);

  const { scale } = useSpring({
    scale: active ? 1000 : 500,
    config: config.wobbly,
  });

  return (
    <animated.mesh onClick={() => setActive(!active)} position={[-100, 100, -100]} scale={scale}>
      <primitive object={model.scene} />
    </animated.mesh>
  );
}
