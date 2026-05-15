import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Select } from '../components/ui';
import toast from 'react-hot-toast';

const Logo = () => (
  <div className="flex items-center justify-center gap-2.5 mb-2">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo to-cyan flex items-center justify-center text-lg font-bold">⬡</div>
    <span className="text-xl font-extrabold tracking-tight">SkillSphere</span>
  </div>
);

const Orbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo/10 rounded-full blur-[80px]" />
    <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan/8 rounded-full blur-[80px]" />
  </div>
);

// ── Login ─────────────────────────────────────────────────────────────────────
export function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
      navigate(user.role === 'student' ? '/dashboard' : user.role === 'faculty' ? '/faculty' : '/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const demoLogin = async (role) => {
    const creds = { student: ['arjun@nit.edu','Student@1234'], faculty: ['faculty@nit.edu','Faculty@1234'], admin: ['admin@nit.edu','Admin@1234'] };
    setForm({ email: creds[role][0], password: creds[role][1] });
    setLoading(true);
    try {
      const user = await login(creds[role][0], creds[role][1]);
      navigate(user.role === 'student' ? '/dashboard' : user.role === 'faculty' ? '/faculty' : '/admin');
    } catch { toast.error('Demo login failed — is the server running?'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#060d1f] flex items-center justify-center p-4">
      <Orbs />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-sm bg-[#0b1630] border border-[#1e2d4a] rounded-2xl p-8">
        <Logo />
        <p className="text-center text-xs text-[#475569] mb-7">Sign in to your growth dashboard</p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="you@college.edu" value={form.email} onChange={set('email')} />
          <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
          <Button variant="primary" loading={loading} className="w-full py-2.5 mt-1">Sign In →</Button>
        </form>

        <div className="flex items-center gap-3 my-5 text-[#334155] text-xs">
          <div className="flex-1 h-px bg-[#1e2d4a]" /><span>or try a demo</span><div className="flex-1 h-px bg-[#1e2d4a]" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {['student','faculty','admin'].map(r => (
            <button key={r} onClick={() => demoLogin(r)} disabled={loading}
              className="py-2 text-xs font-semibold capitalize bg-[#111e3a] border border-[#1e2d4a] rounded-lg text-[#94a3b8] hover:bg-[#162040] hover:text-white transition-all cursor-pointer">
              {r}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-[#475569] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-2 hover:underline font-semibold">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}

// ── Register ──────────────────────────────────────────────────────────────────
export function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student', department:'CSE', rollNumber:'', semester:6 });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {

      const data = await register(form);

      toast.success('OTP sent to your email 📧');

      localStorage.setItem(
        'verifyEmail',
        form.email
      );

      navigate('/verify-otp');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#060d1f] flex items-center justify-center p-4">
      <Orbs />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-sm bg-[#0b1630] border border-[#1e2d4a] rounded-2xl p-8">
        <Logo />
        <p className="text-center text-xs text-[#475569] mb-7">Create your account</p>

        {/* Role tabs */}
        <div className="flex gap-1 bg-[#060d1f] border border-[#1e2d4a] rounded-xl p-1 mb-5">
          {['student','faculty','admin'].map(r => (
            <button key={r} onClick={() => setForm(p=>({...p,role:r}))}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer border-0 ${form.role===r ? 'bg-indigo text-white' : 'text-[#64748b] hover:text-white'}`}>
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <Input label="Full Name *" placeholder="Arjun Mehta" value={form.name} onChange={set('name')} />
          <Input label="Email *" type="email" placeholder="you@college.edu" value={form.email} onChange={set('email')} />
          <Input label="Password *" type="password" placeholder="Min 8 characters" value={form.password} onChange={set('password')} />

          <div className="grid grid-cols-2 gap-3">
            <Select label="Department" value={form.department} onChange={set('department')}
              options={['CSE','ECE','IT','MECH','CIVIL','EEE','OTHER'].map(v=>({value:v,label:v}))} />
            {form.role === 'student' && (
              <Select label="Semester" value={form.semester} onChange={set('semester')}
                options={[1,2,3,4,5,6,7,8].map(v=>({value:v,label:`Sem ${v}`}))} />
            )}
          </div>

          {form.role === 'student' && (
            <Input label="Roll Number" placeholder="21CS047" value={form.rollNumber} onChange={set('rollNumber')} />
          )}

          <Button variant="primary" loading={loading} className="w-full py-2.5 mt-1">Create Account →</Button>
        </form>

        <p className="text-center text-xs text-[#475569] mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-2 hover:underline font-semibold">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
