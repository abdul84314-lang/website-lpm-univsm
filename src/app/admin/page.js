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
  // 1. FUNGSI READ
  // ==========================================
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Mengarah ke Master API route tunggal kita
      const endpoint = `/api/gas?sheet=${activeTab.toLowerCase()}`;
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
  // 2. FUNGSI CREATE & UPDATE 
  // ==========================================
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const isSingle = tabConfig[activeTab].type === 'single';
      const actionType = (isSingle || isEditing) ? 'UPDATE' : 'CREATE';
      
      // Menggabungkan data form dengan info sheet dan action
      const dataToSave = { 
        ...formData, 
        sheet: activeTab.toLowerCase(),
        action: actionType
      };

      if (!isSingle && !isEditing) {
         dataToSave.id = Date.now().toString(); // ID Unik untuk data baru
      }

      // Selalu menggunakan metode POST ke Master API
      const response = await fetch('/api/gas', {
        method: 'POST',
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
  // 3. FUNGSI DELETE
  // ==========================================
  const handleDelete = async (id) => {
    if(!window.confirm('Yakin ingin menghapus data ini secara permanen?')) return;
    setIsLoading(true);
    
    try {
      const payload = {
        sheet: activeTab.toLowerCase(),
        action: 'DELETE',
        id: id
      };

      // Selalu menggunakan metode POST ke Master API
      const response = await fetch('/api/gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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

  const renderFormInputs = () => {
    return tabConfig[activeTab].fields.map((field) => (
      <div key={field.name} className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
        
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
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-200 hover:bg-red-600 hover:text-white rounded-lg transition duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manajemen {activeTab}</h1>
            <p className="text-gray-500 mt-1">Kelola data {activeTab.toLowerCase()} untuk website utama.</p>
          </div>
          
          {tabConfig[activeTab].type === 'multi' && (
            <div className="flex space-x-3">
              <button 
                onClick={exportToExcel}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition"
              >
                <Download className="w-4 h-4 mr-2" /> Export Excel
              </button>
              <button 
                onClick={openAddModal}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition"
              >
                <Plus className="w-4 h-4 mr-2" /> Tambah Data
              </button>
            </div>
          )}
        </header>

        {isLoading && <div className="text-blue-600 font-semibold my-4 animate-pulse">Memuat data...</div>}

        {/* SINGLE ROW */}
        {tabConfig[activeTab].type === 'single' && !isLoading && (
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
            <form onSubmit={handleSave}>
              {renderFormInputs()}
              <div className="mt-8 flex justify-end">
                <button type="submit" className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition">
                  <Save className="w-5 h-5 mr-2" /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MULTI ROW */}
        {tabConfig[activeTab].type === 'multi' && !isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm font-semibold uppercase tracking-wider">
                    {tabConfig[activeTab].fields.slice(0, 4).map(field => ( 
                      <th key={field.name} className="p-4">{field.label}</th>
                    ))}
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.length > 0 ? data.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-gray-50 transition">
                      {tabConfig[activeTab].fields.slice(0, 4).map(field => (
                        <td key={field.name} className="p-4 text-gray-700 truncate max-w-[200px]">
                          {item[field.name]}
                        </td>
                      ))}
                      <td className="p-4 text-center flex justify-center space-x-2">
                        <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition" title="Edit">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Hapus">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        Belum ada data {activeTab}. Silakan klik "Tambah Data".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Edit Data' : 'Tambah Data'} {activeTab}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              {renderFormInputs()}
              <div className="mt-8 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition">
                  Batal
                </button>
                <button type="submit" disabled={isLoading} className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition disabled:opacity-50">
                  <Save className="w-5 h-5 mr-2" /> {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
