// 1. 引入 Three.js 模块（确保 HTML 用 <script type="module">）
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 2. 场景、相机、渲染器
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 3. 灯光
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// 坐标轴
scene.add(new THREE.AxesHelper(5));

// 4. OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 1, 0);

// 5. 模型加载
let model;
const loader = new GLTFLoader();

// 关键：适配 GitHub Pages 路径
const modelURL = new URL('./model.glb', import.meta.url);

loader.load(
  modelURL.href,
  (gltf) => {
    model = gltf.scene;
    model.position.set(0, 0, 0);
    scene.add(model);
    console.log('模型加载成功！');
  },
  (xhr) => {
    console.log(`加载进度：${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error('模型加载失败：', error);

    // 提示加载失败并放一个备用立方体防止空白
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    scene.add(box);
  }
);

// 6. 渲染循环
function animate() {
  requestAnimationFrame(animate);
  if (model) model.rotation.y += 0.005;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 7. 窗口自适应
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
