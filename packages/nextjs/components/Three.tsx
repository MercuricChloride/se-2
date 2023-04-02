import { Ships, Oceans } from "~~/canvas";
import { Sun } from "~~/canvas/Sun";
/* import { Worm } from "~~/canvas/Worm"; */
import { Camping } from "~~/canvas/islands/Camping";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function Three() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(250, 300, 0);
  });

  return (
    <group>
      <Ships count={10} range={400} />;
      <Oceans sideLength={10} />
      {/* <MyScene /> */}
      <Sun />
      {/* <Worm /> */}
      <Camping scale={[10, 10, 10]} position={[50, 5, 50]} />
    </group>
  );
}
