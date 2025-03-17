// /app/api/openai/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define the type for the incoming request body
interface RequestBody {
  text: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { text }: RequestBody = await request.json(); // Type the request body

    // Send request to OpenAI to generate a summary using the GPT model
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or another model that suits your needs
      messages: [{ role: 'user', content: `Summarize the following text: ${text}` }],
    });

    // Extract the summary from the response
    const summary = completion.choices[0].message.content;

    // Return the summary as JSON response
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Return an error response if something goes wrong
    return NextResponse.json(
      { error: 'Failed to summarize text.' },
      { status: 500 }
    );
  }
}
