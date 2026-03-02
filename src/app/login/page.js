"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, User } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    // Validasi input
    if (isRegister) {
      if (!name || !email || !password || !confirmPassword) {
        setError('Semua kolom wajib diisi!');
        return;
      }
      if (password !== confirmPassword) {
        setError('Password dan konfirmasi password tidak cocok!');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Email dan password wajib diisi!');
        return;
      }
    }

    setIsLoading(true);

    // URL Google Apps Script Bapak
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbzcCJAq86ZsIxipm9ujhPf93eTlbXS8wtrvMvFF8aTY8MvrZ5r-FysBBw3lsRoOJpLa0g/exec'; 

    try {
      // Siapkan paket data (Payload) sesuai format API
      const payload = isRegister 
        ? {
            sheet: 'Users',
            action: 'REGISTER',
            username: email,   // Menggunakan email sebagai username
            password: password,
            nama: name
          }
        : {
            sheet: 'Users',
            action: 'LOGIN',
            username: email,
            password: password
          };

      // Tembak API ke Google Apps Script
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
          // Menggunakan text/plain agar GAS tidak memicu error preflight CORS
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === 'success') {
        if (isRegister) {
          setSuccessMsg(result.message);
          setIsRegister(false); // Kembalikan form ke mode login
          setPassword('');
          setConfirmPassword('');
        } else {
          // Jika Login sukses, simpan data user ke penyimpanan lokal browser
          localStorage.setItem('userLPM', JSON.stringify(result.user));
          
          // Lempar ke halaman admin
          router.push('/admin');
        }
      } else {
        // Jika API membalas dengan status error (contoh: password salah / email sudah terdaftar)
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi ke server. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo & Header */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isRegister ? 'Daftar Akun Baru' : 'Login Admin LPM'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Universitas Sapta Mandiri
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Pesan Error & Sukses */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                <p className="text-sm text-green-700 font-medium">{successMsg}</p>
              </div>
            )}

            {/* Input Nama Lengkap (Hanya tampil saat Register) */}
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nama Lengkap
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={isRegister}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 border bg-gray-50 outline-none transition"
                    placeholder="Nama Anda"
                  />
                </div>
              </div>
            )}

            {/* Input Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Alamat Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 border bg-gray-50 outline-none transition"
                  placeholder="admin@univsm.ac.id"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-lg py-3 border bg-gray-50 outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Input Konfirmasi Password (Hanya tampil saat Register) */}
            {isRegister && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Konfirmasi Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required={isRegister}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 border bg-gray-50 outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Lupa Password & Remember Me (Hanya di mode Login) */}
            {!isRegister && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Ingat saya
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition">
                    Lupa password?
                  </a>
                </div>
              </div>
            )}

            {/* Tombol Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Memproses...
                  </>
                ) : (
                  isRegister ? 'Daftar Akun' : 'Masuk ke Dashboard'
                )}
              </button>
            </div>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
              <button
                onClick={toggleMode}
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none"
              >
                {isRegister ? 'Masuk di sini' : 'Daftar sekarang'}
              </button>
            </p>
          </div>

          {/* Kembali ke Beranda */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <Link href="/" className="flex items-center justify-center text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
