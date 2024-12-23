"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";
import StatsDisplay from "./_component/StatsDisplay";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, PlusIcon, Trash2 } from "lucide-react";

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
  const [fileName, setFileName] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileName(file?.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setExtractedImage(null);
        setStats(null);
        setError(null);
        setMetadata(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    if (!selectedImage || !croppedAreaPixels) {
      setError("Please select an image and crop it.");
      return;
    }

    setLoading(true);
    setError(null);
    setExtractedImage(null);
    setStats(null);
    setMetadata(null);

    const formData = new FormData();
    const base64Image = selectedImage.split(",")[1];
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
    const blob = new Blob(byteArrays, { type: "image/jpeg" });
    formData.append("image", blob);
    formData.append("x", croppedAreaPixels.x.toString());
    formData.append("y", croppedAreaPixels.y.toString());
    formData.append("width", croppedAreaPixels.width.toString());
    formData.append("height", croppedAreaPixels.height.toString());

    try {
      const response = await fetch("/api/imageStat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to extract image");
      }
      const res = await response.json();
      setExtractedImage(`data:image/png;base64,${res.image}`);
      setStats(res.stats);
      setMetadata(res.metadata);
    } catch (err) {
      console.error("Extraction error:", err);
      setError(err.message || "An error occurred during extraction.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete (reset state)
  const handleDelete = () => {
    // setSelectedImage(null);
    setSelectedImage(null);
    setExtractedImage(null);
    setError(null);
  };

  // Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.add("border-indigo-500", "border-dashed");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove("border-indigo-500", "border-dashed");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      // setFile(droppedFile);
      setSelectedImage(image);
      setConvertedImage(null);
      setError(null);

      const url = URL.createObjectURL(image);
      //   setImageUrl(url);

      const img = new Image();
      img.src = url;
    }
    e.target.classList.remove("border-indigo-500", "border-dashed");
  };

  return (
    // <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
    //   <div className="bg-white p-8 rounded-lg shadow-md ">
    //     <h1 className="text-2xl font-bold mb-4 text-center">Image Extraction</h1>
    //     <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4 w-full border rounded-md p-2" />
    //     {selectedImage && (
    // <div className="relative h-[300px] w-full">
    //   <Cropper
    //     image={selectedImage}
    //     crop={crop}
    //     zoom={zoom}
    //     aspect={1}
    //     onCropChange={setCrop}
    //     onZoomChange={setZoom}
    //     onCropComplete={onCropComplete}
    //   />
    // </div>
    //     )}
    // {error && <p className="text-red-500 mb-4">{error}</p>}
    // <button
    //   onClick={handleExtract}
    //   disabled={!selectedImage || loading}
    //   className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${
    //     loading ? 'opacity-50 cursor-not-allowed' : ''
    //   }`}
    // >
    //   {loading ? 'Extracting...' : 'Extract'}
    // </button>
    //     {extractedImage && (
    //       <div className="mt-6 text-center">
    //         <h2 className="text-lg font-semibold mb-2">Extracted Image:</h2>
    //         <img src={extractedImage} alt="Extracted" className="max-w-full rounded-md" />
    //         {/* {stats && <pre>{JSON.stringify(stats, null, 2)}</pre>} */}
    //         {stats && <StatsDisplay stats={stats} metadata={metadata} />}
    //       </div>
    //     )}
    //   </div>
    // </main>
    <div className="w-[100%] p-2">
      <Card className="flex flex-col items-center bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Image Stat Extractor
          </CardTitle>
        </CardHeader>
        <div className=" md:flex justify-between w-full h-full">
          <div className="md:w-[70%] p-2 h-[480px]">
            <Card className="p-2 h-full">
              <div className="flex justify-start">
                {!selectedImage && !extractedImage && (
                  <div
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="border-dashed border-2 border-gray-400 rounded-md w-full h-[450px] flex flex-col justify-center items-center"
                  >
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />

                    <PlusIcon size={64} className="text-gray-500 mb-4" />
                    <p className="text-lg text-gray-700 px-10 text-center">
                      Drag and drop an image or click to select
                    </p>
                  </div>
                )}
                {selectedImage && (
                  <button
                    onClick={handleDelete}
                    className=" bg-red-500 hover:bg-red-700 text-white py-2 px-2 -mt-[55px] -ml-[] rounded-full absolute "
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
              {selectedImage && !extractedImage && (
                // <div className="h-[400px]">
                //   <img
                //     src={selectedImage}
                //     alt="Uploaded"
                //     className="w-full h-full"
                //     style={{
                //       objectFit: "contain",
                //     }}
                //   />
                // </div>
                <div className="relative h-[400px] w-full">
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

              {extractedImage && (
                <>
                  <div className="flex flex-col justify-start items-end">
                    <a
                      href={extractedImage}
                      download={`${fileName}_processed_image_ToolVerse.png`}
                      className="absolute no-underline -mt-[55px] text-white px-2 py-2 shadow-md bg-[#000099] rounded-full"
                    >
                      <Download />
                    </a>
                  </div>
                  <div className="h-[400px] flex justify-center items-center border-0 border-black">
                    <img
                      src={extractedImage}
                      alt="Converted"
                      className="w-full rounded-md h-full"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </>
              )}
            </Card>
          </div>
          <div className="md:w-[30%] p-2">
            <Card className="w-full p-2">
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button
                onClick={handleExtract}
                disabled={!selectedImage || loading}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Extracting..." : "Extract"}
              </button>
            </Card>
          </div>
        </div>
      </Card>
      {extractedImage &&
      <div className="pt-2">
        <Card className="w-full">
        {stats && <StatsDisplay stats={stats} metadata={metadata} />}
        </Card>
      </div>}
    </div>
  );
}
