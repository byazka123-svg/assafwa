import React from 'react';
import { Product } from '../types';
import { STRAPI_URL } from '../constants';

interface ProductCardProps {
  product: Product;
  onAddToCartClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCartClick }) => {
  const getPlaceholderImage = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('koko')) return 'https://images.unsplash.com/photo-1621294200609-77f62e604052?auto=format&fit=crop&q=80&w=600';
    if (lowerName.includes('jubah')) return 'https://images.unsplash.com/photo-1598559069352-3d8437b0d42c?auto=format&fit=crop&q=80&w=600';
    return 'https://images.unsplash.com/photo-1516257984877-473d54edfe0c?auto=format&fit=crop&q=80&w=600';
  };

  // Improved Image URL handling: specifically checks for relative paths starting with /
  const imageUrl = product.image?.url 
    ? (product.image.url.startsWith('/') ? `${STRAPI_URL}${product.image.url}` : product.image.url)
    : getPlaceholderImage(product.name);

  return (
    <div className="group bg-white border border-brand-cream/50 rounded-sm overflow-hidden transition-all duration-700 hover:shadow-xl flex flex-col h-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-cream/20">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getPlaceholderImage(product.name);
          }}
        />
      </div>
      
      <div className="p-4 md:p-6 flex flex-col flex-grow text-center">
        <span className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-brand-gold font-medium mb-2">
          {product.category?.name || 'Signature Series'}
        </span>
        <h3 className="text-[13px] md:text-base font-medium text-brand-black mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <div className="mt-auto space-y-4">
          <span className="text-xs md:text-base font-medium text-brand-brown block">
            IDR {product.price.toLocaleString('id-ID')}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCartClick(product);
            }}
            className="w-full py-2.5 md:py-3.5 bg-brand-black text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold transition-all duration-300 transform active:scale-95"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};