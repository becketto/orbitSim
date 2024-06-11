import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(70);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Sphere setup
const sphereGeometry = new THREE.SphereGeometry(5, 32);
const sphereTexture = new THREE.TextureLoader().load('earth.jpeg');
const sphereMaterial = new THREE.MeshBasicMaterial({
  map: sphereTexture,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.rotation.x = .2;

scene.add(sphere);

const moonTexture = new THREE.TextureLoader().load('moon.png');
const moonGeometry = new THREE.SphereGeometry(2, 32);
const moonMaterial = new THREE.MeshBasicMaterial({
  map: moonTexture,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(30, 0, 0);
scene.add(moon);

// Lights setup
const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(5, 10, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 50);
pointLight2.position.set(-7, 5, 10);
scene.add(pointLight2);

const ambientLight = new THREE.AmbientLight(0xffffff);
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
function animate() {
  requestAnimationFrame(animate);

  // sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.004;

  moon.rotation.y += 0.003;
  moon.position.x = 30 * Math.sin(moon.rotation.y);
  moon.position.z = 30 * Math.cos(moon.rotation.y);


  renderer.render(scene, camera);
}

animate();