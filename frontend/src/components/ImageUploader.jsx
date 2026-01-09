import React, { useState } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onUpload, loading = false }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('notes', notes);

    onUpload(formData);
  };

  return (
    <div className="image-uploader">
      <h2>Upload Medical Image</h2>

      <div className="upload-container">
        <div className="upload-zone">
          <input
            type="file"
            id="file-input"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileChange}
            disabled={loading}
            className="file-input"
          />
          <label htmlFor="file-input" className="upload-label">
            <div className="upload-icon">⬆</div>
            <div className="upload-text">
              {selectedFile ? (
                <span>{selectedFile.name}</span>
              ) : (
                <>
                  <span className="main-text">Click to upload medical image</span>
                  <span className="sub-text">or drag and drop (JPEG, PNG)</span>
                </>
              )}
            </div>
          </label>
        </div>

        {preview && (
          <div className="preview-container">
            <h3>Preview</h3>
            <img src={preview} alt="Preview" className="preview-image" />
          </div>
        )}
      </div>

      <div className="notes-section">
        <label htmlFor="notes">Patient Notes (Optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional patient notes or observations..."
          disabled={loading}
          className="notes-textarea"
          rows="4"
        />
      </div>

      <button onClick={handleUpload} disabled={!selectedFile || loading} className="upload-button">
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default ImageUploader;
