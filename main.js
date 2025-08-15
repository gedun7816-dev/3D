// 1. 引入 Three.js 和相关插件（确保你的 HTML 引入这些模块）
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 2. 核心组件
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 5); // 稍微抬高一点视角

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 3. 灯光
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 坐标轴（调试用）
scene.add(new THREE.AxesHelper(5));

// 4. OrbitControls 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 开启阻尼（缓动效果）
controls.dampingFactor = 0.05; // 阻尼系数
controls.target.set(0, 1, 0); // 旋转焦点位置（看模型中心）

// 5. 加载 GLB 模型
let model; // 用变量保存模型引用
const loader = new GLTFLoader();

loader.load(
  './model.glb',
  (gltf) => {
    model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    scene.add(model);
    console.log('模型加载成功！');
  },
  (xhr) => {
    console.log(`加载进度：${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error('模型加载失败：', error);
  }
);

// 6. 动画循环
function animate() {
  requestAnimationFrame(animate);

  // 可选自动旋转（不会影响手动拖拽）
  if (model) model.rotation.y += 0.005;

  controls.update(); // 更新控制器
  renderer.render(scene, camera);
}
animate();

// 7. 自适应窗口大小
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
