import React from "react";
import { Link } from "react-router-dom";

const PetPlanetPage = () => {
  return (
    <div className="planet-page pet-planet-page">
      <h1>宠物星球</h1>
      <div className="planet-content">
        <p>
          那是童年的温暖记忆。奇幻的世界、独特的宠物、激烈的对战，让人沉浸其中。曾经的伙伴如今化作回忆，但那份陪伴与快乐，依旧留存在心。
        </p>
        {/* 这里可以添加更多宠物星球相关的内容 */}
      </div>
      <Link to="/" className="back-button">
        返回星空
      </Link>
    </div>
  );
};

export default PetPlanetPage;
