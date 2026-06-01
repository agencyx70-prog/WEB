import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ScrollProgress from "../components/ScrollProgress";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
import FloatingAiAssistant from "../components/FloatingAiAssistant";
import AmbientBlur from "../components/AmbientBlur";
import ProgressiveBlur from "../components/ProgressiveBlur";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata = {
  title: "AGENCY.X — Affordable Web Design for Startups",
  description:
    "A new agency building beautiful, affordable websites for restaurants, e-commerce, and small businesses. Start small, dream big.",
  keywords: "web design, affordable websites, restaurant website, e-commerce, startup",
  openGraph: {
    title: "AGENCY.X — Affordable Web Design for Startups",
    description:
      "A new agency building beautiful, affordable websites for restaurants, e-commerce, and small businesses.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${hanken.variable} ${mono.variable}`}>
      <body>
        <div className="bg-glow" />
        <AmbientBlur />
        <div className="grain-overlay" />
        <CustomCursor />
        <ScrollProgress />
        <ProgressiveBlur position="top" />
        <Navbar />
        {children}
        <Footer />
        <FloatingAiAssistant />
      </body>
    </html>
  );
}
