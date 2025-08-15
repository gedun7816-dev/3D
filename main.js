import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// 場景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// 攝影機
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 5);

// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 燈光
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 10, 7.5);
scene.add(dir);

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 這裡一定要加 './'，避免 GitHub Pages 錯誤去根目錄找檔案
const loader = new GLTFLoader();
loader.load('./model.glb', (gltf) => {
  scene.add(gltf.scene);
}, undefined, (err) => {
  console.error('模型載入錯誤:', err);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
