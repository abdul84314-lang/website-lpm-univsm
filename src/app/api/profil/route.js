import { NextResponse } from 'next/server';

const SHEET_URL = 'https://sheetdb.io/api/v1/xjth2jttyy0dw';

// MENGAMBIL DATA PROFIL (READ)
export async function GET() {
  try {
    const response = await fetch(`${SHEET_URL}?sheet=Profil`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data Profil' }, { status: 500 });
  }
}

// MENGUBAH DATA PROFIL (UPDATE) - Hanya mengubah data di baris id=1
export async function PUT(request) {
  try {
    const updateData = await request.json();
    
    const response = await fetch(`${SHEET_URL}/id/1?sheet=Profil`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: updateData })
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengubah data Profil' }, { status: 500 });
  }
}