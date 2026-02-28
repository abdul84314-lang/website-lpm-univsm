import { NextResponse } from 'next/server';

const SHEET_URL = 'https://sheetdb.io/api/v1/xjth2jttyy0dw';

// MENGAMBIL DATA AKREDITASI (READ) - Akan mengambil banyak baris
export async function GET() {
  try {
    const response = await fetch(`${SHEET_URL}?sheet=Akreditasi`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data Akreditasi' }, { status: 500 });
  }
}

// MENAMBAH DATA AKREDITASI BARU (CREATE) - Menambah baris baru di bawah
export async function POST(request) {
  try {
    const newData = await request.json();
    
    const response = await fetch(`${SHEET_URL}?sheet=Akreditasi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: newData }) // SheetDB mengharuskan format dibungkus object { data: ... }
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambah data Akreditasi' }, { status: 500 });
  }
}