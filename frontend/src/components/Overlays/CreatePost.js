import React, { useRef, useState } from 'react';
import './CreatePost.css';

const CreatePost = ({ setShowCreatePost }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="create-post-overlay">
      <div className="create-post">
        <div className="header">
          <h3>Create new post</h3>
          <button className="close-btn" onClick={() => setShowCreatePost(false)}>X</button>
        </div>
        <div className="content">
          <div className="icon-container">
            <i className="icon">📷</i>
          </div>
          <p>Drag photos and videos here</p>
          <button className="select-btn" onClick={handleFileSelect}>Select from computer</button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
          {selectedImage && (
            <div className="image-preview">
              <img src={selectedImage} alt="Selected" />
            </div>
          )}
        </div>
        <button className='upload-button'>Upload</button>
      </div>
    </div>
  );
};

export default CreatePost;
