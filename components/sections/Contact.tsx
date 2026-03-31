'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Github, Linkedin, CheckCircle2, AlertCircle } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { sendContact } from '@/lib/api';

interface FormState { name: string; email: string; subject: string; message: string; }
const INIT: FormState = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form,    setForm]    = useState<FormState>(INIT);
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg,  setErrMsg]  = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await sendContact(form);
      setStatus('success');
      setForm(INIT);
    } catch (err: unknown) {
      setStatus('error');
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
  };

  return (
    <section id="contact" className="section-padding bg-[#080810]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Contact"
          title="Let's build something great"
          subtitle="Have a project in mind? I'd love to hear about it."
          center
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {[
              { icon: MapPin, label: 'Location',  value: 'Lucknow, Uttar Pradesh, India', sub: 'Available for remote worldwide' },
              { icon: Mail,   label: 'Email',     value: 'ashutosh@crazydev.in',          sub: 'Reply within 24 hours' },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex items-start gap-4 glass rounded-xl p-5 border border-[#1a1a2e]">
                <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-muted text-xs mb-1">{label}</p>
                  <p className="text-light text-sm font-medium">{value}</p>
                  <p className="text-muted text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            <div className="glass rounded-xl p-5 border border-[#1a1a2e]">
              <p className="text-muted text-xs mb-3">Find me on</p>
              <div className="flex gap-3">
                {[
                  { href: 'https://github.com/Ashutosh724425',                  Icon: Github,   label: 'GitHub'   },
                  { href: 'https://linkedin.com/in/ashutosh-dubey-78111225b/',  Icon: Linkedin, label: 'LinkedIn' },
                ].map(({ href, Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-[#1a1a2e] text-muted hover:text-cyan-400 hover:border-cyan-400/20 transition-all text-sm">
                    <Icon size={15} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl border border-green-400/20 p-12 text-center"
              >
                <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
                <h3 className="text-light text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted text-sm">Thank you for reaching out. I'll get back to you within 24 hours.</p>
                <button onClick={() => setStatus('idle')}
                  className="mt-6 px-5 py-2 rounded-lg glass border border-[#1a1a2e] text-sm text-muted hover:text-light transition-colors">
                  Send another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-2xl border border-[#1a1a2e] p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {(['name', 'email'] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-muted text-xs mb-2 capitalize">{field} *</label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        required
                        placeholder={field === 'name' ? 'John Doe' : 'john@example.com'}
                        className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm placeholder:text-muted/50 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-muted text-xs mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Project inquiry / Freelance / etc."
                    className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm placeholder:text-muted/50 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-muted text-xs mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-xl px-4 py-3 text-light text-sm placeholder:text-muted/50 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all resize-none"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={14} /> {errMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-sm hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 transition-all duration-300"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
