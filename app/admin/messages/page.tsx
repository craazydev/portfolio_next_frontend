'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, MailOpen } from 'lucide-react';

interface Message {
  _id: string; name: string; email: string; subject?: string;
  message: string; read: boolean; createdAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin'); return; }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setMessages(d.data ?? []))
      .finally(() => setLoading(false));
  }, [router]);

  const markRead = async (id: string) => {
    const token = localStorage.getItem('admin_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages((prev) => prev.map((m) => m._id === id ? { ...m, read: true } : m));
  };

  return (
    <div className="min-h-screen bg-[#080810] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-black text-light mb-8">Messages</h1>

        {loading ? (
          <div className="text-muted text-sm">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-muted">No messages yet.</div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m._id} className={`glass rounded-xl border p-6 transition-all ${m.read ? 'border-[#1a1a2e]' : 'border-cyan-400/20'}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    {m.read ? <MailOpen size={16} className="text-muted" /> : <Mail size={16} className="text-cyan-400" />}
                    <div>
                      <p className="text-light text-sm font-semibold">{m.name}</p>
                      <p className="text-muted text-xs">{m.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-muted text-xs">{new Date(m.createdAt).toLocaleDateString('en-IN')}</p>
                    {!m.read && (
                      <button onClick={() => markRead(m._id)} className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 transition-colors">
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
                {m.subject && <p className="text-light text-xs font-medium mb-2">{m.subject}</p>}
                <p className="text-muted text-sm leading-relaxed">{m.message}</p>
                <a href={`mailto:${m.email}`} className="inline-block mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  Reply via email →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
