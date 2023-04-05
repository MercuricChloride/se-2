import { Sparkles, SpotLight, Text3D, useFBX, PositionalAudio, PerspectiveCamera } from "@react-three/drei";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { Water } from "three/examples/jsm/objects/Water.js";

extend({ Water });

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
        intensity={8}
        color="green"
        angle={Math.PI}
      />
      <SpotLight
        ref={spotlight2}
        position={[-480, -935, 3340]}
        distance={2000}
        intensity={10}
        color="blue"
        angle={0.5}
      />
    </group>
  );
}

function Cave() {
  const caveModel = useFBX("/cave.fbx");
  const { camera, scene } = useThree();
  const text = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const cameraTarget = caveModel.getObjectByName("camera_target");
    const crystals = caveModel.children.filter(child => child.name.includes("sneeb"));
    const dale = caveModel.getObjectByName("Dale");

    for (const crystal of crystals) {
      if (crystal instanceof THREE.Mesh) {
        if (crystal.children.filter(child => child.type === "PointLight").length > 0) continue;
        const light = new THREE.PointLight("blue", 10, 1000);
        crystal.add(light);
        crystal.material.emissiveIntensity = 0;
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

    if (text.current) {
      text.current.lookAt(camera.position);
    }
  }, [caveModel, camera, scene]);

  useFrame(() => {
    console.log(camera.position);
  });

  return (
    <group>
      <Text3D
        ref={text}
        font="/font.json"
        smooth={1}
        lineHeight={0.75}
        letterSpacing={-0.025}
        size={200}
        position={[2000, 600, 2200]}
      >
        {"Cult\nof\nCalamar"}
      </Text3D>
      <PerspectiveCamera makeDefault near={0.1} far={10000} fov={75} position={[-60, 231, 2187]} />
      <group>
        <Sparkles size={50} scale={50} count={200} speed={5} color="yellow" position={[50, 172, 2400]} />
        <Sparkles size={50} scale={50} count={200} speed={5} color="yellow" position={[-30, 190, 2450]} />
      </group>
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

function Ocean() {
  const ref = useRef<Water>(null);
  const waterNormals = useLoader(THREE.TextureLoader, "/water.jpeg");

  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const geom = useMemo(() => new THREE.PlaneGeometry(5000, 5000), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x0b5394,
      distortionScale: 40,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [waterNormals],
  );

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value += delta;
    }
  });
  //@ts-ignore
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} position={[-60, 0, 2180]} />;
}

function TestScene() {
  return (
    <>
      <Ocean />
      <Cave />
    </>
  );
}

export default TestScene;
