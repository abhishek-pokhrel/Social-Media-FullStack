import React, { useRef, useState } from 'react';
import './CreatePost.css';

const CreatePost = ({ setShowCreatePost, userId }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
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

  const handleUpload = async () => {
    if (!selectedImage) {
      alert('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('images', fileInputRef.current.files[0]);
    formData.append('caption', caption);

    try {
      const response = await fetch(`http://localhost:5000/api/post/create/${userId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include credentials in the request
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Post created successfully:', data);
        setShowCreatePost(false);
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="create-post-overlay">
      <div className="create-post">
        <div className="header">
          <h3>Create new post</h3>
          <button className="close-btn" onClick={() => setShowCreatePost(false)}>X</button>
        </div>
        <div className="createpost-content">
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
            <div className="createpost-image-preview">
              <img src={selectedImage} alt="Selected" />
            </div>
          )}
          <textarea
            className="caption-input"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <button className='upload-button' onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
};

export default CreatePost;
