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

export const metadata = {
  title: "Simutu UNIVSM | Lembaga Penjaminan Mutu",
  description: "Sistem Informasi Lembaga Penjaminan Mutu (LPM) Universitas Sapta Mandiri.",
  
  // 1. KUNCI DOMAIN AGAR NEXT.JS TIDAK BINGUNG
  metadataBase: new URL('https://lpm.univsm.ac.id'),
  
  // 2. PENGATURAN THUMBNAIL UNTUK WHATSAPP, FACEBOOK, TELEGRAM
  openGraph: {
    title: "Simutu UNIVSM | Lembaga Penjaminan Mutu",
    description: "Sistem Informasi Lembaga Penjaminan Mutu (LPM) Universitas Sapta Mandiri.",
    url: "https://lpm.univsm.ac.id",
    siteName: "LPM UNIVSM",
    images: [
      {
        // Pastikan file gambar bernama logo.png ada di dalam folder "public"
        url: "https://lpm.univsm.ac.id/logo.png", 
        width: 800,
        height: 600,
        alt: "Logo LPM UNIVSM",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  
  // 3. PENGATURAN THUMBNAIL UNTUK X/TWITTER
  twitter: {
    card: "summary_large_image",
    title: "Simutu UNIVSM | Lembaga Penjaminan Mutu",
    description: "Sistem Informasi Lembaga Penjaminan Mutu (LPM) Universitas Sapta Mandiri.",
    images: ["https://lpm.univsm.ac.id/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    // Mengubah lang ke "id" agar SEO lebih optimal di Indonesia
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
