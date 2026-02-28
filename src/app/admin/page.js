"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FileText, Award, BookOpen, Activity, 
  Plus, Edit, Trash2, Save, Download, X, FileCheck, LogOut 
} from 'lucide-react';
import * as XLSX from 'xlsx';

// KONFIGURASI FORM DINAMIS UNTUK SETIAP HALAMAN
const tabConfig = {
  Beranda: { 
    type: 'single', 
    icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
    fields: [
      { name: 'judul_hero', label: 'Judul Utama (Hero)' },
      { name: 'sub_judul', label: 'Sub Judul' },
      { name: 'gambar_bg', label: 'URL Gambar Background' }
    ] 
  },
  Profil: { 
    type: 'single',
    icon: <FileText className="w-5 h-5 mr-3" />,
    fields: [
      { name: 'url_foto_profil', label: 'URL Foto Profil (Link Gambar)' }, 
      { name: 'sejarah', label: 'Sejarah Singkat', type: 'textarea' },
      { name: 'visi', label: 'Visi', type: 'textarea' },
      { name: 'misi', label: 'Misi', type: 'textarea' }
    ] 
  },
  SPMI: { 
    type: 'single',
    icon: <BookOpen className="w-5 h-5 mr-3" />,
    fields: [
      { name: 'deskripsi_spmi', label: 'Deskripsi Pelaksanaan SPMI', type: 'textarea' }
    ] 
  },
  Akreditasi: { 
    type: 'multi',
    icon: <Award className="w-5 h-5 mr-3" />,
    fields: [
      { 
        name: 'prodi', 
        label: 'Nama Program Studi', 
        type: 'select', 
        options: ['Teknologi Informasi', 'Sistem Informasi', 'Ilmu Komputer', 'Teknik Sipil', 'Manajemen', 'Pendidikan Guru Sekolah Dasar', 'Hukum', 'D3 Gizi'] 
      },
      { 
        name: 'strata', 
        label: 'Strata', 
        type: 'select', 
        options: ['D3', 'D4', 'S1', 'S2', 'S3'] 
      },
      { 
        name: 'peringkat', 
        label: 'Peringkat Akreditasi', 
        type: 'select', 
        options: ['Baik', 'Baik Sekali', 'Terakreditasi', 'Unggul', 'Internasional'] 
      },
      { name: 'masa_berlaku', label: 'Masa Berlaku (Tahun)' },
      { name: 'url_sk', label: 'URL SK Akreditasi (Link Google Drive/PDF)' }
    ] 
  },
  Dokumen: { 
    type: 'multi',
    icon: <FileCheck className="w-5 h-5 mr-3" />,
    fields: [
      { name: 'nama_dokumen', label: 'Nama Dokumen' },
      { 
        name: 'kategori_ppepp', 
        label: 'Kategori (PPEPP)', 
        type: 'select', 
        options: ['Penetapan', 'Pelaksanaan', 'Evaluasi', 'Pengendalian', 'Peningkatan'] 
      },
      { name: 'tipe_file', label: 'Tipe File (Contoh: PDF, DOCX)' },
      { name: 'ukuran', label: 'Ukuran File (Contoh: 2 MB)' },
      { name: 'url_dokumen', label: 'Link URL Dokumen' }
    ] 
  },
  Berita: { 
    type: 'multi',
    icon: <Activity className="w-5 h-5 mr-3" />,
    fields: [
      { name: 'judul', label: 'Judul Berita/Kegiatan' },
      { 
        name: 'kategori', 
        label: 'Kategori', 
        type: 'select', 
        options: ['Kegiatan Univsm', 'Monev', 'LLDIKTI', 'Universitas', 'Fakultas', 'Prodi', 'Akreditasi', 'Audit Mutu Internal', 'Pendampingan', 'Lain-lain'] 
      },
      { name: 'ringkasan', label: 'Ringkasan Pendek (Tampil di awal)', type: 'textarea' },
      { name: 'konten', label: 'Isi Berita Lengkap', type: 'textarea' },
      { name: 'gambar_url', label: 'URL Gambar Thumbnail' },
      { name: 'url_berita', label: 'Atau Link Berita Eksternal (Opsional)' },
      { name: 'tanggal', label: 'Tanggal Pelaksanaan', type: 'date' }
    ] 
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Beranda');
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // ==========================================
  // 1. FUNGSI READ (MENGAMBIL DATA API LOKAL)
  // ==========================================
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const endpoint = `/api/${activeTab.toLowerCase()}`;
      const response = await fetch(endpoint);
      const result = await response.json();
      
      if (tabConfig[activeTab].type === 'single') {
        setFormData(result || {});
      } else {
        setData(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      console.error(`Gagal memuat data ${activeTab}`, error);
      alert('Gagal mengambil data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // 2. FUNGSI CREATE & UPDATE (SIMPAN DATA)
  // ==========================================
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const endpoint = `/api/${activeTab.toLowerCase()}`;
      const isSingle = tabConfig[activeTab].type === 'single';
      
      let method = 'POST';
      if (isSingle || isEditing) {
         method = 'PUT'; 
      }

      const dataToSave = { ...formData };

      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });
      
      const result = await response.json();

      if (result.status === 'success') {
         alert(`Data ${activeTab} berhasil disimpan!`);
         setIsModalOpen(false);
         if (!isSingle) setFormData({}); 
         fetchData(); 
      } else {
         alert(`Gagal menyimpan: ${result.message || result.error}`);
      }
      
    } catch (error) {
      alert('Terjadi kesalahan jaringan saat menyimpan data.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // 3. FUNGSI DELETE (HAPUS DATA)
  // ==========================================
  const handleDelete = async (id) => {
    if(!window.confirm('Yakin ingin menghapus data ini secara permanen?')) return;
    setIsLoading(true);
    
    try {
      const endpoint = `/api/${activeTab.toLowerCase()}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        alert('Data berhasil dihapus!');
        fetchData(); 
      } else {
        alert(`Gagal menghapus: ${result.message || result.error}`);
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan saat menghapus data.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // FUNGSI PENDUKUNG UI
  // ==========================================
  const exportToExcel = () => {
    if (data.length === 0) {
      alert('Tidak ada data untuk diekspor!');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);
    XLSX.writeFile(workbook, `Data_${activeTab}_LPM.xlsx`);
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari halaman admin?')) {
      router.push('/login'); 
    }
  };

  const openAddModal = () => {
    setFormData({});
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormData(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // ==========================================
  // RENDER FORM (INPUT, TEXTAREA, SELECT)
  // ==========================================
  const renderFormInputs = () => {
    return tabConfig[activeTab].fields.map((field) => (
      <div key={field.name} className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
        
        {/* FITUR PREVIEW GAMBAR */}
        {(field.name === 'url_foto_profil' || field.name === 'gambar_bg' || field.name === 'gambar_url') && formData[field.name] && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200 inline-block">
            <img 
              src={formData[field.name]} 
              alt="Preview" 
              className="h-32 w-auto object-cover rounded-md shadow-sm"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
        )}

        {/* LOGIKA UNTUK DROPDOWN SELECT */}
        {field.type === 'select' ? (
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none bg-white"
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
            required
          >
            <option value="" disabled>-- Pilih {field.label} --</option>
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
            rows="4"
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
            required={field.name !== 'url_foto_profil'} 
          />
        ) : (
          <input
            type={field.type || 'text'}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
            value={formData[field.name] || ''}
            placeholder={field.name.includes('url') ? "https://..." : ""}
            onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
            required={field.name !== 'url_foto_profil'} 
          />
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-blue-900 text-white flex flex-col shrink-0 shadow-xl z-10 md:min-h-screen">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-2xl font-bold tracking-wider">LPM ADMIN</h2>
          <p className="text-blue-300 text-sm mt-1">Sistem Manajemen Mutu</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {Object.keys(tabConfig).map((tabName) => (
            <button
              key={tabName}
              onClick={() => setActiveTab(tabName)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition duration-200 ${
                activeTab === tabName 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              }`}
            >
              {tabConfig[tabName].icon}
              <span className="font-medium">{tabName}</span>
            </button>
