import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

interface SignupPageProps {
  onNavigateToLogin: () => void;
  onSignupSuccess: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin, onSignupSuccess }) => {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await signup({ username, email, password });
      if (response.error) {
        throw new Error(response.error.message || 'Signup failed');
      }
      onSignupSuccess();
    } catch (err: any) {
      setError('Gagal membuat akun. Email mungkin sudah terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-medium uppercase tracking-widest text-brand-black">Buat Akun</h1>
        <p className="text-gray-400 text-sm mt-2">Dapatkan akses ke koleksi eksklusif kami.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest font-medium text-brand-gold block mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 bg-brand-white border border-brand-cream/50 rounded-sm text-sm text-brand-black placeholder-gray-400 focus:border-brand-gold outline-none transition-colors"
            placeholder="Username Anda"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest font-medium text-brand-gold block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-brand-white border border-brand-cream/50 rounded-sm text-sm text-brand-black placeholder-gray-400 focus:border-brand-gold outline-none transition-colors"
            placeholder="email@anda.com"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest font-medium text-brand-gold block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-brand-white border border-brand-cream/50 rounded-sm text-sm text-brand-black placeholder-gray-400 focus:border-brand-gold outline-none transition-colors"
            placeholder="Minimal 6 karakter"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-black text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-brand-gold transition-all rounded-sm disabled:bg-gray-300"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Sudah punya akun?{' '}
            <button type="button" onClick={onNavigateToLogin} className="font-medium text-brand-gold hover:underline">
              Login di sini
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};