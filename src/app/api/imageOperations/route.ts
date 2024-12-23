// app/api/imageOperations/route.ts
import { NextResponse } from "next/server";
import sharp from "sharp";

const imageOperations = [
  "rotate",
  "flip",
  "flop",
  "sharpen",
  "median",
  "blur",
  "flatten",
  "gamma",
  "negate",
  "normalize",
  "clahe",
  "convolve",
  "threshold",
  "linear",
  "recomb",
  "modulate",
];

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const operation = data.get("operation") as string;
    const imageFile = data.get("image") as File | null;
    const operationValue = data.get("operationValue");

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!imageOperations.includes(operation)) {
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    let sharpImage = sharp(imageBuffer);

    switch (operation) {
      case "rotate":
        sharpImage = sharpImage.rotate(Number(operationValue) || undefined);
        break;
      case "flip":
        sharpImage = sharpImage.flip();
        break;
      case "flop":
        sharpImage = sharpImage.flop();
        break;
      case "sharpen":
        sharpImage = sharpImage.sharpen(Number(operationValue) || undefined);
        break;
      case "median":
        sharpImage = sharpImage.median(Number(operationValue) || undefined);
        break;
      case "blur":
        sharpImage = sharpImage.blur(Number(operationValue) || undefined);
        break;
      case "flatten":
        sharpImage = sharpImage.flatten();
        break;
      case "gamma":
        sharpImage = sharpImage.gamma(Number(operationValue) || undefined);
        break;
      case "negate":
        sharpImage = sharpImage.negate();
        break;
      case "normalize":
        sharpImage = sharpImage.normalize();
        break;
      case "normalise":
        sharpImage = sharpImage.normalize();
        break;
      case "clahe":
        sharpImage = sharpImage.clahe({
          width: Number((operationValue as string)?.split(",")[0]),
          height: Number((operationValue as string)?.split(",")[1]),
        });
        break;
      case "convolve":
        const kernel = (operationValue as string)?.split(",").map(Number);
        if (kernel && kernel.length > 0) {
          sharpImage = sharpImage.convolve({
            width: Math.sqrt(kernel.length),
            height: Math.sqrt(kernel.length),
            kernel: kernel,
          });
        }
        break;
      case "threshold":
        sharpImage = sharpImage.threshold(Number(operationValue) || undefined);
        break;
      case "linear":
        const [a, b] = (operationValue as string).split(",").map(Number);
        sharpImage = sharpImage.linear(a, b);
        break;
      case "recomb":
        let matrix: number[] | undefined;
        if (typeof operationValue === "string") {
          matrix = operationValue.split(",").map(Number);
          if (matrix && matrix.length == 9) {
            // sharpImage = sharpImage.recomb([
            //   matrix.slice(0, 3),
            //   matrix.slice(3, 6),
            //   matrix.slice(6, 9),
            // ]);
            sharpImage = sharpImage.recomb([
              [matrix[0], matrix[1], matrix[2]],
              [matrix[3], matrix[4], matrix[5]],
              [matrix[6], matrix[7], matrix[8]], 
            ]);
          }
        } else {
          console.log("The value is not a string", operationValue);
        }
        // const matrix = operationValue?.split(',').map(Number);
        break;
      case "modulate":
        const [brightness, saturation, hue] = (operationValue as string)
          .split(",")
          .map(Number);
        sharpImage = sharpImage.modulate({ brightness, saturation, hue });
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
  
}
