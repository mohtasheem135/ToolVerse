// app/api/colorManipulation/route.ts
import { NextResponse } from "next/server";
import sharp from "sharp";

const colorOperations = [
  "tint",
  "greyscale",
  "grayscale",
  "pipelineColourspace",
  "pipelineColorspace",
  "toColourspace",
  "toColorspace",
];

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const operation = data.get("operation") as string;
    const imageFile = data.get("image") as File | null;
    const operationValue = data.get("operationValue") as string | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!colorOperations.includes(operation)) {
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    let sharpImage = sharp(imageBuffer);

    switch (operation) {
      case "tint":
        if (!operationValue) {
          return NextResponse.json(
            { error: "Tint requires a color (e.g., #FF0000)" },
            { status: 400 }
          );
        }
        sharpImage = sharpImage.tint(operationValue);
        break;
      case "greyscale":
      case "grayscale":
        sharpImage = sharpImage.greyscale();
        break;
      case "pipelineColourspace":
      case "pipelineColorspace":
        if (!operationValue) {
          return NextResponse.json(
            {
              error: "pipelineColorspace requires a color space (e.g., rgb16)",
            },
            { status: 400 }
          );
        }
        try {
          sharpImage = sharpImage.pipelineColourspace(operationValue);
        } catch (error) {
          console.error(error);
          return NextResponse.json(
            { error: "Invalid color space provided" },
            { status: 400 }
          );
        }
        break;
      case "toColourspace":
      case "toColorspace":
        if (!operationValue) {
          return NextResponse.json(
            { error: "toColorspace requires a color space (e.g., srgb)" },
            { status: 400 }
          );
        }
        try {
          sharpImage = sharpImage.toColourspace(operationValue);
        } catch (error) {
          console.error(error);
          return NextResponse.json(
            { error: "Invalid color space provided" },
            { status: 400 }
          );
        }
        break;
      default:
        return NextResponse.json(
          { error: "Invalid operation" },
          { status: 400 }
        );
    }

    const outputBuffer = await sharpImage.png().toBuffer();
    return new NextResponse(outputBuffer, {
      status: 200,
      headers: { "Content-Type": "image/png" },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Operation error:", error.message);
      return NextResponse.json(
        { error: `Image operation failed: ${error.message}` },
        { status: 500 }
      );
    } else {
      // Handle unexpected error types
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
  //   } catch (error: unknown) {
  //     console.error('Operation error:', error.message);
  //     return NextResponse.json({ error: `Image operation failed: ${error.message}` }, { status: 500 });
  //   }
}
