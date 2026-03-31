'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Code2 } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [show,    setShow]    = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      localStorage.setItem('admin_token', data.token);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] hero-gradient flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
            <Code2 size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-light">Admin Panel</h1>
          <p className="text-muted text-sm mt-1">Portfolio CMS</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl border border-[#1a1a2e] p-8 space-y-5">
          <div>
            <label className="block text-muted text-xs mb-2">Email</label>
            <input
              type="email" required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all"
            />
          </div>
          <div>
            <label className="block text-muted text-xs mb-2">Password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'} required
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 pr-11 text-light text-sm focus:outline-none focus:border-cyan-400/40 transition-all"
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-light transition-colors">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm disabled:opacity-60 transition-all hover:scale-[1.02]"
          >
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock size={15} /> Sign In</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
