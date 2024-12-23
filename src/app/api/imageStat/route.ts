// app/api/extract/route.ts
import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("image") as File | null;
    const x = Math.round(Number(data.get("x"))); // Round to integer
    const y = Math.round(Number(data.get("y"))); // Round to integer
    const width = Math.round(Number(data.get("width"))); // Round to integer
    const height = Math.round(Number(data.get("height"))); // Round to integer

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
      return NextResponse.json(
        { error: "Invalid region parameters" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const metadata = await sharp(buffer).metadata();
      const maxWidth = metadata.width || 0;
      const maxHeight = metadata.height || 0;

      // Ensure extracted region is within image bounds
      const safeWidth = Math.min(width, maxWidth - x);
      const safeHeight = Math.min(height, maxHeight - y);
      if (x < 0 || y < 0 || safeWidth < 0 || safeHeight < 0) {
        return NextResponse.json(
          { error: "Invalid region parameters" },
          { status: 400 }
        );
      }
      const extractedBuffer = await sharp(buffer)
        .extract({ left: x, top: y, width: safeWidth, height: safeHeight })
        .toBuffer();

      const stats = await sharp(extractedBuffer).stats();
      return NextResponse.json(
        { image: extractedBuffer.toString("base64"), stats, metadata },
        { status: 200 }
      );
    } catch (sharpError: unknown) {
      if (sharpError instanceof Error) {
        console.error("Sharp error:", sharpError.message);
        return NextResponse.json(
          { error: `Sharp image processing failed: ${sharpError.message}` },
          { status: 500 }
        );
      } else {
        // Handle unexpected error types
        console.error("Unexpected error:", sharpError);
        return NextResponse.json(
          { error: "An unexpected error occurred" },
          { status: 500 }
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("General error:", error.message);
      return NextResponse.json(
        { error: `An unexpected error occurred: ${error.message}` },
        { status: 500 }
      );
    } else {
      // Handle the case where the error is not an instance of Error (e.g., a string or number)
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
