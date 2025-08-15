// 1. 初始化 Three.js 核心组件（场景、相机、渲染器）
const scene = new THREE.Scene(); // 场景（容器）
// 透视相机（视角75°，宽高比=窗口宽高，近裁剪面0.1，远裁剪面1000）
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// WebGL 渲染器（抗锯齿开启，更清晰）
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); // 渲染器尺寸=窗口尺寸
document.body.appendChild(renderer.domElement); // 将渲染画布添加到页面


// 2. 添加辅助元素（可选：坐标轴、环境光，方便调试）
const axesHelper = new THREE.AxesHelper(5); // 坐标轴（x红、y绿、z蓝，长度5）
scene.add(axesHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 环境光（白色，强度0.5）
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 平行光（增强明暗）
directionalLight.position.set(5, 5, 5); // 光源位置
scene.add(directionalLight);


// 3. 加载 GLB 模型（关键步骤）
const loader = new THREE.GLTFLoader();
// 👉 重点：确保你的模型文件命名为 model.glb，且和 index.html 同目录！
// 若模型在子文件夹（如 models/model.glb），则修改路径为 './models/model.glb'
loader.load(
  './model.glb', // 你的模型路径
  (gltf) => { // 加载成功回调
    scene.add(gltf.scene); // 将模型添加到场景
    // 可选：调整模型位置/大小（根据你的模型比例调整）
    gltf.scene.position.set(0, 0, 0); // 模型位置（x,y,z）
    gltf.scene.scale.set(1, 1, 1); // 模型缩放（1=原尺寸，太大就改小，如0.1）
    console.log('模型加载成功！');
  },
  (xhr) => { // 加载进度回调（可选）
    console.log(`加载进度：${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => { // 加载失败回调（关键：排查错误）
    console.error('模型加载失败！原因：', error);
  }
);


// 4. 相机位置设置（确保相机能看到模型）
camera.position.z = 5; // 相机向后移5个单位（离模型远一点，避免只看到局部）


// 5. 动画循环（让画面持续渲染，支持模型动画/交互）
function animate() {
  requestAnimationFrame(animate); // 浏览器刷新频率同步
  // 可选：让模型自动旋转（沿y轴，每秒旋转0.01弧度）
  if (scene.children.find(child => child.type === 'Group')) {
    scene.children.find(child => child.type === 'Group').rotation.y += 0.01;
  }
  renderer.render(scene, camera); // 渲染场景
}
animate();


// 6. 窗口大小自适应（避免缩放窗口后画面变形）
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 更新相机投影矩阵
  renderer.setSize(window.innerWidth, window.innerHeight); // 更新渲染器尺寸
});
