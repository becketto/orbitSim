import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { calculateMass, updatePositions } from './physics.js';

// Constants and initial values
const earthRadius = 5;
const moonRadius = 1;
const earthMass = calculateMass(earthRadius);
const moonMass = calculateMass(moonRadius);
const earthVelocity = new THREE.Vector3(0, 0, 0);
const moonVelocity = new THREE.Vector3(0, 0, 1.5);
let isPaused = false;
let lastTime = performance.now();

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
const earthGeometry = new THREE.SphereGeometry(earthRadius, 32);
const earthTexture = new THREE.TextureLoader().load('earthMap.jpeg');
const normalTexture = new THREE.TextureLoader().load('earthNormal.jpg');
const earthMaterial = new THREE.MeshBasicMaterial({
  map: earthTexture,
  normalMap: normalTexture,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.rotation.x = 0.2;
scene.add(earth);

const moonTexture = new THREE.TextureLoader().load('moon.png');
const moonGeometry = new THREE.SphereGeometry(moonRadius, 32);
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

// Helpers setup
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelper);

// const lightHelper2 = new THREE.PointLightHelper(pointLight2);
// scene.add(lightHelper2);

// Orbit controls setup
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enablePan = false;

// Background setup
const panoramaTexture = new THREE.TextureLoader().load('darkStars.jpg');
const panoramaGeometry = new THREE.SphereGeometry(500, 60, 40);
panoramaGeometry.scale(-1, 1, 1);
const panoramaMaterial = new THREE.MeshBasicMaterial({
  map: panoramaTexture,
});
const panoramaMesh = new THREE.Mesh(panoramaGeometry, panoramaMaterial);
scene.add(panoramaMesh);


const objects = [
  { position: earth.position, velocity: earthVelocity, mass: earthMass },
  { position: moon.position, velocity: moonVelocity, mass: moonMass },
  // Add more objects as needed
];

const radiusInput = document.getElementById('radiusInput');
const velocityInput = document.getElementById('velocityInput');
const xPositionInput = document.getElementById('xPositionInput');
const yPositionInput = document.getElementById('yPositionInput');
const zPositionInput = document.getElementById('zPositionInput');
const applyButton = document.getElementById('applyButton');

applyButton.addEventListener('click', function () {
  const radius = parseFloat(radiusInput.value);
  const velocity = parseFloat(velocityInput.value);
  const xPosition = parseFloat(xPositionInput.value);
  const yPosition = parseFloat(yPositionInput.value);
  const zPosition = parseFloat(zPositionInput.value);

  const newGeometry = new THREE.SphereGeometry(radius, 32);
  const newTexture = new THREE.TextureLoader().load('earthMap.jpeg');
  const newMaterial = new THREE.MeshBasicMaterial({
    map: newTexture,
  });
  const newMesh = new THREE.Mesh(newGeometry, newMaterial);
  newMesh.position.set(xPosition, yPosition, zPosition);
  scene.add(newMesh);

  // Calculate the mass based on the radius
  const mass = calculateMass(radius);

  // Create a new velocity vector based on the user input
  const newVelocity = new THREE.Vector3(0, 0, velocity);

  // Add the new object to the objects array
  objects.push({
    position: newMesh.position,
    velocity: newVelocity,
    mass: mass,
  });
});

// Animation loop
function animate(time) {
  if (!isPaused) {
    requestAnimationFrame(animate);

    const timeSpeed = parseFloat(timeSpeedSlider.value);
    const dt = 0.1 * timeSpeed;

    lastTime = time;

    updatePositions(objects, dt);

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