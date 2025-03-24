// app/page.js
"use client";
import { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import ColorPalette from "./components/ColorPalette";
import ClusterPlot from "./components/ClusterPlot"; // Import the new component
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, Trash2 } from "lucide-react";
import useMounted from "@/hooks/useMounted";
import Loader from "@/components/ui/Loader";

export default function Home() {
  const mounted = useMounted();
  const [colors, setColors] = useState(null);
  const [cluster, setCluster] = useState(null); // Add pixel state
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setImageUrl(url);
  };

  const handleExtractColors = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/extract-colors", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        console.error("API Error:", errorData);
        alert(`API Error: ${errorData.error || "Unknown error"}`);
        return;
      }

      const data = await response.json();
      setColors(data.colors);
      setCluster(data.cluster);
      setLoading(false);
      //   onColorsExtracted(data.colors, data.cluster);
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Fetch Error:", error);
      alert("Network or processing error occurred.");
      setLoading(false);
    }
  };

  const handleDelete = () => {
    // setSelectedImage(null);
    // setConvertedImage(null);
    setError(null);
    // setWidth(0);
    // setHeight(0);
    setImageUrl(null);
    setFile(null);
  };
  if (!mounted) {
    return <Loader />;
  }
  return (
    // <main>
    //   <h1>Image Color Extractor</h1>
    //   <ImageUploader onColorsExtracted={handleColorsExtracted} />
    //   <ColorPalette colors={colors} />
    // </main>
    <div>
      <Card className="flex flex-col items-center bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Image Color Extractor
          </CardTitle>
        </CardHeader>
        <div className=" md:flex justify-between w-full h-full">
          <div className="md:w-[70%] p-2 h-[480px]">
            <Card className="p-2 h-full">
              <div className="flex justify-start">
                {!file && (
                  <div
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
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
              </div>
              {imageUrl && (
                <button
                  onClick={handleDelete}
                  className=" bg-red-500 hover:bg-red-700 text-white py-2 px-2 -mt-[55px] -ml-[] rounded-full absolute "
                >
                  <Trash2 />
                </button>
              )}
              {file && (
                <div className="h-[400px]">
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
            </Card>
          </div>
          <div className="md:w-[30%] p-2">
            <Card className="w-full p-2">
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button
                onClick={handleExtractColors}
                disabled={loading}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Extracting..." : `Extract Colors`}
              </button>
              <hr />
              <ColorPalette colors={colors} />
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
