import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EveryRandSA Admin",
  description: "Admin dashboard for EveryRandSA – South Africa's financial comparison platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
