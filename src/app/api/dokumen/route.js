import { NextResponse } from 'next/server';

// Menggunakan API ID SheetDB Anda: xjth2jttyy0dw
const SHEETDB_API_ID = 'xjth2jttyy0dw'; 
const SHEET_URL = `https://sheetdb.io/api/v1/${SHEETDB_API_ID}`;

// MENGAMBIL DATA DOKUMEN (READ)
export async function GET() {
  try {
    // Memanggil data dari tab 'Dokumen'
    const response = await fetch(`${SHEET_URL}?sheet=Dokumen`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Gagal menghubungi SheetDB untuk data Dokumen');
    }

    const data = await response.json();

    /**
     * MAPPING DATA:
     * Menyesuaikan nama kolom dari Google Sheets (Bahasa Indonesia)
     * ke nama properti yang dibutuhkan oleh frontend page.js
     */
    const formattedData = data.map(item => ({
      id: item.id,
      title: item.nama_dokumen,    // Kolom Sheets: nama_dokumen
      category: item.kategori_ppepp, // Kolom Sheets: kategori_ppepp
      type: item.tipe_file,        // Kolom Sheets: tipe_file
      size: item.ukuran,           // Kolom Sheets: ukuran
      url: item.url_dokumen        // Kolom Sheets: url_dokumen
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// MENAMBAH DATA DOKUMEN (CREATE)
export async function POST(request) {
  try {
    const body = await request.json();
    
    /**
     * SESUAIKAN INPUT:
     * Mengubah data dari format frontend ke nama kolom Google Sheets
     * agar tersimpan di kolom yang benar.
     */
    const dataBaru = {
      id: body.id || Date.now().toString(),
      nama_dokumen: body.title,
      kategori_ppepp: body.category,
      tipe_file: body.type,
      ukuran: body.size,
      url_dokumen: body.url
    };

    const response = await fetch(`${SHEET_URL}?sheet=Dokumen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: dataBaru })
    });
    
    if (!response.ok) {
      throw new Error('Gagal menambah data dokumen ke Google Sheets');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}