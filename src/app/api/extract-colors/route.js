// app/api/extract-colors/route.js
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { kmeans } from 'ml-kmeans';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const { data, info } = await sharp(arrayBuffer).raw().toBuffer({ resolveWithObject: true });

    const pixels = [];
    for (let i = 0; i < data.length; i += info.channels) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }

    if (pixels.length < 1) {
      return NextResponse.json({
        colors: [],
        error: "Image contains no pixel data.",
      });
    }
    // console.log("LLL ", pixels)
    // console.log("LLL ", pixels.length)
    let k = Math.min(10, pixels.length); // Ensure k is smaller than pixels.length

    //Add check that k is a positive integer
    if (k < 1) {
      k = 1;
    }
    
    const cluster = kmeans(pixels, k, { initialization: "random" }); // Correct usage: kmeans(data, k, options)
    const { centroids } = cluster;
    
    const hexColors = centroids.map((rgb) => {
      const [r, g, b] = rgb.map((c) => Math.round(c));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    });
    
    return NextResponse.json({ cluster: cluster , colors: hexColors });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}