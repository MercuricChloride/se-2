import { useGLTF } from "@react-three/drei";
import { Object3DProps } from "@react-three/fiber";
import { useMemo, useState } from "react";
import { useSpring, animated } from "@react-spring/three";
import { Vector3 } from "three";

interface OceanProps extends Object3DProps {
  x: number;
  z: number;
}

const Ocean = ({ x, z }: OceanProps) => {
  const model = useGLTF("/ocean.glb");
  const [click] = useState(false);
  const { scale } = useSpring({
    scale: click ? new Vector3(1, 1, 1) : new Vector3(0.05, 0.05, 0.05),
  });
  const onClick = () => {
    console.log("click");
  };
  return (
    <animated.object3D position={[x, 0, z]} scale={scale} onClick={onClick}>
      <primitive object={model.scene.clone()} />
    </animated.object3D>
  );
};

interface OceansProps extends Object3DProps {
  sideLength: number;
}

export const Oceans = ({ sideLength }: OceansProps) => {
  const oceans = useMemo(() => {
    return Array.from({ length: sideLength * sideLength }).map((_, index) => {
      const x = (index % sideLength) * 90 - (sideLength * 90) / 2;
      const z = Math.floor(index / sideLength) * 90 - (sideLength * 90) / 2;
      return { x, z };
    });
  }, [sideLength]);

  return (
    <group>
      {oceans.map((ocean, index) => (
        <Ocean key={index} {...ocean} />
      ))}
    </group>
  );
};
