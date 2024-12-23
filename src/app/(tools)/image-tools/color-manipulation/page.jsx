"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, PlusIcon, Trash2 } from "lucide-react";
import useMounted from "@/hooks/useMounted";
const colorOperations = [
  "tint",
  "greyscale",
  "grayscale",
  "pipelineColourspace",
  "pipelineColorspace",
  "toColourspace",
  "toColorspace",
];

export default function ColorManipulationPage() {
  const mounted = useMounted();
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImageURL, setProcessedImageURL] = useState(null);
  const [currentImageBase64, setCurrentImageBase64] = useState(null);
  const [colorOperation, setColorOperation] = useState(colorOperations[0]);
  const [colorOperationValue, setColorOperationValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [fileName, setFileName] = useState(null);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileName(file?.name);
      const imageURL = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setCurrentImageBase64(base64);
      };
      reader.readAsDataURL(file);
      setSelectedImage(imageURL);
      setProcessedImageURL(null);
      setError(null);
    }
  };

  const handleProcessImage = async () => {
    setLoading(true);
    setError(null);
    setProcessedImageURL(null);

    const formData = new FormData();
    if (!currentImageBase64) {
      setError("Please Select the Image");
      setLoading(false);
      return;
    }

    const base64Image = currentImageBase64.split(",")[1];
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
    formData.append("operation", colorOperation);
    formData.append("operationValue", colorOperationValue);

    try {
      const response = await fetch("/api/colorManipulation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Image operation failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImageURL(url);
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
    setSelectedImage(null);
    setColorOperation(colorOperations[0]);
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
      setProcessedImageURL(null);
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
    // <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
    //   <div className="bg-white p-8 rounded-lg shadow-md w-96">
    //     <h1 className="text-2xl font-bold mb-4 text-center">
    //       Color Manipulation
    //     </h1>

    //     <input
    //       type="file"
    //       accept="image/*"
    //       onChange={handleImageChange}
    //       className="mb-4 w-full border rounded-md p-2"
    //     />

    //     {selectedImage && (
    //       <div className="h-[400px] mb-4">
    //         <img
    //           src={selectedImage}
    //           alt="Uploaded"
    //           className="w-full h-full object-contain"
    //         />
    //       </div>
    //     )}

    //     <div className="mb-4">
    //   <label htmlFor="colorOperation" className="block mb-2 font-medium">
    //     Color Operation:
    //   </label>
    //   <select
    //     id="colorOperation"
    //     value={colorOperation}
    //     onChange={(e) => setColorOperation(e.target.value)}
    //     className="w-full border rounded p-2"
    //   >
    //     {colorOperations.map((op) => (
    //       <option key={op} value={op}>
    //         {op}
    //       </option>
    //     ))}
    //   </select>
    //     </div>

    // {/* Conditional Input */}
    // {colorOperation === "tint" && (
    //   <input
    //     type="color"
    //     value={colorOperationValue}
    //     onChange={(e) => setColorOperationValue(e.target.value)}
    //     className="w-full border rounded p-2 mb-4"
    //   />
    // )}
    // {[
    //   "pipelineColourspace",
    //   "pipelineColorspace",
    //   "toColourspace",
    //   "toColorspace",
    // ].includes(colorOperation) && (
    //   <input
    //     type="text"
    //     placeholder="e.g., rgb16, srgb"
    //     value={colorOperationValue}
    //     onChange={(e) => setColorOperationValue(e.target.value)}
    //     className="w-full border rounded p-2 mb-4"
    //   />
    // )}

    //     {error && <p className="text-red-500 mb-4">{error}</p>}

    //     <button
    //       onClick={handleProcessImage}
    //       disabled={loading || !currentImageBase64}
    //       className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${
    //         loading ? "opacity-50 cursor-not-allowed" : ""
    //       }`}
    //     >
    //       {loading ? "Processing..." : "Process Image"}
    //     </button>

    //     {processedImageURL && (
    //       <div className="mt-6 text-center">
    //         <h2 className="text-lg font-semibold mb-2">Processed Image:</h2>
    //         <img
    //           src={processedImageURL}
    //           alt="Processed"
    //           className="max-w-full rounded-md"
    //         />
    //         <a
    //           href={processedImageURL}
    //           download="processed_image.png"
    //           className="mt-2 text-blue-500 underline block"
    //         >
    //           Download Image
    //         </a>
    //       </div>
    //     )}
    //   </div>
    // </main>

    <div className="w-[100%] p-2">
      <Card className="flex flex-col items-center bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Image Color Manipulation
          </CardTitle>
        </CardHeader>
        <div className=" md:flex justify-between w-full h-full">
          <div className="md:w-[70%] p-2 h-[480px]">
            <Card className="p-2 h-full">
              <div className="flex justify-start">
                {!processedImageURL && !selectedImage && (
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
              {selectedImage && !processedImageURL && (
                <div className="h-[400px]">
                  <img
                    src={selectedImage}
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
                <label
                  htmlFor="colorOperation"
                  className="block mb-2 font-medium"
                >
                  Color Operation:
                </label>
                <select
                  id="colorOperation"
                  value={colorOperation}
                  onChange={(e) => setColorOperation(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  {colorOperations.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>
              {/* Conditional Input */}
              {colorOperation === "tint" && (
                <input
                  type="color"
                  value={colorOperationValue}
                  onChange={(e) => setColorOperationValue(e.target.value)}
                  className="w-full border rounded p-2 mb-4"
                />
              )}
              {[
                "pipelineColourspace",
                "pipelineColorspace",
                "toColourspace",
                "toColorspace",
              ].includes(colorOperation) && (
                <input
                  type="text"
                  placeholder="e.g., rgb16, srgb"
                  value={colorOperationValue}
                  onChange={(e) => setColorOperationValue(e.target.value)}
                  className="w-full border rounded p-2 mb-4"
                />
              )}
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button
                onClick={handleProcessImage}
                disabled={loading || !selectedImage}
                className={`${
                  loading || !selectedImage
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-700"
                }  text-white font-normal py-2 px-4 rounded w-full ${
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
