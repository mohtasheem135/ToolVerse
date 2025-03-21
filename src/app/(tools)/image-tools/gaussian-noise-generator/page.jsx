"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import useMounted from "@/hooks/useMounted";
import { Download, PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import Loader from "@/components/ui/Loader";

export default function GaussianNoiseGenerator() {
  const mounted = useMounted();

  const [selectedImage, setSelectedImage] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("png");
  const [imageUrl, setImageUrl] = useState(null);
  const [sigmaValue, setSigmaValue] = useState(0);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];
      setSelectedImage(image);
      setConvertedImage(null);
      setError(null);

      const url = URL.createObjectURL(image);
      setImageUrl(url);

      const img = new Image();
      img.src = url;
    }
  };

  const handleConvert = async () => {
    if (!selectedImage) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("sigma", sigmaValue);
    // formData.append("format", format);
    // if (width) formData.append("width", width);
    // if (height) formData.append("height", height);

    try {
      const response = await fetch("/api/gaussianNoiseGenerator", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to convert image");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setConvertedImage(url);
    } catch (err) {
      console.error("Conversion error:", err);
      setError(err.message || "An error occurred during conversion.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete (reset state)
  const handleDelete = () => {
    setSelectedImage(null);
    setConvertedImage(null);
    setError(null);
    setImageUrl(null);
  };

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
      setImageUrl(url);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
      };
    }
    e.target.classList.remove("border-indigo-500", "border-dashed");
  };

  const handleSigmaValueChange = (newValue) => {
    setSigmaValue(newValue);
  };

  if (!mounted) return <Loader />;

  return (
    <div className="w-[100%] p-2">
      <Card className="flex flex-col items-center bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Image Converter
          </CardTitle>
        </CardHeader>
        <div className=" md:flex justify-between w-full h-full">
          <div className="md:w-[70%] p-2 h-[480px]">
            <Card className="p-2 h-full">
              <div className="flex justify-start">
                {!convertedImage && !imageUrl && (
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
                {imageUrl && (
                  <button
                    onClick={handleDelete}
                    className=" bg-red-500 hover:bg-red-700 text-white py-2 px-2 -mt-[55px] -ml-[] rounded-full absolute "
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
              {!convertedImage && imageUrl && (
                <div className="h-[400px] ">
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="w-full h-full"
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
              {convertedImage && (
                <>
                  <div className="flex flex-col justify-start items-end">
                    <a
                      href={convertedImage}
                      download={`${
                        selectedImage.name.split(".")[0]
                      }_Gaussian_Noise_ToolVerse.${format}`}
                      className="absolute no-underline -mt-[55px] text-white px-2 py-2 shadow-md bg-[#000099] rounded-full"
                    >
                      <Download />
                    </a>
                  </div>
                  <div className="h-[400px] flex justify-center items-center border-0 border-black">
                    <img
                      src={convertedImage}
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

              <div className="py-10 space-y-3">
                <p className="text-gray-500">{sigmaValue}</p>
                <Slider
                  onValueChange={(newValue) => handleSigmaValueChange(newValue)}
                  defaultValue={[0]}
                  max={65}
                  step={1}
                />
              </div>
              <button
                onClick={handleConvert}
                disabled={!selectedImage || loading}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Converting..." : `Convert to ${format}`}
              </button>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
