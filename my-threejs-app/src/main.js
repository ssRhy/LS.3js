import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//全局变量声明
let moon;
let torus;
let controls;
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

//加载纹理
const spaceTexture=new THREE.TextureLoader().load('space.jpg')
scene.background=spaceTexture

const normalTexture=new THREE.TextureLoader().load('normal.jpg')
const moonTexture=new THREE.TextureLoader().load('moon.jpg')
 moon=new THREE.Mesh(
  new THREE.SphereGeometry( 15, 32, 16 ),
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
  const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("CornflowerBlue"),
      emissive: 0xFFFFFF,
      emissiveIntensity: 0.8
  });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
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
  renderer.render(scene,camera)
  renderer.update()
  
renderer.render(scene,camera);

}
//调用函数
init()










