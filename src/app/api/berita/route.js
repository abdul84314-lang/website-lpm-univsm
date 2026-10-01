import { NextResponse } from 'next/server';

// PENTING: Ganti dengan URL Web App Google Apps Script Anda yang TERBARU
const GAS_URL = 'https://script.google.com/macros/s/AKfycbz-Yg1meaU9Tne_Pl02wq5M58eR9NK_Jn9RY6qx9gBk9TuaLuvk-0AKs9jjBWv4LyvL7Q/exec'; 

// 1. MENGAMBIL DATA BERITA (READ)
export async function GET() {
  try {
    // Memanggil parameter ?sheet=berita
    const response = await fetch(`${GAS_URL}?sheet=berita`, {
      cache: 'no-store' 
    });
    
    const news = await response.json();
    return NextResponse.json(news);
    
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data berita' }, { status: 500 });
  }
}

// 2. MENAMBAH DATA BERITA BARU (CREATE)
export async function POST(request) {
  try {
    const newData = await request.json();
    
    // Menambahkan penanda sheet dan aksi untuk GAS
    newData.sheet = 'berita';
    newData.action = 'CREATE';

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Menghindari CORS
      body: JSON.stringify(newData)
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambah data berita' }, { status: 500 });
  }
}

// 3. MENGUBAH DATA BERITA (UPDATE)
export async function PUT(request) {
  try {
    const updateData = await request.json();
    
    // Pastikan ID berita yang ingin diedit dikirimkan dari frontend
    if (!updateData.id) {
        return NextResponse.json({ error: 'ID wajib disertakan untuk update berita' }, { status: 400 });
    }

    updateData.sheet = 'berita';
    updateData.action = 'UPDATE';

    const response = await fetch(GAS_URL, {
      method: 'POST', // Komunikasi ke GAS tetap POST
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengubah data berita' }, { status: 500 });
  }
}

// 4. MENGHAPUS DATA BERITA (DELETE)
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    // Pastikan ID berita yang ingin dihapus dikirimkan
    if (!id) {
        return NextResponse.json({ error: 'ID wajib disertakan untuk hapus berita' }, { status: 400 });
    }

    const deleteData = {
        sheet: 'berita',
        action: 'DELETE',
        id: id
    };

    const response = await fetch(GAS_URL, {
      method: 'POST', 
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(deleteData)
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus data berita' }, { status: 500 });
  }
}
