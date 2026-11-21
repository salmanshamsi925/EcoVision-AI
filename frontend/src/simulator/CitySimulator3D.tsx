import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type SimulationMode = 'heatwave' | 'flood' | 'drought' | 'sustainable';
export type CameraPreset = 'aerial' | 'river' | 'urban';

interface CitySimulator3DProps {
  mode: SimulationMode;
  year: number;
  scenario: string; // 'ssp1_26' | 'ssp2_45' | 'ssp5_85'
  districtId: string;
  districtName: string;
  onCameraChange?: (preset: CameraPreset) => void;
}

export const CitySimulator3D: React.FC<CitySimulator3DProps> = ({
  mode,
  year,
  scenario,
  districtId,
  districtName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Dynamic mesh and light references for smooth transition
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const groundMeshRef = useRef<THREE.Mesh | null>(null);
  const solarPanelsGroupRef = useRef<THREE.Group | null>(null);
  const treesGroupRef = useRef<THREE.Group | null>(null);
  const cropsGroupRef = useRef<THREE.Group | null>(null);
  const vehiclesGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [activeCamPreset, setActiveCamPreset] = useState<CameraPreset>('aerial');

  // ── Camera Presets ──────────────────────────────────────────────────────────
  const applyCameraPreset = useCallback((preset: CameraPreset) => {
    setActiveCamPreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;

    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    if (preset === 'aerial') {
      cam.position.set(0, 52, 62);
      ctrl.target.set(0, 0, -4);
    } else if (preset === 'river') {
      cam.position.set(-24, 7, 18);
      ctrl.target.set(2, 3, -6);
    } else if (preset === 'urban') {
      cam.position.set(22, 12, 16);
      ctrl.target.set(6, 2, -4);
    }
    ctrl.update();
  }, []);

  // ── Main Three.js Scene Setup ───────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Bright Daytime Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#38bdf8');
    scene.fog = new THREE.FogExp2('#7dd3fc', 0.005);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.5,
      400
    );
    camera.position.set(0, 52, 62);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not dip below ground
    controls.minDistance = 15;
    controls.maxDistance = 120;
    controls.target.set(0, 0, -4);
    controlsRef.current = controls;

    // 5. Lighting (Bright, Vivid, Shadow-free Visibility)
    const ambientLight = new THREE.AmbientLight('#ffffff', 2.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight('#e0f2fe', '#334155', 1.6);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight('#ffffff', 3.2);
    dirLight.position.set(35, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 130;
    dirLight.shadow.camera.left = -40;
    dirLight.shadow.camera.right = 40;
    dirLight.shadow.camera.top = 40;
    dirLight.shadow.camera.bottom = -40;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // ── Build 3D City & Rural Landscape ──────────────────────────────────────

    // A. Ground Terrain
    const groundGeo = new THREE.PlaneGeometry(90, 90, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#1a3328', // Lush grass baseline
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    groundMeshRef.current = ground;

    // B. River / Canal Channel (Cutting through the landscape)
    const channelBedGeo = new THREE.PlaneGeometry(20, 90);
    const channelBedMat = new THREE.MeshStandardMaterial({
      color: '#131e18',
      roughness: 0.95,
    });
    const channelBed = new THREE.Mesh(channelBedGeo, channelBedMat);
    channelBed.rotation.x = -Math.PI / 2;
    channelBed.position.set(-6, -0.7, 0);
    channelBed.receiveShadow = true;
    scene.add(channelBed);

    // River Water Plane
    const waterGeo = new THREE.PlaneGeometry(22, 90, 32, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: '#1d88c2',
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(-6, 0.2, 0);
    water.receiveShadow = true;
    scene.add(water);
    waterMeshRef.current = water;

    // C. Main Road Network & Bridges
    const roadMat = new THREE.MeshStandardMaterial({ color: '#222831', roughness: 0.7 });
    
    // East-West Main Avenue crossing canal
    const mainAvenue = new THREE.Mesh(new THREE.PlaneGeometry(90, 5), roadMat);
    mainAvenue.rotation.x = -Math.PI / 2;
    mainAvenue.position.set(0, 0.08, -6);
    mainAvenue.receiveShadow = true;
    scene.add(mainAvenue);

    // Bridge Structure over canal
    const bridgeGeo = new THREE.BoxGeometry(22, 0.4, 5.4);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: '#393e46', roughness: 0.5 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(-6, 0.4, -6);
    bridge.castShadow = true;
    bridge.receiveShadow = true;
    scene.add(bridge);

    // Bridge railings
    const railingGeo = new THREE.BoxGeometry(22, 0.6, 0.2);
    const railMat = new THREE.MeshStandardMaterial({ color: '#22B8FF', roughness: 0.3 });
    const railNorth = new THREE.Mesh(railingGeo, railMat);
    railNorth.position.set(-6, 0.9, -8.6);
    const railSouth = new THREE.Mesh(railingGeo, railMat);
    railSouth.position.set(-6, 0.9, -3.4);
    scene.add(railNorth, railSouth);

    // Secondary North-South Urban Road
    const urbanRoad = new THREE.Mesh(new THREE.PlaneGeometry(4, 90), roadMat);
    urbanRoad.rotation.x = -Math.PI / 2;
    urbanRoad.position.set(16, 0.07, 0);
    urbanRoad.receiveShadow = true;
    scene.add(urbanRoad);

    // D. Moving Vehicles Group
    const vehiclesGroup = new THREE.Group();
    scene.add(vehiclesGroup);
    vehiclesGroupRef.current = vehiclesGroup;

    const carGeo = new THREE.BoxGeometry(1.6, 0.7, 0.9);
    const carColors = ['#22B8FF', '#FF9F43', '#FFFFFF', '#35D39A', '#E74C3C'];
    const vehicles: { mesh: THREE.Mesh; speed: number; minX: number; maxX: number; dir: number }[] = [];

    for (let i = 0; i < 7; i++) {
      const cMat = new THREE.MeshStandardMaterial({ color: carColors[i % carColors.length], roughness: 0.3 });
      const car = new THREE.Mesh(carGeo, cMat);
      car.castShadow = true;
      const zOffset = i % 2 === 0 ? -7.2 : -4.8;
      car.position.set(-35 + i * 11, 0.55, zOffset);
      vehiclesGroup.add(car);
      vehicles.push({
        mesh: car,
        speed: 0.12 + (i % 3) * 0.04,
        minX: -42,
        maxX: 42,
        dir: i % 2 === 0 ? 1 : -1,
      });
    }

    // E. Urban City Blocks & Architecture (East side of canal)
    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);

    const solarGroup = new THREE.Group();
    scene.add(solarGroup);
    solarPanelsGroupRef.current = solarGroup;

    const buildingPalette = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#fef3c7', '#fed7aa'];
    const buildingCoords = [
      // Downtown cluster
      { x: 10, z: -14, w: 6, d: 6, h: 14 },
      { x: 18, z: -14, w: 7, d: 5, h: 18 },
      { x: 26, z: -14, w: 5, d: 6, h: 11 },
      { x: 10, z: 2, w: 5, d: 6, h: 12 },
      { x: 24, z: 2, w: 6, d: 7, h: 16 },
      { x: 32, z: -8, w: 7, d: 6, h: 10 },
      // Waterfront residences & civic halls
      { x: 8, z: 12, w: 4, d: 5, h: 7 },
      { x: 14, z: 12, w: 5, d: 5, h: 8 },
      { x: 22, z: 12, w: 6, d: 5, h: 9 },
      { x: 30, z: 6, w: 5, d: 5, h: 7 },
      { x: 10, z: -24, w: 6, d: 5, h: 9 },
      { x: 20, z: -24, w: 7, d: 6, h: 13 },
      { x: 28, z: -24, w: 5, d: 5, h: 8 },
    ];

    buildingCoords.forEach((b, idx) => {
      // Main Building Mesh - Bright Architectural Concrete & Sandstone
      const bMat = new THREE.MeshStandardMaterial({
        color: buildingPalette[idx % buildingPalette.length],
        roughness: 0.45,
        metalness: 0.1,
      });
      const bMesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), bMat);
      bMesh.position.set(b.x, b.h / 2, b.z);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      buildingsGroup.add(bMesh);

      // Windows grid accent (Bright reflecting glass with subtle cyan emissive glow)
      const winGeo = new THREE.BoxGeometry(b.w + 0.05, b.h * 0.75, b.d + 0.05);
      const winMat = new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 0.35,
        roughness: 0.15,
        metalness: 0.3,
      });
      const winMesh = new THREE.Mesh(winGeo, winMat);
      winMesh.position.set(b.x, b.h / 2, b.z);
      buildingsGroup.add(winMesh);

      // Rooftop Solar Panel Arrays (Dynamically shown in sustainable mode)
      const solarPanelMat = new THREE.MeshStandardMaterial({
        color: '#1a3a6b',
        roughness: 0.1,
        metalness: 0.85,
        emissive: '#0d254c',
        emissiveIntensity: 0.3,
      });
      const panel = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.75, 0.2, b.d * 0.75), solarPanelMat);
      panel.position.set(b.x, b.h + 0.12, b.z);
      solarGroup.add(panel);
    });

    // F. Agricultural Crop Fields (West side of canal)
    const cropsGroup = new THREE.Group();
    scene.add(cropsGroup);
    cropsGroupRef.current = cropsGroup;

    const cropPlots = [
      { x: -24, z: -22, w: 14, d: 18 },
      { x: -24, z: 4, w: 14, d: 16 },
      { x: -24, z: 24, w: 14, d: 16 },
    ];

    cropPlots.forEach((p) => {
      // Field soil patch
      const fieldGeo = new THREE.PlaneGeometry(p.w, p.d);
      const fieldMat = new THREE.MeshStandardMaterial({ color: '#2d5a3f', roughness: 0.95 });
      const field = new THREE.Mesh(fieldGeo, fieldMat);
      field.rotation.x = -Math.PI / 2;
      field.position.set(p.x, 0.04, p.z);
      field.receiveShadow = true;
      cropsGroup.add(field);

      // Crop row ridges
      for (let r = -p.d / 2 + 1.5; r < p.d / 2; r += 2.2) {
        const ridge = new THREE.Mesh(
          new THREE.BoxGeometry(p.w * 0.9, 0.35, 0.9),
          new THREE.MeshStandardMaterial({ color: '#38b000', roughness: 0.8 })
        );
        ridge.position.set(p.x, 0.2, p.z + r);
        ridge.receiveShadow = true;
        cropsGroup.add(ridge);
      }
    });

    // G. Vegetation: Trees & Mangrove Buffers
    const treesGroup = new THREE.Group();
    scene.add(treesGroup);
    treesGroupRef.current = treesGroup;

    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.6, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#5c4033', roughness: 0.9 });
    const foliageGeo = new THREE.ConeGeometry(1.4, 2.8, 7);
    const foliageMat = new THREE.MeshStandardMaterial({ color: '#2d6a4f', roughness: 0.7 });

    const treePositions = [
      // Along Canal Bank (Riparian / Mangrove buffer)
      { x: 3.5, z: -18 }, { x: 3.5, z: -12 }, { x: 3.5, z: 2 }, { x: 3.5, z: 8 }, { x: 3.5, z: 16 }, { x: 3.5, z: 24 },
      { x: -15.5, z: -16 }, { x: -15.5, z: -8 }, { x: -15.5, z: 10 }, { x: -15.5, z: 20 },
      // Urban Parks & Street Trees
      { x: 15, z: -8 }, { x: 19, z: -8 }, { x: 23, z: -8 },
      { x: 14, z: 4 }, { x: 18, z: 4 },
      // Rural boundaries
      { x: -33, z: -12 }, { x: -33, z: 6 }, { x: -33, z: 18 },
    ];

    treePositions.forEach((pos) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.8;
      trunk.castShadow = true;

      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 2.4;
      foliage.castShadow = true;

      tree.add(trunk, foliage);
      tree.position.set(pos.x, 0, pos.z);
      treesGroup.add(tree);
    });

    // H. Weather Particle System (Heat haze / Rain / Dust)
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 80;
      particlePositions[i * 3 + 1] = Math.random() * 35;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.05;
      particleVelocities[i * 3 + 1] = -0.2 - Math.random() * 0.3; // Default falling (rain)
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: '#ffffff',
      size: 0.45,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // ── Animation Loop ────────────────────────────────────────────────────────
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Controls update
      controls.update();

      // Animate Vehicles
      vehicles.forEach((v) => {
        v.mesh.position.x += v.speed * v.dir;
        if (v.mesh.position.x > v.maxX) v.mesh.position.x = v.minX;
        if (v.mesh.position.x < v.minX) v.mesh.position.x = v.maxX;
      });

      // Animate Water subtle ripple
      if (waterMeshRef.current) {
        waterMeshRef.current.position.y += Math.sin(time * 2.5) * 0.003;
      }

      // Animate Particles based on current mode
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          // Heatwave: rising heat shimmer
          // Flood: falling monsoon rain
          // Drought: drifting dusty wind
          // Sustainable: gentle ambient specks
          positions[i * 3 + 1] += particleVelocities[i * 3 + 1];

          if (positions[i * 3 + 1] < 0.2) {
            positions[i * 3 + 1] = 32;
            positions[i * 3] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
          }
          if (positions[i * 3 + 1] > 35) {
            positions[i * 3 + 1] = 0.5;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize Listener ───────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // ── Update Mode Visuals (Heatwave vs Flood vs Drought vs Sustainable) ───────
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const water = waterMeshRef.current;
    const ground = groundMeshRef.current;
    const solar = solarPanelsGroupRef.current;
    const trees = treesGroupRef.current;
    const crops = cropsGroupRef.current;
    const particles = particlesRef.current;
    const dirLight = dirLightRef.current;
    const hemiLight = hemiLightRef.current;

    // Apply 4 distinct simulation states with bright daytime atmospheres
    if (mode === 'heatwave') {
      // 1. Heatwave: Bright amber/golden daytime sky, rising heat-haze, thermal glow
      scene.background = new THREE.Color('#ff9e44');
      scene.fog = new THREE.FogExp2('#fdbb74', 0.007);

      if (dirLight) {
        dirLight.color.set('#ffe5b4');
        dirLight.intensity = 3.2;
      }
      if (hemiLight) {
        hemiLight.color.set('#fed7aa');
        hemiLight.groundColor.set('#c2410c');
        hemiLight.intensity = 1.8;
      }

      if (ground) (ground.material as THREE.MeshStandardMaterial).color.set('#d97706'); // Sun-baked golden earth
      if (water) {
        water.position.y = -0.15; // Low water level
        (water.material as THREE.MeshStandardMaterial).color.set('#b45309'); // Muddy low canal
        (water.material as THREE.MeshStandardMaterial).opacity = 0.75;
      }

      if (solar) solar.visible = false;

      // Particles: Amber rising heat haze
      if (particles) {
        particles.visible = true;
        (particles.material as THREE.PointsMaterial).color.set('#ffffff');
        (particles.material as THREE.PointsMaterial).size = 0.55;
        (particles.material as THREE.PointsMaterial).opacity = 0.6;
      }

      // Withered trees
      if (trees) {
        trees.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.ConeGeometry) {
            (obj.material as THREE.MeshStandardMaterial).color.set('#a16207'); // Wilted golden-brown
          }
        });
      }

      // Dried crops
      if (crops) {
        crops.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            (obj.material as THREE.MeshStandardMaterial).color.set('#ca8a04');
          }
        });
      }
    } else if (mode === 'flood') {
      // 2. Flood: Steel-blue storm daylight sky, torrential monsoon rain, river rises submerging roads
      scene.background = new THREE.Color('#3b6998');
      scene.fog = new THREE.FogExp2('#6ba0d6', 0.009);

      if (dirLight) {
        dirLight.color.set('#e0f2fe');
        dirLight.intensity = 2.8;
      }
      if (hemiLight) {
        hemiLight.color.set('#bfdbfe');
        hemiLight.groundColor.set('#1e3a8a');
        hemiLight.intensity = 1.8;
      }

      if (ground) (ground.material as THREE.MeshStandardMaterial).color.set('#15803d'); // Saturated green soil
      if (water) {
        // Dramatic flood surge: water rises to submerging height!
        water.position.y = 1.35; // Submerges low banks and crop edges
        (water.material as THREE.MeshStandardMaterial).color.set('#0284c7'); // Turbid fast-flowing storm river
        (water.material as THREE.MeshStandardMaterial).opacity = 0.92;
      }

      if (solar) solar.visible = false;

      // Particles: Heavy monsoon downpour
      if (particles) {
        particles.visible = true;
        (particles.material as THREE.PointsMaterial).color.set('#ffffff');
        (particles.material as THREE.PointsMaterial).size = 0.5;
        (particles.material as THREE.PointsMaterial).opacity = 0.8;
      }

      if (trees) {
        trees.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.ConeGeometry) {
            (obj.material as THREE.MeshStandardMaterial).color.set('#166534');
          }
        });
      }

      if (crops) {
        crops.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            (obj.material as THREE.MeshStandardMaterial).color.set('#14532d'); // Flooded paddies
          }
        });
      }
    } else if (mode === 'drought') {
      // 3. Drought: Bright desert tan daylight, receding riverbed exposed, cracked soil
      scene.background = new THREE.Color('#d4a359');
      scene.fog = new THREE.FogExp2('#eab368', 0.008);

      if (dirLight) {
        dirLight.color.set('#fef3c7');
        dirLight.intensity = 3.0;
      }
      if (hemiLight) {
        hemiLight.color.set('#fde68a');
        hemiLight.groundColor.set('#78350f');
        hemiLight.intensity = 1.6;
      }

      if (ground) (ground.material as THREE.MeshStandardMaterial).color.set('#ca8a04'); // Cracked arid desert dirt
      if (water) {
        // Severe water contraction: riverbed almost completely dried out!
        water.position.y = -0.55;
        (water.material as THREE.MeshStandardMaterial).color.set('#78350f');
        (water.material as THREE.MeshStandardMaterial).opacity = 0.45;
      }

      if (solar) solar.visible = false;

      // Particles: Dust storm haze
      if (particles) {
        particles.visible = true;
        (particles.material as THREE.PointsMaterial).color.set('#fef08a');
        (particles.material as THREE.PointsMaterial).size = 0.55;
        (particles.material as THREE.PointsMaterial).opacity = 0.65;
      }

      if (trees) {
        trees.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.ConeGeometry) {
            (obj.material as THREE.MeshStandardMaterial).color.set('#854d0e'); // Severely dried
          }
        });
      }

      if (crops) {
        crops.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            (obj.material as THREE.MeshStandardMaterial).color.set('#a16207'); // Failed crops
          }
        });
      }
    } else {
      // 4. Sustainable: Vibrant cyan-blue daytime sky, lush emerald green, rooftop solar canopy, crystal river
      scene.background = new THREE.Color('#38bdf8');
      scene.fog = new THREE.FogExp2('#7dd3fc', 0.004); // Crisp, clean transparent sky

      if (dirLight) {
        dirLight.color.set('#ffffff');
        dirLight.intensity = 3.4;
      }
      if (hemiLight) {
        hemiLight.color.set('#e0f2fe');
        hemiLight.groundColor.set('#15803d');
        hemiLight.intensity = 2.0;
      }

      if (ground) (ground.material as THREE.MeshStandardMaterial).color.set('#16a34a'); // Lush emerald grass
      if (water) {
        // Regulated pristine canal
        water.position.y = 0.22;
        (water.material as THREE.MeshStandardMaterial).color.set('#06b6d4');
        (water.material as THREE.MeshStandardMaterial).opacity = 0.9;
      }

      // Rooftop solar canopy ACTIVE!
      if (solar) solar.visible = true;

      // Clean fresh atmosphere
      if (particles) {
        particles.visible = false;
      }

      if (trees) {
        trees.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.ConeGeometry) {
            (obj.material as THREE.MeshStandardMaterial).color.set('#15803d'); // Lush deep green
          }
        });
      }

      if (crops) {
        crops.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            (obj.material as THREE.MeshStandardMaterial).color.set('#22c55e'); // Thriving crops
          }
        });
      }
    }
  }, [mode]);

  return (
    <div className="relative w-full h-full" style={{ background: '#07111F' }}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Quick Camera Preset Controls Overlay */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 p-1 rounded-xl border border-white/10 shadow-xl" style={{ background: 'rgba(13,27,42,0.85)', backdropFilter: 'blur(10px)' }}>
        <button
          onClick={() => applyCameraPreset('aerial')}
          className={`px-2.5 py-1 rounded-lg text-xs font-grotesk font-semibold transition ${
            activeCamPreset === 'aerial'
              ? 'bg-eco-blue text-eco-bg shadow-sm'
              : 'text-eco-muted hover:text-white hover:bg-white/5'
          }`}
        >
          🚁 Aerial View
        </button>
        <button
          onClick={() => applyCameraPreset('river')}
          className={`px-2.5 py-1 rounded-lg text-xs font-grotesk font-semibold transition ${
            activeCamPreset === 'river'
              ? 'bg-eco-blue text-eco-bg shadow-sm'
              : 'text-eco-muted hover:text-white hover:bg-white/5'
          }`}
        >
          🌊 Canal Level
        </button>
        <button
          onClick={() => applyCameraPreset('urban')}
          className={`px-2.5 py-1 rounded-lg text-xs font-grotesk font-semibold transition ${
            activeCamPreset === 'urban'
              ? 'bg-eco-blue text-eco-bg shadow-sm'
              : 'text-eco-muted hover:text-white hover:bg-white/5'
          }`}
        >
          🏙 Urban &amp; Agri
        </button>
      </div>

      {/* Live 3D Simulation Telemetry Pill */}
      <div className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono shadow-xl flex items-center gap-2" style={{ background: 'rgba(13,27,42,0.85)', backdropFilter: 'blur(10px)' }}>
        <span className={`w-2 h-2 rounded-full animate-pulse ${
          mode === 'heatwave' ? 'bg-eco-orange' :
          mode === 'flood' ? 'bg-eco-blue' :
          mode === 'drought' ? 'bg-amber-500' : 'bg-eco-green'
        }`} />
        <span className="text-white font-bold uppercase">{mode}</span>
        <span className="text-eco-muted">| {year} ({scenario.toUpperCase().replace('_', '.')})</span>
      </div>

      {/* OrbitControls mouse hint */}
      <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-lg text-[10px] font-mono text-eco-muted/70 border border-white/5 pointer-events-none" style={{ background: 'rgba(13,27,42,0.6)' }}>
        Left-click + drag to rotate • Right-click to pan • Scroll to zoom
      </div>
    </div>
  );
};

