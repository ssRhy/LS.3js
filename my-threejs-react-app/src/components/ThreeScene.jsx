import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { navigateToPlanet } from "../utils/navigation";

const ThreeScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameId = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 存储场景中的对象
  const objectsRef = useRef({
    moon: null,
    purple: null,
    mars: null,
    pink: null,
    stars: [],
  });

  // 存储轨道角度
  const orbitsRef = useRef({
    purpleOrbitAngle: 0,
    marsOrbitAngle: 0,
    pinkOrbitAngle: 0,
  });

  // 添加星星函数 - 移到这里，作为组件的方法
  const addStar = () => {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const starBlue = new THREE.Color(0x4682b4);
    const material = new THREE.MeshStandardMaterial({
      color: starBlue,
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
    objectsRef.current.stars.push(star);
    sceneRef.current.add(star);
  };

  // 初始化场景
  const initialize = () => {
    if (!mountRef.current || isInitialized) return;

    try {
      // 创建场景
      sceneRef.current = new THREE.Scene();

      // 创建相机
      cameraRef.current = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      cameraRef.current.position.setZ(30);

      // 创建渲染器
      rendererRef.current = new THREE.WebGLRenderer({
        canvas: mountRef.current,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });

      // 设置渲染器属性
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);

      // 创建控制器
      controlsRef.current = new OrbitControls(
        cameraRef.current,
        rendererRef.current.domElement
      );

      // 添加光源
      const pointLight = new THREE.PointLight(0xffffff, 2);
      const ambientLight = new THREE.AmbientLight(0xffffff);
      pointLight.position.set(2, 2, 2);
      sceneRef.current.add(pointLight, ambientLight);

      const pointLight2 = new THREE.PointLight(0xffffff, 1);
      pointLight2.position.set(-20, 10, -10);
      sceneRef.current.add(pointLight2);

      // 加载纹理
      const textureLoader = new THREE.TextureLoader();
      const spaceTexture = textureLoader.load("/space.jpg");
      const normalTexture = textureLoader.load("/normal.jpg");
      const moonTexture = textureLoader.load("/moon.jpg");
      const purpleTexture = textureLoader.load("/purple.jpg");
      const marsTexture = textureLoader.load("/mars.jpg");
      const pinkTexture = textureLoader.load("/pink.jpg");

      sceneRef.current.background = spaceTexture;

      // 创建月球
      objectsRef.current.moon = new THREE.Mesh(
        new THREE.SphereGeometry(15, 32, 16),
        new THREE.MeshStandardMaterial({
          map: moonTexture,
          normalMap: normalTexture,
        })
      );
      objectsRef.current.moon.userData = {
        name: "月球",
        description:
          "月球是地球唯一的天然卫星，也是太阳系中第五大的卫星。它的存在影响着地球的潮汐和气候。",
      };
      sceneRef.current.add(objectsRef.current.moon);

      // 创建其他行星
      // Purple planet
      objectsRef.current.purple = new THREE.Mesh(
        new THREE.SphereGeometry(5, 32, 32),
        new THREE.MeshStandardMaterial({
          map: purpleTexture,
          normalMap: normalTexture,
        })
      );
      objectsRef.current.purple.userData = {
        name: "宠物星球",
        description:
          "那是童年的温暖记忆。奇幻的世界、独特的宠物、激烈的对战，让人沉浸其中。曾经的伙伴如今化作回忆，但那份陪伴与快乐，依旧留存在心。",
      };
      objectsRef.current.purple.position.set(-60, 0, 0);
      sceneRef.current.add(objectsRef.current.purple);

      // Mars
      objectsRef.current.mars = new THREE.Mesh(
        new THREE.SphereGeometry(4, 32, 32),
        new THREE.MeshStandardMaterial({
          map: marsTexture,
          normalMap: normalTexture,
        })
      );
      objectsRef.current.mars.userData = {
        name: "亲情star",
        description:
          "怀念亲情，像微风拂过心田，温暖而深远。曾经的关怀与陪伴，化作记忆中的光亮。无论时光如何流转，家人的爱始终如影随形，支撑着我们前行，成为心中最温柔的牵挂。",
      };
      objectsRef.current.mars.position.set(50, 0, 0);
      sceneRef.current.add(objectsRef.current.mars);

      // Pink planet
      objectsRef.current.pink = new THREE.Mesh(
        new THREE.SphereGeometry(8, 32, 32),
        new THREE.MeshStandardMaterial({
          map: pinkTexture,
          normalMap: normalTexture,
        })
      );
      objectsRef.current.pink.userData = {
        name: "爱情star",
        description:
          "这颗独特的粉色星球充满了浪漫的气息，它的表面覆盖着粉色的晶体，在太空中闪烁着柔和的光芒。怀念爱情，像一首悠扬的旋律，曾经的甜蜜与悸动铭刻在心。那些并肩走过的日子，如今化作温柔的回忆。即使时光远去，那份真挚的情感，依然在心底悄然绽放。",
      };
      objectsRef.current.pink.position.set(50, 30, 0);
      sceneRef.current.add(objectsRef.current.pink);

      // 添加星星
      Array(200)
        .fill()
        .forEach(() => addStar());

      // 处理窗口大小变化
      const handleResize = () => {
        if (!cameraRef.current || !rendererRef.current) return;

        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      };

      // 处理点击事件
      const handleClick = (event) => {
        if (!cameraRef.current || !sceneRef.current) return;

        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, cameraRef.current);

        const intersects = raycaster.intersectObjects(
          sceneRef.current.children
        );

        if (intersects.length > 0) {
          const clickedObject = intersects[0].object;
          if (clickedObject.userData.name) {
            showModal(
              clickedObject.userData.name,
              clickedObject.userData.description
            );
          }
        }
      };

      // 显示模态框
      const showModal = (title, content) => {
        const existingModal = document.querySelector(".planet-modal");
        if (existingModal) {
          existingModal.remove();
        }

        const modal = document.createElement("div");
        modal.className = "planet-modal";
        modal.innerHTML = `
          <div class="modal-content">
            <h2>${title}</h2>
            <p>${content}</p>
            <div class="modal-buttons">
              <button class="enter-button">进入星球</button>
              <button class="close-button">关闭</button>
            </div>
          </div>
        `;

        document.body.appendChild(modal);

        // 添加按钮事件监听器
        const enterButton = modal.querySelector(".enter-button");
        const closeButton = modal.querySelector(".close-button");
        const modalContent = modal.querySelector(".modal-content");

        enterButton.addEventListener("click", (e) => {
          e.stopPropagation();
          navigateToPlanet(title);
        });

        closeButton.addEventListener("click", (e) => {
          e.stopPropagation();
          modal.remove();
        });

        // 点击模态框外部关闭
        modal.addEventListener("click", (e) => {
          if (!modalContent.contains(e.target)) {
            modal.remove();
          }
        });

        // 阻止模态框内部点击事件冒泡
        modalContent.addEventListener("click", (e) => {
          e.stopPropagation();
        });
      };

      // 动画循环
      const animate = () => {
        if (!sceneRef.current || !cameraRef.current || !rendererRef.current)
          return;

        animationFrameId.current = requestAnimationFrame(animate);

        // 更新行星自转
        if (objectsRef.current.moon) {
          objectsRef.current.moon.rotation.x += 0.01;
          objectsRef.current.moon.rotation.y += 0.005;
          objectsRef.current.moon.rotation.z += 0.01;
        }

        // 更新其他行星的自转和公转
        ["purple", "mars", "pink"].forEach((planet) => {
          if (objectsRef.current[planet]) {
            // 自转
            objectsRef.current[planet].rotation.x += 0.012;
            objectsRef.current[planet].rotation.y += 0.008;
            objectsRef.current[planet].rotation.z += 0.003;
          }
        });

        // 更新公转
        orbitsRef.current.purpleOrbitAngle += 0.005;
        orbitsRef.current.marsOrbitAngle += 0.003;
        orbitsRef.current.pinkOrbitAngle += 0.008;

        // 更新位置
        if (objectsRef.current.purple) {
          const purpleOrbitRadius = 60;
          objectsRef.current.purple.position.x =
            Math.cos(orbitsRef.current.purpleOrbitAngle) * purpleOrbitRadius;
          objectsRef.current.purple.position.z =
            Math.sin(orbitsRef.current.purpleOrbitAngle) * purpleOrbitRadius;
        }

        if (objectsRef.current.mars) {
          const marsOrbitRadius = 50;
          objectsRef.current.mars.position.x =
            Math.cos(orbitsRef.current.marsOrbitAngle) * marsOrbitRadius;
          objectsRef.current.mars.position.z =
            Math.sin(orbitsRef.current.marsOrbitAngle) * marsOrbitRadius;
        }

        if (objectsRef.current.pink) {
          const pinkOrbitRadius = 40;
          objectsRef.current.pink.position.x =
            Math.cos(orbitsRef.current.pinkOrbitAngle) * pinkOrbitRadius;
          objectsRef.current.pink.position.y =
            15 + Math.sin(orbitsRef.current.pinkOrbitAngle) * 15;
          objectsRef.current.pink.position.z =
            Math.sin(orbitsRef.current.pinkOrbitAngle) * pinkOrbitRadius;
        }

        // 更新星星
        objectsRef.current.stars.forEach((star, i) => {
          star.rotation.x += star.rotationSpeed.x;
          star.rotation.y += star.rotationSpeed.y;
          star.rotation.z += star.rotationSpeed.z;
          const time = Date.now() * 0.001;
          const offset = i * 0.01;
          star.position.x += Math.sin(time + offset) * 0.03;
          star.position.y += Math.cos(time + offset) * 0.03;
          if (star.userData && star.userData.originalColor) {
            const flicker =
              Math.sin(time * star.userData.flickerSpeed) * 0.2 + 0.8;
            star.material.emissiveIntensity = flicker;
          }
        });

        if (controlsRef.current) controlsRef.current.update();
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      };

      // 添加事件监听器
      window.addEventListener("resize", handleResize);
      window.addEventListener("click", handleClick);

      setIsInitialized(true);
      animate();
    } catch (error) {
      console.error("Error initializing scene:", error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initScene = () => {
      if (!mounted) return;

      // 确保 DOM 已加载并且 WebGL 上下文可用
      if (mountRef.current && !isInitialized) {
        try {
          const canvas = mountRef.current;
          const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
          if (gl) {
            requestAnimationFrame(initialize);
          } else {
            console.error("WebGL not supported");
          }
        } catch (error) {
          console.error("Error initializing WebGL:", error);
        }
      }
    };

    if (document.readyState === "complete") {
      initScene();
    } else {
      window.addEventListener("load", initScene);
    }

    return () => {
      mounted = false;

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      // 清理资源
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement) {
          rendererRef.current.domElement.remove();
        }
        rendererRef.current = null;
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => {
                  if (material.map) material.map.dispose();
                  if (material.normalMap) material.normalMap.dispose();
                  material.dispose();
                });
              } else {
                if (object.material.map) object.material.map.dispose();
                if (object.material.normalMap)
                  object.material.normalMap.dispose();
                object.material.dispose();
              }
            }
          }
        });
        sceneRef.current = null;
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }

      // 清除状态
      setIsInitialized(false);
    };
  }, []);

  return (
    <canvas
      ref={mountRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
};

export default ThreeScene;
