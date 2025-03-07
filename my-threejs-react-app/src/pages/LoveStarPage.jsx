import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryPages.css";

const LoveStarPage = () => {
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  // 添加新记忆
  const addMemory = () => {
    if (newMemory.trim() === "") return;

    const memory = {
      id: Date.now(),
      title: title || "无标题记忆",
      content: newMemory,
      date: date || new Date().toISOString().split("T")[0],
      images: images,
      createdAt: new Date().toISOString(),
    };

    setMemories([memory, ...memories]);
    setNewMemory("");
    setTitle("");
    setDate("");
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

  // 删除记忆
  const deleteMemory = (id) => {
    setMemories(memories.filter((memory) => memory.id !== id));
  };

  return (
    <div className="memory-page love-memory-page">
      <div className="memory-header">
        <h1>爱情记忆星球</h1>
        <p className="memory-subtitle">
          在这里珍藏那些曾经的美好，即使逝去，依然温暖人心
        </p>
      </div>

      <div className="memory-content">
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
          <h2>记忆档案</h2>
          {memories.length === 0 ? (
            <p className="no-memories">
              还没有记录，开始添加你的第一段记忆吧...
            </p>
          ) : (
            <div className="memory-cards">
              {memories.map((memory) => (
                <div key={memory.id} className="memory-card">
                  <div className="memory-card-header">
                    <h3>{memory.title}</h3>
                    <span className="memory-date">{memory.date}</span>
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

export default LoveStarPage;
