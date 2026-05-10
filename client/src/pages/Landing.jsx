import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  { icon: '🎯', title: 'Skill Tracking',       desc: 'Add skills, set proficiency levels, track progress with animated charts and completion metrics.' },
  { icon: '🏆', title: 'Leaderboards',          desc: 'Healthy competition with department and coding leaderboards, XP points, and achievement badges.' },
  { icon: '💼', title: 'Opportunity Matching',  desc: 'AI-powered matching of students to internships, hackathons, and research roles.' },
  { icon: '📊', title: 'Analytics',             desc: 'Real-time analytics for faculty and HODs to monitor department-wide performance.' },
  { icon: '🚀', title: 'Project Portfolio',     desc: 'Showcase projects with tech stacks, GitHub links, live demos, and team collaborators.' },
  { icon: '🔔', title: 'Smart Notifications',  desc: 'Deadline reminders, opportunity alerts, achievement unlocks, and faculty announcements.' },
];

const stats = [
  { val: '12,400+', label: 'Active Students' },
  { val: '98%',     label: 'Placement Rate'  },
  { val: '340K+',   label: 'Skills Tracked'  },
  { val: '15',      label: 'Institutions'    },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#060d1f] text-[#f1f5f9] overflow-y-auto">
      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-cyan/8 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[#1e2d4a]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo to-cyan flex items-center justify-center font-bold">⬡</div>
          <span className="font-bold text-base tracking-tight">SkillSphere</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')}   className="btn-ghost text-sm px-4 py-2">Sign In</button>
          <button onClick={() => navigate('/register')} className="btn-primary text-sm px-4 py-2">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-20 pb-16">
        <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 bg-indigo/10 border border-indigo/25 rounded-full px-4 py-1.5 text-xs text-indigo-2 font-semibold mb-8">
          ✨ Trusted by 2,000+ students across 15 institutions
        </motion.div>
        <motion.h1 {...fadeUp(0.2)} className="text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-[-2px] mb-6">
          Track Skills.{' '}<br />
          Build Growth.{' '}<br />
          <span className="gradient-text">Shape Futures.</span>
        </motion.h1>
        <motion.p {...fadeUp(0.3)} className="text-[17px] text-[#94a3b8] leading-relaxed max-w-xl mx-auto mb-10">
          SkillSphere is the all-in-one student growth platform that turns scattered progress into a clear, actionable roadmap — for students, faculty, and institutions.
        </motion.p>
        <motion.div {...fadeUp(0.4)} className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => navigate('/register')}
            className="px-7 py-3.5 bg-gradient-to-r from-indigo to-indigo-2 text-white font-bold rounded-xl text-sm shadow-[0_0_30px_rgba(79,70,229,.35)] hover:shadow-[0_4px_40px_rgba(79,70,229,.5)] hover:-translate-y-0.5 transition-all duration-200 border-0 cursor-pointer"
          >
            Get Started Free →
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-7 py-3.5 bg-transparent text-[#f1f5f9] font-bold rounded-xl text-sm border border-[#253552] hover:bg-[#0b1630] transition-all duration-200 cursor-pointer"
          >
            Sign In ↗
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeUp(0.5)} className="flex gap-10 justify-center mt-16 flex-wrap">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-extrabold font-mono gradient-text">{s.val}</div>
              <div className="text-xs text-[#64748b] mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Everything you need.</h2>
          <p className="text-[#64748b] text-sm">Purpose-built for the modern campus ecosystem.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: '0 0 40px rgba(79,70,229,.15)' }}
              className="bg-[#111e3a] border border-[#1e2d4a] rounded-2xl p-6 cursor-default transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo/10 flex items-center justify-center text-2xl mb-4">{f.icon}</div>
              <div className="font-bold text-[15px] mb-2">{f.title}</div>
              <p className="text-sm text-[#64748b] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-2xl mx-auto text-center px-6 pb-24">
        <div className="bg-gradient-to-br from-indigo/10 to-cyan/5 border border-indigo/20 rounded-3xl p-12">
          <div className="text-3xl font-extrabold mb-4 tracking-tight">Ready to level up?</div>
          <p className="text-[#64748b] text-sm mb-8">Join thousands of students building their future with SkillSphere.</p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo to-cyan text-white font-bold rounded-xl text-sm border-0 cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Free Account →
          </button>
        </div>
      </section>

      <footer className="relative z-10 text-center text-xs text-[#334155] pb-8">
        © 2025 SkillSphere. Built for modern campuses.
      </footer>
    </div>
  );
}
