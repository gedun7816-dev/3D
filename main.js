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
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 燈光
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 10, 7.5);
dir.castShadow = true;
scene.add(dir);

// 地板（微弱）
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 1, metalness: 0 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.001;
ground.receiveShadow = true;
scene.add(ground);

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 視窗尺寸變化
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 嘗試載入模型（GitHub Pages 子路徑須使用相對路徑）
const loader = new GLTFLoader();
const MODEL_PATH = './model.glb';

function addFallback() {
  // 如果沒找到模型，放一個替代立方體，確保頁面不會空白
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshStandardMaterial({ color: 0x4ea3ff });
  const cube = new THREE.Mesh(geo, mat);
  cube.castShadow = true;
  scene.add(cube);

  const msg = '找不到 model.glb，已顯示示意方塊。請將你的模型檔命名為 model.glb 並放在與 index.html 同層。';
  console.warn(msg);
  const note = document.createElement('div');
  note.className = 'toast';
  note.style.top = '12px';
  note.style.bottom = 'auto';
  note.textContent = msg;
  document.body.appendChild(note);
}

loader.load(MODEL_PATH, (gltf) => {
  const root = gltf.scene;
  root.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });
  // 自動置中與縮放
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  root.position.sub(center); // 移到原點

  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2 / maxDim; // 將最大尺寸縮放到 2
  root.scale.setScalar(scale);

  scene.add(root);
}, (xhr) => {
  if (xhr.total) {
    console.log(`載入進度: ${(xhr.loaded / xhr.total * 100).toFixed(1)}%`);
  } else {
    console.log(`已載入位元組: ${xhr.loaded}`);
  }
}, (err) => {
  console.error('模型載入錯誤:', err);
  addFallback();
});

// 動畫循環
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
