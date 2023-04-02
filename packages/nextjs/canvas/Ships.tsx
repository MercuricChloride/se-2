import { useMemo, useRef, useState } from "react";
import { useGLTF, Clone } from "@react-three/drei";
import { Mesh } from "three";
import { Object3DProps } from "@react-three/fiber";
import { animated } from "@react-spring/three";

interface ShipProps {
  x: number;
  y: number;
  z: number;
  rotation: number;
  rate: number;
}

//function Ship({ x, y, z, rotation, rate }: ShipProps) {
function Ship({ x, y, z }: ShipProps) {
  const model = useGLTF("/ship.glb");
  const ref = useRef<Mesh>(null);
  const [clicked, setClicked] = useState(false);
  const [, setHovered] = useState(false);

  const onClick = () => {
    if (!ref.current) return;
    setClicked(!clicked);
    console.log("click");
  };

  const onPointerOver = () => {
    if (!ref.current) return;
    setHovered(true);
    console.log("over");
  };

  const onPointerLeave = () => {
    if (!ref.current) return;
    setHovered(false);
    console.log("leave");
  };

  return (
    <animated.mesh
      ref={ref}
      position={[x, y, z]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerLeave={onPointerLeave}
    >
      <Clone object={model.scene} deep />
    </animated.mesh>
  );
}

interface ShipsProps extends Object3DProps {
  count?: number;
  range?: number;
}

export function Ships({ count = 10, range = 10 }: ShipsProps) {
  const ships = useMemo(() => {
    return Array.from({ length: count }, () => {
      const x = Math.random() * range;
      const y = 0;
      const z = Math.random() * range;
      const rotation = Math.random() * Math.PI * 2;
      const rate = Math.random() * 0.001;
      return { x, y, z, rotation, rate };
    });
  }, [count, range]);

  return <group>{ships.map(Ship)}</group>;
}
