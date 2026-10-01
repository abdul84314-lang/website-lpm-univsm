import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// KONFIGURASI METADATA UNTUK THUMBNAIL WHATSAPP/SOSMED
export const metadata = {
  metadataBase: new URL("https://lpm.univsm.ac.id"),
  title: "Simutu UNIVSM | Lembaga Penjaminan Mutu",
  description: "Sistem Informasi Lembaga Penjaminan Mutu (LPM) Universitas Sapta Mandiri.",
  openGraph: {
    title: "Simutu UNIVSM | Lembaga Penjaminan Mutu",
    description: "Sistem Informasi Lembaga Penjaminan Mutu (LPM) Universitas Sapta Mandiri.",
    url: "https://lpm.univsm.ac.id",
    siteName: "LPM UNIVSM",
    images: [
      {
        url: "/logo.png", // Pastikan file gambar bernama logo.png ada di folder 'public'
        width: 800,
        height: 600,
        alt: "Logo LPM UNIVSM",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
