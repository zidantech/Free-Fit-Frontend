import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freefit.com - Live Sports Streaming",
  description: "Stream the biggest matches and events from across the continent in HD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}