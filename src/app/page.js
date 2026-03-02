"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, X, ChevronRight, Award, BookOpen, FileCheck, 
  Activity, Search, MapPin, Phone, Mail, ExternalLink, ShieldCheck,
  Download, Filter, ChevronLeft, Loader2, Building, Target,
  FileText, PieChart // Ikon baru untuk Peraturan & Kepuasan
} from 'lucide-react';

// =========================================================================
// PENTING: GANTI URL DI BAWAH INI DENGAN URL WEB APP DARI GOOGLE APPS SCRIPT
// =========================================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzcCJAq86ZsIxipm9ujhPf93eTlbXS8wtrvMvFF8aTY8MvrZ5r-FysBBw3lsRoOJpLa0g/exec"; 

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  
  // State BARU untuk Peraturan & Kepuasan
  const [dataPeraturan, setDataPeraturan] = useState([]);
  const [dataKepuasan, setDataKepuasan] = useState([]);

  // Fungsi untuk mengambil data spesifik berdasarkan halaman yang dibuka
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
          // Fetch untuk Peraturan
          const resPeraturan = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=peraturan`);
          const jsonPeraturan = await resPeraturan.json();
          if (Array.isArray(jsonPeraturan)) setDataPeraturan(jsonPeraturan);
        }
        else if (currentPage === 'kepuasan' && dataKepuasan.length === 0) {
          // Fetch untuk Kepuasan
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigasi dengan tambahan menu baru
  const navLinks = [
    { id: 'beranda', name: 'Beranda' },
    { id: 'profil', name: 'Profil' },
    { id: 'spmi', name: 'SPMI' },
    { id: 'akreditasi', name: '
