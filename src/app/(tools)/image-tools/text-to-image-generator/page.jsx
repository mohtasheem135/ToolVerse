'use client';
import { useState } from 'react';

export default function TextToImage() {
  const [text, setText] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateImage = async () => {
    if (!text) {
      setError('Please enter some text.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/textToImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setGeneratedImage(url);
    } catch (err) {
      console.error('Image generation error:', err);
      setError(err.message || 'An error occurred during image generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Text to Image</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here"
          className="mb-4 w-full border rounded-md p-2 h-24 resize-y" //Added resize for textarea
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleGenerateImage}
          disabled={!text || loading}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>

        {generatedImage && (
          <div className="mt-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Generated Image:</h2>
            <img src={generatedImage} alt="Generated Text" className="max-w-full rounded-md" />
            <a href={generatedImage} download="text_image.png" className="mt-2 text-blue-500 underline">Download</a>
          </div>
        )}
      </div>
    </main>
  );
}