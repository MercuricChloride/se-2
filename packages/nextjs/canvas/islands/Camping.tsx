import { useGLTF, SpotLight } from "@react-three/drei";
import { Vector3, Object3D, Group } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export interface CampingProps {
  position: [number, number, number];
  scale: [number, number, number];
}

interface IslandProps {
  model: Object3D;
}

export function SnowIsland({ model }: IslandProps) {
  const [hovered, setHover] = useState(false);
  const ref = useRef<Object3D>(null);

  const onPointerOver = () => {
    setHover(true);
  };

  const onPointerLeave = () => {
    setHover(false);
  };

  return (
    <group onPointerOver={onPointerOver} onPointerLeave={onPointerLeave}>
      <primitive ref={ref} object={model} />
      {hovered && (
        <SpotLight
          distance={500}
          intensity={1}
          position={ref.current ? new Vector3(0, 20, 0).add(ref?.current?.position) : 0}
        />
      )}
    </group>
  );
}

export function CaveLand({ model }: IslandProps) {
  const [hovered, setHover] = useState(false);
  const ref = useRef<Object3D>(null);

  const onPointerOver = () => {
    setHover(true);
  };

  const onPointerLeave = () => {
    setHover(false);
  };

  return (
    <group onPointerOver={onPointerOver} onPointerLeave={onPointerLeave}>
      <primitive ref={ref} object={model} />
      {hovered && (
        <>
          <pointLight
            distance={500}
            intensity={1}
            position={ref.current ? new Vector3(0, 20, 0).add(ref?.current?.position) : 0}
          />
        </>
      )}
    </group>
  );
}

function Zoomable(model: Object3D) {
  const [zoomed, setZoomed] = useState(false);
  const ref = useRef<Group>(null);
  const { camera } = useThree();
  console.log(model);

  const onPointerDown = () => {
    setZoomed(!zoomed);
  };

  const onPointerMissed = () => {
    if (zoomed) setZoomed(!zoomed);
  };

  useFrame(() => {
    if (zoomed && ref.current && camera.position.y !== ref.current.position.y + 100) {
      const { x, y, z } = ref.current?.position;
      console.log(ref.current?.position);
      camera.position.lerp(new Vector3(x, y + 100, z), 1);
      camera.lookAt(new Vector3(x, y + 100, z));
    } else {
      /* camera.position.lerp(new Vector3(700, 500, 0), 1);
       * camera.lookAt(-550, -300, 0); */
    }
  });

  return (
    <group onPointerDown={onPointerDown} onPointerMissed={onPointerMissed}>
      <primitive ref={ref} object={model} />
    </group>
  );
}

export function Camping({ position, scale }: CampingProps) {
  const model = useGLTF("/scene.glb") as GLTF;

  return (
    <group position={position} scale={scale}>
      {model.scene.clone().children.map(Zoomable)}
    </group>
  );
}
