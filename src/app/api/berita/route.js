import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Ganti URL di bawah ini dengan URL API dari SheetDB / SteinHQ milik Anda
    const response = await fetch('https://sheetdb.io/api/v1/xjth2jttyy0dw', {
      // Menambahkan parameter ini agar Next.js selalu mengambil data terbaru dari Sheets
      cache: 'no-store' 
    });
    
    // 2. Ubah respon menjadi JSON
    const news = await response.json();
    
    // 3. Kirim ke halaman website
    return NextResponse.json(news);
    
  } catch (error) {
    // Jika terjadi error saat mengambil data
    return NextResponse.json({ error: 'Gagal mengambil data berita' }, { status: 500 });
  }
}