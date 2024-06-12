import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { calculateMass, updatePositions } from './physics.js';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(70);

const timeSpeedSlider = document.getElementById('timeSpeedSlider');
const moonVelocitySlider = document.getElementById('moonVelocitySlider');

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Sphere setup
const earthGeometry = new THREE.SphereGeometry(5, 32);
const earthTexture = new THREE.TextureLoader().load('earth.jpeg');
const earthMaterial = new THREE.MeshBasicMaterial({
  map: earthTexture,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.rotation.x = .2;

scene.add(earth);

const moonTexture = new THREE.TextureLoader().load('moon.png');
const moonGeometry = new THREE.SphereGeometry(2, 32);
const moonMaterial = new THREE.MeshBasicMaterial({
  map: moonTexture,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(50, 0, 0);
scene.add(moon);

// Lights setup
const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(5, 10, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 50);
pointLight2.position.set(-7, 5, 10);
scene.add(pointLight2);

// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

// Helpers setup
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

const lightHelper2 = new THREE.PointLightHelper(pointLight2);
scene.add(lightHelper2);

// Orbit controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

// Background setup
const panoramaTexture = new THREE.TextureLoader().load('space.jpeg');
const panoramaGeometry = new THREE.SphereGeometry(500, 60, 40);
// Invert the geometry inside out
panoramaGeometry.scale(-1, 1, 1);

const panoramaMaterial = new THREE.MeshBasicMaterial({
  map: panoramaTexture,
});

const panoramaMesh = new THREE.Mesh(panoramaGeometry, panoramaMaterial);
scene.add(panoramaMesh);

// Animation loop


const earthRadius = 5;
const moonRadius = 2;

const earthMass = calculateMass(earthRadius);
const moonMass = calculateMass(moonRadius);

const earthVelocity = new THREE.Vector3(0, 0, .2); // Initial velocity of Earth
// moon.position.set(5, 0, 0);
const moonVelocity = new THREE.Vector3(0, 0, -1);


let isPaused = false;
let lastTime = performance.now();

function animate(time) {
  if (!isPaused) {
    requestAnimationFrame(animate);

    // const dt = (time - lastTime) * 0.01; // Convert milliseconds to seconds
    const timeSpeed = parseFloat(timeSpeedSlider.value);
    const dt = 0.1 * timeSpeed;

    lastTime = time;

    updatePositions(
      { position: earth.position, velocity: earthVelocity, mass: earthMass },
      { position: moon.position, velocity: moonVelocity, mass: moonMass },
      dt
    );

    renderer.render(scene, camera);
  }
}

function togglePause() {
  isPaused = !isPaused;

  if (!isPaused) {
    lastTime = performance.now();
    animate(lastTime);
  }
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    togglePause();
  }
});

animate(performance.now());