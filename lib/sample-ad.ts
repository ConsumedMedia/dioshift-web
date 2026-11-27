/**
 * The fictional :30 ad that plays on the hero TV and the small TV in the
 * "How it works" stepper. Edit the frames here. The business, phone number
 * (555-01xx is reserved for fiction) and .example web address are all made up.
 */

export type SampleAdFrame =
  | { kind: "brand"; name: string; tagline: string }
  | { kind: "service"; eyebrow: string; headline: string; detail: string }
  | { kind: "area"; eyebrow: string; headline: string; detail: string }
  | { kind: "cta"; eyebrow: string; phone: string; web: string };

export const SAMPLE_AD_BUSINESS = "Ridgeline Roofing";

export const SAMPLE_AD_FRAMES: SampleAdFrame[] = [
  { kind: "brand", name: SAMPLE_AD_BUSINESS, tagline: "Roofs, gutters and siding" },
  {
    kind: "service",
    eyebrow: SAMPLE_AD_BUSINESS,
    headline: "Free roof inspections",
    detail: "Storm damage, repairs and replacements",
  },
  {
    kind: "area",
    eyebrow: SAMPLE_AD_BUSINESS,
    headline: "Serving Central Ohio",
    detail: "Columbus and the surrounding suburbs",
  },
  {
    kind: "cta",
    eyebrow: "Book your free inspection",
    phone: "(614) 555-0142",
    web: "ridgelineroofing.example",
  },
];

/** Seconds each frame stays on screen before crossfading to the next. */
export const SAMPLE_AD_FRAME_SECONDS = 3.5;
