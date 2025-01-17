import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
export default function render(canvas, { particleImage }) {
  const isDebug = location.hash === "#debug";
  let gui;
  if (isDebug) {
    // Debug
    gui = new GUI({ width: 340 });
  }

  // Scene
  const scene = new THREE.Scene();

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const textureLoader = new THREE.TextureLoader();
  const particleTexture = textureLoader.load(particleImage.src);

  /**
   * Responsiveness
   */
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * particles
   */
  const params = {
    particlesCount: 884,
    amplitude: 8,
    backOffset: -10,
  };

  const material = new THREE.PointsMaterial({
    color: "#dfd3c0",
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    alphaMap: particleTexture,
    size: 0.1,
  });

  let pointsMesh = null;
  let pointsGroup = null;

  const createParticles = () => {
    if (pointsMesh) {
      pointsMesh.geometry.dispose();
      pointsMesh.material.dispose();
      scene.remove(pointsGroup);
    }

    pointsGroup = new THREE.Group();
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(params.particlesCount * 3);

    for (let i = 0; i < params.particlesCount; i++) {
      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * params.amplitude;
      positions[i3 + 1] = (Math.random() - 0.5) * params.amplitude;
      positions[i3 + 2] = (Math.random() - 0.5) * params.amplitude;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsMesh = new THREE.Points(geometry, material);
    pointsGroup.add(pointsMesh);
    scene.add(pointsGroup);
  };

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(1, 1, -2);
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  createParticles();

  let isThinking = false;

  const onThinking = (callback) => {
    isThinking = true;

    gsap.to(camera.position, {
      duration: 1,
      z: params.backOffset,
      onUpdate: function () {
        camera.lookAt(0);
      },
      onComplete: function () {
        if (callback) callback();
      },
    });

    gsap.to(pointsGroup.position, {
      duration: 1,
      x: -sizes.width / 120,
      y: 0,
    });
  };

  const onNotThinking = (callback) => {
    isThinking = false;

    gsap.to(camera.position, {
      duration: 1,
      z: 1,
      onUpdate: function () {
        camera.lookAt(pointsMesh.position);

        if (callback) callback();
      },
    });

    gsap.to(pointsGroup.position, {
      duration: 1,
      x: 0,
      y: 0,
    });
  };

  if (isDebug) {
    gui
      .add(params, "particlesCount")
      .min(100)
      .max(1000)
      .step(1)
      .onChange(createParticles);
    gui
      .add(params, "amplitude")
      .min(1)
      .max(30)
      .step(0.01)
      .onChange(createParticles);
    gui
      .add(params, "backOffset")
      .min(-30)
      .max(1)
      .step(0.01)
      .onChange(onThinking);
  }

  window.onThinking = onThinking;
  window.onNotThinking = onNotThinking;

  onThinking();

  /**
   * Animate
   */
  const clock = new THREE.Clock();
  let previousTime = 0;

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    controls.update();

    if (isThinking) {
      pointsGroup.rotation.y += deltaTime * 0.1;
      pointsGroup.rotation.x += deltaTime * 0.1;
    } else {
      pointsGroup.rotation.y = 0;
      pointsMesh.position.y =
        Math.sin(elapsedTime * 0.1) * parseFloat(params.amplitude / 4);
      pointsMesh.position.x =
        Math.cos(elapsedTime * 0.1) * parseFloat(params.amplitude / 4);
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
}
