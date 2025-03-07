import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryPages.css";
import {
  generateAnonymousId,
  filterContent,
  isContentAppropriate,
} from "../utils/anonymousUtils";

const LoveStarPage = () => {
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [videoUrl, setVideoUrl] = useState("");
  const [lovedOneName, setLovedOneName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [epitaph, setEpitaph] = useState("");
  const [tombstoneStyle, setTombstoneStyle] = useState("classic");
  const [isEditingTombstone, setIsEditingTombstone] = useState(false);
  const [showTombstoneDesigner, setShowTombstoneDesigner] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonymousId, setAnonymousId] = useState("");
  const [publishStatus, setPublishStatus] = useState("private"); // private, pending, published
  const [contentWarning, setContentWarning] = useState("");
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const contentRef = useRef(null);

  // 从本地存储加载数据
  useEffect(() => {
    const savedMemories = localStorage.getItem("loveMemories");
    const savedTombstoneData = localStorage.getItem("loveTombstone");

    if (savedMemories) {
      setMemories(JSON.parse(savedMemories));
    }

    if (savedTombstoneData) {
      const data = JSON.parse(savedTombstoneData);
      setLovedOneName(data.name || "");
      setRelationship(data.relationship || "");
      setBirthDate(data.birthDate || "");
      setDepartureDate(data.departureDate || "");
      setEpitaph(data.epitaph || "");
      setTombstoneStyle(data.style || "classic");
    } else {
      setShowTombstoneDesigner(true);
    }

    const savedAnonymousId = localStorage.getItem("loveAnonymousId");
    if (savedAnonymousId) {
      setAnonymousId(savedAnonymousId);
    }
  }, []);

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem("loveMemories", JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    const tombstoneData = {
      name: lovedOneName,
      relationship: relationship,
      birthDate: birthDate,
      departureDate: departureDate,
      epitaph: epitaph,
      style: tombstoneStyle,
    };
    localStorage.setItem("loveTombstone", JSON.stringify(tombstoneData));
  }, [
    lovedOneName,
    relationship,
    birthDate,
    departureDate,
    epitaph,
    tombstoneStyle,
  ]);

  // 处理匿名发布
  const handleAnonymousToggle = () => {
    if (!isAnonymous) {
      const newAnonymousId = generateAnonymousId();
      setAnonymousId(newAnonymousId);
      localStorage.setItem("loveAnonymousId", newAnonymousId);
    }
    setIsAnonymous(!isAnonymous);
  };

  // 发布内容
  const publishContent = () => {
    // 内容审核
    if (!isContentAppropriate(newMemory)) {
      setContentWarning("内容不符合发布规范，请检查后重试");
      return;
    }

    const filteredMemory = filterContent(newMemory);
    const memory = {
      id: Date.now(),
      title: title || "无标题记忆",
      content: filteredMemory,
      date: date || new Date().toISOString().split("T")[0],
      images: images,
      videoUrl: videoUrl,
      tags: tags,
      privacy: isAnonymous ? "public" : privacy,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      isAnonymous: isAnonymous,
      authorId: isAnonymous ? anonymousId : "user",
    };

    setMemories([memory, ...memories]);
    setPublishStatus("published");

    // 重置表单
    setNewMemory("");
    setTitle("");
    setDate("");
    setImages([]);
    setVideoUrl("");
    setTags([]);
    setPrivacy("private");
    setContentWarning("");
  };

  // 添加匿名评论
  const addAnonymousComment = (memoryId, comment) => {
    if (!comment.trim()) return;

    const commentAnonymousId = generateAnonymousId();
    setMemories(
      memories.map((memory) => {
        if (memory.id === memoryId) {
          return {
            ...memory,
            comments: [
              ...memory.comments,
              {
                id: Date.now(),
                text: filterContent(comment),
                date: new Date().toISOString(),
                isAnonymous: true,
                authorId: commentAnonymousId,
              },
            ],
          };
        }
        return memory;
      })
    );
  };

  // 添加新记忆
  const addMemory = () => {
    if (newMemory.trim() === "") return;

    const memory = {
      id: Date.now(),
      title: title || "无标题记忆",
      content: newMemory,
      date: date || new Date().toISOString().split("T")[0],
      images: images,
      videoUrl: videoUrl,
      tags: tags,
      privacy: privacy,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    setMemories([memory, ...memories]);
    setNewMemory("");
    setTitle("");
    setDate("");
    setImages([]);
    setVideoUrl("");
    setTags([]);
    setPrivacy("private");
  };

  // 处理图片上传
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 处理视频链接
  const handleVideoInput = (e) => {
    setVideoUrl(e.target.value);
  };

  // 添加标签
  const addTag = () => {
    if (newTag.trim() === "") return;
    if (tags.includes(newTag.trim())) return;

    setTags([...tags, newTag.trim()]);
    setNewTag("");
  };

  // 删除标签
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 删除记忆
  const deleteMemory = (id) => {
    setMemories(memories.filter((memory) => memory.id !== id));
  };

  // 点赞功能
  const likeMemory = (id) => {
    setMemories(
      memories.map((memory) =>
        memory.id === id ? { ...memory, likes: memory.likes + 1 } : memory
      )
    );
  };

  // 添加评论
  const addComment = (id, comment) => {
    if (!comment.trim()) return;

    setMemories(
      memories.map((memory) => {
        if (memory.id === id) {
          return {
            ...memory,
            comments: [
              ...memory.comments,
              {
                id: Date.now(),
                text: comment,
                date: new Date().toISOString(),
              },
            ],
          };
        }
        return memory;
      })
    );
  };

  // 保存墓碑设计
  const saveTombstone = () => {
    setIsEditingTombstone(false);
    setShowTombstoneDesigner(false);
  };

  // 扩展为专页
  const expandPage = () => {
    setIsExpanded(true);
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 渲染墓碑
  const renderTombstone = () => {
    return (
      <div className={`tombstone ${tombstoneStyle}`}>
        <div className="tombstone-content">
          <h2>{lovedOneName || "逝去的爱情"}</h2>
          {relationship && <p className="relationship">{relationship}</p>}
          <div className="dates">
            {birthDate && <span>{birthDate}</span>}
            {birthDate && departureDate && <span> - </span>}
            {departureDate && <span>{departureDate}</span>}
          </div>
          {epitaph && <p className="epitaph">"{epitaph}"</p>}
          <div className="tombstone-actions">
            <button
              className="edit-tombstone-btn"
              onClick={() => setIsEditingTombstone(true)}
            >
              编辑墓碑
            </button>
            <button className="expand-page-btn" onClick={expandPage}>
              扩展为专页
            </button>
          </div>
          <div className="anonymous-toggle">
            <label>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={handleAnonymousToggle}
              />
              匿名发布
            </label>
            {isAnonymous && (
              <span className="anonymous-badge">{anonymousId}</span>
            )}
          </div>
          {isAnonymous && (
            <p className="anonymous-info">
              匿名发布后，您的个人信息将被隐藏，内容将以"{anonymousId}
              "的身份显示
            </p>
          )}
        </div>
      </div>
    );
  };

  // 墓碑设计器
  const renderTombstoneDesigner = () => {
    return (
      <div className="tombstone-designer">
        <h2>设计爱情墓碑</h2>
        <div className="designer-form">
          <div className="form-group">
            <label>名字</label>
            <input
              type="text"
              value={lovedOneName}
              onChange={(e) => setLovedOneName(e.target.value)}
              placeholder="逝去的爱情名称"
              className="memory-input"
            />
          </div>

          <div className="form-group">
            <label>关系</label>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="例如：初恋、前任"
              className="memory-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>开始日期</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="memory-input"
              />
            </div>

            <div className="form-group half">
              <label>结束日期</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="memory-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>墓志铭</label>
            <textarea
              value={epitaph}
              onChange={(e) => setEpitaph(e.target.value)}
              placeholder="写下你想铭记的话..."
              className="memory-textarea"
              maxLength={100}
            />
            <small>{epitaph.length}/100 字符</small>
          </div>

          <div className="form-group">
            <label>墓碑样式</label>
            <div className="tombstone-styles">
              <div
                className={`style-option ${
                  tombstoneStyle === "classic" ? "selected" : ""
                }`}
                onClick={() => setTombstoneStyle("classic")}
              >
                <div className="style-preview classic"></div>
                <span>经典</span>
              </div>

              <div
                className={`style-option ${
                  tombstoneStyle === "modern" ? "selected" : ""
                }`}
                onClick={() => setTombstoneStyle("modern")}
              >
                <div className="style-preview modern"></div>
                <span>现代</span>
              </div>

              <div
                className={`style-option ${
                  tombstoneStyle === "heart" ? "selected" : ""
                }`}
                onClick={() => setTombstoneStyle("heart")}
              >
                <div className="style-preview heart"></div>
                <span>心形</span>
              </div>
            </div>
          </div>

          <button className="save-tombstone-btn" onClick={saveTombstone}>
            保存墓碑设计
          </button>
        </div>
      </div>
    );
  };

  // 更新记忆卡片渲染
  const renderMemoryCard = (memory) => (
    <div className="memory-card">
      <div className="memory-card-header">
        <h3>{memory.title}</h3>
        <div className="memory-meta-info">
          <span className="memory-date">{memory.date}</span>
          {memory.isAnonymous ? (
            <span className="anonymous-badge">{memory.authorId}</span>
          ) : (
            <span className="memory-privacy">
              {memory.privacy === "private"
                ? "仅自己可见"
                : memory.privacy === "friends"
                ? "仅好友可见"
                : "公开"}
            </span>
          )}
        </div>
        {!memory.isAnonymous && (
          <button
            className="delete-memory"
            onClick={() => deleteMemory(memory.id)}
          >
            删除
          </button>
        )}
      </div>

      <p className="memory-text">{memory.content}</p>

      {memory.tags.length > 0 && (
        <div className="memory-tags">
          {memory.tags.map((tag, index) => (
            <span key={index} className="memory-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {memory.images.length > 0 && (
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
        <button className="like-button" onClick={() => likeMemory(memory.id)}>
          ❤️ {memory.likes}
        </button>

        <div className="comments-section">
          <h4>评论 ({memory.comments.length})</h4>
          {memory.comments.map((comment) => (
            <div
              key={comment.id}
              className={`comment ${
                comment.isAnonymous ? "anonymous-comment" : ""
              }`}
            >
              {comment.isAnonymous && (
                <div className="comment-author">
                  <span className="anonymous-badge">{comment.authorId}</span>
                </div>
              )}
              <p className="comment-content">{comment.text}</p>
              <span className="comment-date">
                {new Date(comment.date).toLocaleDateString()}
              </span>
            </div>
          ))}

          <div className="add-comment">
            <input
              type="text"
              placeholder="添加匿名评论..."
              className="comment-input"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addAnonymousComment(memory.id, e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // 在记忆表单中添加发布选项
  const renderMemoryForm = () => (
    <div className="memory-form">
      <h2>记录新的回忆</h2>
      <input
        type="text"
        placeholder="给这段记忆起个标题..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="memory-input"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="memory-input"
      />
      <textarea
        placeholder="写下你想记录的回忆..."
        value={newMemory}
        onChange={(e) => setNewMemory(e.target.value)}
        className="memory-textarea"
      />

      <div className="memory-upload">
        <button
          className="upload-button"
          onClick={() => fileInputRef.current.click()}
        >
          上传照片
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          multiple
          accept="image/*"
          style={{ display: "none" }}
        />
        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className="preview-image-container">
              <img src={image} alt="预览" className="preview-image" />
              <button
                className="remove-image"
                onClick={() => setImages(images.filter((_, i) => i !== index))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="video-input">
        <label>添加视频链接 (YouTube, Bilibili等)</label>
        <input
          type="text"
          placeholder="粘贴视频链接..."
          value={videoUrl}
          onChange={handleVideoInput}
          className="memory-input"
        />
      </div>

      <div className="tags-input">
        <label>添加标签</label>
        <div className="tag-form">
          <input
            type="text"
            placeholder="添加标签 (如: 初恋, 告别)"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTag()}
            className="memory-input"
          />
          <button className="add-tag-button" onClick={addTag}>
            添加
          </button>
        </div>
        <div className="tags-list">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button className="remove-tag" onClick={() => removeTag(tag)}>
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="privacy-settings">
        <label>隐私设置</label>
        <select
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
          className="memory-input"
        >
          <option value="private">仅自己可见</option>
          <option value="friends">仅好友可见</option>
          <option value="public">公开</option>
        </select>
      </div>

      <div className="anonymous-toggle">
        <label>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={handleAnonymousToggle}
          />
          匿名发布
        </label>
        {isAnonymous && <span className="anonymous-badge">{anonymousId}</span>}
      </div>

      {contentWarning && <p className="anonymous-warning">{contentWarning}</p>}

      <div className="publish-options">
        <div className="publish-status">
          <span className={`status-icon ${publishStatus}`}></span>
          {publishStatus === "private" && "未发布"}
          {publishStatus === "pending" && "审核中"}
          {publishStatus === "published" && "已发布"}
        </div>
        <button
          className="publish-button"
          onClick={publishContent}
          disabled={publishStatus === "pending"}
        >
          {isAnonymous ? "匿名发布" : "发布"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="memory-page love-memory-page">
      <div className="memory-header">
        <h1>爱情记忆星球</h1>
        <p className="memory-subtitle">
          在这里珍藏那些曾经的美好，即使逝去，依然温暖人心
        </p>
      </div>

      {showTombstoneDesigner || isEditingTombstone
        ? renderTombstoneDesigner()
        : renderTombstone()}

      <div
        ref={contentRef}
        className={`memory-content ${isExpanded ? "expanded" : ""}`}
        style={{
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          visibility: isExpanded ? "visible" : "hidden",
          height: isExpanded ? "auto" : 0,
        }}
      >
        {renderMemoryForm()}

        <div className="memories-timeline">
          <h2>记忆时间线</h2>
          {memories.length === 0 ? (
            <p className="no-memories">
              还没有记录，开始添加你的第一段记忆吧...
            </p>
          ) : (
            <div className="timeline-memories">
              {memories.map((memory) => (
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
      </div>

      <div className="memory-footer">
        <Link to="/" className="back-button">
          返回星空
        </Link>
      </div>
    </div>
  );
};

export default LoveStarPage;
