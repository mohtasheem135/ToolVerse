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
  const year = searchParams.get("year");
  const country = searchParams.get("country") || "india";
//   const seriesId = countrySeries[country.toLowerCase()] || countrySeries["india"];
const seriesId = countrySeries[country.toLowerCase()] || countrySeries["india"];
  if (!year || isNaN(parseInt(year))) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=8fa61f4e3d0557e625aed31bbe04c096&file_type=json&observation_start=${year}-01-01&observation_end=${year}-12-31`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    const observations = data.observations;

    const prevYearRes = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=8fa61f4e3d0557e625aed31bbe04c096&file_type=json&observation_start=${parseInt(year) - 1}-12-01&observation_end=${parseInt(year) - 1}-12-31`
    );
    const prevYearData = await prevYearRes.json();
    const decPrevYearCPI = parseFloat(prevYearData.observations.slice(-1)[0].value);

    const monthlyRates = observations.map((obs: any, index: number) => {
      if (index === 0) return null;
      const prevCPI = parseFloat(observations[index - 1].value);
      const currentCPI = parseFloat(obs.value);
      const rate = ((currentCPI - prevCPI) / prevCPI * 100).toFixed(2);
      return {
        month: new Date(obs.date).toLocaleString("default", { month: "long" }),
        rate,
      };
    }).filter(Boolean);

    const decCPI = parseFloat(observations.slice(-1)[0].value);
    const yearlyRate = ((decCPI - decPrevYearCPI) / decPrevYearCPI * 100).toFixed(2);

    return NextResponse.json({ yearlyRate, monthlyRates });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}