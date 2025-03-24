// app/components/ImageUploader.js
'use client';
import { useState } from 'react';

export default function ImageUploader({ onColorsExtracted }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleExtractColors = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/extract-colors', {
        method: 'POST',
        body: formData,
      });

      console.log("RESPONSE ", response)

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(`API Error: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const data = await response.json();
      onColorsExtracted(data.colors, data.cluster);
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Fetch Error:', error);
      alert('Network or processing error occurred.');
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleExtractColors}>Extract Colors</button>
    </div>
  );
}