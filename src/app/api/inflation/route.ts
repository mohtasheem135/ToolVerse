import { NextResponse } from "next/server";

const countrySeries: Record<string, string> = {
    india: "INCPIALLMINMEI",
    united_states: "CPIAUCNS",
    united_kingdom: "GBRCPIALLMINMEI",
    canada: "CPALTT01CAM657N",
    australia: "AUSCPIALLMINMEI",
    germany: "DEUCPIALLMINMEI",
    france: "FRCPIALLMINMEI",
    japan: "JPNCPIALLMINMEI",
    china: "CHNCPIALLMINMEI",
    south_korea: "KORCPIALLMINMEI",
    brazil: "BRACPIALLMINMEI",
    russia: "RUSCPIALLMINMEI",
    mexico: "MXNCPIALLMINMEI",
    south_africa: "ZAFCPICORMINMEI",
    italy: "ITACPIALLMINMEI",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || "india"; // Default to India
//   const seriesId = countrySeries[country.toLowerCase()] || countrySeries["india"];
const seriesId = countrySeries[country.toLowerCase()] || countrySeries["india"];

  try {
    const res = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${process.env.FRED_API_KEY}&file_type=json`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) throw new Error("Failed to fetch data");
    const data = await res.json();
    const latestCPI = parseFloat(data.observations.slice(-1)[0].value);
    const yearAgoCPI = parseFloat(data.observations.slice(-13, -12)[0].value);
    const inflationRate = ((latestCPI - yearAgoCPI) / yearAgoCPI * 100).toFixed(2);
    return NextResponse.json({ inflationRate, country });
  } catch (error) {
    console.error("Error fetching inflation rate:", error);
    return NextResponse.json({ inflationRate: "4.31", country: "india" }); // Fallback to India’s Jan 2025 rate
  }
}