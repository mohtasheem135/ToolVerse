"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, PlusIcon, Trash2 } from "lucide-react";
import useMounted from "@/hooks/useMounted";
import CommonOperationInput from "./_components/CommonOperationInput";
const imageOperations = [
  "rotate",
  "flip",
  "flop",
  "sharpen",
  "median",
  "blur",
  "flatten",
  "gamma",
  "negate",
  "normalize",
  "normalise",
  "clahe",
  "convolve",
  "threshold",
  "linear",
  "recomb",
  "modulate",
];

export default function Home() {
  const mounted = useMounted();
  //   const [selectedImage, setSelectedImage] = useState(null);
  //   const [processedImage, setProcessedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null); // Store original base64
  const [currentImage, setCurrentImage] = useState(null); // Store current (processed or original) base64
  const [processedImageURL, setProcessedImageURL] = useState(null); // Store URL for display/download

  const [fileName, setFileName] = useState(null);
  const [operation, setOperation] = useState(imageOperations[0]);
  const [operationValue, setOperationValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileName(file?.name);
      const imageURL = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // setSelectedImage(reader.result);
        setCurrentImage(reader.result);
        setProcessedImageURL(null);
        setError(null);
      };
      reader.readAsDataURL(file);
      setOriginalImage(imageURL);
    }
  };

  //   const handleProcessImage = async () => {
  //     setLoading(true);
  //     setError(null);
  //     setProcessedImageURL(null);

  //     const formData = new FormData();
  //     if (!selectedImage) {
  //       setError("Please Select the Image");
  //       setLoading(false);
  //       return;
  //     }
  //     const base64Image = selectedImage.split(",")[1];
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
  //     const blob = new Blob(byteArrays, { type: "image/jpeg" });
  //     formData.append("image", blob);
  //     formData.append("operation", operation);
  //     formData.append("operationValue", operationValue);

  //     try {
  //       const response = await fetch("/api/imageOperations", {
  //         method: "POST",
  //         body: formData,
  //       });
  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(errorData.error || "Image operation failed");
  //       }
  //       const blob = await response.blob();
  //       const url = URL.createObjectURL(blob);
  //       setProcessedImage(url);
  //       setSelectedImage(url);
  //     } catch (err) {
  //       console.error("Image processing error:", err);
  //       setError(err.message || "An error occurred during image processing.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleProcessImage = async () => {
    setLoading(true);
    setError(null);
    setProcessedImageURL(null);
    setOriginalImage(null);

    const formData = new FormData();
    if (!currentImage) {
      // Use currentImage instead of selectedImage
      setError("No image to process.");
      setLoading(false);
      return;
    }

    const base64Image = currentImage.split(",")[1];
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
    formData.append("operation", operation);
    formData.append("operationValue", operationValue);

    try {
      const response = await fetch("/api/imageOperations", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Image operation failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const reader = new FileReader();
      reader.onloadend = () => {
        const newBase64 = reader.result;
        // setCurrentImage(newBase64);
        setProcessedImageURL(url);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("Image processing error:", err);
      setError(err.message || "An error occurred during image processing.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete (reset state)
  const handleDelete = () => {
    // setSelectedImage(null);
    setProcessedImageURL(null);
    setCurrentImage(null);
    setOriginalImage(null);
    setOperation(imageOperations[0]);
    setOperationValue("");
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

  if (!mounted) return <p>Loading...</p>;
  return (
    <div className="w-[100%] p-2">
      <Card className="flex flex-col items-center bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Image Operations
          </CardTitle>
        </CardHeader>
        <div className=" md:flex justify-between w-full h-full">
          <div className="md:w-[70%] p-2 h-[480px]">
            <Card className="p-2 h-full">
              <div className="flex justify-start">
                {!processedImageURL && !currentImage && (
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
                {currentImage && (
                  <button
                    onClick={handleDelete}
                    className=" bg-red-500 hover:bg-red-700 text-white py-2 px-2 -mt-[55px] -ml-[] rounded-full absolute "
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
              {originalImage && (
                <div className="h-[400px]">
                  <img
                    src={originalImage}
                    alt="Uploaded"
                    className="w-full h-full"
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}

              {processedImageURL && (
                <>
                  <div className="flex flex-col justify-start items-end">
                    <a
                      href={processedImageURL}
                      download={`${fileName}_processed_image_ToolVerse.png`}
                      className="absolute no-underline -mt-[55px] text-white px-2 py-2 shadow-md bg-[#000099] rounded-full"
                    >
                      <Download />
                    </a>
                  </div>
                  <div className="h-[400px] flex justify-center items-center border-0 border-black">
                    <img
                      src={processedImageURL}
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

              <div className="mb-4">
                <label htmlFor="operation" className="block mb-2 font-medium">
                  Operation:
                </label>
                <select
                  id="operation"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  {imageOperations.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4 flex gap-2">
                {/* Conditional input fields */}
                {[
                  "rotate",
                  "sharpen",
                  "median",
                  "blur",
                  "gamma",
                  "threshold",
                ].includes(operation) && (
                  // <input
                  //   type="number"
                  //   placeholder={operation === "rotate" ? "Degrees" : "Value"}
                  //   value={operationValue}
                  //   onChange={(e) => setOperationValue(e.target.value)}
                  //   className="w-full border rounded p-2 mb-4"
                  // />
                  <CommonOperationInput
                    operation={operation}
                    operationValue={operationValue}
                    setOperationValue={setOperationValue}
                  />
                )}
                {operation === "clahe" && (
                  <input
                    type="text"
                    placeholder="Width,Height (e.g., 8,8)"
                    value={operationValue}
                    onChange={(e) => setOperationValue(e.target.value)}
                    className="w-full border rounded p-2 mb-4"
                  />
                )}
                {operation === "convolve" && (
                  <input
                    type="text"
                    placeholder="Kernel (e.g., 1,2,1,0,1,0,-1,-2,-1)"
                    value={operationValue}
                    onChange={(e) => setOperationValue(e.target.value)}
                    className="w-full border rounded p-2 mb-4"
                  />
                )}
                {operation === "linear" && (
                  <input
                    type="text"
                    placeholder="a,b (e.g., 1,0)"
                    value={operationValue}
                    onChange={(e) => setOperationValue(e.target.value)}
                    className="w-full border rounded p-2 mb-4"
                  />
                )}
                {operation === "recomb" && (
                  <input
                    type="text"
                    placeholder="Matrix (9 comma-separated values)"
                    value={operationValue}
                    onChange={(e) => setOperationValue(e.target.value)}
                    className="w-full border rounded p-2 mb-4"
                  />
                )}
                {operation === "modulate" && (
                  <input
                    type="text"
                    placeholder="Brightness,Saturation,Hue (e.g., 1,1,0)"
                    value={operationValue}
                    onChange={(e) => setOperationValue(e.target.value)}
                    className="w-full border rounded p-2 mb-4"
                  />
                )}
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button
                onClick={handleProcessImage}
                disabled={loading || !currentImage}
                className={`${loading || !currentImage ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"}  text-white font-normal py-2 px-4 rounded w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : "Process Image"}
              </button>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
