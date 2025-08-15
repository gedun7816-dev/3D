import * as THREE from 'https://unpkg.com/three@0.153.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.153.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/OrbitControls.js';

// 初始化場景
const scene = new THREE.Scene();

// 相機
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 2);

// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);

// 光源
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// 載入模型
const loader = new GLTFLoader();
loader.load(
  './model.glb',

  // 成功載入
  function (gltf) {
    console.log('✅ 模型載入完成:', gltf);

    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    const size = box.getSize(new THREE.Vector3()).length();
    const scale = 1.5 / size;
    model.scale.setScalar(scale);

    scene.add(model);
  },

  // 載入進度
  function (xhr) {
    const percent = (xhr.loaded / xhr.total) * 100;
    console.log(`📦 模型載入中: ${percent.toFixed(2)}%`);
  },

  // 錯誤處理
  function (error) {
    console.error('❌ 模型載入失敗: ', error);
    if (error instanceof Error) {
      console.error('錯誤訊息:', error.message);
      console.error('堆疊:', error.stack);
    }
  }
);

// 動畫循環
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 視窗縮放響應
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
