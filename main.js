import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { calculateMass, calculateGravitationalForce } from './physics.js';

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
// scene.add(earth);

const moonTexture = new THREE.TextureLoader().load('moon.png');
const moonGeometry = new THREE.SphereGeometry(moonRadius, 32);
const moonMaterial = new THREE.MeshBasicMaterial({
  map: moonTexture,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(50, 0, 0);
// scene.add(moon);

// Lights setup
const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(5, 10, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 50);
pointLight2.position.set(-7, 5, 10);
scene.add(pointLight2);

// Helpers setup
const gridHelper = new THREE.GridHelper(200, 50);

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
  // const mass = calculateMass(radius);

  // Create a new velocity vector based on the user input
  const newVelocity = new THREE.Vector3(0, 0, velocity);

  // Add the new object to the objects array
  objects.push({
    position: newMesh.position,
    velocity: newVelocity,
    radius: radius,
    mass: calculateMass(radius),
  });
});

function generateRandomSphere() {
  const minRadius = 1;
  const maxRadius = 5;
  const minVelocity = -2;
  const maxVelocity = 2;
  const minPosition = -50;
  const maxPosition = 50;

  const radius = Math.random() * (maxRadius - minRadius) + minRadius;
  const velocity = new THREE.Vector3(
    Math.random() * (maxVelocity - minVelocity) + minVelocity,
    Math.random() * (maxVelocity - minVelocity) + minVelocity,
    Math.random() * (maxVelocity - minVelocity) + minVelocity
  );
  const position = new THREE.Vector3(
    Math.random() * (maxPosition - minPosition) + minPosition,
    Math.random() * (maxPosition - minPosition) + minPosition,
    Math.random() * (maxPosition - minPosition) + minPosition
  );

  const newGeometry = new THREE.SphereGeometry(radius, 32);
  const newTexture = new THREE.TextureLoader().load('earthMap.jpeg');
  const newMaterial = new THREE.MeshBasicMaterial({
    map: newTexture,
  });
  const newMesh = new THREE.Mesh(newGeometry, newMaterial);
  newMesh.position.copy(position);
  scene.add(newMesh);

  // const mass = calculateMass(radius);

  objects.push({
    mesh: newMesh,
    position: newMesh.position,
    velocity: velocity,
    radius: radius,
    mass: calculateMass(radius),
  });
}

function generateRandomScene() {
  const minRadius = 1;
  const maxRadius = 5;
  const minVelocity = -2;
  const maxVelocity = 2;
  const minPosition = -50;
  const maxPosition = 50;
  const numSpheres = parseFloat(sceneNumber.value);

  for (let i = 0; i < numSpheres; i++) {
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const velocity = new THREE.Vector3(
      Math.random() * (maxVelocity - minVelocity) + minVelocity,
      Math.random() * (maxVelocity - minVelocity) + minVelocity,
      Math.random() * (maxVelocity - minVelocity) + minVelocity
    );
    const position = new THREE.Vector3(
      Math.random() * (maxPosition - minPosition) + minPosition,
      Math.random() * (maxPosition - minPosition) + minPosition,
      Math.random() * (maxPosition - minPosition) + minPosition
    );

    const newGeometry = new THREE.SphereGeometry(radius, 32);
    const newMaterial = new THREE.MeshBasicMaterial({
      color: Math.random() * 0xffffff, // Random color
    });
    const newMesh = new THREE.Mesh(newGeometry, newMaterial);
    newMesh.position.copy(position);
    scene.add(newMesh);

    const mass = calculateMass(radius);

    objects.push({
      mesh: newMesh,
      position: newMesh.position,
      velocity: velocity,
      radius: radius,
      mass: calculateMass(radius),
    });
  }
}

//* physics
function updatePositions(objects, dt) {
  const numObjects = objects.length;

  for (let i = 0; i < numObjects; i++) {
    const obj1 = objects[i];

    for (let j = i + 1; j < numObjects; j++) {
      const obj2 = objects[j];

      const distance = obj1.position.distanceTo(obj2.position);
      const collisionDistance = obj1.radius + obj2.radius;
      // console.log(collisionDistance);

      if (distance > 0 && distance < collisionDistance) {
        //collision
        console.log('collision');
        const mergedMass = obj1.mass + obj2.mass;
        const mergedRadius = Math.pow((3 * mergedMass) / (4 * Math.PI), 1 / 3);
        const mergedPosition = obj1.position.clone().lerp(obj2.position, obj2.mass / mergedMass);
        const mergedVelocity = obj1.velocity.clone().multiplyScalar(obj1.mass / mergedMass)
          .add(obj2.velocity.clone().multiplyScalar(obj2.mass / mergedMass));

        obj1.position.copy(mergedPosition);
        obj1.velocity.copy(mergedVelocity);
        obj1.mass = mergedMass;
        obj1.radius = mergedRadius;

        scene.remove(obj2.mesh);
        objects.splice(j, 1);
        j--;
      } else if (distance > 0) {
        const direction = obj2.position.clone().sub(obj1.position).normalize();
        const force = calculateGravitationalForce(obj1.mass, obj2.mass, distance);

        const acceleration1 = direction.clone().multiplyScalar(force / obj1.mass);
        const acceleration2 = direction.clone().multiplyScalar(-force / obj2.mass);

        obj1.velocity.add(acceleration1.clone().multiplyScalar(dt));
        obj2.velocity.add(acceleration2.clone().multiplyScalar(dt));
      }
    }
  }


  for (let i = 0; i < numObjects; i++) {
    const obj = objects[i];
    obj.position.add(obj.velocity.clone().multiplyScalar(dt));
  }
}

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

const generateButton = document.getElementById('generateButton');

generateButton.addEventListener('click', function () {
  generateRandomSphere();
});

const generateSceneButton = document.getElementById('generateSceneButton');
const sceneNumber = document.getElementById('sceneNumber');

generateSceneButton.addEventListener('click', function () {
  generateRandomScene();
});

animate(performance.now());