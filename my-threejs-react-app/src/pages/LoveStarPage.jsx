import React from "react";
import { Link } from "react-router-dom";

const LoveStarPage = () => {
  return (
    <div className="planet-page love-star-page">
      <h1>爱情star</h1>
      <div className="planet-content">
        <p>
          怀念爱情，像一首悠扬的旋律，曾经的甜蜜与悸动铭刻在心。那些并肩走过的日子，如今化作温柔的回忆。即使时光远去，那份真挚的情感，依然在心底悄然绽放。
        </p>
        {/* 这里可以添加更多爱情star相关的内容 */}
      </div>
      <Link to="/" className="back-button">
        返回星空
      </Link>
    </div>
  );
};

export default LoveStarPage;
