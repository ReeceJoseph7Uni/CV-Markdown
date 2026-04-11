import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: [
    { path: "../../public/fonts/geist-latin-ext.woff2", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/geist-latin.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "EveryRandSA – SA Finance Calculators & Comparisons",
  description:
    "Free South African finance calculators: PAYE tax, bond, loan, TFSA tracker. Compare savings accounts and loans from major SA banks. Data sourced from SARB and SARS.",
  keywords: "PAYE calculator, South Africa, TFSA, bond calculator, savings comparison, SARB, SARS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
