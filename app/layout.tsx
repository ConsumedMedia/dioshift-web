import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const title = "Dioshift | Streaming TV Advertising for Local Businesses";
const description =
  "Put your local business on the big screen. Dioshift runs your commercial on smart TVs and streaming apps, targeted to your area, with simple monthly plans and no long-term contract.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | Dioshift",
  },
  description,
  applicationName: "Dioshift",
  openGraph: {
    type: "website",
    siteName: "Dioshift",
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col">
        <Navbar />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
