import { NextResponse } from 'next/server';

// PENTING: Ganti dengan URL Web App Google Apps Script Anda yang TERBARU
const GAS_URL = 'https://script.google.com/macros/s/AKfycbz-Yg1meaU9Tne_Pl02wq5M58eR9NK_Jn9RY6qx9gBk9TuaLuvk-0AKs9jjBWv4LyvL7Q/exec'; 

// MENGAMBIL DATA (READ)
export async function GET() {
  try {
    // Karena nama sheet sudah huruf kecil, kita panggil ?sheet=akreditasi
    const response = await fetch(`${GAS_URL}?sheet=akreditasi`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// MENAMBAH DATA BARU (CREATE)
export async function POST(request) {
  try {
    // Ambil data yang dikirim dari form halaman admin
    const newData = await request.json();
    
    // Tambahkan informasi nama sheet ke dalam data yang akan dikirim ke GAS
    newData.sheet = 'akreditasi';

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 
        // WAJIB text/plain agar Google tidak memblokir request (CORS)
        'Content-Type': 'text/plain;charset=utf-8' 
      },
      // Kirim data langsung, tidak perlu dibungkus { data: ... } seperti SheetDB
      body: JSON.stringify(newData)
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambah data' }, { status: 500 });
  }
}
