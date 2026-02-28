import { NextResponse } from 'next/server';

// Ganti KODE_RAHASIA_ANDA dengan API ID dari SheetDB Anda
const SHEET_URL = 'https://sheetdb.io/api/v1/xjth2jttyy0dw';

// MENGAMBIL DATA BERANDA (READ)
export async function GET() {
  try {
    const response = await fetch(`${SHEET_URL}?sheet=Beranda`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data Beranda' }, { status: 500 });
  }
}

// MENGUBAH DATA BERANDA (UPDATE) - Hanya mengubah data di baris id=1
export async function PUT(request) {
  try {
    const updateData = await request.json();
    
    // Perhatikan tambahan /id/1 untuk menargetkan baris pertama saja
    const response = await fetch(`${SHEET_URL}/id/1?sheet=Beranda`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: updateData })
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengubah data Beranda' }, { status: 500 });
  }
}