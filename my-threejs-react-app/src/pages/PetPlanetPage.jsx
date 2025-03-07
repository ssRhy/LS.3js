import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryPages.css";

const PetPlanetPage = () => {
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petBirthday, setPetBirthday] = useState("");
  const [petMemories, setPetMemories] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [newMemory, setNewMemory] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [images, setImages] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [backgroundStyle, setBackgroundStyle] = useState("starry");
  const fileInputRef = useRef(null);
  const profileInputRef = useRef(null);

  // 添加新记忆
  const addMemory = () => {
    if (newMemory.trim() === "") return;

    const memory = {
      id: Date.now(),
      content: newMemory,
      images: images,
      createdAt: new Date().toISOString(),
    };

    setPetMemories([memory, ...petMemories]);
    setNewMemory("");
    setImages([]);
  };

  // 添加时间轴事件
  const addTimelineEvent = () => {
    if (newEventTitle.trim() === "" || newEventDate.trim() === "") return;

    const event = {
      id: Date.now(),
      title: newEventTitle,
      date: newEventDate,
      description: newEventDescription,
      images: images,
    };

    setTimelineEvents(
      [...timelineEvents].sort((a, b) => new Date(a.date) - new Date(b.date))
    );
    setTimelineEvents((prev) => [...prev, event]);
    setNewEventTitle("");
    setNewEventDate("");
    setNewEventDescription("");
    setImages([]);
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

  // 处理宠物头像上传
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // 删除记忆
  const deleteMemory = (id) => {
    setPetMemories(petMemories.filter((memory) => memory.id !== id));
  };

  // 删除时间轴事件
  const deleteEvent = (id) => {
    setTimelineEvents(timelineEvents.filter((event) => event.id !== id));
  };

  // 切换背景样式
  const toggleBackground = () => {
    const styles = ["starry", "meadow", "sunset"];
    const currentIndex = styles.indexOf(backgroundStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setBackgroundStyle(styles[nextIndex]);
  };

  return (
    <div className={`memory-page pet-memory-page ${backgroundStyle}`}>
      <div className="memory-header">
        <h1>宠物纪念星球</h1>
        <p className="memory-subtitle">
          记录与你相伴的那些温暖时光，它们永远活在你的心里
        </p>
        <button className="toggle-background" onClick={toggleBackground}>
          切换背景
        </button>
      </div>

      <div className="memory-content">
        <div className="pet-profile">
          <div className="profile-image-container">
            {profileImage ? (
              <img
                src={profileImage}
                alt="宠物照片"
                className="pet-profile-image"
              />
            ) : (
              <div
                className="profile-placeholder"
                onClick={() => profileInputRef.current.click()}
              >
                <span>点击添加宠物照片</span>
              </div>
            )}
            <input
              type="file"
              ref={profileInputRef}
              onChange={handleProfileUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
            {profileImage && (
              <button
                className="change-profile"
                onClick={() => profileInputRef.current.click()}
              >
                更换照片
              </button>
            )}
          </div>

          <div className="pet-info">
            <input
              type="text"
              placeholder="宠物名字"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="pet-name-input"
            />
            <div className="pet-details">
              <select
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="pet-type-select"
              >
                <option value="">选择宠物类型</option>
                <option value="dog">狗狗</option>
                <option value="cat">猫咪</option>
                <option value="bird">鸟类</option>
                <option value="fish">鱼类</option>
                <option value="rabbit">兔子</option>
                <option value="other">其他</option>
              </select>
              <input
                type="date"
                placeholder="出生日期"
                value={petBirthday}
                onChange={(e) => setPetBirthday(e.target.value)}
                className="pet-birthday-input"
              />
            </div>
          </div>
        </div>

        <div className="pet-timeline">
          <h2>生命时间轴</h2>
          <div className="timeline-form">
            <input
              type="text"
              placeholder="事件标题 (如: 第一次见面)"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="memory-input"
            />
            <input
              type="date"
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
              className="memory-input"
            />
            <textarea
              placeholder="事件描述..."
              value={newEventDescription}
              onChange={(e) => setNewEventDescription(e.target.value)}
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

            <button className="add-memory-button" onClick={addTimelineEvent}>
              添加到时间轴
            </button>
          </div>

          {timelineEvents.length > 0 && (
            <div className="timeline-container">
              {timelineEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`timeline-event ${
                    index % 2 === 0 ? "left" : "right"
                  }`}
                >
                  <div className="timeline-event-content">
                    <div className="event-header">
                      <h3>{event.title}</h3>
                      <span className="event-date">{event.date}</span>
                      <button
                        className="delete-event"
                        onClick={() => deleteEvent(event.id)}
                      >
                        删除
                      </button>
                    </div>
                    <p>{event.description}</p>
                    {event.images.length > 0 && (
                      <div className="event-images">
                        {event.images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt="事件照片"
                            className="event-image"
                            onClick={() => window.open(image, "_blank")}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="memory-form">
          <h2>记录新的回忆</h2>
          <textarea
            placeholder={`写下关于${petName || "它"}的回忆...`}
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
            保存这段回忆
          </button>
        </div>

        <div className="memories-container">
          <h2>记忆档案</h2>
          {petMemories.length === 0 ? (
            <p className="no-memories">
              还没有记录，开始添加你的第一段回忆吧...
            </p>
          ) : (
            <div className="memory-cards">
              {petMemories.map((memory) => (
                <div key={memory.id} className="memory-card">
                  <div className="memory-card-header">
                    <span className="memory-date">
                      {new Date(memory.createdAt).toLocaleDateString()}
                    </span>
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
        <div className="pet-decorations">
          <span className="paw-print">🐾</span>
          <span className="bone">🦴</span>
          <span className="paw-print">🐾</span>
        </div>
        <Link to="/" className="back-button">
          返回星空
        </Link>
      </div>
    </div>
  );
};

export default PetPlanetPage;
