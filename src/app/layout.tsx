// Root layout: loads global fonts and mounts the persistent Redux store and iris overlay.
import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import localFont from "next/font/local";
import ReduxProvider from "../redux/ReduxProvider";
import IrisOverlay from "./components/IrisOverlay";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
  display: "swap",
});

const kiara = localFont({
  src: "./assets/Kiara.otf",
  variable: "--font-kiara",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kiara's Personal Website",
  description: "Personal website for Kiara, showcasing projects, resume, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-screen w-screen" lang="en">
      <body className={`h-screen w-screen ${inter.className} ${kiara.variable} ${pressStart2P.variable}`}>
        <ReduxProvider>
          {children}
          <IrisOverlay />
        </ReduxProvider>
      </body>
    </html>
  );
}
