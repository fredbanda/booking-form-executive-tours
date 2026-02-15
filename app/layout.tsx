import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "Executive Tours - Airport Transfers & Transport",
  description:
    "Book reliable airport transfers and transport in Cape Town. Toyota, Mercedes, luxury vehicles available.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

