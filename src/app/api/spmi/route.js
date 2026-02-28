import { NextResponse } from 'next/server';

// PENTING: Ganti dengan URL Web App Google Apps Script Anda yang TERBARU
const GAS_URL = 'https://script.google.com/macros/s/AKfycb.../exec'; 

// MENGAMBIL DATA SPMI (READ)
export async function GET() {
  try {
    // Panggil ?sheet=spmi (huruf kecil)
    const response = await fetch(`${GAS_URL}?sheet=spmi`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data SPMI' }, { status: 500 });
  }
}

// MENGUBAH DATA SPMI (UPDATE)
export async function PUT(request) {
  try {
    const updateData = await request.json();
    
    // Tambahkan parameter sheet dan action
    updateData.sheet = 'spmi';
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
    return NextResponse.json({ error: 'Gagal mengubah data SPMI' }, { status: 500 });
  }
}
