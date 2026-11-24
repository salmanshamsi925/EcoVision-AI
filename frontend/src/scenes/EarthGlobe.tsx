import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { generateProceduralEarthTextures, latLonToVector3 } from './earthTextures';

export interface LocationTarget {
  id: string;
  name: string;
  province?: string;
  latitude: number;
  longitude: number;
}

interface EarthGlobeProps {
  selectedLocation: LocationTarget | null;
  onSelectLocation?: (loc: LocationTarget) => void;
  flyToTrigger?: number; // increments to trigger fly
  reducedMotion?: boolean;
  onFlyComplete?: () => void;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  selectedLocation,
  onSelectLocation,
  flyToTrigger,
  reducedMotion = false,
  onFlyComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const beaconRef = useRef<THREE.Group | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Google Earth style spherical rotation & camera interpolation state
  const isRotating = useRef(false);
  const startQuat = useRef(new THREE.Quaternion());
  const targetQuat = useRef(new THREE.Quaternion());
  const cameraStartPos = useRef(new THREE.Vector3());
  const cameraEndPos = useRef(new THREE.Vector3());
  const rotProgress = useRef(0);

  const GLOBE_RADIUS = 2.0;

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#07111F');

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    // Helper: calculate ideal camera Z distance based on screen dimensions
    const getBaseCameraZ = (w: number, h: number) => {
      if (w >= 1024) return 7.2;
      const aspect = w / h;
      // Target visible width = 5.2 (Earth diameter 4.0 gives ~77% coverage with space all around)
      const halfFovRad = (45 * Math.PI) / 360;
      const reqZ = 2.6 / (Math.tan(halfFovRad) * aspect);
      return Math.max(9.0, Math.min(15.0, reqZ));
    };

    // Dynamic Camera View & Distance Config:
    // - On desktop (>=1024px): shifts Earth to the RIGHT half (-w * 0.18), giving hero cockpit breathing room on left.
    // - On mobile (<1024px): scales distance to fit 100% inside screen width and frames in upper portion (Tile 6).
    const updateCameraConfig = (w: number, h: number) => {
      camera.aspect = w / h;
      const targetZ = getBaseCameraZ(w, h);
      camera.position.set(0, 0, targetZ);

      if (w >= 1024) {
        camera.setViewOffset(w, h, -w * 0.18, 0, w, h);
        if (controlsRef.current) {
          controlsRef.current.minDistance = 2.4;
          controlsRef.current.maxDistance = 14.0;
        }
      } else {
        camera.setViewOffset(w, h, 0, h * 0.21, w, h);
        if (controlsRef.current) {
          controlsRef.current.minDistance = 4.0;
          controlsRef.current.maxDistance = 18.0;
        }
      }
      camera.updateProjectionMatrix();
    };
    updateCameraConfig(width, height);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.maxWidth = '100%';
    renderer.domElement.style.maxHeight = '100%';
    renderer.domElement.style.display = 'block';
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    currentMount.appendChild(renderer.domElement);

    // 2. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 2.4;
    controls.maxDistance = 14.0;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);

    // 3. Globe Group (Origin centered at 0, 0, 0 for perfect spherical rotation)
    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, 0, 0);
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Initial orientation: Rotate so Pakistan is naturally facing towards the front
    const initialTarget = latLonToVector3(28.5, 69.0, 1.0).normalize();
    const cameraDir = new THREE.Vector3(0, 0.2, 1.0).normalize();
    globeGroup.quaternion.setFromUnitVectors(initialTarget, cameraDir);

    // 4. NASA High-Res Satellite Textures with Procedural Fallbacks
    const textureLoader = new THREE.TextureLoader();
    const { dayTexture: procDay, nightTexture: procNight, cloudsTexture: procClouds, specularMap: procSpec } = generateProceduralEarthTextures();

    const realDayTexture = textureLoader.load(
      '/textures/earth_atmos_2048.jpg',
      (tex) => { tex.colorSpace = THREE.SRGBColorSpace; }
    );
    const realNormalTexture = textureLoader.load('/textures/earth_normal_2048.jpg');
    const realSpecularTexture = textureLoader.load('/textures/earth_specular_2048.jpg');
    const realCloudsTexture = textureLoader.load(
      '/textures/earth_clouds_1024.png',
      (tex) => { tex.colorSpace = THREE.SRGBColorSpace; }
    );

    // Earth Sphere - Vibrant Sapphire Oceans and Detailed Continents
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: realDayTexture || procDay,
      bumpMap: realNormalTexture,
      bumpScale: 0.03,
      specularMap: realSpecularTexture || procSpec,
      specular: new THREE.Color(0x38bdf8),
      shininess: 16,
      emissiveMap: procNight,
      emissive: new THREE.Color(0x06111f),
      emissiveIntensity: 0.2,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Clouds Sphere
    const cloudsGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.012, 64, 64);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: realCloudsTexture || procClouds,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    cloudsMeshRef.current = cloudsMesh;
    globeGroup.add(cloudsMesh);

    // Atmospheric Fresnel Glow Outer Sphere
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 64, 64);
    const atmosphereShader = {
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.13, 0.72, 1.0, 1.0) * intensity * 1.4;
        }
      `,
    };
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereShader.vertexShader,
      fragmentShader: atmosphereShader.fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // 5. Starfield Background
    const starCount = reducedMotion ? 1200 : 3500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color('#22B8FF'),
      new THREE.Color('#35D39A'),
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#FFD166'),
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 40 + Math.random() * 80;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);

      starPositions[i * 3] = radius * sinPhi * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * sinPhi * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 6. Multi-angle Cinematic Lighting Rig (Balanced, Realistic, Non-blinding)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x06111f, 0.75);
    scene.add(hemiLight);

    // Front fill headlight: gentle soft fill, NO harsh specular over-saturation
    const cameraHeadlight = new THREE.DirectionalLight(0xffffff, 0.6);
    cameraHeadlight.position.set(0, 0, 1);
    camera.add(cameraHeadlight);
    scene.add(camera);

    const sunLight = new THREE.DirectionalLight(0xfff8ee, 1.4);
    sunLight.position.set(12, 6, 10);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x20c5ff, 1.1);
    rimLight.position.set(-12, -4, -8);
    scene.add(rimLight);

    // 7. Beacon / Marker Group
    const beaconGroup = new THREE.Group();
    beaconRef.current = beaconGroup;
    globeGroup.add(beaconGroup);

    // 8. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Slow orbital clouds rotation
      if (cloudsMeshRef.current && !reducedMotion) {
        cloudsMeshRef.current.rotation.y += delta * 0.015;
      }

      // Smooth globe rotation (Google Earth spherical slerp)
      if (isRotating.current && globeGroupRef.current) {
        rotProgress.current += delta * 1.0; // ~1.0s arrival duration
        if (rotProgress.current >= 1.0) {
          rotProgress.current = 1.0;
          isRotating.current = false;
          if (onFlyComplete) onFlyComplete();
        }

        // Cubic ease in-out
        const t = rotProgress.current;
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        globeGroupRef.current.quaternion.slerpQuaternions(startQuat.current, targetQuat.current, ease);

        if (cameraRef.current) {
          cameraRef.current.position.lerpVectors(cameraStartPos.current, cameraEndPos.current, ease);
          cameraRef.current.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
        }
      } else if (globeGroupRef.current && !controls.state && !reducedMotion) {
        // Gentle orbital spin when idle
        const idleRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), delta * 0.02);
        globeGroupRef.current.quaternion.multiply(idleRot);
      }

      // Beacon ripple effect
      if (beaconGroup.children.length > 0) {
        const ring = beaconGroup.getObjectByName('beaconRing');
        if (ring) {
          const s = 1.0 + (Math.sin(elapsedTime * 6) + 1) * 0.45;
          ring.scale.set(s, s, s);
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      updateCameraConfig(w, h);
      renderer.setSize(w, h);
      controls.target.set(0, 0, 0);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      cloudsGeometry.dispose();
      cloudsMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      if (procDay) procDay.dispose();
      if (procNight) procNight.dispose();
      if (procClouds) procClouds.dispose();
      if (procSpec) procSpec.dispose();
      if (realDayTexture) realDayTexture.dispose();
      if (realNormalTexture) realNormalTexture.dispose();
      if (realSpecularTexture) realSpecularTexture.dispose();
      if (realCloudsTexture) realCloudsTexture.dispose();
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  // Update Beacon Marker when selectedLocation changes
  useEffect(() => {
    const beaconGroup = beaconRef.current;
    if (!beaconGroup) return;

    // Clear previous markers
    while (beaconGroup.children.length > 0) {
      const obj = beaconGroup.children[0];
      beaconGroup.remove(obj);
    }

    if (!selectedLocation) return;

    // Convert coordinates to globe surface vector
    const pos = latLonToVector3(selectedLocation.latitude, selectedLocation.longitude, GLOBE_RADIUS);

    // Glowing core pin
    const pinGeom = new THREE.SphereGeometry(0.045, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x22B8FF });
    const pin = new THREE.Mesh(pinGeom, pinMat);
    pin.position.copy(pos);
    beaconGroup.add(pin);

    // Vertical holographic light beam pointing outwards
    const beamDir = pos.clone().normalize();
    const beamLength = 0.35;
    const beamGeom = new THREE.CylinderGeometry(0.008, 0.022, beamLength, 16);
    beamGeom.translate(0, beamLength / 2, 0); // anchor at base
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x35D39A,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const beam = new THREE.Mesh(beamGeom, beamMat);
    beam.position.copy(pos);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), beamDir);
    beaconGroup.add(beam);

    // Pulsing Ripple Ring on surface
    const ringGeom = new THREE.RingGeometry(0.06, 0.09, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22B8FF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.name = 'beaconRing';
    ring.position.copy(pos.clone().multiplyScalar(1.002));
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), beamDir);
    beaconGroup.add(ring);
  }, [selectedLocation]);

  // Google Earth style smooth globe rotation when flyToTrigger or selectedLocation changes
  useEffect(() => {
    if (!globeGroupRef.current || !cameraRef.current) return;

    const lat = selectedLocation ? selectedLocation.latitude : 28.5;
    const lon = selectedLocation ? selectedLocation.longitude : 69.0;

    const localPoint = latLonToVector3(lat, lon, 1.0).normalize();
    const cameraDir = new THREE.Vector3(0, 0.2, 1.0).normalize();

    startQuat.current.copy(globeGroupRef.current.quaternion);
    targetQuat.current.setFromUnitVectors(localPoint, cameraDir);

    cameraStartPos.current.copy(cameraRef.current.position);
    const isMobile = window.innerWidth < 1024;
    const aspect = window.innerWidth / window.innerHeight;
    const reqZ = 2.6 / (Math.tan((45 * Math.PI) / 360) * aspect);
    const targetZ = isMobile ? Math.max(9.0, Math.min(15.0, reqZ)) : 6.2;
    cameraEndPos.current.set(0, 0, targetZ);

    rotProgress.current = 0;
    isRotating.current = true;
  }, [selectedLocation, flyToTrigger]);

  return (
    <div className="relative w-full max-w-full h-full select-none overflow-hidden">
      <div ref={mountRef} className="w-full max-w-full h-full cursor-grab active:cursor-grabbing overflow-hidden" />
    </div>
  );
};

