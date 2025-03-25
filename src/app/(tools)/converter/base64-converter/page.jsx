"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import useMounted from "@/hooks/useMounted";
import { Copy, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const mounted = useMounted();
  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [clicked, setClicked] = useState("");
  const [copyStatus, setCopyStatus] = useState(false);
  const [textType, setTextType] = useState("");

  const isBase64 = (str) => {
    try {
      // Check if the input matches Base64 format
      return btoa(atob(str)) === str;
    } catch (e) {
      return false;
    }
  };

  // Handle text input change
  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);

    // Check if input text is Base64
    if (isBase64(newText)) {
      setTextType("Base64");
    } else {
      setTextType("Normal");
    }
  };

  // Function to convert input to Base64
  const handleToBase64 = () => {
    const base64String = btoa(inputText);
    setConvertedText(base64String);
    setClicked("toBase64");
  };

  // Function to convert input Base64 to regular text
  const handleFromBase64 = () => {
    try {
      const decodedString = atob(inputText);
      setConvertedText(decodedString);
      setClicked("fromBase64");
    } catch (error) {
      setConvertedText("Invalid Base64 string");
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setInputText("");
    setConvertedText("");
    setClicked("");
    setTextType("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedText).then(() => {
      setCopyStatus(true);
      setTimeout(() => {
        setCopyStatus(false);
      }, 5000);
    });
  };

  if (!mounted) {
    return <Loader />;
  }
  return (
    <div className="px-4 py-2">
      <Card className="flex flex-col items-center bg-white shadow-lg rounded-lg">
        <CardHeader className="w-full">
          <CardTitle className="text-2xl font-bold text-gray-800 flex justify-center items-center">
            Base64 Converter
          </CardTitle>
          <CardDescription className="w-full flex justify-end items-center">
            <button
              onClick={(e) => handleClear(e)}
              className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-2 py-1 shadow rounded border-none flex items-center"
            >
              <Trash2 />
            </button>
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <div className="mb-2">
            <label>
              {textType === "Normal" && "This is Normal Text!"}
              {textType === "Base64" && "This is in Base64!"}
              {textType === "" && "Enter the string here!!!"}
            </label>
            <textarea
              rows={6}
              cols={50}
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter text or Base64 string here"
              className="w-full font-[16px] p-2 outline-none border border-gray-300 rounded"
            />
          </div>
          <div className="flex space-x-4 mb-2">
            {textType === "" ? null : textType === "Normal" ? (
              <button
                onClick={handleToBase64}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/4`}
              >
                to Base64
              </button>
            ) : (
              <button
                onClick={handleFromBase64}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/4`}
              >
                Base64 To Text
              </button>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-4 bg-green-300 px-2 rounded">
              <label>
                {clicked === "toBase64" && "Your Text converted to Base64"}
                {clicked === "fromBase64" && "Your Base64 converted to Text"}
              </label>

              {clicked && convertedText && (
                <button
                  onClick={copyToClipboard}
                  className={`text-white p-2 rounded-md text-lg ${
                    copyStatus
                      ? "bg-green-500"
                      : "bg-purple-500 hover:bg-purple-600"
                  }`}
                >
                  <Copy />
                </button>
              )}
            </div>

            {clicked && convertedText && (
              <textarea
                rows={6}
                cols={50}
                value={convertedText}
                readOnly
                className="outline-none border border-gray-300 rounded bg-[#f7f7f7] font-[16px] w-full p-2"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
