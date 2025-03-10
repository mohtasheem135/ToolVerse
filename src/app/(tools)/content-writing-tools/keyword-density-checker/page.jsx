"use client";

import { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import useMounted from "@/hooks/useMounted";

const page = () => {
  const mounted = useMounted();

  const [text, setText] = useState("");
  const [keywordDensity, setKeywordDensity] = useState([]);
  const [mostOccurring, setMostOccurring] = useState([]);
  const [leastOccurring, setLeastOccurring] = useState([]);
  const [functionWords, setFunctionWords] = useState([]);
  const [word, setWord] = useState("");
  const [highlightedText, setHighlightedText] = useState("");
  const [textStats, setTextStats] = useState({
    totalWords: 0,
    totalCharacters: 0,
    averageWordLength: 0,
    totalSentences: 0,
  });

  // List of common prepositions, conjunctions, and articles
  const functionWordsList = [
    "the",
    "and",
    "a",
    "an",
    "in",
    "on",
    "at",
    "for",
    "to",
    "of",
    "with",
    "by",
    "as",
    "or",
    "but",
    "if",
    "so",
    "yet",
    "nor",
    "that",
    "this",
    "these",
    "those",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "we",
    "how",
    "will",
    "can",
  ];

  // Function to calculate keyword density
  //   const calculateKeywordDensity = () => {
  //     const words = text.split(/\s+/).filter((word) => word.length > 0);
  //     const wordCount = {};
  //     words.forEach((word) => {
  //       const normalizedWord = word.toLowerCase().replace(/[^\w\s]/g, ""); // Normalize word
  //       wordCount[normalizedWord] = (wordCount[normalizedWord] || 0) + 1;
  //     });

  //     const totalWords = words.length;
  //     const densityData = Object.keys(wordCount).map((word) => ({
  //       word,
  //       count: wordCount[word],
  //       density: ((wordCount[word] / totalWords) * 100).toFixed(2) + "%",
  //     }));

  //     // Filter out function words for most and least occurring tables
  //     const filteredDensityData = densityData.filter(
  //       (data) => !functionWordsList.includes(data.word)
  //     );

  //     // Sort by count (descending)
  //     const sortedByCount = [...filteredDensityData].sort(
  //       (a, b) => b.count - a.count
  //     );

  //     // Filter words with count >= 2 for most occurring words and exclude empty words
  //     const mostOccurringWords = sortedByCount.filter(
  //       (wordData) => wordData.count >= 2 && wordData.word !== ""
  //     );
  //     setMostOccurring(mostOccurringWords);

  //     // Filter words with count === 1 for least occurring words and exclude empty words
  //     const leastOccurringWords = sortedByCount.filter(
  //       (wordData) => wordData.count === 1 && wordData.word !== ""
  //     );
  //     setLeastOccurring(leastOccurringWords);

  //     // Function words (prepositions, conjunctions, articles)
  //     const functionWordsData = densityData.filter((data) =>
  //       functionWordsList.includes(data.word)
  //     );
  //     setFunctionWords(functionWordsData);

  //     setKeywordDensity(densityData);
  //   };

  const calculateKeywordDensity = () => {
    // Split text into words by whitespace and filter out empty strings
    const words = text.split(/\s+/).filter((word) => word.length > 0);

    // Calculate total characters (excluding spaces)
    const totalCharacters = text.replace(/\s+/g, "").length;

    // Calculate total sentences (based on basic sentence-ending punctuation)
    const totalSentences = text
      .split(/[.!?]/)
      .filter((sentence) => sentence.length > 0).length;

    const wordCount = {};

    words.forEach((word) => {
      // Normalize word, keeping hyphens but removing other non-alphanumeric characters
      const normalizedWord = word
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Retain hyphens
        .replace(/(^-+|-+$)/g, ""); // Remove hyphens at the start or end of the word

      // Count the occurrences of the normalized word
      wordCount[normalizedWord] = (wordCount[normalizedWord] || 0) + 1;
    });

    const totalWords = words.length;
    // Calculate average word length
    const averageWordLength = totalWords
      ? (totalCharacters / totalWords).toFixed(2)
      : 0;

    // Update text statistics state
    setTextStats({
      totalWords,
      totalCharacters,
      averageWordLength,
      totalSentences,
    });
    const densityData = Object.keys(wordCount).map((word) => ({
      word,
      count: wordCount[word],
      density: ((wordCount[word] / totalWords) * 100).toFixed(2) + "%",
    }));

    // Filter out function words for most and least occurring tables
    const filteredDensityData = densityData.filter(
      (data) => !functionWordsList.includes(data.word)
    );

    // Sort by count (descending)
    const sortedByCount = [...filteredDensityData].sort(
      (a, b) => b.count - a.count
    );

    // Filter words with count >= 2 for most occurring words and exclude empty words
    const mostOccurringWords = sortedByCount.filter(
      (wordData) => wordData.count >= 2 && wordData.word !== ""
    );
    setMostOccurring(mostOccurringWords);

    // Filter words with count === 1 for least occurring words and exclude empty words
    const leastOccurringWords = sortedByCount.filter(
      (wordData) => wordData.count === 1 && wordData.word !== ""
    );
    setLeastOccurring(leastOccurringWords);

    // Function words (prepositions, conjunctions, articles)
    const functionWordsData = densityData.filter((data) =>
      functionWordsList.includes(data.word)
    );
    setFunctionWords(functionWordsData);

    setKeywordDensity(densityData);
  };

  // Render a table
  const renderTable = (data, title) => (
    <div>
      {/* <h3>{title}</h3> */}
      <table className="w-full text-sm text-left border border-gray-400 rounded-lg shadow-sm">
        <thead className="bg-gray-400">
          <tr>
            <th className="px-4 py-2">Word</th>
            <th className="px-4 py-2">Count</th>
            <th className="px-4 py-2">Density</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data, index) => (
            <tr
              key={index}
              className="hover:bg-gray-300 cursor-pointer"
              onClick={() => setWord(data?.word)}
            >
              <td className="px-4 py-2">{data.word}</td>
              <td className="px-4 py-2">{data.count}</td>
              <td className="px-4 py-2">{data.density}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const handleHighlight = (text, word) => {
    if (!word) return text;

    // Escape special characters in the word to search for
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Create a regular expression to search for the word, case-insensitive
    const regex = new RegExp(`(${escapedWord})`, "gi");

    // Replace matched words with a <mark> tag for highlighting
    return text.replace(regex, "<mark>$1</mark>");
  };

  useEffect(() => {
    setHighlightedText(handleHighlight(text, word));
  }, [text, word]);

  if (!mounted) return null;
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-3">
        Keyword Density Checker
      </h1>
      <div className="flex justify-end">
        {textStats.totalWords ? (
          <p className="bg-blue-400 rounded-lg shadow px-2 py-1 text-[14px] md:text-[16px]">
            Total Words: {textStats.totalWords}
          </p>
        ) : (
          ""
        )}
      </div>
      <div
        onInput={(e) => setText(e.target.innerText)} // Use innerText to capture the user's input
        contentEditable={true}
        className="w-full h-[400px] border border-gray-400 rounded-lg shadow-md p-2 overflow-y-auto outline-none"
        style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }} // Preserve whitespace and wrapping
        dangerouslySetInnerHTML={{ __html: highlightedText }} // Use dangerouslySetInnerHTML to render highlighted content
        suppressContentEditableWarning={true} // Prevent warning for dangerouslySetInnerHTML in editable div
      ></div>
      {/* <br /> */}
      <div className="flex justify-between items-center mt-2">
        <button
          className={`px-4 py-2 rounded-md bg-blue-600 text-white text-[14px] md:text-[16px]`}
          onClick={calculateKeywordDensity}
        >
          Calculate Density
        </button>
        {textStats.totalCharacters &&
        textStats.totalSentences &&
        textStats.averageWordLength ? (
          <div className="bg-blue-400 rounded-lg shadow px-2 py-1 text-[14px] md:text-[16px]">
            <p>Total Characters: {textStats.totalCharacters}</p>
            <p>Total Sentences: {textStats.totalSentences}</p>
            <p>Average Word Length: {textStats.averageWordLength}</p>
          </div>
        ) : (
          ""
        )}
      </div>
      {keywordDensity.length > 0 && (
        <>
          <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4 mb-10 border border-gray-400">
            <div className="md:w-1/3 h-[400px] overflow-y-auto">
              <h4>Most Occuring Words</h4>
              {renderTable(
                mostOccurring,
                "Most Occurring Words (Excluding Function Words)"
              )}
            </div>
            <div className="md:w-1/3 h-[400px] overflow-y-auto">
              <h4>Least Occuring Words</h4>
              {renderTable(
                leastOccurring,
                "Least Occurring Words (Excluding Function Words)"
              )}
            </div>
            <div className="md:w-1/3 h-[400px] overflow-y-auto">
              <h4>Function Words</h4>
              {renderTable(
                functionWords,
                "Prepositions, Conjunctions, and Articles"
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default page;
