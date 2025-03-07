import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import PlanetClickHandler from "./click.js";
//import { Application } from "@splinetool/runtime";
//import Spline from '@splinetool/react-spline/next';

//全局变量声明
let moon;
let purple;
let mars;
let controls;
let pink;
let stars = [];
let time = 0;
// 添加公转角度变量
let purpleOrbitAngle = 0;
let marsOrbitAngle = 0;
let pinkOrbitAngle = 0;

// 添加射线检测器和鼠标位置变量
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//场景
const scene = new THREE.Scene();
//相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//渲染器
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

// 创建点击处理器实例
const clickHandler = new PlanetClickHandler(camera, scene);

//<--------------------------------------------------------------------------

//初始化
function init() {
  //初始化相机位置
  camera.position.setZ(30);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //初始化控制器
  controls = new OrbitControls(camera, renderer.domElement);

  //初始化light
  const pointLight = new THREE.PointLight(0xffffff, 2);
  const ambientLight = new THREE.AmbientLight(0xffffff);
  const lightHelper = new THREE.PointLightHelper(pointLight);
  pointLight.position.set(2, 2, 2);
  scene.add(pointLight, ambientLight);
  scene.add(lightHelper);

  // 添加第二个点光源，从不同角度照亮星球
  const pointLight2 = new THREE.PointLight(0xffffff, 1);
  pointLight2.position.set(-20, 10, -10);
  scene.add(pointLight2);

  // 添加环境贴图来增强材质的真实感
  const envTexture = new THREE.TextureLoader().load("/space.jpg");
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envTexture;

  //初始化物体grid
  const gridHelper = new THREE.GridHelper(200, 50);
  //scene.add(gridHelper)

  // 添加空间纹理背景
  const spaceTexture = new THREE.TextureLoader().load("/space.jpg");
  scene.background = spaceTexture;

  const normalTexture = new THREE.TextureLoader().load("/normal.jpg");
  const moonTexture = new THREE.TextureLoader().load("/moon.jpg");
  const purpleTexture = new THREE.TextureLoader().load("/purple.jpg");
  const marsTexture = new THREE.TextureLoader().load("/mars.jpg");
  const pinkTexture = new THREE.TextureLoader().load("/pink.jpg");

  //初始化月球
  moon = new THREE.Mesh(
    new THREE.SphereGeometry(15, 32, 16),
    new THREE.MeshStandardMaterial({
      map: moonTexture,
      normalMap: normalTexture,
    })
  );
  // 添加月球的用户数据
  moon.userData = {
    name: "月球",
    description:
      "月球是地球唯一的天然卫星，也是太阳系中第五大的卫星。它的存在影响着地球的潮汐和气候。",
  };
  scene.add(moon);

  //初始化purple球
  purple = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshStandardMaterial({
      map: purpleTexture,
      normalMap: normalTexture,
    })
  );
  // 添加紫色星球的用户数据
  purple.userData = {
    name: "宠物星",
    description:
      "那是童年的温暖记忆。奇幻的世界、独特的宠物、激烈的对战，让人沉浸其中。曾经的伙伴如今化作回忆，但那份陪伴与快乐，依旧留存在心。",
  };
  // 将紫色星球放在月球的左侧
  purple.position.set(-60, 0, 0);
  scene.add(purple);

  // 初始化火星
  mars = new THREE.Mesh(
    new THREE.SphereGeometry(4, 32, 32),
    new THREE.MeshStandardMaterial({
      map: marsTexture,
      normalMap: normalTexture,
    })
  );
  // 添加火星的用户数据
  mars.userData = {
    name: "亲情星",
    description:
      "怀念亲情，像微风拂过心田，温暖而深远。曾经的关怀与陪伴，化作记忆中的光亮。无论时光如何流转，家人的爱始终如影随形，支撑着我们前行，成为心中最温柔的牵挂。",
  };
  // 将火星放在月球的右侧
  mars.position.set(50, 0, 0);
  scene.add(mars);

  // 初始化pink星
  pink = new THREE.Mesh(
    new THREE.SphereGeometry(8, 32, 32),
    new THREE.MeshStandardMaterial({
      map: pinkTexture,
      normalMap: normalTexture,
    })
  );
  // 添加粉色星球的用户数据
  pink.userData = {
    name: "爱情星",
    description:
      "怀念爱情，像一首悠扬的旋律，曾经的甜蜜与悸动铭刻在心。那些并肩走过的日子，如今化作温柔的回忆。即使时光远去，那份真挚的情感，依然在心底悄然绽放。",
  };
  // 将粉色星球放在特定位置
  pink.position.set(50, 30, 0);
  scene.add(pink);

  //添加星星
  Array(200).fill().forEach(addStar);

  // 添加滚动事件监听
  document.body.onscroll = moveCamera;
  //添加动画循环
  animate();

  // 添加点击事件监听器
  window.addEventListener("click", onMouseClick);
}
//-------------------------------------------------------------------------------

// 创建addStar函数
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starBlue = new THREE.Color(0x4682b4); // 蓝色
  const starPurple = new THREE.Color(0x9370db); // 紫色
  const material = new THREE.MeshStandardMaterial({
    color: starBlue,
    starPurple,
    emissive: 0xffffff,
    emissiveIntensity: 0.8,
  });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  star.rotationSpeed = {
    x: Math.random() * 0.02,
    y: Math.random() * 0.02,
    z: Math.random() * 0.02,
  };
  star.userData = {
    originalColor: star.material.color.getHex(),
    flickerSpeed: 0.05 + Math.random() * 0.1,
  };

  //先加入再显示
  stars.push(star);
  scene.add(star);
}

//Array(200).fill().forEach(addStar)

// 3. 创建moveCamera函数
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.x = t * -0.01;
  camera.position.y = t * -0.0002;
  camera.position.z = t * -0.0002;
}

//创建球体动画循环
function animate() {
  requestAnimationFrame(animate);

  // 月球自转
  moon.rotation.x += 0.01;
  moon.rotation.y += 0.005;
  moon.rotation.z += 0.01;

  // 紫色星球自转
  purple.rotation.x += 0.015;
  purple.rotation.y += 0.01;
  purple.rotation.z += 0.005;

  // 火星自转
  mars.rotation.x += 0.012;
  mars.rotation.y += 0.008;
  mars.rotation.z += 0.003;

  // 粉色星球自转
  pink.rotation.x += 0.012;
  pink.rotation.y += 0.008;
  pink.rotation.z += 0.003;

  // 更新公转角度
  purpleOrbitAngle += 0.005; // 紫色星球公转速度
  marsOrbitAngle += 0.003; // 火星公转速度
  pinkOrbitAngle += 0.008; // 粉色星球公转速度

  // 计算紫色星球的公转位置（绕月球）
  const purpleOrbitRadius = 60; // 公转半径
  purple.position.x = Math.cos(purpleOrbitAngle) * purpleOrbitRadius;
  purple.position.z = Math.sin(purpleOrbitAngle) * purpleOrbitRadius;

  // 计算火星的公转位置（绕月球）
  const marsOrbitRadius = 50; // 公转半径
  mars.position.x = Math.cos(marsOrbitAngle) * marsOrbitRadius;
  mars.position.z = Math.sin(marsOrbitAngle) * marsOrbitRadius;

  // 计算粉色星球的公转位置（绕月球）
  const pinkOrbitRadius = 40; // 公转半径
  pink.position.x = Math.cos(pinkOrbitAngle) * pinkOrbitRadius;
  pink.position.y = 15 + Math.sin(pinkOrbitAngle) * 15; // 让粉色星球在垂直方向也有一些变化
  pink.position.z = Math.sin(pinkOrbitAngle) * pinkOrbitRadius;

  // 更新所有星星的旋转
  time += 0.01;
  stars.forEach((star, i) => {
    star.rotation.x += star.rotationSpeed.x;
    star.rotation.y += star.rotationSpeed.y;
    star.rotation.z += star.rotationSpeed.z;
    const offset = i * 0.01;
    star.position.x += Math.sin(time + offset) * 0.03;
    star.position.y += Math.cos(time + offset) * 0.03;
    //闪烁效果
    if (star.userData && star.userData.originalColor) {
      const flicker = Math.sin(time * star.userData.flickerSpeed) * 0.2 + 0.8;
      star.material.emissiveIntensity = flicker;
    }
  });

  // 更新控制器
  if (controls) controls.update();

  // 渲染场景
  renderer.render(scene, camera);
}

// 添加点击事件监听器
function onMouseClick(event) {
  // 计算鼠标在归一化设备坐标中的位置
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 更新射线检测器
  raycaster.setFromCamera(mouse, camera);

  // 获取射线和物体的交点
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;

    // 根据点击的对象显示不同的弹窗内容
    if (clickedObject.userData.name) {
      showModal(
        clickedObject.userData.name,
        clickedObject.userData.description
      );
    }
  }
}

// 创建和显示弹窗的函数
function showModal(title, content) {
  // 移除已存在的弹窗
  const existingModal = document.querySelector(".planet-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // 创建弹窗元素
  const modal = document.createElement("div");
  modal.className = "planet-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>${title}</h2>
      <p>${content}</p>
      <button onclick="this.parentElement.parentElement.remove()">关闭</button>
    </div>
  `;

  // 添加到页面
  document.body.appendChild(modal);
}

//调用函数
init();
