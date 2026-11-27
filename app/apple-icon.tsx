import { ImageResponse } from "next/og";

/*
 * iOS home screen icon, drawn from the same design as app/icon.svg: a blue
 * dot with a soft glow on the dark background. Square and full bleed, since
 * iOS rounds the corners itself. Prerendered at build time.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0b0f",
        }}
      >
        {/* Glow: icon.svg's r=22 of 64, scaled to 180 */}
        <div
          style={{
            position: "absolute",
            width: 124,
            height: 124,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(79,142,255,0.55) 0%, rgba(79,142,255,0) 70%)",
          }}
        />
        {/* Dot: icon.svg's r=11 of 64 */}
        <div style={{ width: 62, height: 62, borderRadius: 9999, background: "#4f8eff" }} />
      </div>
    ),
    size,
  );
}
