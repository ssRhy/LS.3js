import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryPages.css";
import {
  generateAnonymousId,
  filterContent,
  isContentAppropriate,
} from "../utils/anonymousUtils";

const FamilyStarPage = () => {
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [person, setPerson] = useState("");
  const [relationship, setRelationship] = useState("");
  const [images, setImages] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRelation, setNewMemberRelation] = useState("");
  const [newMemberPhoto, setNewMemberPhoto] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [videoUrl, setVideoUrl] = useState("");
  const [memorialName, setMemorialName] = useState("");
  const [memorialDescription, setMemorialDescription] = useState("");
  const [tombstoneStyle, setTombstoneStyle] = useState("family");
  const [isEditingTombstone, setIsEditingTombstone] = useState(false);
  const [showTombstoneDesigner, setShowTombstoneDesigner] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonymousId, setAnonymousId] = useState("");
  const [publishStatus, setPublishStatus] = useState("private");
  const [contentWarning, setContentWarning] = useState("");
  const fileInputRef = useRef(null);
  const memberPhotoRef = useRef(null);
  const videoInputRef = useRef(null);
  const contentRef = useRef(null);

  // 从本地存储加载数据
  useEffect(() => {
    const savedMemories = localStorage.getItem("familyMemories");
    const savedFamilyMembers = localStorage.getItem("familyMembers");
    const savedTombstoneData = localStorage.getItem("familyTombstone");
    const savedAnonymousId = localStorage.getItem("familyAnonymousId");

    if (savedMemories) {
      setMemories(JSON.parse(savedMemories));
    }

    if (savedFamilyMembers) {
      setFamilyMembers(JSON.parse(savedFamilyMembers));
    }

    if (savedTombstoneData) {
      const data = JSON.parse(savedTombstoneData);
      setMemorialName(data.name || "");
      setMemorialDescription(data.description || "");
      setTombstoneStyle(data.style || "family");
    } else {
      setShowTombstoneDesigner(true);
    }

    if (savedAnonymousId) {
      setAnonymousId(savedAnonymousId);
    }
  }, []);

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem("familyMemories", JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem("familyMembers", JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    const tombstoneData = {
      name: memorialName,
      description: memorialDescription,
      style: tombstoneStyle,
    };
    localStorage.setItem("familyTombstone", JSON.stringify(tombstoneData));
  }, [memorialName, memorialDescription, tombstoneStyle]);

  // 添加新记忆
  const addMemory = () => {
    if (newMemory.trim() === "") return;

    const memory = {
      id: Date.now(),
      title: title || "无标题记忆",
      content: newMemory,
      date: date || new Date().toISOString().split("T")[0],
      person: person,
      relationship: relationship,
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
    setPerson("");
    setRelationship("");
    setImages([]);
    setVideoUrl("");
    setTags([]);
    setPrivacy("private");
  };

  // 添加家庭成员
  const addFamilyMember = () => {
    if (newMemberName.trim() === "") return;

    const member = {
      id: Date.now(),
      name: newMemberName,
      relation: newMemberRelation,
      photo: newMemberPhoto,
      isDeceased: false,
    };

    setFamilyMembers([...familyMembers, member]);
    setNewMemberName("");
    setNewMemberRelation("");
    setNewMemberPhoto("");
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

  // 处理成员照片上传
  const handleMemberPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewMemberPhoto(event.target.result);
    };
    reader.readAsDataURL(file);
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

  // 删除家庭成员
  const deleteFamilyMember = (id) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== id));
  };

  // 标记成员为逝者
  const markAsDeceased = (id) => {
    setFamilyMembers(
      familyMembers.map((member) =>
        member.id === id
          ? { ...member, isDeceased: !member.isDeceased }
          : member
      )
    );
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

  // 根据关系人筛选记忆
  const filterMemoriesByPerson = (personName) => {
    if (!personName) return memories;
    return memories.filter((memory) => memory.person === personName);
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

  // 处理匿名发布
  const handleAnonymousToggle = () => {
    if (!isAnonymous) {
      const newAnonymousId = generateAnonymousId();
      setAnonymousId(newAnonymousId);
      localStorage.setItem("familyAnonymousId", newAnonymousId);
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
      person: person,
      relationship: relationship,
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
    setPerson("");
    setRelationship("");
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

  // 渲染墓碑
  const renderTombstone = () => {
    return (
      <div className={`tombstone ${tombstoneStyle}`}>
        <div className="tombstone-content">
          <h2>{memorialName || "家族记忆"}</h2>
          {memorialDescription && (
            <p className="epitaph">"{memorialDescription}"</p>
          )}
          <div className="deceased-members">
            {familyMembers
              .filter((member) => member.isDeceased)
              .map((member) => (
                <div key={member.id} className="deceased-member">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="deceased-photo"
                    />
                  ) : (
                    <div className="deceased-photo-placeholder">
                      {member.name[0]}
                    </div>
                  )}
                  <div className="deceased-info">
                    <h3>{member.name}</h3>
                    <p>{member.relation}</p>
                  </div>
                </div>
              ))}
          </div>
          <div className="tombstone-actions">
            <button
              className="edit-tombstone-btn"
              onClick={() => setIsEditingTombstone(true)}
            >
              编辑纪念碑
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
        <h2>设计家族纪念碑</h2>
        <div className="designer-form">
          <div className="form-group">
            <label>纪念名称</label>
            <input
              type="text"
              value={memorialName}
              onChange={(e) => setMemorialName(e.target.value)}
              placeholder="例如：张氏家族记忆"
              className="memory-input"
            />
          </div>

          <div className="form-group">
            <label>纪念描述</label>
            <textarea
              value={memorialDescription}
              onChange={(e) => setMemorialDescription(e.target.value)}
              placeholder="写下对家族的寄语..."
              className="memory-textarea"
              maxLength={150}
            />
            <small>{memorialDescription.length}/150 字符</small>
          </div>

          <div className="form-group">
            <label>纪念碑样式</label>
            <div className="tombstone-styles">
              <div
                className={`style-option ${
                  tombstoneStyle === "family" ? "selected" : ""
                }`}
                onClick={() => setTombstoneStyle("family")}
              >
                <div className="style-preview family"></div>
                <span>家族</span>
              </div>

              <div
                className={`style-option ${
                  tombstoneStyle === "tree" ? "selected" : ""
                }`}
                onClick={() => setTombstoneStyle("tree")}
              >
                <div className="style-preview tree"></div>
                <span>家谱树</span>
              </div>

              <div
                className={`style-option ${
                  tombstoneStyle === "book" ? "selected" : ""
                }`}
                onClick={() => setTombstoneStyle("book")}
              >
                <div className="style-preview book"></div>
                <span>纪念册</span>
              </div>
            </div>
          </div>

          <button className="save-tombstone-btn" onClick={saveTombstone}>
            保存纪念碑设计
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
          {memory.person && (
            <span className="memory-person">
              {memory.person}
              {memory.relationship && ` (${memory.relationship})`}
            </span>
          )}
          {memory.isAnonymous ? (
            <span className="anonymous-badge">{memory.authorId}</span>
          ) : (
            <span className="memory-privacy">
              {memory.privacy === "private"
                ? "仅自己可见"
                : memory.privacy === "family"
                ? "仅家人可见"
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

      {memory.tags && memory.tags.length > 0 && (
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
          <h4>评论 ({memory.comments ? memory.comments.length : 0})</h4>
          {memory.comments &&
            memory.comments.map((comment) => (
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

  // 更新记忆表单渲染
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
      <div className="memory-meta">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="memory-input date-input"
        />
        <select
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          className="memory-input person-select"
        >
          <option value="">选择相关人物</option>
          {familyMembers.map((member) => (
            <option key={member.id} value={member.name}>
              {member.name}
            </option>
          ))}
          <option value="全家">全家</option>
        </select>
        {!familyMembers.find((m) => m.name === person) &&
          person &&
          person !== "全家" && (
            <input
              type="text"
              placeholder="关系"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="memory-input relation-input"
            />
          )}
      </div>
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
            placeholder="添加标签 (如: 团聚, 节日)"
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
          <option value="family">仅家人可见</option>
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
    <div className="memory-page family-memory-page">
      <div className="memory-header">
        <h1>亲情记忆星球</h1>
        <p className="memory-subtitle">
          珍藏与家人的温暖回忆，那些爱与陪伴永远不会消逝
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
          <h2>
            记忆时间线
            {person && (
              <span className="filter-tag">
                筛选: {person}
                <button className="clear-filter" onClick={() => setPerson("")}>
                  ×
                </button>
              </span>
            )}
          </h2>
          {filterMemoriesByPerson(person).length === 0 ? (
            <p className="no-memories">
              还没有记录，开始添加你的第一段记忆吧...
            </p>
          ) : (
            <div className="timeline-memories">
              {filterMemoriesByPerson(person).map((memory) => (
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

export default FamilyStarPage;
