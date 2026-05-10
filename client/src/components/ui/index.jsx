import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInitials, avatarGradient, clsx } from '../../utils';

// ── Avatar ────────────────────────────────────────────────────────────────────
export const Avatar = ({ name = '', size = 36, className = '', src }) => {
  if (src) return <img src={src} alt={name} style={{ width: size, height: size }} className={`rounded-full object-cover ${className}`} />;
  const grad = avatarGradient(name);
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      className={`rounded-full bg-gradient-to-br ${grad} flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

// ── Badge ─────────────────────────────────────────────────────────────────────
const badgeVariants = {
  indigo: 'bg-indigo/10 text-indigo-2 border border-indigo/25',
  cyan:   'bg-cyan/10   text-cyan    border border-cyan/25',
  green:  'bg-emerald/10 text-emerald border border-emerald/25',
  amber:  'bg-amber/10  text-amber   border border-amber/25',
  red:    'bg-rose/10   text-rose    border border-rose/25',
  purple: 'bg-purple/10 text-purple  border border-purple/25',
  pink:   'bg-pink/10   text-pink    border border-pink/25',
};
export const Badge = ({ children, variant = 'indigo', className = '' }) => (
  <span className={`badge ${badgeVariants[variant] || badgeVariants.indigo} ${className}`}>{children}</span>
);

// ── ProgressBar ───────────────────────────────────────────────────────────────
export const ProgressBar = ({ pct = 0, color = '#4f46e5', height = 6, animate = true }) => (
  <div className="progress-bar" style={{ height }}>
    <motion.div
      className="progress-fill"
      style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }}
      initial={animate ? { width: 0 } : { width: `${pct}%` }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  </div>
);

// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 20, className = '' }) => (
  <div
    style={{ width: size, height: size, borderWidth: size * 0.1 }}
    className={`rounded-full border-[#1e2d4a] border-t-indigo animate-spin ${className}`}
  />
);

// ── Button ────────────────────────────────────────────────────────────────────
export const Button = ({ children, variant = 'primary', loading, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg text-sm transition-all duration-150 cursor-pointer border-0 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-indigo to-indigo-2 text-white hover:opacity-90 hover:-translate-y-px',
    ghost:   'bg-transparent text-[#94a3b8] border border-[#1e2d4a] hover:bg-[#0b1630] hover:text-white',
    cyan:    'bg-gradient-to-r from-cyan to-[#0e7490] text-white hover:opacity-90 hover:-translate-y-px',
    danger:  'bg-rose/10 text-rose border border-rose/25 hover:bg-rose/20',
    success: 'bg-emerald/10 text-emerald border border-emerald/25 hover:bg-emerald/20',
  };
  return (
    <button disabled={loading} className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {loading ? <Spinner size={14} /> : null}
      {children}
    </button>
  );
};

// ── Input ─────────────────────────────────────────────────────────────────────
export const Input = ({ label, error, className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-xs text-[#94a3b8] font-semibold tracking-wide">{label}</label>}
    <input className="input" {...props} />
    {error && <p className="text-xs text-rose">{error}</p>}
  </div>
);

// ── Select ────────────────────────────────────────────────────────────────────
export const Select = ({ label, options = [], className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-xs text-[#94a3b8] font-semibold tracking-wide">{label}</label>}
    <select className="input" {...props}>
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, width = 'max-w-lg' }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className={`relative w-full ${width} bg-[#0b1630] border border-[#1e2d4a] rounded-2xl p-6 shadow-2xl`}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {title && (
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base">{title}</h3>
              <button onClick={onClose} className="text-[#64748b] hover:text-white text-xl leading-none">×</button>
            </div>
          )}
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── EmptyState ────────────────────────────────────────────────────────────────
export const EmptyState = ({ icon = '📭', title, desc, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-4xl mb-3">{icon}</div>
    <div className="font-bold text-[#f1f5f9] mb-1">{title}</div>
    {desc && <p className="text-sm text-[#64748b] mb-4 max-w-xs">{desc}</p>}
    {action}
  </div>
);

// ── StatCard ──────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, change, icon, gradient = 'from-indigo to-indigo-2', className = '' }) => (
  <motion.div
    className={`stat-card ${className}`}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.15 }}
  >
    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient}`} />
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] text-[#64748b] uppercase tracking-[.8px] font-semibold">{label}</span>
      {icon && <span className="text-lg">{icon}</span>}
    </div>
    <div className={`text-2xl font-bold font-mono bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{value}</div>
    {change !== undefined && (
      <div className={`text-[11px] mt-1.5 ${change >= 0 ? 'text-emerald' : 'text-rose'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last sem
      </div>
    )}
  </motion.div>
);

// ── Tabs ──────────────────────────────────────────────────────────────────────
export const Tabs = ({ tabs = [], active, onChange }) => (
  <div className="flex gap-1 bg-[#0b1630] border border-[#1e2d4a] rounded-xl p-1">
    {tabs.map(t => (
      <button
        key={t.value}
        onClick={() => onChange(t.value)}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
          active === t.value
            ? 'bg-indigo text-white shadow-sm'
            : 'text-[#64748b] hover:text-[#94a3b8]'
        }`}
      >
        {t.label}
      </button>
    ))}
  </div>
);
