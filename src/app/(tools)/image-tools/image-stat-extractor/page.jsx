// // app/page.tsx
// 'use client';
// import { useState, useRef } from 'react';

// export default function Home() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [extractedImage, setExtractedImage] = useState(null);
//   const [stats,setStats]=useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
//   const imageRef = useRef(null);

//   const handleImageChange = (event) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const file = event.target.files[0];
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setSelectedImage(reader.result);
//         setExtractedImage(null);
//         setStats(null);
//         setError(null);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleExtract = async () => {
//     if (!selectedImage) {
//       setError('Please select an image.');
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     setExtractedImage(null);
//     setStats(null);

//     const formData = new FormData();
//     const base64Image = selectedImage.split(',')[1];
//     const byteCharacters = atob(base64Image);
//     const byteArrays = [];
//     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//       const slice = byteCharacters.slice(offset, offset + 512);
//       const byteNumbers = new Array(slice.length);
//       for (let i = 0; i < slice.length; i++) {
//         byteNumbers[i] = slice.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);
//       byteArrays.push(byteArray);
//     }
//     const blob = new Blob(byteArrays, { type: 'image/jpeg' });
//     formData.append('image', blob);
//     formData.append('x', cropArea.x.toString());
//     formData.append('y', cropArea.y.toString());
//     formData.append('width', cropArea.width.toString());
//     formData.append('height', cropArea.height.toString());

//     try {
//       const response = await fetch('/api/imageStat', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to extract image');
//       }
//       const res = await response.json();
//       setExtractedImage(`data:image/png;base64,${res.image}`);
//       setStats(res.stats);
//     } catch (err) {
//       console.error('Extraction error:', err);
//       setError(err.message || 'An error occurred during extraction.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMouseMove = (e) => {
//     if (!imageRef.current) return;
//     const rect = imageRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     setCropArea({ ...cropArea, x, y });
//   };

//   const handleSizeChange = (e) => {
//     setCropArea({ ...cropArea, [e.target.name]: Number(e.target.value) });
//   };

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h1 className="text-2xl font-bold mb-4 text-center">Image Extraction</h1>
//         <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4 w-full border rounded-md p-2" />
//         {selectedImage && (
//           <div className="relative">
//             <img src={selectedImage} alt="Selected" ref={imageRef} onMouseMove={handleMouseMove} className="max-w-full rounded-md" />
//             <div
//               className="absolute border-2 border-red-500"
//               style={{
//                 left: cropArea.x,
//                 top: cropArea.y,
//                 width: cropArea.width,
//                 height: cropArea.height,
//               }}
//             ></div>
//           </div>
//         )}
//         <div className="flex gap-2 mt-4">
//           <input type="number" name="width" value={cropArea.width} onChange={handleSizeChange} className="border rounded p-1 w-1/2" />
//           <input type="number" name="height" value={cropArea.height} onChange={handleSizeChange} className="border rounded p-1 w-1/2" />
//         </div>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <button
//           onClick={handleExtract}
//           disabled={!selectedImage || loading}
//           className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${
//             loading ? 'opacity-50 cursor-not-allowed' : ''
//           }`}
//         >
//           {loading ? 'Extracting...' : 'Extract'}
//         </button>
//         {extractedImage && (
//           <div className="mt-6 text-center">
//             <h2 className="text-lg font-semibold mb-2">Extracted Image:</h2>
//             <img src={extractedImage} alt="Extracted" className="max-w-full rounded-md" />
//             {stats && <pre>{JSON.stringify(stats, null, 2)}</pre>}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }


// app/page.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import StatsDisplay from './_component/StatsDisplay';
import getCroppedImg from './_component/cropImage';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedImage, setExtractedImage] = useState(null);
  const [stats, setStats] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setExtractedImage(null);
        setStats(null);
        setError(null);
        setMetadata(null)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    if (!selectedImage || !croppedAreaPixels) {
      setError('Please select an image and crop it.');
      return;
    }

    setLoading(true);
    setError(null);
    setExtractedImage(null);
    setStats(null);
    setMetadata(null)

    const formData = new FormData();
    const base64Image = selectedImage.split(',')[1];
    const byteCharacters = atob(base64Image);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
    formData.append('image', blob);
    formData.append('x', croppedAreaPixels.x.toString());
    formData.append('y', croppedAreaPixels.y.toString());
    formData.append('width', croppedAreaPixels.width.toString());
    formData.append('height', croppedAreaPixels.height.toString());

    try {
      const response = await fetch('/api/imageStat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract image');
      }
      const res = await response.json();
      setExtractedImage(`data:image/png;base64,${res.image}`);
      setStats(res.stats);
      setMetadata(res.metadata)
    } catch (err) {
      console.error('Extraction error:', err);
      setError(err.message || 'An error occurred during extraction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md ">
        <h1 className="text-2xl font-bold mb-4 text-center">Image Extraction</h1>
        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4 w-full border rounded-md p-2" />
        {selectedImage && (
          <div className="relative h-[300px] w-full">
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleExtract}
          disabled={!selectedImage || loading}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Extracting...' : 'Extract'}
        </button>
        {extractedImage && (
          <div className="mt-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Extracted Image:</h2>
            <img src={extractedImage} alt="Extracted" className="max-w-full rounded-md" />
            {/* {stats && <pre>{JSON.stringify(stats, null, 2)}</pre>} */}
            {stats && <StatsDisplay stats={stats} metadata={metadata} />}
          </div>
        )}
      </div>
    </main>
  );
}