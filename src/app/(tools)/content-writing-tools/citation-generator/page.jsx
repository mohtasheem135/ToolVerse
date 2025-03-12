"use client";
import useMounted from "@/hooks/useMounted";
import { Copy } from "lucide-react";
import React, { useState } from "react";

const CitationGenerator = () => {
  const mounted = useMounted();

  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [link, setLink] = useState("");
  const [citationType, setCitationType] = useState("APA");
  const [copyStatus, setCopyStatus] = useState(false);

  const [citations, setCitations] = useState([]);

  // Function to add a new citation
  const addCitation = () => {
    if (author && title && year) {
      setCitations([...citations, { author, title, year, link }]);
      setAuthor("");
      setTitle("");
      setYear("");
      setLink("");
    }
  };

  // Function to generate formatted citations based on type
  const formatCitation = (citation) => {
    switch (citationType) {
      case "APA":
        return `${citation.author}. (${citation.year}). ${citation.title}. Retrieved from ${citation.link}`;
      case "MLA":
        return `${citation.author}. "${citation.title}." ${citation.year}, ${citation.link}`;
      case "Chicago":
        return `${citation.author}. "${citation.title}." Accessed ${citation.year}. ${citation.link}`;
      default:
        return `${citation.author}. (${citation.year}). ${citation.title}. ${citation.link}`;
    }
  };

  const generateCitations = () => {
    return citations.map((citation, index) => (
      <div key={index} className="bg-gray-100 p-4 rounded-lg mb-2 shadow-sm">
        <p>{formatCitation(citation)}</p>
      </div>
    ));
  };

  // Function to copy all citations to clipboard
  const copyToClipboard = () => {
    const formattedCitations = citations.map(formatCitation).join("\n");
    navigator.clipboard.writeText(formattedCitations).then(() => {
      setCopyStatus(true);
      setTimeout(() => {
        setCopyStatus(false);
      }, 5000);
    });
  };

  if (!mounted) return null;
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl text-center mb-8 font-bold">
        Citation Generator
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side: Input Form */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Citation Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Link
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Citation Style
            </label>
            <select
              value={citationType}
              onChange={(e) => setCitationType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="APA">APA</option>
              <option value="MLA">MLA</option>
              <option value="Chicago">Chicago</option>
            </select>
          </div>

          <button
            onClick={addCitation}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            + Add Citation
          </button>
        </div>

        {/* Right Side: Display Citation Containers */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          {citations.length === 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Citation List</h2>
              <p className="text-gray-500">
                No citations added yet. Add some from the left!
              </p>
            </>
          ) : (
            <div>
              <div className="flex justify-end">
                <button
                  onClick={copyToClipboard}
                  className={`text-white p-2 rounded-md text-lg  ${
                    copyStatus
                      ? "bg-green-500"
                      : "bg-purple-500 hover:bg-purple-600"
                  }`}
                >
                  <Copy />
                </button>
              </div>
              {generateCitations()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitationGenerator;
