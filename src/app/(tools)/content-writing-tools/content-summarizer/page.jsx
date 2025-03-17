"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [openaiSummary, setOpenaiSummary] = useState("");
  const [geminiSummary, setGeminiSummary] = useState("");
  const [geminiTitle, setGeminiTitle] = useState("");
  const [geminiModel, setGeminiModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [wordCountBefore, setWordCountBefore] = useState(0);
  const [wordCountAfter, setWordCountAfter] = useState(0);
  const [copied, setCopied] = useState(false);

  // Function to calculate the number of words in a string
  const countWords = (str) => {
    const words = str.trim().split(/\s+/); // Split by any whitespace (spaces, tabs, etc.)
    return words.filter((word) => word.length > 0).length; // Filter out empty strings and count the words
  };

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    setText(inputText);

    // Calculate and update the word count
    const count = countWords(inputText);
    setWordCountBefore(count);
  };

  // Function to copy text to clipboard
  const copyToClipboard = (textToCopy) => {
    if (document.hasFocus()) {
      navigator.clipboard.writeText(textToCopy).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 5000); // Hide the confirmation after 2 seconds
        },
        (error) => {
          console.error("Failed to copy text: ", error);
        }
      );
    } else {
      console.warn("Document is not focused. Clipboard action aborted.");
    }
  };

  const summarize = async (api) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/${api}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (api === "openai") {
        setOpenaiSummary(data.summary);
      } else {
        setGeminiSummary(data.summary);
        setGeminiTitle(data.title);
        const count = countWords(data.summary);
        setWordCountAfter(count);
        setGeminiModel(data.model); // Set the model used for Gemini
      }
    } catch (error) {
      console.error("Error summarizing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-3xl text-center mb-10 md:mb-4 font-bold">
        Content Summarizer
      </h1>
      <div className="md:flex space-y-10 md:space-x-2 md:space-y-0">
        <div className="md:w-1/2 bg-[#bdddfc] rounded-xl p-2 shadow relative">
          <textarea
            className="w-full h-[450px] border p-2 mb-4 outline-none bg-transparent border-none "
            value={text}
            onChange={handleTextChange}
            placeholder="Enter text to summarize..."
          ></textarea>
          {wordCountBefore ? (
            <div className="absolute -top-[30px] left-[20px] px-4 py-1 bg-[#474747] rounded-sm text-white">
              {wordCountBefore} words
            </div>
          ) : null}
          <button
            className={`bg-green-500 text-white px-4 py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => summarize("gemini")}
            disabled={loading}
          >
            Summarize
          </button>
        </div>

        <div className="md:w-1/2 bg-[#c1fcc0] rounded-xl p-2 shadow relative">
          {loading && <p>Loading...</p>}
          {geminiSummary && (
            <>
              {wordCountAfter && (
                <div className="absolute -top-[30px] right-[20px] px-4 py-1 bg-[#474747] rounded-sm text-white">
                  {Math.round(
                    ((wordCountBefore - wordCountAfter) / wordCountBefore) * 100
                  )}
                  % summarized
                </div>
              )}
              <div className="mt-1">
                {/* <h2 className="font-semibold">
                Gemini Summary (Model: {geminiModel}):
                </h2> */}
                <div className="flex justify-end mb-3">
                  <button
                    className={`border-none ${
                      copied ? " bg-[#8e8f8c]" : "bg-[#494a48]"
                    } rounded-md p-1`}
                    onClick={copyToClipboard(geminiSummary)}
                  >
                    <Copy />
                  </button>
                </div>
                <div>
                  <p className="text-center mb-2 text-[24px] font-bold">{geminiTitle}</p>
                  <p>{geminiSummary}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
