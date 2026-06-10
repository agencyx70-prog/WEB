import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ScrollProgress from "../components/ScrollProgress";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingAiAssistant from "../components/FloatingAiAssistant";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
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
  metadataBase: new URL("https://www.thesevenz.com"),
  title: "TheSevenZ — Content, Video, Social & Web",
  description:
    "TheSevenZ — a creative studio for content creation, video editing, social media management, brand deals, and web. Start small, dream big.",
  keywords: "content creation, video editing, social media management, brand deals, web design, creative studio",
  alternates: { canonical: "/" },
  openGraph: {
    title: "TheSevenZ — Content, Video, Social & Web",
    description:
      "A creative studio for content creation, video editing, social media management, brand deals, and web.",
    url: "https://www.thesevenz.com",
    siteName: "TheSevenZ",
    type: "website",
  },
  robots: { index: true, follow: true },
  // After verifying in Google Search Console, paste the code here:
  // verification: { google: "your-verification-code" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${hanken.variable} ${mono.variable}`}>
      <body>
        <div className="bg-glow" />
        <AmbientBlur />
        <div className="grain-overlay" />
        <ScrollProgress />
        <ProgressiveBlur position="top" />
        <Navbar />
        {children}
        <Footer />
        <FloatingAiAssistant />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
