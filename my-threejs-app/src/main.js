import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene =new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer=new THREE.WebGLRenderer({
  canvas:document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.setZ(30);
renderer.render(scene,camera);

const geometry=new THREE.TorusGeometry(10,3,16,100);
const material=new THREE.MeshStandardMaterial({color:'red'})
const torus=new THREE.Mesh(geometry,material);
const pointLight=new THREE.PointLight(0xffffff)
const ambientLight = new THREE.AmbientLight( 0xffffff)
const lightHelper=new THREE.PointLightHelper(pointLight)
const gridHelper=new THREE.GridHelper(200,50)
const controls=new OrbitControls(camera,renderer.domElement)

pointLight.position.set(2,2,1)
scene.add(pointLight,ambientLight)
scene.add(torus)
scene.add(lightHelper)


function addStar()
{
const geometry=new THREE.SphereGeometry(0.25,24,24)
const material = new THREE.MeshStandardMaterial({
  color: new THREE.Color("CornflowerBlue"), // 使用CornflowerBlue色值
  emissive: 0xFFFFFF, // 自发光白色
  emissiveIntensity: 0.8 // 发光强度
});
// 创建颜色渐变材质（需在init函数中定义）
const gradientMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec3 vPosition;
    void main() {
      float mixValue = (vPosition.y + 1.0)/2.0; // 根据Y轴位置混合颜色
      gl_FragColor = vec4(mix(color1, color2, mixValue), 1.0);
    }
  `,
  uniforms: {
    color1: { value: new THREE.Color(0x6495ED) },
    color2: { value: new THREE.Color(0xFFFFFF) }
  }
});

// 应用材质到几何体
const star = new THREE.Mesh(geometry, gradientMaterial);
const star1=new THREE.Mesh(geometry,material)

const [x,y,z]=Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100))
star1.position.set(x,y,z)
scene.add(star1)
} 
Array(200).fill().forEach(addStar)

const spaceTexture=new THREE.TextureLoader().load('space.jpg')
scene.background=spaceTexture

const normalTexture=new THREE.TextureLoader().load('normal.jpg')
const moonTexture=new THREE.TextureLoader().load('moon.jpg')
const moon=new THREE.Mesh(
  new THREE.SphereGeometry( 15, 32, 16 ),
  new THREE.MeshStandardMaterial( {
    map: moonTexture,
    normalMap:normalTexture

  } )
)
scene.add(moon)

function moveCamera(){
  const t=document.body.getBoundingClientRect().top
  moon.rotation.x+=0.05
  moon.rotation.y+=0.075
  moon.rotation.z+=0.05

  camera.position.x=t*-0.01
  camera.position.y=t*-0.0002
  camera.position.z=t*-0.0002
  
}
document.body.onscroll=moveCamera

function animate(){
  requestAnimationFrame(animate)
  moon .rotation.x+=0.01
  moon.rotation.y+=0.005
  moon.rotation.z+=0.01
  renderer.render(scene,camera)
  renderer.update()

}
animate()









