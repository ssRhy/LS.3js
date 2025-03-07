import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryPages.css";

const MemoryChainPage = () => {
  const [allMemories, setAllMemories] = useState([]);
  const [filter, setFilter] = useState("all"); // all, love, family, pet
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // 从本地存储加载所有记忆
  useEffect(() => {
    const loadMemories = () => {
      const loveMemories = JSON.parse(
        localStorage.getItem("loveMemories") || "[]"
      ).map((memory) => ({ ...memory, type: "love" }));
      const familyMemories = JSON.parse(
        localStorage.getItem("familyMemories") || "[]"
      ).map((memory) => ({ ...memory, type: "family" }));
      const petMemories = JSON.parse(
        localStorage.getItem("petMemories") || "[]"
      ).map((memory) => ({ ...memory, type: "pet" }));

      const combined = [
        ...loveMemories,
        ...familyMemories,
        ...petMemories,
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      // 收集所有可用的标签
      const tags = new Set();
      combined.forEach((memory) => {
        if (memory.tags) {
          memory.tags.forEach((tag) => tags.add(tag));
        }
      });
      setAvailableTags(Array.from(tags));
      setAllMemories(combined);
    };

    loadMemories();
  }, []);

  // 过滤记忆
  const filteredMemories = allMemories.filter((memory) => {
    const matchesType = filter === "all" || memory.type === filter;
    const matchesSearch =
      searchTerm === "" ||
      memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      (memory.tags && selectedTags.every((tag) => memory.tags.includes(tag)));
    return matchesType && matchesSearch && matchesTags;
  });

  // 渲染记忆卡片
  const renderMemoryCard = (memory) => {
    const getTypeIcon = (type) => {
      switch (type) {
        case "love":
          return "💕";
        case "family":
          return "👨‍👩‍👧‍👦";
        case "pet":
          return "🐾";
        default:
          return "📝";
      }
    };

    const getTypeLabel = (type) => {
      switch (type) {
        case "love":
          return "爱情记忆";
        case "family":
          return "家庭记忆";
        case "pet":
          return "宠物记忆";
        default:
          return "其他记忆";
      }
    };

    return (
      <div className="memory-card">
        <div className="memory-card-header">
          <div className="memory-type">
            <span className="type-icon">{getTypeIcon(memory.type)}</span>
            <span className="type-label">{getTypeLabel(memory.type)}</span>
          </div>
          <h3>{memory.title}</h3>
          <div className="memory-meta-info">
            <span className="memory-date">{memory.date}</span>
            {memory.person && (
              <span className="memory-person">
                {memory.person}
                {memory.relationship && ` (${memory.relationship})`}
              </span>
            )}
            {memory.isAnonymous && (
              <span className="anonymous-badge">{memory.authorId}</span>
            )}
          </div>
        </div>

        <p className="memory-text">{memory.content}</p>

        {memory.tags && memory.tags.length > 0 && (
          <div className="memory-tags">
            {memory.tags.map((tag, index) => (
              <span
                key={index}
                className="memory-tag"
                onClick={() => {
                  if (!selectedTags.includes(tag)) {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {memory.images && memory.images.length > 0 && (
          <div className="memory-images">
            {memory.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="记忆照片"
                className="memory-image"
                onClick={() => window.open(image, "_blank")}
              />
            ))}
          </div>
        )}

        {memory.videoUrl && (
          <div className="memory-video">
            <iframe
              src={
                memory.videoUrl.includes("youtube.com")
                  ? memory.videoUrl.replace("watch?v=", "embed/")
                  : memory.videoUrl
              }
              title="Embedded video"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="memory-actions">
          <div className="memory-stats">
            <span className="likes">❤️ {memory.likes || 0}</span>
            <span className="comments">💬 {memory.comments?.length || 0}</span>
          </div>
          <Link
            to={`/${memory.type}-star`}
            className="view-source"
            title="查看来源"
          >
            查看原始记忆
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="memory-page memory-chain-page">
      <div className="memory-header">
        <h1>我的记忆星链</h1>
        <p className="memory-subtitle">
          在这里，所有珍贵的记忆汇聚成璀璨的星河，编织成永恒的回忆之链
        </p>
      </div>

      <div className="memory-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="搜索记忆..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-button ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            全部记忆
          </button>
          <button
            className={`filter-button love ${
              filter === "love" ? "active" : ""
            }`}
            onClick={() => setFilter("love")}
          >
            💕 爱情记忆
          </button>
          <button
            className={`filter-button family ${
              filter === "family" ? "active" : ""
            }`}
            onClick={() => setFilter("family")}
          >
            👨‍👩‍👧‍👦 家庭记忆
          </button>
          <button
            className={`filter-button pet ${filter === "pet" ? "active" : ""}`}
            onClick={() => setFilter("pet")}
          >
            🐾 宠物记忆
          </button>
        </div>

        {availableTags.length > 0 && (
          <div className="tag-filters">
            <div className="selected-tags">
              {selectedTags.map((tag, index) => (
                <span key={index} className="selected-tag">
                  {tag}
                  <button
                    className="remove-tag"
                    onClick={() =>
                      setSelectedTags(selectedTags.filter((t) => t !== tag))
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="available-tags">
              {availableTags
                .filter((tag) => !selectedTags.includes(tag))
                .map((tag, index) => (
                  <span
                    key={index}
                    className="available-tag"
                    onClick={() => setSelectedTags([...selectedTags, tag])}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="memories-timeline">
        <div className="timeline-statistics">
          <div className="stat-item">
            <span className="stat-number">{allMemories.length}</span>
            <span className="stat-label">总记忆数</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {allMemories.filter((m) => m.type === "love").length}
            </span>
            <span className="stat-label">爱情记忆</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {allMemories.filter((m) => m.type === "family").length}
            </span>
            <span className="stat-label">家庭记忆</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {allMemories.filter((m) => m.type === "pet").length}
            </span>
            <span className="stat-label">宠物记忆</span>
          </div>
        </div>

        {filteredMemories.length === 0 ? (
          <p className="no-memories">
            {searchTerm || selectedTags.length > 0
              ? "没有找到匹配的记忆..."
              : "还没有记录任何记忆，开始在各个星球创建你的第一段记忆吧..."}
          </p>
        ) : (
          <div className="timeline-memories">
            {filteredMemories.map((memory) => (
              <div key={memory.id} className="timeline-memory">
                <div className="memory-date-indicator">
                  <div className="date-bubble">
                    {new Date(memory.date).toLocaleDateString()}
                  </div>
                  <div className="date-line"></div>
                </div>
                {renderMemoryCard(memory)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="memory-footer">
        <Link to="/" className="back-button">
          返回星空
        </Link>
      </div>
    </div>
  );
};

export default MemoryChainPage;
