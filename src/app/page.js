"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, X, ChevronRight, ChevronDown, Award, BookOpen, FileCheck, 
  Activity, Search, MapPin, Phone, Mail, ExternalLink, ShieldCheck,
  Download, Filter, ChevronLeft, Loader2, Building, Target,
  FileText, PieChart, Users
} from 'lucide-react';

// =========================================================================
// PENTING: GANTI URL DI BAWAH INI DENGAN URL WEB APP DARI GOOGLE APPS SCRIPT
// =========================================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzcCJAq86ZsIxipm9ujhPf93eTlbXS8wtrvMvFF8aTY8MvrZ5r-FysBBw3lsRoOJpLa0g/exec"; 

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State khusus untuk menu bertingkat di versi Mobile
  const [mobileSurveiOpen, setMobileSurveiOpen] = useState(false);
  const [mobileInstrumenOpen, setMobileInstrumenOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState('beranda');
  const [docCategory, setDocCategory] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);

  // State untuk menyimpan data masing-masing halaman dari Spreadsheet
  const [dataBeranda, setDataBeranda] = useState({});
  const [dataProfil, setDataProfil] = useState({});
  const [dataSPMI, setDataSPMI] = useState({});
  const [dataAkreditasi, setDataAkreditasi] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [news, setNews] = useState([]);
  const [dataPeraturan, setDataPeraturan] = useState([]);
  const [dataKepuasan, setDataKepuasan] = useState([]);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!GOOGLE_SCRIPT_URL) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        if (currentPage === 'beranda') {
          const resBeranda = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=beranda`);
          const jsonBeranda = await resBeranda.json();
          if (!jsonBeranda.error) setDataBeranda(jsonBeranda);

          if (news.length === 0) {
            const resBerita = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=berita`);
            const jsonBerita = await resBerita.json();
            if (Array.isArray(jsonBerita)) setNews(jsonBerita);
          }
        } 
        else if (currentPage === 'profil' && Object.keys(dataProfil).length === 0) {
          const resProfil = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=profil`);
          const jsonProfil = await resProfil.json();
          if (!jsonProfil.error) setDataProfil(jsonProfil);
        }
        else if (currentPage === 'spmi' && Object.keys(dataSPMI).length === 0) {
          const resSPMI = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=spmi`);
          const jsonSPMI = await resSPMI.json();
          if (!jsonSPMI.error) setDataSPMI(jsonSPMI);
        }
        else if (currentPage === 'akreditasi' && dataAkreditasi.length === 0) {
          const resAkreditasi = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=akreditasi`);
          const jsonAkreditasi = await resAkreditasi.json();
          if (Array.isArray(jsonAkreditasi)) setDataAkreditasi(jsonAkreditasi);
        }
        else if (currentPage === 'dokumen' && documents.length === 0) {
          const resDok = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=dokumen`);
          const jsonDok = await resDok.json();
          if (Array.isArray(jsonDok)) setDocuments(jsonDok);
        }
        else if (currentPage === 'peraturan' && dataPeraturan.length === 0) {
          const resPeraturan = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=peraturan`);
          const jsonPeraturan = await resPeraturan.json();
          if (Array.isArray(jsonPeraturan)) setDataPeraturan(jsonPeraturan);
        }
        else if (currentPage === 'laporan_kepuasan' && dataKepuasan.length === 0) {
          const resKepuasan = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=kepuasan`);
          const jsonKepuasan = await resKepuasan.json();
          if (Array.isArray(jsonKepuasan)) setDataKepuasan(jsonKepuasan);
        }
        else if (currentPage === 'berita' && news.length === 0) {
          const resBerita = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=berita`);
          const jsonBerita = await resBerita.json();
          if (Array.isArray(jsonBerita)) setNews(jsonBerita);
        }
      } catch (error) {
        console.error("Gagal mengambil data dari Spreadsheet:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [currentPage]); 

  // Fungsi untuk berpindah halaman
  const navigate = (page, category = 'Semua', data = null) => {
    setCurrentPage(page);
    setDocCategory(category);
    if(data) setSelectedNews(data);
    setIsMobileMenuOpen(false);
    // Reset mobile dropdown states
    setMobileSurveiOpen(false);
    setMobileInstrumenOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigasi Standar (Menu Survei Pelanggan akan kita sisipkan secara khusus di JSX)
  const navLinksStart = [
    { id: 'beranda', name: 'Beranda' },
    { id: 'profil', name: 'Profil' },
    { id: 'spmi', name: 'SPMI' },
    { id: 'akreditasi', name: 'Akreditasi' },
    { id: 'dokumen', name: 'Dokumen Mutu' },
    { id: 'peraturan', name: 'Peraturan' },
  ];
  
  const navLinksEnd = [
    { id: 'berita', name: 'Berita & Kegiatan' },
  ];

  // ================= KOMPONEN HALAMAN =================

  // Komponen Halaman Sementara (Placeholder) untuk menu yang belum ada databasenya
  const PlaceholderPage = ({ title }) => (
    <div className="py-20 bg-gray-50 min-h-[70vh] flex flex-col items-center justify-center px-4 animate-in fade-in">
      <div className="max-w-2xl w-full bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
        <Users className="w-16 h-16 text-blue-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">Halaman ini sedang dalam tahap pengembangan (Under Construction). Sistem akan segera dihubungkan ke database.</p>
        <button onClick={() => navigate('beranda')} className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition">
          <ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
        </button>
      </div>
    </div>
  );

  const BerandaPage = () => (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white overflow-hidden">
        {dataBeranda.gambar_bg ? (
          <div 
            className="absolute inset-0 z-0 opacity-30 bg-cover bg-center" 
            style={{ backgroundImage: `url(${dataBeranda.gambar_bg})` }}
          ></div>
        ) : (
          <div className="absolute inset-0 z-0 opacity-20 bg-black"></div>
        )}
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-10 md:mb-0">
            <div className="inline-block px-3 py-1 bg-blue-800 bg-opacity-60 text-blue-100 text-sm font-semibold rounded-full mb-4 border border-blue-700">
              Menuju Perguruan Tinggi Unggul
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {dataBeranda.judul_hero || "Mewujudkan Budaya Mutu Berkelanjutan"}
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed whitespace-pre-wrap">
              {dataBeranda.sub_judul || "Lembaga Penjaminan Mutu (LPM) Universitas Sapta Mandiri berkomitmen mengawal tercapainya visi institusi melalui penerapan Sistem Penjaminan Mutu Internal (SPMI) yang sistematis dan terukur."}
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('dokumen')} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded shadow-lg transition duration-300">
                Dokumen Mutu
              </button>
              <button onClick={() => navigate('akreditasi')} className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 font-semibold py-3 px-6 rounded transition duration-300">
                Status Akreditasi
              </button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center md:justify-end">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full border-t-4 border-amber-500">
              <div className="text-center">
                <Award className="w-16 h-16 text-amber-500 mx-auto mb-3" />
                <h3 className="text-gray-800 font-bold text-xl mb-1">Akreditasi Institusi</h3>
                <div className="text-3xl font-extrabold text-blue-900 mb-2">TERAKREDITASI</div>
                <p className="text-gray-500 text-sm mb-4">Badan Akreditasi Nasional (BAN-PT)</p>
                <button onClick={() => navigate('akreditasi')} className="text-blue-600 font-medium text-sm flex items-center justify-center w-full hover:underline">
                  Lihat Detail Akreditasi <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 bg-white relative -mt-10 z-20 mx-4 md:mx-auto container rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          <div onClick={() => navigate('spmi')} className="flex flex-col items-start p-4 hover:bg-gray-50 rounded-lg transition duration-300 cursor-pointer group">
            <div className="p-4 rounded-xl mb-4 bg-blue-50"><BookOpen className="w-8 h-8 text-blue-600" /></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700">SPMI</h3>
            <p className="text-gray-600 text-sm">Siklus PPEPP standar pendidikan tinggi.</p>
          </div>
          <div onClick={() => navigate('dokumen', 'Evaluasi')} className="flex flex-col items-start p-4 hover:bg-gray-50 rounded-lg transition duration-300 cursor-pointer group">
            <div className="p-4 rounded-xl mb-4 bg-green-50"><Activity className="w-8 h-8 text-green-600" /></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700">Audit (AMI)</h3>
            <p className="text-gray-600 text-sm">Evaluasi berkala standar akademik.</p>
          </div>
          <div onClick={() => navigate('akreditasi')} className="flex flex-col items-start p-4 hover:bg-gray-50 rounded-lg transition duration-300 cursor-pointer group">
            <div className="p-4 rounded-xl mb-4 bg-amber-50"><Award className="w-8 h-8 text-amber-600" /></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700">Akreditasi</h3>
            <p className="text-gray-600 text-sm">Peringkat akreditasi BAN-PT & Internasional.</p>
          </div>
          <div onClick={() => navigate('dokumen')} className="flex flex-col items-start p-4 hover:bg-gray-50 rounded-lg transition duration-300 cursor-pointer group">
            <div className="p-4 rounded-xl mb-4 bg-purple-50"><FileCheck className="w-8 h-8 text-purple-600" /></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700">Dokumen Mutu</h3>
            <p className="text-gray-600 text-sm">Akses ke Kebijakan, Manual, dan Standar.</p>
          </div>
        </div>
      </section>

      {/* Siklus SPMI Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siklus Penjaminan Mutu Internal (PPEPP)</h2>
          <p className="text-blue-200 mb-12 max-w-2xl mx-auto">
            Klik pada setiap tahapan di bawah ini untuk melihat dokumen mutu yang berkaitan dengan siklus tersebut.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Penetapan', 'Pelaksanaan', 'Evaluasi', 'Pengendalian', 'Peningkatan'].map((step, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate('dokumen', step)}
                className="bg-blue-800 bg-opacity-50 p-6 rounded-lg border border-blue-700 hover:bg-blue-600 hover:border-blue-400 transition duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="text-4xl font-black text-blue-400 mb-2">{idx + 1}</div>
                <h3 className="font-bold text-lg">{step}</h3>
                <p className="text-xs text-blue-300 mt-2 opacity-0 hover:opacity-100 transition-opacity">Lihat Dokumen</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-1 bg-amber-500"></div>
                <h4 className="text-amber-600 font-bold uppercase tracking-wider text-sm">Pusat Informasi</h4>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Berita & Kegiatan Mutu</h2>
            </div>
            <button onClick={() => navigate('berita')} className="hidden md:flex items-center text-blue-600 font-semibold hover:text-blue-800">
              Lihat Semua Berita <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center my-10"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.slice(0, 3).map((item, idx) => (
                <div 
                  key={item.id || idx} 
                  onClick={() => item.url_berita ? window.open(item.url_berita, '_blank') : navigate('detail_berita', 'Semua', item)} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition duration-300 group cursor-pointer flex flex-col"
                >
                  {item.gambar_url && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                       <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="inline-block w-fit bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded mb-3">{item.kategori || 'Berita'}</div>
                    <div className="text-sm text-gray-500 mb-2">{item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">{item.judul}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.ringkasan}</p>
                    <div className="mt-auto pt-4 border-t border-gray-100 text-blue-600 text-sm font-semibold flex items-center group-hover:text-blue-800">
                      Baca Selengkapnya <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              ))}
              {news.length === 0 && <p className="text-gray-500 col-span-3 text-center">Belum ada berita terbaru.</p>}
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const ProfilPage = () => (
    <div className="py-16 bg-slate-50 min-h-[70vh] animate-in fade-in duration-500">
      <div className="container mx-auto px-4 max-w-5xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64"><Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4"/> Memuat Profil...</div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="h-48 bg-blue-900"></div>
              <div className="px-8 pb-8 flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 gap-6">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-md bg-white overflow-hidden flex-shrink-0">
                  {dataProfil.url_foto_profil ? (
                    <img 
                      src={dataProfil.url_foto_profil} 
                      alt="Profil Instansi" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Foto+Gagal' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <ShieldCheck size={48} />
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left pt-2 sm:pt-0">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Profil Lembaga Penjaminan Mutu</h1>
                  <p className="text-slate-500 mt-1">Universitas Sapta Mandiri</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 h-full">
                  <div className="flex items-center space-x-3 mb-6">
                    <Building className="text-blue-600 w-6 h-6" />
                    <h2 className="text-2xl font-bold text-slate-900">Sejarah & Profil Singkat</h2>
                  </div>
                  <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                    {dataProfil.sejarah || 'Belum ada data sejarah yang diisi.'}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Target className="text-blue-600 w-6 h-6" />
                    <h2 className="text-xl font-bold text-slate-900">Visi</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                    &quot;{dataProfil.visi || 'Belum ada data visi yang diisi.'}&quot;
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="text-blue-600 w-6 h-6" />
                    <h2 className="text-xl font-bold text-slate-900">Misi</h2>
                  </div>
                  <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {dataProfil.misi || 'Belum ada data misi yang diisi.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const SPMIPage = () => (
    <div className="py-20 bg-gray-50 min-h-[70vh] flex flex-col items-center justify-center px-4 animate-in fade-in">
      <div className="max-w-4xl w-full bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
        <ShieldCheck className="w-20 h-20 text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Sistem Penjaminan Mutu Internal (SPMI)</h1>
        
        {isLoading ? (
          <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : (
          <div className="text-lg text-gray-600 text-left whitespace-pre-wrap leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100">
            {dataSPMI.deskripsi_spmi || "Data deskripsi SPMI belum diisi. Silakan isi melalui halaman admin."}
          </div>
        )}
        
        <button onClick={() => navigate('beranda')} className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition">
          <ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
        </button>
      </div>
    </div>
  );

  const AkreditasiPage = () => (
    <div className="py-16 bg-gray-50 min-h-[70vh] animate-in fade-in">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <Award className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Status Akreditasi</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Daftar lengkap peringkat akreditasi Program Studi di lingkungan Universitas Sapta Mandiri.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Program Studi</th>
                  <th className="p-4 font-semibold">Strata</th>
                  <th className="p-4 font-semibold text-center">Peringkat</th>
                  <th className="p-4 font-semibold text-center">Masa Berlaku</th>
                  <th className="p-4 font-semibold text-center">Unduh SK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2"/> Memuat data akreditasi...</td></tr>
                ) : dataAkreditasi.length > 0 ? dataAkreditasi.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition duration-150">
                    <td className="p-4 font-semibold text-gray-800">{item.prodi}</td>
                    <td className="p-4 text-gray-600">{item.strata}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.peringkat?.toUpperCase() === 'UNGGUL' || item.peringkat === 'A' ? 'bg-green-100 text-green-800' :
                        item.peringkat?.toUpperCase() === 'BAIK SEKALI' || item.peringkat === 'B' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {item.peringkat}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-600">{item.masa_berlaku}</td>
                    <td className="p-4 text-center">
                      {item.url_sk ? (
                        <a href={item.url_sk} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded inline-flex items-center transition" title="Unduh SK">
                          <Download className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Belum ada data akreditasi yang tersimpan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const DokumenPage = () => {
    const categories = ['Semua', 'Penetapan', 'Pelaksanaan', 'Evaluasi', 'Pengendalian', 'Peningkatan'];
    const filteredDocs = docCategory === 'Semua' 
      ? documents 
      : documents.filter(doc => doc.kategori_ppepp === docCategory);

    return (
      <div className="py-16 bg-gray-50 min-h-[70vh] animate-in fade-in">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Repositori Dokumen Mutu</h1>
              <p className="text-gray-600 mt-2">Akses dokumen kebijakan, manual, standar, dan formulir (PPEPP).</p>
            </div>
            
            <div className="flex flex-wrap gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center px-3 text-gray-500 border-r border-gray-200"><Filter className="w-4 h-4 mr-2"/> Filter:</div>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setDocCategory(cat)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition ${docCategory === cat ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Nama Dokumen</th>
                    <th className="p-4 font-semibold">Kategori (PPEPP)</th>
                    <th className="p-4 font-semibold">Tipe</th>
                    <th className="p-4 font-semibold">Ukuran</th>
                    <th className="p-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2"/> Memuat data dokumen...</td></tr>
                  ) : filteredDocs.length > 0 ? filteredDocs.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition duration-150">
                      <td className="p-4 font-medium text-gray-800 flex items-center">
                        <FileCheck className="w-5 h-5 text-blue-500 mr-3 shrink-0" /> {doc.nama_dokumen}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">{doc.kategori_ppepp}</span>
                      </td>
                      <td className="p-4 text-sm text-gray-600 font-mono bg-gray-50 rounded px-2">{doc.tipe_file}</td>
                      <td className="p-4 text-sm text-gray-600">{doc.ukuran}</td>
                      <td className="p-4 text-center">
                        {doc.url_dokumen ? (
                          <a href={doc.url_dokumen} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded inline-flex items-center transition" title="Unduh/Lihat">
                            <Download className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-xs text-red-500">No Link</span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        Tidak ada dokumen yang ditemukan untuk kategori ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PeraturanPage = () => (
    <div className="py-16 bg-gray-50 min-h-[70vh] animate-in fade-in">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Peraturan & Kebijakan Kementerian</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Kumpulan dokumen regulasi, undang-undang, dan peraturan menteri terkait pendidikan tinggi.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold w-1/2">Judul Peraturan</th>
                  <th className="p-4 font-semibold text-center w-1/4">Kategori</th>
                  <th className="p-4 font-semibold text-center">Tanggal</th>
                  <th className="p-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2"/> Memuat peraturan...</td></tr>
                ) : dataPeraturan.length > 0 ? dataPeraturan.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition duration-150">
                    <td className="p-4 font-semibold text-gray-800">{item.judul_peraturan}</td>
                    <td className="p-4 text-center">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-semibold border border-gray-200">{item.kategori}</span>
                    </td>
                    <td className="p-4 text-center text-sm text-gray-600">
                      {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="p-4 text-center">
                      {item.file_url ? (
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded inline-flex items-center transition" title="Unduh Peraturan">
                          <Download className="w-4 h-4 mr-1" /> Unduh
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">Tidak ada file</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-500">Belum ada data peraturan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const KepuasanPage = () => {
    const calculatePercentage = (nilai, total) => {
      if (!total || total == 0) return 0;
      return Math.round((Number(nilai) / total) * 100);
    };

    return (
      <div className="py-16 bg-gray-50 min-h-[70vh] animate-in fade-in">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <PieChart className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Laporan Kepuasan Pelanggan</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Hasil evaluasi pengukuran tingkat kepuasan layanan di lingkungan Universitas Sapta Mandiri.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center my-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
          ) : dataKepuasan.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dataKepuasan.map((item, idx) => {
                const sangatBaik = Number(item.skor_sangat_baik || 0);
                const baik = Number(item.skor_baik || 0);
                const cukup = Number(item.skor_cukup || 0);
                const kurang = Number(item.skor_kurang || 0);
                const total = sangatBaik + baik + cukup + kurang;

                return (
                  <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800">{item.aspek_penilaian}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Tahun {item.tahun}</span>
                    </div>

                    <div className="space-y-4">
                      {/* Bar Sangat Baik */}
                      <div>
                        <div className="flex justify-between text-sm mb-1 font-medium">
                          <span className="text-green-700">Sangat Baik ({sangatBaik})</span>
                          <span className="text-gray-600">{calculatePercentage(sangatBaik, total)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div className="bg-green-500 h-3 rounded-full" style={{ width: `${calculatePercentage(sangatBaik, total)}%` }}></div>
                        </div>
                      </div>

                      {/* Bar Baik */}
                      <div>
                        <div className="flex justify-between text-sm mb-1 font-medium">
                          <span className="text-blue-700">Baik ({baik})</span>
                          <span className="text-gray-600">{calculatePercentage(baik, total)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${calculatePercentage(baik, total)}%` }}></div>
                        </div>
                      </div>

                      {/* Bar Cukup */}
                      <div>
                        <div className="flex justify-between text-sm mb-1 font-medium">
                          <span className="text-amber-700">Cukup ({cukup})</span>
                          <span className="text-gray-600">{calculatePercentage(cukup, total)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div className="bg-amber-400 h-3 rounded-full" style={{ width: `${calculatePercentage(cukup, total)}%` }}></div>
                        </div>
                      </div>

                      {/* Bar Kurang */}
                      <div>
                        <div className="flex justify-between text-sm mb-1 font-medium">
                          <span className="text-red-700">Kurang ({kurang})</span>
                          <span className="text-gray-600">{calculatePercentage(kurang, total)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div className="bg-red-500 h-3 rounded-full" style={{ width: `${calculatePercentage(kurang, total)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">Data laporan kepuasan pelanggan tahun ini belum dipublikasikan.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const BeritaPage = () => (
    <div className="py-16 bg-white min-h-[70vh] animate-in fade-in">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Berita & Kegiatan Mutu</h1>
        <p className="text-gray-600 mb-10 border-b pb-6">Informasi terbaru seputar kegiatan LPM dan perkembangan mutu kampus.</p>
        
        {isLoading ? (
           <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, idx) => ( 
              <div 
                key={idx} 
                onClick={() => item.url_berita ? window.open(item.url_berita, '_blank') : navigate('detail_berita', 'Semua', item)} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition duration-300 group cursor-pointer flex flex-col"
              >
                {item.gambar_url && (
                  <div className="h-48 overflow-hidden bg-gray-100">
                      <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="inline-block w-fit bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded mb-3">{item.kategori || 'Berita'}</div>
                  <div className="text-sm text-gray-500 mb-2">{item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">{item.judul}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.ringkasan}</p>
                  <div className="mt-auto pt-4 border-t border-gray-100 text-blue-600 text-sm font-semibold flex items-center group-hover:text-blue-800">
                    Baca Selengkapnya <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            ))}
            {news.length === 0 && <p className="text-gray-500 col-span-3 text-center">Belum ada berita yang tersedia di database.</p>}
          </div>
        )}
      </div>
    </div>
  );

  const DetailBeritaPage = () => {
    if (!selectedNews) return <BeritaPage />;
    
    return (
      <div className="py-16 bg-white min-h-[70vh] animate-in fade-in">
        <div className="container mx-auto px-4 max-w-4xl">
          <button onClick={() => navigate('berita')} className="mb-8 flex items-center text-blue-600 hover:text-blue-800 font-medium transition hover:underline">
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar Berita
          </button>
          
          {selectedNews.gambar_url && (
            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-md">
              <img src={selectedNews.gambar_url} alt={selectedNews.judul} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded">{selectedNews.kategori || 'Berita'}</span>
            <span className="flex items-center">
              {selectedNews.tanggal ? new Date(selectedNews.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Tanggal tidak tersedia'}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">{selectedNews.judul}</h1>
          
          <div className="prose max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
            {selectedNews.konten || selectedNews.ringkasan}
          </div>
        </div>
      </div>
    );
  };

  // Router Navigasi Utama
  const renderContent = () => {
    switch(currentPage) {
      case 'beranda': return <BerandaPage />;
      case 'profil': return <ProfilPage />;
      case 'spmi': return <SPMIPage />;
      case 'akreditasi': return <AkreditasiPage />;
      case 'dokumen': return <DokumenPage />;
      case 'peraturan': return <PeraturanPage />; 
      
      // Routing Baru untuk Menu Pelanggan
      case 'laporan_kepuasan': return <KepuasanPage />;   
      case 'form_keluhan': return <PlaceholderPage title="Form Keluhan Pelanggan" />;
      case 'laporan_survei': return <PlaceholderPage title="Laporan Survei" />;
      case 'laporan_keluhan': return <PlaceholderPage title="Laporan Keluhan Pelanggan" />;
      case 'instrumen_mahasiswa': return <PlaceholderPage title="Instrumen Survei Mahasiswa" />;
      case 'instrumen_dosen': return <PlaceholderPage title="Instrumen Survei Dosen" />;
      case 'instrumen_tendik': return <PlaceholderPage title="Instrumen Survei Tenaga Kependidikan" />;
      case 'instrumen_alumni': return <PlaceholderPage title="Instrumen Survei Alumni" />;
      case 'instrumen_pengguna': return <PlaceholderPage title="Instrumen Pengguna Lulusan" />;
      case 'instrumen_mitra': return <PlaceholderPage title="Instrumen Mitra Kerjasama" />;

      case 'berita': return <BeritaPage />;
      case 'detail_berita': return <DetailBeritaPage />;
      default: return <BerandaPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      
      {/* Top Bar */}
      <div className="bg-blue-900 text-white text-xs py-2 hidden md:block shrink-0">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <span className="flex items-center"><Phone className="w-3 h-3 mr-2" /> (62) 812 1770 3626</span>
            <span className="flex items-center"><Mail className="w-3 h-3 mr-2" /> lpm@univsm.ac.id</span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-200 transition">Portal Mahasiswa</a>
            <a href="#" className="hover:text-blue-200 transition">Portal Dosen</a>
            <a href="https://univsm.ac.id/" className="hover:text-blue-200 transition">Web Universitas</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 shrink-0 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('beranda')}>
            <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center text-white shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight text-blue-900">LPM</h1>
              <h2 className="text-sm font-semibold text-gray-600 hidden sm:block">Universitas Sapta Mandiri</h2>
            </div>
          </div>

          {/* ======================= DESKTOP NAVIGATION ======================= */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            
            {/* Bagian Awal Navigasi */}
            {navLinksStart.map((link) => (
              <button 
                key={link.id} 
                onClick={() => navigate(link.id)} 
                className={`font-semibold py-2 transition duration-300 ${currentPage === link.id ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-blue-700'}`}
              >
                {link.name}
              </button>
            ))}
            
            {/* ====== MENU DROPDOWN SURVEI PELANGGAN ====== */}
            <div className="relative group/main">
              <button className={`font-semibold py-2 flex items-center transition duration-300 ${['laporan_kepuasan', 'form_keluhan', 'laporan_survei', 'laporan_keluhan'].includes(currentPage) || currentPage.startsWith('instrumen_') ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-blue-700'}`}>
                Survei Pelanggan <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              
              {/* Flyout Menu Level 1 */}
              <div className="absolute left-0 top-full mt-0 w-64 bg-white border border-gray-100 shadow-xl rounded-lg py-2 opacity-0 invisible group-hover/main:opacity-100 group-hover/main:visible transition-all duration-300 z-50">
                
                {/* Menu Nested Level 2: Instrumen Survei */}
                <div className="relative group/sub px-4 py-2 hover:bg-blue-50 cursor-pointer">
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                    Instrumen Survei Pelanggan <ChevronRight className="w-4 h-4" />
                  </div>
                  
                  {/* Flyout Menu Level 2 */}
                  <div className="absolute left-full top-0 ml-0 w-56 bg-white border border-gray-100 shadow-xl rounded-lg py-2 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300">
                    <button onClick={() => navigate('instrumen_mahasiswa')} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50">Mahasiswa</button>
                    <button onClick={() => navigate('instrumen_dosen')} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50">Dosen</button>
                    <button onClick={() => navigate('instrumen_tendik')} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50">Tenaga Kependidikan</button>
                    <button onClick={() => navigate('instrumen_alumni')} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50">Alumni</button>
                    <button onClick={() => navigate('instrumen_pengguna')} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50">Pengguna Lulusan</button>
                    <button onClick={() => navigate('instrumen_mitra')} className="block w-full text-left px-4 py-2 text-sm
