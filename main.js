import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 建立場景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee); // 可選：設定背景色

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
controls.update(); // 初始化後立即更新

// 光源
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// 載入模型
const loader = new GLTFLoader();
loader.load(
  './model.glb',
  function (gltf) {
    const model = gltf.scene;

    // 自動置中與縮放
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    const size = box.getSize(new THREE.Vector3()).length();
    const scale = 1.5 / size;
    model.scale.setScalar(scale);

    scene.add(model);
    console.log('✅ 模型加載成功');
  },
  function (xhr) {
    console.log(`📦 模型載入進度：${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
  },
  function (error) {
    console.error('❌ 模型加載失敗', error);
  }
);

// 動畫循環
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 視窗縮放
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
