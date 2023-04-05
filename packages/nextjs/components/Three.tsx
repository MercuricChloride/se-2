import { useEffect, Suspense } from "react";

import React from "react";
import { extend, useThree } from "@react-three/fiber";
import { useProgress, Html } from "@react-three/drei";

import { Water } from "three/examples/jsm/objects/Water.js";

extend({ Water });

function Loader() {
  const { progress } = useProgress();
  console.log(progress);
  return <Html>{progress} % loaded</Html>;
}

/* function Ocean() {
 *   const ref = useRef();
 *   const waterNormals = useLoader(THREE.TextureLoader, "/water.jpeg");
 *
 *   waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
 *
 *   const geom = useMemo(() => new THREE.PlaneGeometry(30000, 30000), []);
 *   const config = useMemo(
 *     () => ({
 *       textureWidth: 512,
 *       textureHeight: 512,
 *       waterNormals,
 *       sunDirection: new THREE.Vector3(),
 *       sunColor: 0xffffff,
 *       waterColor: 0x0b5394,
 *       distortionScale: 40,
 *     }),
 *     // eslint-disable-next-line react-hooks/exhaustive-deps
 *     [waterNormals],
 *   );
 *   //@ts-ignore
 *   useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta));
 *   //@ts-ignore
 *   return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} position={[0, 0, 0]} />;
 * } */

export default function Three() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(700, 500, 0);
    camera.lookAt(-550, -300, 0);
  });

  return (
    <Suspense fallback={<Loader />}>
      <group></group>
    </Suspense>
  );
}
