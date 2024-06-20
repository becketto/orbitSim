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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50000);
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
const panoramaGeometry = new THREE.SphereGeometry(15000, 60, 40);
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
  const maxRadius = 100;
  const minVelocity = -2;
  const maxVelocity = 2;
  const minPosition = -50;
  const maxPosition = 50;

  const exponentialDistribution = (min, max, lambda) => {
    return min - Math.log(1 - Math.random()) / lambda * (max - min);
  };

  // const radius = Math.random() * (maxRadius - minRadius) + minRadius;
  const radius = exponentialDistribution(minRadius, maxRadius, 1);
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


//! If they collide at a certain velocity, it splits apart
function generateRandomScene() {
  const minRadius = 2;
  const maxRadius = 150;
  const minVelocity = -5;
  const maxVelocity = 25;
  const minPosition = -1500;
  const maxPosition = 1500;
  const numSpheres = parseFloat(sceneNumber.value);

  const exponentialDistribution = (min, max, lambda) => {
    return min - Math.log(1 - Math.random()) / lambda * (max - min);
  };

  for (let i = 0; i < numSpheres; i++) {
    // const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    // const radius = 5;
    const radius = exponentialDistribution(minRadius, maxRadius, 60);
    const velocity = new THREE.Vector3(exponentialDistribution(minVelocity, maxVelocity, 4),
      exponentialDistribution(minVelocity, maxVelocity, 4),
      exponentialDistribution(minVelocity, maxVelocity, 4));

    // const velocity = new THREE.Vector3(
    //   Math.random() * (maxVelocity - minVelocity) + minVelocity,
    //   Math.random() * (maxVelocity - minVelocity) + minVelocity,
    //   Math.random() * (maxVelocity - minVelocity) + minVelocity
    // );
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
  const despawnDistance = 6000;
  const minSphereCount = 50;
  const addSphereCount = 300;

  for (let i = 0; i < numObjects; i++) {
    const obj1 = objects[i];

    // Check if the object is beyond the despawn distance
    if (obj1.position.length() > despawnDistance) {
      console.log('despawn');
      scene.remove(obj1.mesh);
      objects.splice(i, 1);
      i--;
      continue;
    }

    for (let j = i + 1; j < numObjects; j++) {
      const obj2 = objects[j];

      const distance = obj1.position.distanceTo(obj2.position);
      const collisionDistance = obj1.radius + obj2.radius;

      if (distance > 0 && distance < collisionDistance) {
        // collision
        // console.log('collision');
        const mergedMass = obj1.mass + obj2.mass;
        const mergedRadius = Math.pow((3 * mergedMass) / (4 * Math.PI), 1 / 3);
        const mergedPosition = obj1.position.clone().lerp(obj2.position, obj2.mass / mergedMass);
        const mergedVelocity = obj1.velocity.clone().multiplyScalar(obj1.mass)
          .add(obj2.velocity.clone().multiplyScalar(obj2.mass))
          .divideScalar(mergedMass);

        // console.log(obj1.radius, obj1.mass, obj2.radius, obj2.mass, mergedMass, mergedRadius);

        // Create a new merged object
        const mergedGeometry = new THREE.SphereGeometry(mergedRadius, 32);
        const mergedMaterial = new THREE.MeshBasicMaterial({
          color: Math.random() * 0xffffff, // Random color
        });
        const mergedMesh = new THREE.Mesh(mergedGeometry, mergedMaterial);
        mergedMesh.position.copy(mergedPosition);

        // Add the new merged object to the scene
        scene.add(mergedMesh);

        // Remove the colliding objects from the scene and the objects array
        scene.remove(obj1.mesh);
        scene.remove(obj2.mesh);
        objects.splice(j, 1);
        objects.splice(i, 1);

        // Add the new merged object to the objects array
        objects.push({
          mesh: mergedMesh,
          position: mergedPosition,
          velocity: mergedVelocity,
          radius: mergedRadius,
          mass: mergedMass,
        });

        i--; // Decrement i to account for the removed object
        break; // Exit the inner loop since the current object has been merged
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

  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    obj.position.add(obj.velocity.clone().multiplyScalar(dt));
    obj.mesh.position.copy(obj.position); // Update the mesh position
  }

  if (objects.length < minSphereCount) {
    // Generate additional spheres
    generateRandomScene(addSphereCount);
  }

  const sphereCountElement = document.getElementById('sphereCount');
  sphereCountElement.textContent = `Sphere Count: ${objects.length}`;
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