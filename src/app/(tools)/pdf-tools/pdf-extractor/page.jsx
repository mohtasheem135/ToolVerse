"use client";
import React, { useState } from "react";

export default function PDFExtractor() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("/api/pdf-extractor", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // objects.forEach((obj) => {
        //   console.log(`Object ${obj.id} (Generation ${obj.generation}):`);
        //   console.log(obj.data);
        //   console.log("---");
        // });
        // setQuestions(data.questions);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  return (
    <div>
      <h1>Upload PDF and Extract Questions</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button type="submit">Upload PDF</button>
      </form>

      {/* {questions.length > 0 && (
        <div>
          <h2>Extracted Questions:</h2>
          <ul>
            {questions.map((q) => (
              <li key={q.id}>
                {q.id}. {q.question}
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
}
