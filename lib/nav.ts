export const NAV_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/industries", label: "Industries" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const GET_STARTED = { href: "/signup", label: "Get Started" } as const;

/** Footer links: the main nav plus pages that don't fit in the header. */
export const FOOTER_LINKS = [
  ...NAV_LINKS,
  { href: "/about", label: "About" },
  { href: "/streaming-tv-advertising", label: "Streaming TV Guide" },
  { href: "/columbus-streaming-tv-advertising", label: "Columbus" },
  GET_STARTED,
] as const;

export const LEGAL_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
] as const;
