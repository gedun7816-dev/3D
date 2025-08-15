// 初始化场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 添加光源
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// 加载模型
const loader = new THREE.GLTFLoader();
loader.load(
  'model.glb',
  function (gltf) {
    scene.add(gltf.scene);
    console.log('✅ 模型加载成功');
  },
  undefined,
  function (error) {
    console.error('❌ 模型加载失败', error);
  }
);

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// 响应窗口大小变化
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
