import React, { useState } from 'react';
import { Product, CartItem } from '../types';

interface SelectionModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: CartItem) => void;
}

const SIZES = ['M', 'L', 'XL', 'XXL'];
const COLORS = ['White', 'Black', 'Navy', 'Olive'];

export const SelectionModal: React.FC<SelectionModalProps> = ({ product, isOpen, onClose, onConfirm }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('White');

  if (!product) return null;

  const handleConfirm = () => {
    onConfirm({
      ...product,
      quantity: 1,
      selectedSize,
      selectedColor
    });
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-brand-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white z-[70] shadow-2xl rounded-sm transition-all duration-300 transform ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-brand-gold font-medium block mb-1">Pilihan Koleksi</span>
              <h2 className="text-xl font-medium text-brand-black">{product.name}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-brand-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <label className="text-xs uppercase tracking-widest font-medium text-brand-black block mb-4">Pilih Ukuran</label>
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedSize(s)}
                    className={`py-3 text-xs font-bold border transition-all rounded-sm ${selectedSize === s ? 'bg-brand-black text-white border-brand-black' : 'border-brand-cream text-brand-brown hover:border-brand-gold'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-medium text-brand-black block mb-4">Pilih Warna</label>
              <div className="grid grid-cols-2 gap-2">
                {COLORS.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setSelectedColor(c)}
                    className={`py-3 text-xs font-bold border transition-all uppercase tracking-widest rounded-sm ${selectedColor === c ? 'bg-brand-black text-white border-brand-black' : 'border-brand-cream text-brand-brown hover:border-brand-gold'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleConfirm}
              className="w-full py-5 bg-brand-gold text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-brand-black transition-all shadow-xl shadow-brand-gold/20"
            >
              Konfirmasi Pesanan
            </button>
          </div>
        </div>
      </div>
    </>
  );
};