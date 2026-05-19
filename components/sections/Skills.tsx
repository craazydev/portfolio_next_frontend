'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeading from '@/components/ui/SectionHeading';

const CATEGORIES = [
  {
    key: 'frontend',
    label: 'Frontend',
    color: '#00d4ff',
    icon: '🎨',
    techs: [
      { name: 'React',        icon: '⚛️',  color: '#61dafb', desc: 'UI & SPA'         },
      { name: 'Next.js',      icon: '▲',   color: '#ffffff', desc: 'Full-stack React'  },
      { name: 'TypeScript',   icon: '📘',  color: '#3178c6', desc: 'Type-safe JS'      },
      { name: 'Tailwind CSS', icon: '🌊',  color: '#38bdf8', desc: 'Utility-first CSS' },
      { name: 'Framer Motion',icon: '🎞️',  color: '#cc44ff', desc: 'Animations'       },
      { name: 'Three.js',     icon: '🧊',  color: '#00d4ff', desc: '3D on the web'    },
    ],
  },
  {
    key: 'backend',
    label: 'Backend',
    color: '#28e98c',
    icon: '⚙️',
    techs: [
      { name: 'Node.js',     icon: '🟢',  color: '#68a063', desc: 'Server runtime'    },
      { name: 'Express.js',  icon: '🚂',  color: '#999999', desc: 'REST APIs'         },
      { name: 'PHP',         icon: '🐘',  color: '#8892bf', desc: 'Web scripting'     },
      { name: 'Laravel',     icon: '🔴',  color: '#ff2d20', desc: 'PHP framework'     },
      { name: 'REST APIs',   icon: '🔌',  color: '#28e98c', desc: 'API design'        },
      { name: 'JWT / Auth',  icon: '🔐',  color: '#f59e0b', desc: 'Secure auth'       },
    ],
  },
  {
    key: 'database',
    label: 'Database',
    color: '#a855f7',
    icon: '🗄️',
    techs: [
      { name: 'MongoDB',     icon: '🍃',  color: '#47a248', desc: 'NoSQL document DB'  },
      { name: 'MySQL',       icon: '🐬',  color: '#f29111', desc: 'Relational DB'      },
      { name: 'Mongoose',    icon: '📦',  color: '#880000', desc: 'ODM for MongoDB'    },
      { name: 'Redis',       icon: '🔴',  color: '#dc382d', desc: 'In-memory cache'    },
    ],
  },
  {
    key: 'payments',
    label: 'Payments',
    color: '#f59e0b',
    icon: '💳',
    techs: [
      { name: 'Razorpay',    icon: '💙',  color: '#072654', desc: 'India payments'    },
      { name: 'PhonePe',     icon: '💜',  color: '#5f259f', desc: 'UPI gateway'       },
      { name: 'Stripe',      icon: '🟣',  color: '#635bff', desc: 'Global payments'   },
      { name: 'Webhooks',    icon: '🪝',  color: '#28e98c', desc: 'Event handling'    },
    ],
  },
  {
    key: 'devops',
    label: 'DevOps & Tools',
    color: '#f97316',
    icon: '🚀',
    techs: [
      { name: 'Git & GitHub', icon: '🐙', color: '#f05032', desc: 'Version control'   },
      { name: 'Docker',       icon: '🐳', color: '#0db7ed', desc: 'Containerization'  },
      { name: 'AWS',          icon: '☁️', color: '#ff9900', desc: 'Cloud services'    },
      { name: 'Vercel',       icon: '▲',  color: '#ffffff', desc: 'Deployments'       },
      { name: 'Cloudinary',   icon: '🌤️', color: '#3448c5', desc: 'Media storage'    },
      { name: 'Postman',      icon: '📮', color: '#ff6c37', desc: 'API testing'       },
    ],
  },
];

export default function Skills() {
  const [active, setActive] = useState('frontend');
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const category = CATEGORIES.find(c => c.key === active)!;

  return (
    <section id="skills" className="section-padding bg-[#06060f]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Tech Stack"
          title="What I build with"
          subtitle="Hand-picked tools I use daily — from pixel to production."
          center
        />

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                active === cat.key ? 'text-white' : 'text-muted hover:text-light'
              }`}
              style={active === cat.key ? {
                background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}11)`,
                border: `1px solid ${cat.color}40`,
                boxShadow: `0 0 20px ${cat.color}15`,
              } : {
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {active === cat.key && (
                <motion.span
                  layoutId="tab-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: `${cat.color}08` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Tech cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {category.techs.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                whileHover={{ y: -6, scale: 1.04 }}
                className="group relative rounded-2xl p-5 cursor-default flex flex-col items-center text-center gap-3 overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${tech.color}08, rgba(10,10,20,0.8))`,
                  border: `1px solid ${tech.color}20`,
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${tech.color}18 0%, transparent 70%)` }}
                />

                {/* Icon */}
                <div className="relative text-3xl">{tech.icon}</div>

                {/* Name */}
                <p className="relative text-light text-sm font-semibold leading-tight group-hover:text-white transition-colors">
                  {tech.name}
                </p>

                {/* Desc */}
                <p className="relative text-muted text-[10px] font-mono leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {tech.desc}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${tech.color}, transparent)` }}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom — tools strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-10 border-t border-[#1a1a2e]"
        >
          <p className="text-center text-muted text-xs font-mono uppercase tracking-widest mb-6">
            Also comfortable with
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Bootstrap', 'jQuery', 'Socket.io', 'Nginx', 'Linux', 'Figma', 'VS Code', 'Postman', 'Railway', 'cPanel', 'Apache', 'Cloudflare'].map((tool) => (
              <span key={tool}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-muted hover:text-light transition-colors"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {tool}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
