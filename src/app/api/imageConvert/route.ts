import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("image") as File | null;
    const format = (data.get("format") as string | null) || "png";
    const width = data.get("width") as string | null;
    const height = data.get("height") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let image = sharp(buffer);

    if (width || height) {
      image = image.resize(
        width ? parseInt(width, 10) : null,
        height ? parseInt(height, 10) : null
      );
    }
    let outputBuffer: Buffer;
    let contentType: string;
    let filenameExtension: string;
    switch (format.toLowerCase()) {
      case "png":
        outputBuffer = await image.png().toBuffer();
        contentType = "image/png";
        filenameExtension = "png";
        break;
      case "jpg":
      case "jpeg":
        outputBuffer = await image.jpeg().toBuffer();
        contentType = "image/jpeg";
        filenameExtension = "jpg";
        break;
      case "webp":
        outputBuffer = await image.webp().toBuffer();
        contentType = "image/webp";
        filenameExtension = "webp";
        break;
      case "avif":
        outputBuffer = await image.avif().toBuffer();
        contentType = "image/avif";
        filenameExtension = "avif";
        break;
      case "tiff":
        outputBuffer = await image.tiff().toBuffer();
        contentType = "image/tiff";
        filenameExtension = "tiff";
        break;
      default:
        return NextResponse.json(
          { error: "Invalid format specified" },
          { status: 400 }
        );
    }
    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="converted.${filenameExtension}"`,
      },
    });
  } catch (error) {
    console.error("Error converting image:", error);
    return NextResponse.json(
      { error: "Failed to convert image" },
      { status: 500 }
    );
  }
}
