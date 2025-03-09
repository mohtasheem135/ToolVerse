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
  const country = searchParams.get("country") || "india";
  const seriesId = countrySeries[country.toLowerCase()] || countrySeries["india"];

  try {
    const res = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=8fa61f4e3d0557e625aed31bbe04c096&file_type=json&observation_start=1913-01-01&observation_end=2025-12-31`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    const observations = data.observations;

    const yearlyData = observations
      .filter((obs: any) => obs.date.endsWith("-12-01"))
      .map((obs: any, index: number, arr: any[]) => {
        if (index === 0) return null;
        const prevCPI = parseFloat(arr[index - 1].value);
        const currentCPI = parseFloat(obs.value);
        const rate = ((currentCPI - prevCPI) / prevCPI * 100).toFixed(2);
        return {
          year: new Date(obs.date).getFullYear(),
          rate,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ yearlyData });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}