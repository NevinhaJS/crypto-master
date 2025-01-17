import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Orbitron } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Master",
  description:
    "Ask me anything about crypto and I'll do my best to answer your questions!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${orbitron.className} ${inter.className} antialiased`}
        >
          {children}
        </body>

        <GoogleAnalytics gaId="G-5V8WHC2C6C" />
      </html>
    </ClerkProvider>
  );
}
