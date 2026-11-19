import { Geist_Mono, Pacifico, Playfair_Display } from "next/font/google";
import "./globals.css";
import StellarIntro from "./components/intro/stellar-intro";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stellar | Find your New York home",
  description:
    "Creating, investing, developing and living in the New York neighborhoods that feel like home.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${pacifico.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#081a4d]">
        <StellarIntro />
        {children}
      </body>
    </html>
  );
}
