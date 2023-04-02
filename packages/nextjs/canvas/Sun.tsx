import { useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useSpring, animated, config } from "@react-spring/three";

export function Sun() {
  const model = useGLTF("/Sun.glb");
  const [active, setActive] = useState(false);
  const { scale } = useSpring({
    scale: active ? 25 : 10,
    config: config.wobbly,
  });

  return (
    <animated.mesh onClick={() => setActive(!active)} position={[100, 100, 100]} scale={scale}>
      <primitive object={model.scene} />
    </animated.mesh>
  );
}
