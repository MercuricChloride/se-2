import { useGLTF } from "@react-three/drei";
import { Object3D } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export interface CampingProps {
  position: [number, number, number];
  scale: [number, number, number];
}

interface IslandProps {
  model: Object3D;
}

export function SnowIsland({ model }: IslandProps) {
  const onClick = () => {
    console.log("clicked the snow island");
  };
  return (
    <group onClick={onClick}>
      <primitive object={model} />;
    </group>
  );
}

export function CaveLand({ model }: IslandProps) {
  const onClick = () => {
    console.log("clicked the pirate island");
  };
  return (
    <group onClick={onClick}>
      <primitive object={model} />;
    </group>
  );
}

function getIsland(islandName: string, model: GLTF) {
  const island = model.scene.children.find(child => child.name === islandName);
  return island as Object3D;
}

export function Camping({ position, scale }: CampingProps) {
  const model = useGLTF("/camping.glb") as GLTF;

  const snow = getIsland("Snow", model);
  const caveLand = getIsland("Cave_Land", model);

  return (
    <group position={position} scale={scale}>
      <SnowIsland model={snow} />
      <CaveLand model={caveLand} />
    </group>
  );
}
