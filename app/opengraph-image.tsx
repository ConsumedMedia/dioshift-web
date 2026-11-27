import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { STARTING_PRICE } from "@/lib/metadata";

/*
 * Social share image for every page (Open Graph and, via the root layout's
 * summary_large_image card, Twitter/X). Prerendered at build time.
 */

export const alt = "Dioshift: your business on streaming TV";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same colors as app/globals.css.
const BG = "#0a0b0f";
const ACCENT = "#4f8eff";
const ACCENT_SOFT = "#7eb3ff";
const ACCENT_2 = "#a78bfa";
const GOLD = "#f0c060";
const TEXT = "#f0f0f5";
const TEXT_DIM = "#9ca3af";

/** The site's fonts as TTF (ImageResponse can't read woff2). Falls back to the built-in font. */
async function loadFonts() {
  try {
    const dir = join(process.cwd(), "assets", "fonts");
    const [syne, dmSans] = await Promise.all([
      readFile(join(dir, "Syne-ExtraBold.ttf")),
      readFile(join(dir, "DMSans-Medium.ttf")),
    ]);
    return [
      { name: "Syne", data: syne, style: "normal" as const, weight: 800 as const },
      { name: "DM Sans", data: dmSans, style: "normal" as const, weight: 500 as const },
    ];
  } catch (err) {
    console.warn("[opengraph-image] Could not load fonts, using the default font:", err);
    return undefined;
  }
}

const fontsPromise = loadFonts();

export default async function Image() {
  const fonts = await fontsPromise;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          background: BG,
          color: TEXT,
          fontFamily: "DM Sans",
          padding: "64px 80px",
        }}
      >
        {/* Background glows (explicit color stops: Satori mishandles "transparent") */}
        <div
          style={{
            position: "absolute",
            top: -420,
            left: 0,
            width: 1200,
            height: 840,
            display: "flex",
            background: "radial-gradient(circle, rgba(79,142,255,0.20) 0%, rgba(79,142,255,0) 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 600,
            width: 900,
            height: 900,
            display: "flex",
            background: "radial-gradient(circle, rgba(167,139,250,0.16) 0%, rgba(167,139,250,0) 60%)",
          }}
        />

        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: ACCENT,
              boxShadow: "0 0 24px rgba(79,142,255,0.8)",
            }}
          />
          <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 40, letterSpacing: -1 }}>Dioshift</div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Syne",
            fontWeight: 800,
            fontSize: 76,
            lineHeight: 1.04,
            letterSpacing: -3,
          }}
        >
          <span>Your business on</span>
          <span
            style={{
              backgroundImage: `linear-gradient(90deg, ${ACCENT_SOFT}, ${ACCENT} 55%, ${ACCENT_2})`,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            streaming TV
          </span>
        </div>

        {/* Subline and TV */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 32, lineHeight: 1.35 }}>
            <span style={{ color: TEXT }}>Plans from {STARTING_PRICE}/month.</span>
            <span style={{ color: TEXT_DIM }}>Guaranteed impressions. No contract.</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: 330,
                height: 196,
                padding: 8,
                borderRadius: 16,
                background: "#07080b",
                border: "2px solid rgba(255,255,255,0.12)",
                boxShadow: "0 0 90px -10px rgba(79,142,255,0.5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  height: "100%",
                  borderRadius: 10,
                  padding: "14px 18px",
                  background: "linear-gradient(150deg, #2a4a8f 0%, #0f1a36 45%, #2a2350 100%)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "3px 8px",
                      borderRadius: 5,
                      background: "rgba(0,0,0,0.45)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: 9999, background: GOLD }} />
                    AD
                  </div>
                  <div
                    style={{
                      display: "flex",
                      padding: "3px 8px",
                      borderRadius: 5,
                      background: "rgba(0,0,0,0.45)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    0:30
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 24, lineHeight: 1.05, color: "#fff" }}>
                    Your Business Here.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginTop: 10,
                      height: 4,
                      borderRadius: 9999,
                      background: "rgba(255,255,255,0.15)",
                    }}
                  >
                    <div style={{ width: "62%", height: 4, borderRadius: 9999, background: GOLD }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Stand */}
            <div style={{ display: "flex", width: 70, height: 16, background: "#15171d" }} />
            <div style={{ display: "flex", width: 130, height: 6, borderRadius: 9999, background: "#15171d" }} />
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
