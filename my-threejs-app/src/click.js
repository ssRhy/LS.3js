import * as THREE from "three";

class PlanetClickHandler {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 绑定方法到实例
    this.onMouseClick = this.onMouseClick.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  // 初始化点击事件
  init() {
    window.addEventListener("click", this.onMouseClick);
  }

  // 移除点击事件（如果需要清理的话）
  destroy() {
    window.removeEventListener("click", this.onMouseClick);
  }

  // 处理点击事件
  onMouseClick(event) {
    // 计算鼠标在归一化设备坐标中的位置
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 更新射线检测器
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 获取射线和物体的交点
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;

      // 根据点击的对象显示不同的弹窗内容
      if (clickedObject.userData.name) {
        this.showModal(
          clickedObject.userData.name,
          clickedObject.userData.description
        );
      }
    }
  }

  // 创建和显示弹窗
  showModal(title, content) {
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
}

export default PlanetClickHandler;
