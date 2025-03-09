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

interface FredObservation {
  date: string;
  value: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || "india";
  const seriesId =
    countrySeries[country.toLowerCase()] || countrySeries["india"];

  try {
    const res = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${process.env.FRED_API_KEY}&file_type=json&observation_start=1913-01-01&observation_end=2025-12-31`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    // const observations = data.observations;
    const observations: FredObservation[] = data.observations;
    const yearlyData = observations
      .filter((obs) => obs.date.endsWith("-12-01"))
      .map((obs, index: number, arr) => {
        if (index === 0) return null;
        const prevCPI = parseFloat(arr[index - 1].value);
        const currentCPI = parseFloat(obs.value);
        const rate = (((currentCPI - prevCPI) / prevCPI) * 100).toFixed(2);
        return {
          year: new Date(obs.date).getFullYear(),
          rate,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ yearlyData });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
