'use client'
import React, { useState } from 'react';
import axios from 'axios';

const UploadImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('post_id', '2'); 

        const response = await axios.post('/api/posting', formData);

        console.log('Image uploaded:', response.data.message);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {selectedImage && (
        <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
      )}
    </div>
  );
};

export default UploadImage;
