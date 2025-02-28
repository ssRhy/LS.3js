import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//全局变量声明
let moon;
let torus;
let controls;
let stars=[];
let time=0;
  //场景
  const scene =new THREE.Scene();  
  //相机
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  
 //渲染器
 const renderer=new THREE.WebGLRenderer({
  canvas:document.querySelector('#bg'), 
});


//<--------------------------------------------------------------------------


//初始化
function init(){ 
//初始化相机位置
camera.position.setZ(30);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);

//初始化控制器
controls=new OrbitControls(camera,renderer.domElement)

//初始化light
const pointLight=new THREE.PointLight(0xffffff)
const ambientLight = new THREE.AmbientLight( 0xffffff)
const lightHelper=new THREE.PointLightHelper(pointLight)
pointLight.position.set(2,2,1)
scene.add(pointLight,ambientLight)
scene.add(lightHelper)

//初始化物体circle
const geometry=new THREE.TorusGeometry(10,3,16,100);
const material=new THREE.MeshStandardMaterial({color:'red'})
torus=new THREE.Mesh(geometry,material);
scene.add(torus)

//初始化物体grid  
const gridHelper=new THREE.GridHelper(200,50)
//scene.add(gridHelper)

// 添加空间纹理背景
const spaceTexture=new THREE.TextureLoader().load('/space.jpg')
scene.background=spaceTexture

const normalTexture=new THREE.TextureLoader().load('/normal.jpg')
const moonTexture=new THREE.TextureLoader().load('/moon.jpg')

//初始化月球
moon=new THREE.Mesh(
    new THREE.SphereGeometry(15, 32, 16 ),
    new THREE.MeshStandardMaterial( {
      map: moonTexture,
      normalMap:normalTexture
    } )
)
scene.add(moon)

//添加星星
Array(200).fill().forEach(addStar)

// 添加滚动事件监听
document.body.onscroll=moveCamera
//添加动画循环
animate()
}
//-------------------------------------------------------------------------------




// 创建addStar函数
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starBlue = new THREE.Color(0x4682B4);   // 钢蓝色
const starPurple = new THREE.Color(0x9370DB); // 中等紫色
  const material = new THREE.MeshStandardMaterial({
      color: starBlue,starPurple,
      emissive: 0xFFFFFF,
      emissiveIntensity: 0.8
  });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  star.rotationSpeed={
    x:Math.random()*0.02,
    y:Math.random()*0.02,
    z:Math.random()*0.02
  }
  star.userData={
    originalColor:  star.material.color.getHex(),
    flickerSpeed: 0.05 + Math.random() * 0.1
  }

//先加入再显示
  stars.push(star);
  scene.add(star);
}


//Array(200).fill().forEach(addStar)

// 3. 创建moveCamera函数
function moveCamera(){
  const t=document.body.getBoundingClientRect().top
  moon.rotation.x+=0.05
  moon.rotation.y+=0.075
  moon.rotation.z+=0.05

  camera.position.x=t*-0.01
  camera.position.y=t*-0.0002
  camera.position.z=t*-0.0002
  
}

//创建球体动画循环
function animate(){
  requestAnimationFrame(animate)
  moon .rotation.x+=0.01
  moon.rotation.y+=0.005
  moon.rotation.z+=0.01
 // 更新所有星星的旋转
 time+=0.01
 stars.forEach((star,i) => {
  star.rotation.x += star.rotationSpeed.x;
  star.rotation.y += star.rotationSpeed.y;
  star.rotation.z += star.rotationSpeed.z;
  const offset=i*0.01
  star.position.x+=Math.sin(time+offset)*0.03;
  star.position.y+=Math.cos(time+offset)*0.03;
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
//调用函数
init()
