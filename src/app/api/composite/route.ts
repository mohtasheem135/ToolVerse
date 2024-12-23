// app/api/composite/route.ts
import { NextResponse } from 'next/server';
import sharp from 'sharp';

const compositeOperations = [
  'clear', 'source', 'over', 'in', 'out', 'atop', 'dest', 'dest-over',
  'dest-in', 'dest-out', 'dest-atop', 'xor', 'add', 'saturate', 'multiply',
  'screen', 'overlay', 'darken', 'lighten', 'colour-dodge', 'color-dodge',
  'colour-burn', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion',
];

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const operation = data.get('operation') as string;
    const images = [];

    if (!compositeOperations.includes(operation)) {
      return NextResponse.json({ error: 'Invalid composite operation' }, { status: 400 });
    }

    for (let i = 0; i < 3; i++) { // Max 3 images
      const file = data.get(`image${i + 1}`) as File | null;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        images.push(buffer);
      }
    }

    if (images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    let compositeImage = sharp(images[0]);

    if (images.length > 1) {
      const compositeArray = images.slice(1).map((imageBuffer) => ({
        input: imageBuffer,
        blend: operation,
      }));
      // @ts-expect-error: We are intentionally ignoring this error at the moment
      compositeImage = compositeImage.composite(compositeArray);
    }

    const outputBuffer = await compositeImage.png().toBuffer();

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="composite_image.png"`,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Composite error:', error.message);
      return NextResponse.json({ error: `Composite operation failed: ${error.message}` }, { status: 500 });
    } else {
      // Handle the case where the error is not an instance of Error (e.g., a string or number)
      console.error('Unexpected error:', error);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}