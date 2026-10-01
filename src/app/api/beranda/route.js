import { NextResponse } from 'next/server';

// PENTING: Ganti dengan URL Web App Google Apps Script Anda yang TERBARU
const GAS_URL = 'https://script.google.com/macros/s/AKfycbz-Yg1meaU9Tne_Pl02wq5M58eR9NK_Jn9RY6qx9gBk9TuaLuvk-0AKs9jjBWv4LyvL7Q/exec'; 

// MENGAMBIL DATA BERANDA (READ)
export async function GET() {
  try {
    // Panggil ?sheet=beranda (huruf kecil sesuai di Google Apps Script)
    const response = await fetch(`${GAS_URL}?sheet=beranda`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data beranda' }, { status: 500 });
  }
}

// MENGUBAH DATA BERANDA (UPDATE)
export async function PUT(request) {
  try {
    const updateData = await request.json();
    
    // Tambahkan parameter sheet dan action untuk dibaca oleh GAS
    updateData.sheet = 'beranda';
    updateData.action = 'UPDATE'; 

    const response = await fetch(GAS_URL, {
      method: 'POST', // Ingat, komunikasi ke GAS selalu menggunakan POST
      headers: { 
        'Content-Type': 'text/plain;charset=utf-8' // Hindari block CORS
      },
      // Kirim data langsung tanpa dibungkus { data: ... }
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengubah data beranda' }, { status: 500 });
  }
}
