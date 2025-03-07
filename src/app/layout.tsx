import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReduxProvider from "../redux/ReduxProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-screen w-screen" lang="en">
      <body className={`h-screen w-screen ${inter.className}`}>
        <ReduxProvider> {/* ✅ Wrap in Redux Provider */}
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}