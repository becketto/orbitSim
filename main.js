import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const sphereGeometry = new THREE.SphereGeometry(5, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

scene.add(sphere);

const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(5, 10, 5);

scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 50);
pointLight2.position.set(-7, 5, 10);

scene.add(pointLight2);

const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

const lightHelper2 = new THREE.PointLightHelper(pointLight2);
scene.add(lightHelper2);


const controls = new OrbitControls(camera, renderer.domElement);


function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();