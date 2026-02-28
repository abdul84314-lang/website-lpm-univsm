import { NextResponse } from 'next/server';

// PENTING: Ganti dengan URL Web App Google Apps Script Anda yang TERBARU
const GAS_URL = 'https://script.google.com/macros/s/AKfycb.../exec'; 

// 1. MENGAMBIL DATA dokumen (READ)
export async function GET() {
  try {
    // Memanggil parameter ?sheet=dokumen
    const response = await fetch(`${GAS_URL}?sheet=dokumen`, {
      cache: 'no-store' 
    });
    
    const news = await response.json();
    return NextResponse.json(news);
    
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data dokumen' }, { status: 500 });
  }
}

// 2. MENAMBAH DATA dokumen BARU (CREATE)
export async function POST(request) {
  try {
    const newData = await request.json();
    
    // Menambahkan penanda sheet dan aksi untuk GAS
    newData.sheet = 'dokumen';
    newData.action = 'CREATE';

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Menghindari CORS
      body: JSON.stringify(newData)
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambah data dokumen' }, { status: 500 });
  }
}

// 3. MENGUBAH DATA dokumen (UPDATE)
export async function PUT(request) {
  try {
    const updateData = await request.json();
    
    // Pastikan ID dokumen yang ingin diedit dikirimkan dari frontend
    if (!updateData.id) {
        return NextResponse.json({ error: 'ID wajib disertakan untuk update dokumen' }, { status: 400 });
    }

    updateData.sheet = 'dokumen';
    updateData.action = 'UPDATE';

    const response = await fetch(GAS_URL, {
      method: 'POST', // Komunikasi ke GAS tetap POST
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengubah data dokumen' }, { status: 500 });
  }
}

// 4. MENGHAPUS DATA dokumen (DELETE)
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    // Pastikan ID dokumen yang ingin dihapus dikirimkan
    if (!id) {
        return NextResponse.json({ error: 'ID wajib disertakan untuk hapus dokumen' }, { status: 400 });
    }

    const deleteData = {
        sheet: 'dokumen',
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
    return NextResponse.json({ error: 'Gagal menghapus data dokumen' }, { status: 500 });
  }
}
