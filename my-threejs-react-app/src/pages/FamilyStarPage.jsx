import React from "react";
import { Link } from "react-router-dom";

const FamilyStarPage = () => {
  return (
    <div className="planet-page family-star-page">
      <h1>亲情star</h1>
      <div className="planet-content">
        <p>
          怀念亲情，像微风拂过心田，温暖而深远。曾经的关怀与陪伴，化作记忆中的光亮。无论时光如何流转，家人的爱始终如影随形，支撑着我们前行，成为心中最温柔的牵挂。
        </p>
        {/* 这里可以添加更多亲情star相关的内容 */}
      </div>
      <Link to="/" className="back-button">
        返回星空
      </Link>
    </div>
  );
};

export default FamilyStarPage;
