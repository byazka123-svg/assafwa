
import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { STRAPI_URL } from '../constants';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: CartItem) => void;
}

const SIZES = ['M', 'L', 'XL', 'XXL'];
const COLORS = ['White', 'Black', 'Navy', 'Olive'];

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('White');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getPlaceholderImage = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('koko')) return 'https://images.unsplash.com/photo-1621294200609-77f62e604052?auto=format&fit=crop&q=80&w=1200';
    if (lowerName.includes('jubah')) return 'https://images.unsplash.com/photo-1598559069352-3d8437b0d42c?auto=format&fit=crop&q=80&w=1200';
    return 'https://images.unsplash.com/photo-1516257984877-473d54edfe0c?auto=format&fit=crop&q=80&w=1200';
  };

  const imageUrl = product.image?.url 
    ? (product.image.url.startsWith('/') ? `${STRAPI_URL}${product.image.url}` : product.image.url)
    : getPlaceholderImage(product.name);

  const handleAdd = () => {
    onAddToCart({
      ...product,
      quantity: 1,
      selectedSize,
      selectedColor
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-16 animate-fadeIn">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-brand-gold transition-colors mb-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Katalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        <div className="space-y-6">
          <div className="aspect-[3/4] overflow-hidden bg-brand-cream/20 border border-brand-cream/50 rounded-sm shadow-inner">
            <img 
              src={imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getPlaceholderImage(product.name);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-10">
            <span className="text-[9px] md:text-[11px] uppercase tracking-[0.5em] text-brand-gold font-bold mb-4 block">
              {product.category?.name || 'Signature Edition'}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold brand-serif text-brand-black mb-6 leading-tight uppercase tracking-tight">{product.name}</h1>
            <p className="text-2xl md:text-3xl font-bold text-brand-brown font-sans">IDR {product.price.toLocaleString('id-ID')}</p>
          </div>

          <div className="space-y-10 pb-10 border-b border-brand-cream/50">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-black block mb-5">Pilih Ukuran</label>
              <div className="flex flex-wrap gap-4">
                {SIZES.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[64px] py-4 text-[12px] font-bold border transition-all rounded-sm ${selectedSize === s ? 'bg-brand-black text-white border-brand-black shadow-lg shadow-brand-black/20' : 'border-brand-cream hover:border-brand-gold text-brand-brown'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleAdd}
                className="w-full py-6 bg-brand-gold text-white font-bold uppercase tracking-[0.3em] text-[12px] hover:bg-brand-black transition-all duration-500 shadow-xl shadow-brand-gold/20 transform active:scale-[0.98]"
              >
                Tambahkan ke Keranjang
              </button>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-black mb-4">Deskripsi Produk</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed font-light">
                {product.description || "Didesain eksklusif oleh Assafwa dengan mengedepankan kualitas jahitan dan material."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
