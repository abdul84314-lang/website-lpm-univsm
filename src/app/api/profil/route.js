import { NextResponse } from 'next/server';

// PENTING: Ganti dengan URL Web App Google Apps Script Anda yang TERBARU
const GAS_URL = 'https://script.google.com/macros/s/AKfycb.../exec'; 

// MENGAMBIL DATA PROFIL (READ)
export async function GET() {
  try {
    // Panggil ?sheet=profil (huruf kecil)
    const response = await fetch(`${GAS_URL}?sheet=profil`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data profil' }, { status: 500 });
  }
}

// MENGUBAH DATA PROFIL (UPDATE)
export async function PUT(request) {
  try {
    const updateData = await request.json();
    
    // Tambahkan parameter sheet dan action
    updateData.sheet = 'profil';
    updateData.action = 'UPDATE'; 

    const response = await fetch(GAS_URL, {
      method: 'POST', // Komunikasi ke GAS selalu POST
      headers: { 
        'Content-Type': 'text/plain;charset=utf-8' 
      },
      // Kirim data langsung
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengubah data profil' }, { status: 500 });
  }
}
