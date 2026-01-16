
import React, { useState } from 'react';

interface ProfileProps {
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');

  const mockOrders = [
    { id: 'ASV-9921', date: '12 Feb 2024', status: 'Selesai', total: 599000 },
    { id: 'ASV-8812', date: '05 Jan 2024', status: 'Selesai', total: 349000 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 animate-fadeIn">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-brand-gold transition-colors mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      {/* Header / Loyalty Card */}
      <div className="relative overflow-hidden bg-brand-black rounded-sm p-6 md:p-10 text-white mb-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-gold rounded-full flex items-center justify-center text-white text-2xl font-bold brand-serif border-4 border-brand-black shadow-xl">
              AF
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-brand-gold font-bold">Gold Member</span>
              <h2 className="text-xl md:text-2xl font-bold brand-serif mt-1">Ahmad Fulan</h2>
              <p className="text-[11px] text-gray-400 mt-1 opacity-70">ahmad.fulan@email.com</p>
            </div>
          </div>
          {/* Points section removed for a cleaner look */}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-cream mb-8">
        {[
          { id: 'info', label: 'Informasi Akun' },
          { id: 'orders', label: 'Riwayat Pesanan' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold transition-all relative ${
              activeTab === tab.id ? 'text-brand-black' : 'text-gray-400 hover:text-brand-black'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold animate-scaleX"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'info' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">Nama Lengkap</label>
                <p className="text-brand-black font-medium border-b border-brand-cream/50 pb-2">Ahmad Fulan</p>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">No. WhatsApp</label>
                <p className="text-brand-black font-medium border-b border-brand-cream/50 pb-2">0812 3456 7890</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">Alamat Utama</label>
                <p className="text-brand-black font-medium border-b border-brand-cream/50 pb-2 leading-relaxed">
                  Jl. Kebon Jeruk No. 12, Kel. Palmerah, Kec. Palmerah, Jakarta Barat, 11480
                </p>
              </div>
            </div>
            <button className="px-8 py-3 bg-brand-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-gold transition-all rounded-sm">
              Edit Profil
            </button>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-5 border border-brand-cream rounded-sm hover:border-brand-gold transition-colors group">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-brand-black">{order.id}</span>
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[9px] uppercase font-bold rounded-full">{order.status}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">{order.date}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-sm text-brand-brown font-sans">IDR {order.total.toLocaleString('id-ID')}</p>
                  <button className="text-[9px] uppercase tracking-widest font-bold text-brand-gold group-hover:underline">Detail Pesanan</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="mt-16 pt-8 border-t border-brand-cream text-center md:text-left">
        <button className="text-[10px] uppercase tracking-[0.3em] font-bold text-red-800 hover:text-red-600 transition-colors flex items-center justify-center md:justify-start gap-2 mx-auto md:mx-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
};
