import { NextResponse } from 'next/server';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbzikbzH43irKSoEmNscn_It4XFXcgA6RtlErWdL-nZHwScREiX-coZyxCQetb-B9buwVw/exec';

// FUNGSI UNTUK MENGAMBIL DATA (READ)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sheet = searchParams.get('sheet');
    
    if (!sheet) return NextResponse.json({ error: 'Parameter sheet kosong' }, { status: 400 });

    const response = await fetch(`${GAS_URL}?sheet=${sheet}`, { cache: 'no-store' });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// FUNGSI UNTUK TAMBAH, EDIT, DAN HAPUS (CREATE, UPDATE, DELETE)
export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memproses data' }, { status: 500 });
  }
}
