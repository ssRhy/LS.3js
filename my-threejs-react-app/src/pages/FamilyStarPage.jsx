import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryPages.css";

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
  const fileInputRef = useRef(null);
  const memberPhotoRef = useRef(null);

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
      createdAt: new Date().toISOString(),
    };

    setMemories([memory, ...memories]);
    setNewMemory("");
    setTitle("");
    setDate("");
    setPerson("");
    setRelationship("");
    setImages([]);
  };

  // 添加家庭成员
  const addFamilyMember = () => {
    if (newMemberName.trim() === "") return;

    const member = {
      id: Date.now(),
      name: newMemberName,
      relation: newMemberRelation,
      photo: newMemberPhoto,
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

  // 删除记忆
  const deleteMemory = (id) => {
    setMemories(memories.filter((memory) => memory.id !== id));
  };

  // 删除家庭成员
  const deleteFamilyMember = (id) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== id));
  };

  // 根据关系人筛选记忆
  const filterMemoriesByPerson = (personName) => {
    if (!personName) return memories;
    return memories.filter((memory) => memory.person === personName);
  };

  return (
    <div className="memory-page family-memory-page">
      <div className="memory-header">
        <h1>亲情记忆星球</h1>
        <p className="memory-subtitle">
          珍藏与家人的温暖回忆，那些爱与陪伴永远不会消逝
        </p>
      </div>

      <div className="memory-content">
        <div className="family-members-section">
          <h2>家庭成员</h2>
          <div className="family-member-form">
            <div className="member-photo-container">
              {newMemberPhoto ? (
                <img
                  src={newMemberPhoto}
                  alt="成员照片"
                  className="member-photo-preview"
                />
              ) : (
                <div
                  className="member-photo-placeholder"
                  onClick={() => memberPhotoRef.current.click()}
                >
                  <span>添加照片</span>
                </div>
              )}
              <input
                type="file"
                ref={memberPhotoRef}
                onChange={handleMemberPhotoUpload}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            <div className="member-info-inputs">
              <input
                type="text"
                placeholder="成员姓名"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="memory-input"
              />
              <input
                type="text"
                placeholder="关系 (如: 父亲、母亲、兄弟)"
                value={newMemberRelation}
                onChange={(e) => setNewMemberRelation(e.target.value)}
                className="memory-input"
              />
              <button className="add-member-button" onClick={addFamilyMember}>
                添加成员
              </button>
            </div>
          </div>

          <div className="family-members-gallery">
            {familyMembers.length === 0 ? (
              <p className="no-members">还没有添加家庭成员</p>
            ) : (
              <div className="members-container">
                {familyMembers.map((member) => (
                  <div key={member.id} className="family-member-card">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="member-photo"
                      />
                    ) : (
                      <div className="member-photo-placeholder small">
                        <span>{member.name[0]}</span>
                      </div>
                    )}
                    <div className="member-info">
                      <h3>{member.name}</h3>
                      <p>{member.relation}</p>
                    </div>
                    <div className="member-actions">
                      <button
                        className="filter-memories"
                        onClick={() => setPerson(member.name)}
                      >
                        查看相关记忆
                      </button>
                      <button
                        className="delete-member"
                        onClick={() => deleteFamilyMember(member.id)}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== index))
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="add-memory-button" onClick={addMemory}>
            保存这段记忆
          </button>
        </div>

        <div className="memories-container">
          <h2>
            记忆档案
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
            <div className="memory-cards">
              {filterMemoriesByPerson(person).map((memory) => (
                <div key={memory.id} className="memory-card">
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
                    </div>
                    <button
                      className="delete-memory"
                      onClick={() => deleteMemory(memory.id)}
                    >
                      删除
                    </button>
                  </div>
                  <p className="memory-text">{memory.content}</p>
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
