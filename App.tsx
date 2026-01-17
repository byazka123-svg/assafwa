import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from './constants';
import { Product, CartItem, StrapiResponse } from './types';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import { ProductDetail } from './components/ProductDetail';
import { SelectionModal } from './components/SelectionModal';
import { Profile } from './components/Profile';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { useAuth } from './AuthContext';

const categories = [
  { id: 'all', name: 'Semua', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  )},
  { id: 'koko', name: 'Koko', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L9.5 5.5L12 9L14.5 5.5L12 2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10L4 12V21H20V12L15 10" />
    </svg>
  )},
  { id: 'jubah', name: 'Jubah', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 3L18 3L21 21L3 21L6 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3V21" />
    </svg>
  )},
  { id: 'kurta', name: 'Kurta', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4L4 8V20H20V8L12 4Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4V20M8 8h8" />
    </svg>
  )},
  { id: 'sirwal', name: 'Sirwal', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 3L12 6L17 3L20 21H14L12 14L10 21H4L7 3Z" />
    </svg>
  )}
];

type View = 'home' | 'profile' | 'login' | 'signup';

const App: React.FC = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToConfigure, setProductToConfigure] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let url = `${API_URL}/products?populate=*`;
      if (activeCategory !== 'all') {
        url += `&filters[category][slug][$eqi]=${activeCategory}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const json: StrapiResponse<Product> = await response.json();
      setProducts(json.data || []);
    } catch (err: any) {
      console.error('Fetch error:', err.message);
      setError("Gagal memuat produk. Periksa koneksi ke server Strapi.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    if (currentView === 'home' && !selectedProduct) {
      fetchProducts();
    }
  }, [fetchProducts, currentView, selectedProduct]);

  const addToCart = (productWithSelection: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(item => 
        item.id === productWithSelection.id && 
        item.selectedSize === productWithSelection.selectedSize &&
        item.selectedColor === productWithSelection.selectedColor
      );
      if (existing) {
        return prev.map(item => 
          (item.cartKey === existing.cartKey) 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { ...productWithSelection, cartKey: Math.random().toString(36).substr(2, 9) }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartKey: string) => setCartItems(p => p.filter(i => i.cartKey !== cartKey));
  const updateQuantity = (cartKey: string, delta: number) => setCartItems(p => p.map(i => i.cartKey === cartKey ? {...i, quantity: Math.max(1, i.quantity + delta)} : i));
  const updateSelection = (cartKey: string, size: string, color: string) => setCartItems(p => p.map(i => i.cartKey === cartKey ? {...i, selectedSize: size, selectedColor: color} : i));

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navigateTo = (view: View) => {
    if (view === 'profile' && !user) {
      setCurrentView('login');
      return;
    }
    setCurrentView(view);
    setSelectedProduct(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setCurrentView('home');
    setSelectedProduct(null);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigateTo('home');
  };

  const renderContent = () => {
    if (authLoading) {
       return (
        <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
        </div>
       )
    }

    if (currentView === 'login') {
      return <LoginPage onNavigateToSignup={() => navigateTo('signup')} onLoginSuccess={() => navigateTo('home')} />;
    }
    if (currentView === 'signup') {
      return <SignupPage onNavigateToLogin={() => navigateTo('login')} onSignupSuccess={() => navigateTo('home')} />;
    }
    if (currentView === 'profile') {
      return <Profile onBack={() => navigateTo('home')} onLogout={handleLogout} />;
    }
    if (selectedProduct) {
      return <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} onAddToCart={addToCart} />;
    }

    return (
      <>
        {/* Marquee, Hero, Categories */}
        <div className="bg-brand-cream/60 border-b border-brand-cream py-2 md:py-3 overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee">
            <div className="flex items-center gap-12 md:gap-24 px-4 text-[9px] md:text-[11px] font-medium uppercase tracking-[0.3em] text-brand-brown">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="flex items-center gap-3">
                  <svg className="h-4 w-4 text-brand-gold" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.74-3.94-1.69-.15-.12-.29-.26-.43-.4-.02 2.75-.02 5.51-.02 8.26 0 1.45-.44 2.89-1.28 4.04-1.12 1.54-2.88 2.59-4.73 2.82-1.85.23-3.8-.18-5.32-1.26-1.52-1.07-2.58-2.77-2.86-4.6-.28-1.84.15-3.8 1.22-5.32 1.07-1.52 2.77-2.58 4.6-2.86.82-.12 1.65-.12 2.47-.02v4.04c-.66-.11-1.34-.06-1.97.16-.63.22-1.2.62-1.59 1.15-.39.53-.59 1.18-.56 1.83.03.65.29 1.28.73 1.75.44.47 1.05.77 1.71.84.66.07 1.32-.08 1.89-.42.57-.34 1.01-.86 1.24-1.48.23-.62.24-1.31.02-1.94V.02z"/></svg>
                  ASSAFWA SIGNATURE - PREMIUM QUALITY
                </span>
              ))}
            </div>
          </div>
        </div>
        <section className="relative h-[25vh] md:h-[40vh] flex items-center justify-center overflow-hidden bg-brand-cream/20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=1500')] bg-cover bg-center mix-blend-multiply opacity-[0.05]"></div>
          <div className="z-10 text-center px-6">
            <span className="text-[8px] md:text-[10px] uppercase tracking-[0.6em] text-brand-gold font-medium mb-2 md:mb-4 block opacity-80">Collection 2024</span>
            <h2 className="text-2xl md:text-5xl font-medium mb-2 md:mb-4 text-brand-black capitalize tracking-tight">
              {activeCategory === 'all' ? 'Koleksi Signature' : activeCategory.replace('-', ' ')}
            </h2>
            <div className="h-[1px] w-8 md:w-12 bg-brand-gold mx-auto"></div>
          </div>
        </section>
        <div className="bg-white border-b border-brand-cream/50">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
            <div className="flex justify-center items-center gap-4 md:gap-12 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={`flex flex-col items-center gap-2 group transition-all duration-300 min-w-[60px] ${activeCategory === cat.id && currentView === 'home' && !selectedProduct ? 'text-brand-gold' : 'text-gray-400 hover:text-brand-black'}`}>
                  <div className={`p-2.5 rounded-full transition-all duration-500 ${activeCategory === cat.id && currentView === 'home' && !selectedProduct ? 'bg-brand-gold/10' : 'bg-gray-50'}`}><div className="scale-90 md:scale-100">{cat.icon}</div></div>
                  <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-medium whitespace-nowrap">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-20">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4"><div className="bg-brand-cream/40 aspect-[3/4] animate-pulse rounded-sm" /><div className="h-4 bg-brand-cream/40 w-3/4 animate-pulse mx-auto" /><div className="h-4 bg-brand-cream/40 w-1/4 animate-pulse mx-auto" /></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20"><p className="text-red-400 uppercase tracking-widest text-xs font-medium">{error}</p><button onClick={fetchProducts} className="mt-4 text-[10px] uppercase tracking-widest font-medium text-brand-gold underline">Coba Lagi</button></div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-y-16 md:gap-x-12">
              {products.map((product) => (
                <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                  <ProductCard product={product} onAddToCartClick={(p) => setProductToConfigure(p)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <svg className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4" /></svg>
              <p className="text-gray-400 uppercase tracking-widest text-[10px] font-medium">Belum ada koleksi untuk kategori "{activeCategory}".</p>
            </div>
          )}
        </main>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-brand-white selection:bg-brand-gold selection:text-white pb-20 md:pb-0">
      <div className="bg-brand-black py-2.5 text-center">
        <div className="max-w-7xl mx-auto px-4 text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-brand-gold font-medium">
          JAM BUKA: 09.00 - 21.00 WIB | WHATSAPP: 0812 3456 789
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-cream/50 h-[70px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full flex items-center justify-between">
          <div className="flex flex-col cursor-pointer" onClick={() => navigateTo('home')}>
            <h1 className="text-xl md:text-3xl font-medium tracking-[0.3em] text-brand-black uppercase">ASSAFWA</h1>
          </div>
          <nav className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] font-medium">
            <button onClick={() => navigateTo('home')} className={currentView === 'home' && !selectedProduct ? 'text-brand-gold' : 'text-brand-black hover:text-brand-gold transition-colors'}>Katalog</button>
            {!authLoading && (user ? (
              <button onClick={() => navigateTo('profile')} className={currentView === 'profile' ? 'text-brand-gold' : 'text-brand-black hover:text-brand-gold transition-colors'}>Profil</button>
            ) : (
              <button onClick={() => navigateTo('login')} className={currentView === 'login' ? 'text-brand-gold' : 'text-brand-black hover:text-brand-gold transition-colors'}>Login</button>
            ))}
            <button className="text-brand-black hover:text-brand-gold transition-colors">Bantuan</button>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-brand-black hover:text-brand-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {totalCartCount > 0 && <span className="absolute top-1 right-1 bg-brand-gold text-white text-[8px] font-bold px-1 py-0.5 rounded-full min-w-[17px]">{totalCartCount}</span>}
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-brand-black">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-brand-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[101] shadow-2xl transform transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-brand-cream flex justify-between items-center"><h2 className="font-medium text-lg tracking-widest uppercase">Menu</h2><button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
        <nav className="p-8 flex flex-col gap-8 text-[11px] uppercase tracking-[0.3em] font-medium">
          <button onClick={() => navigateTo('home')} className="text-left py-2 border-b border-brand-cream/30 hover:text-brand-gold">Home</button>
          <button onClick={() => handleCategorySelect('all')} className="text-left py-2 border-b border-brand-cream/30 hover:text-brand-gold">Katalog</button>
          {!authLoading && (user ? (
            <>
              <button onClick={() => navigateTo('profile')} className="text-left py-2 border-b border-brand-cream/30 hover:text-brand-gold">Profil Saya</button>
              <button onClick={handleLogout} className="text-left py-2 border-b border-brand-cream/30 text-red-700 hover:text-red-500">Keluar</button>
            </>
          ) : (
            <button onClick={() => navigateTo('login')} className="text-left py-2 border-b border-brand-cream/30 hover:text-brand-gold">Login / Daftar</button>
          ))}
        </nav>
      </div>

      {renderContent()}

      <footer className="bg-brand-black text-white pt-20 pb-10 border-t border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8 text-center md:text-left"><h2 className="text-3xl font-medium uppercase tracking-[0.3em]">ASSAFWA</h2><p className="text-gray-400 text-[11px] leading-relaxed tracking-wider uppercase opacity-60 max-w-xs mx-auto md:mx-0">Menyediakan busana muslim premium dengan kualitas kain terbaik dan desain eksklusif sejak 2018.</p></div>
            <div className="text-center md:text-left"><h3 className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-medium mb-8">Katalog</h3><ul className="space-y-4 text-[11px] uppercase tracking-[0.15em] text-gray-400 font-medium"><li><button onClick={() => handleCategorySelect('koko')} className="hover:text-white">Koleksi Koko</button></li><li><button onClick={() => handleCategorySelect('kurta')} className="hover:text-white">Koleksi Kurta</button></li><li><button onClick={() => handleCategorySelect('jubah')} className="hover:text-white">Koleksi Jubah</button></li></ul></div>
            <div className="text-center md:text-left"><h3 className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-medium mb-8">Bantuan</h3><ul className="space-y-4 text-[11px] uppercase tracking-[0.15em] text-gray-400 font-medium"><li><a href="#" className="hover:text-white">Status Pesanan</a></li><li><a href="#" className="hover:text-white">Kebijakan Retur</a></li></ul></div>
            <div className="text-center md:text-left"><h3 className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-medium mb-8">Offline Store</h3><p className="text-[10px] text-white/60 leading-relaxed uppercase">Pertokoan Assafwa, Blok C-04, Tanah Abang, Jakarta Pusat</p></div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6"><p className="text-gray-600 text-[9px] uppercase tracking-[0.4em] font-medium text-center md:text-left">&copy; 2024 ASSAFWA SIGNATURE. ALL RIGHTS RESERVED.</p></div>
        </div>
      </footer>
      <SelectionModal product={productToConfigure} isOpen={!!productToConfigure} onClose={() => setProductToConfigure(null)} onConfirm={addToCart} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onRemove={removeFromCart} onUpdateQty={updateQuantity} onUpdateSelection={updateSelection} />
    </div>
  );
};
export default App;
