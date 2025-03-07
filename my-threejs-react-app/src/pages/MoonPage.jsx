import React from "react";
import { Link } from "react-router-dom";

const MoonPage = () => {
  return (
    <div className="planet-page moon-page">
      <h1>月球</h1>
      <div className="planet-content">
        <p>
          月球是地球唯一的天然卫星，也是太阳系中第五大的卫星。它的存在影响着地球的潮汐和气候。
        </p>
        {/* 这里可以添加更多月球相关的内容 */}
      </div>
      <Link to="/" className="back-button">
        返回星空
      </Link>
    </div>
  );
};

export default MoonPage;
