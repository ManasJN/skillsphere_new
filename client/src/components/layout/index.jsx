import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks';
import { Avatar, Badge } from '../ui';
import { levelFromXP, xpProgress } from '../../utils';

// ── Nav config per role ────────────────────────────────────────────────────────
const studentNav = [
  { section: 'Menu' },
  { to: '/dashboard',     label: 'Dashboard',     icon: '🏠' },
  { to: '/profile',       label: 'My Profile',    icon: '👤' },
  { to: '/skills',        label: 'Skills & Goals', icon: '🎯' },
  { to: '/projects',      label: 'Projects',      icon: '🛠' },
  { section: 'Discover' },
  { to: '/opportunities', label: 'Opportunities', icon: '💼', badge: 'new' },
  { to: '/leaderboard',   label: 'Leaderboard',   icon: '🏆' },
  { section: 'Insights' },
  { to: '/analytics',     label: 'Analytics',     icon: '📊' },
  { to: '/notifications', label: 'Notifications', icon: '🔔', badge: 'unread' },
  { to: '/settings',      label: 'Settings',      icon: '⚙️' },
];
const facultyNav = [
  { section: 'Menu' },
  { to: '/faculty',       label: 'Dashboard',     icon: '🏠' },
  { to: '/students',      label: 'Students',      icon: '👥' },
  { to: '/leaderboard',   label: 'Leaderboard',   icon: '🏆' },
  { to: '/analytics',     label: 'Analytics',     icon: '📊' },
  { to: '/opportunities', label: 'Opportunities', icon: '💼' },
  { to: '/notifications', label: 'Notifications', icon: '🔔', badge: 'unread' },
  { to: '/settings',      label: 'Settings',      icon: '⚙️' },
];
const adminNav = [
  { section: 'Menu' },
  { to: '/admin',         label: 'Dashboard',     icon: '🏠' },
  { to: '/students',      label: 'Students',      icon: '👥' },
  { to: '/leaderboard',   label: 'Leaderboard',   icon: '🏆' },
  { to: '/analytics',     label: 'Analytics',     icon: '📊' },
  { to: '/opportunities', label: 'Opportunities', icon: '💼' },
  { section: 'Admin' },
  { to: '/notifications', label: 'Notifications', icon: '🔔', badge: 'unread' },
  { to: '/settings',      label: 'Settings',      icon: '⚙️' },
];

const navByRole = { student: studentNav, faculty: facultyNav, admin: adminNav };

// ── Sidebar ───────────────────────────────────────────────────────────────────
export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { unreadCount }  = useNotifications();
  const nav              = navByRole[user?.role] || studentNav;
  const xp               = user?.xpPoints || 0;
  const level            = levelFromXP(xp);
  const prog             = xpProgress(xp);

  return (
    <aside className="w-[220px] min-w-[220px] bg-[#0b1630] border-r border-[#1e2d4a] flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[#1e2d4a]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo to-cyan flex items-center justify-center text-base font-bold">⬡</div>
          <div>
            <div className="text-sm font-bold tracking-tight">SkillSphere</div>
            <div className="text-[10px] text-[#475569] uppercase tracking-widest">Growth Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto flex flex-col gap-0.5">
        {nav.map((item, i) => {
          if (item.section) return (
            <div key={i} className="text-[10px] text-[#475569] uppercase tracking-[1px] px-2.5 pt-3 pb-1 mt-1">{item.section}</div>
          );
          const badge = item.badge === 'unread' ? unreadCount : null;
          return (
            <NavLink key={i} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="flex-1 text-[13px]">{item.label}</span>
              {badge > 0 && (
                <span className="bg-indigo text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{badge}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* XP bar */}
      {user?.role === 'student' && (
        <div className="px-4 pb-3">
          <div className="flex justify-between text-[11px] text-[#64748b] mb-1">
            <span>Level {level}</span>
            <span className="font-mono">{xp} XP</span>
          </div>
          <div className="progress-bar" style={{ height: 4 }}>
            <div className="progress-fill" style={{ width: `${prog}%`, background: 'linear-gradient(90deg,#f59e0b,#ef4444)' }} />
          </div>
        </div>
      )}

      {/* User footer */}
      <div className="px-3 pb-4 border-t border-[#1e2d4a] pt-3 flex items-center gap-2.5">
        <Avatar name={user?.name} size={32} />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold truncate">{user?.name}</div>
          <div className="text-[10px] text-[#475569] capitalize">{user?.role}</div>
        </div>
        <button onClick={logout} title="Logout" className="text-[#475569] hover:text-rose text-sm transition-colors">⬡</button>
      </div>
    </aside>
  );
};

// ── Topbar ────────────────────────────────────────────────────────────────────
export const Topbar = ({ title }) => {
  const { user }        = useAuth();
  const { unreadCount } = useNotifications();
  const navigate        = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <header className="h-14 border-b border-[#1e2d4a] flex items-center px-6 gap-4 flex-shrink-0 bg-[#060d1f]">
      <h1 className="text-sm font-bold text-[#f1f5f9]">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#0b1630] border border-[#1e2d4a] rounded-lg px-3 py-1.5 w-48">
          <span className="text-[#475569] text-sm">🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search..." onKeyDown={e => e.key === 'Enter' && navigate(`/students?q=${search}`)}
            className="bg-transparent text-xs text-[#94a3b8] outline-none w-full placeholder:text-[#475569]"
          />
        </div>
        {/* Notifications bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="w-8 h-8 bg-[#0b1630] border border-[#1e2d4a] rounded-lg flex items-center justify-center relative hover:bg-[#111e3a] transition-colors"
        >
          <span className="text-sm">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        {/* Avatar */}
        <button onClick={() => navigate('/profile')} className="hover:opacity-80 transition-opacity">
          <Avatar name={user?.name} size={30} />
        </button>
      </div>
    </header>
  );
};

// ── Main Layout ───────────────────────────────────────────────────────────────
export const Layout = ({ children, title = 'SkillSphere' }) => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title={title} />
      <main className="flex-1 overflow-y-auto p-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {children}
        </motion.div>
      </main>
    </div>
  </div>
);
