"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, Trash2 } from "lucide-react";
const compositeOperations = [
  "clear",
  "source",
  "over",
  "in",
  "out",
  "atop",
  "dest",
  "dest-over",
  "dest-in",
  "dest-out",
  "dest-atop",
  "xor",
  "add",
  "saturate",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "colour-dodge",
  "color-dodge",
  "colour-burn",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
];

export default function Home() {
  const [operation, setOperation] = useState(compositeOperations[2]); // Default to 'over'
  const [images, setImages] = useState([null, null]);
  const [compositeImage, setCompositeImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event, index) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = reader.result;
        setImages(newImages);
        setCompositeImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComposite = async () => {
    setLoading(true);
    setError(null);
    setCompositeImage(null);

    const formData = new FormData();
    formData.append("operation", operation);
    images.forEach((image, index) => {
      if (image) {
        const base64Image = image.split(",")[1];
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
        formData.append(`image${index + 1}`, blob);
      }
    });

    try {
      const response = await fetch("/api/composite", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Composite operation failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setCompositeImage(url);
    } catch (err) {
      console.error("Composite error:", err);
      setError(err.message || "An error occurred during compositing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100%] p-2">
      <Card className="flex flex-col items-center bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Image Composite
          </CardTitle>
        </CardHeader>
        <div className=" md:flex justify-between w-full h-full">
          <div className="md:w-[70%] p-2 h-[300px] md:h-[480px]">
            <Card className="p-2 h-full">
              <div className="flex space-x-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="md:w-1/2 shadow-md px-1 rounded-md md:h-[450px]"
                  >
                    <label
                      htmlFor={`image${i}`}
                      className="block mb-2 font-medium"
                    >
                      Image {i}:
                    </label>
                    <input
                      type="file"
                      id={`image${i}`}
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, i - 1)}
                      className="w-full border rounded p-2"
                    />
                    {images[i - 1] && (
                      <img
                        src={images[i - 1]}
                        alt={`Image ${i} Preview`}
                        className="w-full mt-2 rounded-md h-[180px] md:h-[350px]"
                        style={{ objectFit: "contain" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="md:w-[30%] p-2">
            <Card className="w-full p-2">
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="mb-4">
                <label htmlFor="operation" className="block mb-2 font-medium">
                  Composite Operation:
                </label>
                <select
                  id="operation"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  {compositeOperations.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleComposite}
                disabled={loading || images.filter((image) => image).length < 1}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Compositing..." : "Composite"}
              </button>
            </Card>
          </div>
        </div>
      </Card>
      <div className="py-2">
        <Card className="w-full">
          {compositeImage && (
            <div className="mt-6 px-4 text-center">
              <h2 className="text-lg font-semibold mb-2">Composite Image:</h2>
              <img
                src={compositeImage}
                alt="Composite"
                className="max-w-full rounded-md"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
