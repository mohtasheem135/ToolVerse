// app/api/textToImage/route.ts
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Expecting JSON data
    const text = data.text;

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const imageBuffer = await sharp({
      text: {
        text: text,
        width: 800, // Adjust as needed
        height: 600, // Adjust as needed
        align: 'center', // Align text to the center
        font: 'sans',
        rgba: true
      },
    }).png().toBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="text_image.png"`,
      },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}