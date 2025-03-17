// import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const apiKey = process.env.GOOGLE_API_KEY;

// if (!apiKey) {
//   throw new Error('Google API key is missing');
// }

// const genAI = new GoogleGenerativeAI(apiKey);

// interface RequestBody {
//   text: string;
// }

// const models = [
//   'gemini-2.0-flash-lite',
//   'gemini-1.5-flash',
//   'gemini-1.5-pro'
// ];

// async function generateContentWithRetry(modelName: string, prompt: string) {
//   let attempt = 0;

//   while (attempt < models.length) {
//     try {
//       const model = genAI.getGenerativeModel({ model: modelName });
//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       return { text: response.text(), model: modelName }; // Include the model name in the response
//     } catch (error: unknown) {
//       console.error(`${modelName} failed:`, error);

//       if (error instanceof Error) {
//         if (error.message.includes('rate limit')) {
//           attempt++;
//           if (attempt < models.length) {
//             modelName = models[attempt];
//             console.log(`Switching to model: ${modelName}`);
//             continue;
//           }
//         }
//       }

//       throw error;
//     }
//   }

//   throw new Error('All models failed');
// }

// export async function POST(request: Request): Promise<NextResponse> {
//   try {
//     const { text }: RequestBody = await request.json();

//     const prompt = `Summarize the following text: ${text}`;
//     const { text: summary, model } = await generateContentWithRetry(models[0], prompt);

//     return NextResponse.json({ summary, model }); // Send back the summary and model name
//   } catch (error: unknown) {
//     console.error('Gemini API Error:', error);
//     return NextResponse.json({ error: 'Failed to summarize text.' }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("Google API key is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

interface RequestBody {
  text: string;
}

const models = ["gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-pro"];

async function generateContentWithRetry(modelName: string, prompt: string) {
  let attempt = 0;

  while (attempt < models.length) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return { text: response.text(), model: modelName }; // Include the model name in the response
    } catch (error: unknown) {
      console.error(`${modelName} failed:`, error);

      if (error instanceof Error) {
        if (error.message.includes("rate limit")) {
          attempt++;
          if (attempt < models.length) {
            modelName = models[attempt];
            console.log(`Switching to model: ${modelName}`);
            continue;
          }
        }
      }

      throw error;
    }
  }

  throw new Error("All models failed");
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { text }: RequestBody = await request.json();

    // Modify the prompt to generate both summary and title
    const prompt = `Summarize the following text and provide a title for the summary: ${text}`;
    const { text: resultText, model } = await generateContentWithRetry(
      models[0],
      prompt
    );

    const resultLines = resultText.split("\n").map((line) => line.trim());

    const title = resultLines[0].replace(/^## /, "");
    const summary = resultLines.slice(1).join(" ").trim();

    return NextResponse.json({ summary, title, model }); // Send back the title, summary, and model name
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to summarize text." },
      { status: 500 }
    );
  }
}
