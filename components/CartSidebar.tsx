import React, { useState } from 'react';
import { CartItem } from '../types';
import { STRAPI_URL } from '../constants';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (cartKey: string) => void;
  onUpdateQty: (cartKey: string, delta: number) => void;
  onUpdateSelection: (cartKey: string, size: string, color: string) => void;
}

const SIZES = ['M', 'L', 'XL', 'XXL'];
const COLORS = ['White', 'Black', 'Navy', 'Olive'];

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, items, onRemove, onUpdateQty, onUpdateSelection }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getPlaceholderImage = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('koko')) return 'https://images.unsplash.com/photo-1621294200609-77f62e604052?auto=format&fit=crop&q=80&w=200';
    if (lowerName.includes('jubah')) return 'https://images.unsplash.com/photo-1598559069352-3d8437b0d42c?auto=format&fit=crop&q=80&w=200';
    if (lowerName.includes('sirwal') || lowerName.includes('celana')) return 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=200';
    return 'https://images.unsplash.com/photo-1516257984877-473d54edfe0c?auto=format&fit=crop&q=80&w=200';
  };

  const handleWhatsAppOrder = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Mohon lengkapi data pengiriman Anda untuk cek ongkir.');
      return;
    }

    const itemDetails = items.map(item => 
      `- ${item.name} (${item.selectedSize}/${item.selectedColor}) x${item.quantity}: IDR ${(item.price * item.quantity).toLocaleString('id-ID')}`
    ).join('%0A');

    const message = `Halo Assafwa, saya ingin bertanya ongkir untuk pesanan berikut:%0A%0A${itemDetails}%0A%0A*Total: IDR ${total.toLocaleString('id-ID')}*%0A%0A*Data Pengiriman:*%0ANama: ${formData.name}%0AWA: ${formData.phone}%0AAlamat: ${formData.address}`;
    
    window.open(`https://wa.me/628123456789?text=${message}`, '_blank');
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-brand-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        <div className={`relative w-full max-w-lg bg-white rounded-sm shadow-2xl flex flex-col max-h-[85vh] transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="p-6 border-b border-brand-cream flex items-center justify-between bg-brand-black text-white rounded-t-sm">
            <div>
              <h2 id="cart-heading" className="text-xl font-medium tracking-tight">Keranjang Saya</h2>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-gold mt-1 font-medium">Assafwa Signature</p>
            </div>
            <button onClick={onClose} className="p-2 hover:text-brand-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-brand-white/20">
            {!showForm && (
              <button 
                onClick={onClose}
                className="w-full py-2 mb-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-brand-gold border border-brand-gold/30 rounded-sm hover:bg-brand-gold hover:text-white transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali Belanja
              </button>
            )}

            {!showForm ? (
              items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-brand-brown/40 space-y-4 py-20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-sm font-medium opacity-60">Belum ada pilihan koleksi.</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.cartKey} className="flex gap-4 items-start animate-fadeIn border-b border-brand-cream pb-6">
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-brand-cream border border-brand-cream shadow-sm">
                      <img 
                        src={item.image?.url ? (item.image.url.startsWith('/') ? `${STRAPI_URL}${item.image.url}` : item.image.url) : getPlaceholderImage(item.name)} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-brand-black text-base tracking-tight mb-2">{item.name}</h4>
                      
                      <div className="flex gap-2 mb-3">
                        <select 
                          value={item.selectedSize}
                          onChange={(e) => onUpdateSelection(item.cartKey!, e.target.value, item.selectedColor)}
                          className="bg-transparent border border-brand-cream text-xs font-medium uppercase p-1 outline-none hover:border-brand-gold transition-colors text-brand-brown cursor-pointer"
                        >
                          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select 
                          value={item.selectedColor}
                          onChange={(e) => onUpdateSelection(item.cartKey!, item.selectedSize, e.target.value)}
                          className="bg-transparent border border-brand-cream text-xs font-medium uppercase p-1 outline-none hover:border-brand-gold transition-colors text-brand-brown cursor-pointer"
                        >
                          {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <p className="text-brand-gold text-sm font-medium">IDR {item.price.toLocaleString('id-ID')}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-brand-cream bg-white rounded-sm">
                          <button onClick={() => onUpdateQty(item.cartKey!, -1)} className="px-2 py-0.5 hover:text-brand-gold transition-colors text-sm">-</button>
                          <span className="px-2 text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.cartKey!, 1)} className="px-2 py-0.5 hover:text-brand-gold transition-colors text-sm">+</button>
                        </div>
                        <button onClick={() => onRemove(item.cartKey!)} className="text-xs uppercase tracking-widest text-red-800 font-medium hover:underline">Hapus</button>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <button 
                  onClick={() => setShowForm(false)}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-gray-400 hover:text-brand-black transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Kembali ke Keranjang
                </button>
                <h3 className="text-xl font-medium">Data Pengiriman</h3>
                <p className="text-sm text-gray-400 -mt-4 italic">Mohon lengkapi alamat untuk hitung ongkos kirim.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest font-medium text-brand-gold block mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-brand-black border border-brand-cream rounded-sm text-sm text-white placeholder-gray-400 focus:border-brand-gold outline-none transition-colors" 
                      placeholder="Contoh: Ahmad Fulan"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest font-medium text-brand-gold block mb-1">No. WhatsApp</label>
                    <input 
                      type="tel" 
                      className="w-full p-3 bg-brand-black border border-brand-cream rounded-sm text-sm text-white placeholder-gray-400 focus:border-brand-gold outline-none transition-colors" 
                      placeholder="Contoh: 0812..."
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest font-medium text-brand-gold block mb-1">Alamat Lengkap</label>
                    <textarea 
                      className="w-full p-3 bg-brand-black border border-brand-cream rounded-sm text-sm text-white placeholder-gray-400 focus:border-brand-gold outline-none h-24 transition-colors" 
                      placeholder="Nama Jalan, No Rumah, Kelurahan, Kecamatan..."
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-brand-cream bg-white rounded-b-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 uppercase tracking-widest text-xs font-medium">Subtotal</span>
              <span className="text-lg font-medium text-brand-brown">IDR {total.toLocaleString('id-ID')}</span>
            </div>
            
            {showForm ? (
              <button 
                onClick={handleWhatsAppOrder}
                className="w-full py-4 bg-green-600 text-white font-bold uppercase tracking-widest text-sm transition-all hover:bg-green-700 shadow-xl flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.32 0-4.591.905-6.229 2.543-1.638 1.639-2.543 3.909-2.543 6.229 0 2.37.935 4.689 2.57 6.323l.115.115-.991 3.621 3.704-.972.115.067c1.554.918 3.324 1.399 5.129 1.401h.001c2.321 0 4.591-.905 6.23-2.543 1.639-1.638 2.544-3.908 2.544-6.228 0-2.321-.905-4.591-2.543-6.23-1.638-1.638-3.908-2.543-6.228-2.543zm0 2.031c1.868 0 3.633.727 4.965 2.059 1.332 1.332 2.059 3.097 2.059 4.965 0 1.868-.727 3.633-2.059 4.965-1.332 1.332-3.097 2.059-4.965 2.059h-.001c-1.516 0-3-.418-4.281-1.21l-.307-.182-2.147.564.574-2.094-.2-.319c-.866-1.378-1.321-2.981-1.321-4.633 0-1.868.727-3.633 2.059-4.965 1.332-1.332 3.097-2.059 4.965-2.059z"/></svg>
                Kirim Pesan
              </button>
            ) : (
              <button 
                disabled={items.length === 0}
                onClick={() => setShowForm(true)}
                className="w-full py-4 bg-brand-black text-white font-bold uppercase tracking-widest text-sm transition-all hover:bg-brand-gold disabled:bg-gray-100 disabled:text-gray-400 shadow-xl shadow-brand-black/5 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884 0 2.225.584 3.911 1.706 5.659l-.991 3.616 3.774-.974zm12.013-7.243c-.059-.098-.219-.159-.459-.279s-1.416-.699-1.635-.779-.379-.12-.539.12-.618.779-.759.94-.281.18-.521.06-.915-.337-1.743-1.077c-.644-.574-1.08-1.284-1.206-1.498s-.012-.331.108-.45c.107-.108.239-.279.359-.42.12-.139.159-.239.239-.399s.04-.299-.02-.42c-.06-.12-.539-1.298-.738-1.778-.194-.466-.394-.403-.539-.41-.139-.007-.299-.008-.459-.008s-.42.06-.639.299c-.219.239-.838.82-0.838 2.0s.859 2.318.979 2.478 1.69 2.581 4.094 3.621c2.404 1.04 2.404.693 2.843.653s1.416-.579 1.616-1.138.199-1.037.14-1.137z"/></svg>
                Tanya Ongkir
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};