import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("image") as File | null;
    const sigmaValue = data.get("sigma") as number | null;
    console.log(sigmaValue)

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const metadata = await sharp(buffer).metadata();
    const { width, height, channels } = metadata;

    if (!width || !height || !channels) {
      return NextResponse.json(
        { error: "Could not determine image dimensions" },
        { status: 500 }
      );
    }

    // Generate Gaussian noise
    const noiseBuffer = await sharp({
      // @ts-expect-error: We are intentionally ignoring this error at the moment
      create: {
        width,
        height,
        channels,
        noise: {
          type: "gaussian",
          mean: 0,
          sigma: Number(sigmaValue), // Adjust this for noise intensity
        },
      },
    })
      .raw()
      .toBuffer();

    const noisyImageBuffer = await sharp(buffer)
      .raw()
      .toBuffer()
      .then((originalBuffer) => {
        const noisyPixels = new Uint8Array(originalBuffer.length);
        for (let i = 0; i < originalBuffer.length; i++) {
          noisyPixels[i] = Math.max(
            0,
            Math.min(255, originalBuffer[i] + noiseBuffer[i] - 128)
          ); // Subtract 128 because sharp create gaussian noise with mean 128
        }
        return Buffer.from(noisyPixels);
      });

    const outputBuffer = await sharp(noisyImageBuffer, {
      raw: { width, height, channels },
    })
      .png()
      .toBuffer();

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="noisy_image.png"`,
      },
    });
  } catch (error) {
    console.error("Error adding noise:", error);
    return NextResponse.json(
      { error: "Failed to add noise to image" },
      { status: 500 }
    );
  }
}
