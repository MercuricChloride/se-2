import {
  Sparkles,
  SpotLight,
  Text3D,
  useFBX,
  PositionalAudio,
  PerspectiveCamera,
  Float,
  Html,
  ScreenSpace,
  useProgress,
} from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { Water } from "three/examples/jsm/objects/Water.js";

extend({ Water });

const TEAL = "#36fff8";
const RED = "#70041a";
const ORANGE = "#c25400";

function Lights() {
  const spotlight = useRef<THREE.SpotLight>(null);
  const spotlight2 = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    if (spotlight.current) {
      spotlight.current.lookAt(2532, 758, 3368);
    }
    if (spotlight2.current) {
      spotlight2.current.lookAt(-120, 223, 2637);
    }
  }, []);

  return (
    <group>
      <SpotLight
        ref={spotlight}
        position={[2502, -124, 3178]}
        distance={2000}
        intensity={0}
        color={RED}
        angle={Math.PI}
      />
      <SpotLight
        ref={spotlight2}
        position={[-480, -935, 3340]}
        distance={2000}
        intensity={0}
        color={TEAL}
        angle={0.5}
      />
    </group>
  );
}

function Cave() {
  const caveModel = useFBX("/cave.fbx");
  const { camera, scene } = useThree();
  const text = useRef<THREE.Mesh>(null);
  /* const transform = useRef<THREE.Mesh>(null); */

  useEffect(() => {
    const cameraTarget = caveModel.getObjectByName("camera_target");
    const crystals = caveModel.children.filter(child => child.name.includes("sneeb"));
    const dale = caveModel.getObjectByName("Dale");

    for (const crystal of crystals) {
      if (crystal instanceof THREE.Mesh) {
        if (crystal.children.filter(child => child.type === "PointLight").length > 0) continue;
        const color = Math.random() > 0.5 ? ORANGE : ORANGE;
        const light = new THREE.PointLight(color, 4, 1000);
        crystal.add(light);
        crystal.material.emissiveIntensity = 0.3;
        crystal.material.emissive.set(new THREE.Color(color));
        crystal.material.metalness = 0;
      }
    }

    if (!cameraTarget) return console.log("no camera target");
    if (!dale) return console.log("no dale");
    if (!camera) return console.log("no camera");

    if (dale instanceof THREE.Mesh) {
      dale.material.emissive.set(new THREE.Color(0xffffff));
      dale.material.emissiveIntensity = 0.1;
      dale.material.transparent = false;
      dale.addEventListener("onHover", () => {
        dale.material.emissiveIntensity = 0.5;
      });
    }

    camera.position.set(-60, 231, 2187);

    camera.lookAt(1854, 360, 3606);
  }, [caveModel, camera, scene]);

  useFrame(() => {
    /* console.log(transform.current.position); */
  });

  return (
    <group>
      {window.innerWidth < 800 ? (
        <Float floatingRange={[0, 1]} floatIntensity={100} rotationIntensity={0.2} speed={2}>
          <Text3D
            ref={text}
            font="/font.json"
            smooth={1}
            lineHeight={0.75}
            letterSpacing={-0.025}
            size={130}
            rotation={[0, -Math.PI / 1.5, 0]}
            position={[1000, 700, 2600]}
          >
            {"Cult\nof\nCalamar"}
            <meshStandardMaterial emissive={ORANGE} emissiveIntensity={2} />
            <pointLight color={RED} intensity={0} />
          </Text3D>
        </Float>
      ) : (
        <Float floatingRange={[0, 1]} floatIntensity={100} rotationIntensity={0.2} speed={2}>
          <Text3D
            ref={text}
            font="/font.json"
            smooth={1}
            lineHeight={0.75}
            letterSpacing={-0.025}
            size={180}
            rotation={[0, -Math.PI / 2, 0]}
            position={[1300, 600, 2000]}
          >
            {"Cult\nof\nCalamar"}
            <meshStandardMaterial emissive={ORANGE} emissiveIntensity={2} />
            <pointLight color={RED} intensity={0} />
          </Text3D>
        </Float>
      )}
      <PerspectiveCamera
        makeDefault
        near={0.1}
        far={10000}
        fov={window.innerWidth < 800 ? 90 : 75}
        position={[-60, 231, 2187]}
      />
      <Sparkles size={50} scale={50} count={200} speed={5} color="yellow" position={[73, 146, 2432]} />
      <Sparkles size={50} scale={50} count={200} speed={5} color="yellow" position={[-28, 182, 2442]} />
      <pointLight intensity={0.15} position={[13, -1334, 3034]} color={TEAL} />
      {/* <TransformControls object={transform} position={[50, 172, 2400]} /> */}
      <Lights />
      {
        //@ts-ignore
        <PositionalAudio url="/sounds/drips.wav" autoplay distance={10000} loop />
      }
      {
        //@ts-ignore
        <PositionalAudio url="/sounds/whale_sounds.mp3" autoplay distance={10000} />
      }
      <primitive object={caveModel} />
    </group>
  );
}

/* function Ocean() {
 *   const ref = useRef<Water>(null);
 *   const waterNormals = useLoader(THREE.TextureLoader, "/water.jpeg");
 *
 *   waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
 *
 *   const geom = useMemo(() => new THREE.PlaneGeometry(10000, 5000), []);
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
 *
 *   useFrame((state, delta) => {
 *     if (ref.current) {
 *       ref.current.material.uniforms.time.value += delta;
 *     }
 *   });
 *   //@ts-ignore
 *   return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} position={[-60, 0, 2180]} />;
 * } */

function Loading() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-white rounded-full animate-spin" />
          </div>
          <div className="mt-4 text-white">{progress} % loaded</div>
        </div>
      </div>
    </Html>
  );
}

function TestScene() {
  const [enter, setEnter] = useState(false);
  return (
    <Suspense fallback={<Loading />}>
      <group visible={enter}>
        {/* <Ocean /> */}
        <Cave />
      </group>
      <ScreenSpace depth={1} visible={!enter}>
        <Html fullscreen occlude>
          <div className="flex items-center justify-center h-screen w-screen">
            <button
              className="px-4 py-2 text-lg font-semibold text-white bg-black border border-white rounded-md hover:bg-white hover:text-black"
              hidden={enter}
              onClick={() => setEnter(true)}
            >
              Enter
            </button>
          </div>
        </Html>
      </ScreenSpace>
    </Suspense>
  );
}

export default TestScene;
