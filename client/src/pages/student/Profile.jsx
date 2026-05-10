import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { Avatar, Button, Input, Select, Badge, ProgressBar, Spinner } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { usersAPI, achievementsAPI } from '../../services/api';
import { levelFromXP, xpProgress } from '../../utils';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState({
    name: user?.name || '', bio: user?.bio || '', phone: user?.phone || '',
    aspiration: user?.aspiration || 'Not decided', cgpa: user?.cgpa || '',
    'socialLinks.github': user?.socialLinks?.github || '',
    'socialLinks.linkedin': user?.socialLinks?.linkedin || '',
    'socialLinks.leetcode': user?.socialLinks?.leetcode || '',
    'socialLinks.codeforces': user?.socialLinks?.codeforces || '',
  });
  const [statsForm, setStatsForm] = useState({
    leetcodeSolved: user?.codingStats?.leetcodeSolved || 0,
    leetcodeEasy: user?.codingStats?.leetcodeEasy || 0,
    leetcodeMedium: user?.codingStats?.leetcodeMedium || 0,
    leetcodeHard: user?.codingStats?.leetcodeHard || 0,
    codeforcesRating: user?.codingStats?.codeforcesRating || 0,
    githubContributions: user?.codingStats?.githubContributions || 0,
    githubRepos: user?.codingStats?.githubRepos || 0,
    contestsParticipated: user?.codingStats?.contestsParticipated || 0,
  });

  useEffect(() => {
    achievementsAPI.getMine().then(r => setAchievements(r.data.data)).catch(() => {});
  }, []);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const setStats = k => e => setStatsForm(p => ({ ...p, [k]: Number(e.target.value) }));

  const save = async () => {
    setLoading(true);
    try {
      const payload = {
        name: form.name, bio: form.bio, phone: form.phone,
        aspiration: form.aspiration, cgpa: Number(form.cgpa),
        socialLinks: {
          github: form['socialLinks.github'],
          linkedin: form['socialLinks.linkedin'],
          leetcode: form['socialLinks.leetcode'],
          codeforces: form['socialLinks.codeforces'],
        },
      };
      const res = await usersAPI.update(user._id, payload);
      updateUser(res.data.data);
      toast.success('Profile updated!');
      setEditing(false);
    } catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  const saveStats = async () => {
    setLoading(true);
    try {
      const res = await usersAPI.updateCodingStats(user._id, statsForm);
      toast.success('Coding stats updated!');
      if (res.data.newAchievements?.length) toast.success(`🏅 New achievement: ${res.data.newAchievements[0].title}`);
    } catch { toast.error('Failed to update stats'); }
    finally { setLoading(false); }
  };

  const xp    = user?.xpPoints || 0;
  const level = levelFromXP(xp);
  const prog  = xpProgress(xp);

  return (
    <Layout title="My Profile">
      <div className="max-w-4xl mx-auto">
        {/* Header card */}
        <div className="card mb-5" style={{ background: 'linear-gradient(135deg,#0b1630,#111e3a)' }}>
          <div className="flex items-start gap-5 flex-wrap">
            <Avatar name={user?.name} size={72} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">{user?.name}</h2>
                  <div className="flex gap-2 flex-wrap mt-2">
                    <Badge variant="indigo">{user?.department}</Badge>
                    <Badge variant="cyan">Sem {user?.semester}</Badge>
                    {user?.rollNumber && <Badge variant="amber">{user.rollNumber}</Badge>}
                    <Badge variant="purple">{user?.aspiration}</Badge>
                  </div>
                  {user?.bio && <p className="text-sm text-[#64748b] mt-2 max-w-lg leading-relaxed">{user.bio}</p>}
                </div>
                <Button variant={editing ? 'ghost' : 'primary'} onClick={() => setEditing(e => !e)}>
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
              {/* XP */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-[#64748b] mb-1.5">
                  <span>Level {level} — {xp.toLocaleString()} XP</span>
                  <span className="font-mono">{prog}% to next level</span>
                </div>
                <ProgressBar pct={prog} color="#f59e0b" height={6} />
              </div>
              {/* Quick stats */}
              <div className="flex gap-4 mt-4 flex-wrap">
                {[
                  ['📚', user?.cgpa, 'CGPA'],
                  ['💻', user?.codingStats?.leetcodeSolved, 'LC Solved'],
                  ['⚡', user?.codingStats?.codeforcesRating || '—', 'CF Rating'],
                  ['🔥', `${user?.streakDays || 0}d`, 'Streak'],
                ].map(([icon, val, label], i) => (
                  <div key={i} className="bg-[#060d1f] border border-[#1e2d4a] rounded-xl px-3 py-2 text-center min-w-[72px]">
                    <div className="text-base">{icon}</div>
                    <div className="text-sm font-bold font-mono text-[#f1f5f9] mt-0.5">{val}</div>
                    <div className="text-[10px] text-[#475569]">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Edit / Info */}
          <div className="card">
            <div className="section-title mb-4">👤 {editing ? 'Edit Info' : 'Personal Info'}</div>
            {editing ? (
              <div className="flex flex-col gap-3">
                <Input label="Full Name" value={form.name} onChange={set('name')} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#94a3b8] font-semibold">Bio</label>
                  <textarea rows={3} value={form.bio} onChange={set('bio')} placeholder="Tell us about yourself..." className="input resize-none" />
                </div>
                <Input label="Phone" value={form.phone} onChange={set('phone')} />
                <Input label="CGPA" type="number" step="0.1" min="0" max="10" value={form.cgpa} onChange={set('cgpa')} />
                <Select label="Aspiration" value={form.aspiration} onChange={set('aspiration')}
                  options={['Placements','GATE','Higher Studies','Startup','Research','Government','Freelancing','Not decided'].map(v=>({value:v,label:v}))} />
                <div className="section-title mt-2 mb-2">🔗 Social Links</div>
                <Input label="GitHub" placeholder="https://github.com/..." value={form['socialLinks.github']} onChange={set('socialLinks.github')} />
                <Input label="LinkedIn" placeholder="https://linkedin.com/in/..." value={form['socialLinks.linkedin']} onChange={set('socialLinks.linkedin')} />
                <Input label="LeetCode" placeholder="https://leetcode.com/..." value={form['socialLinks.leetcode']} onChange={set('socialLinks.leetcode')} />
                <Input label="Codeforces" placeholder="https://codeforces.com/profile/..." value={form['socialLinks.codeforces']} onChange={set('socialLinks.codeforces')} />
                <Button variant="primary" onClick={save} loading={loading} className="mt-2">Save Changes</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {[['Email', user?.email], ['Department', user?.department], ['Semester', user?.semester], ['Roll No.', user?.rollNumber], ['College', user?.college]].map(([l,v]) => v && (
                  <div key={l} className="flex justify-between py-2 border-b border-[#1e2d4a] last:border-0">
                    <span className="text-xs text-[#64748b]">{l}</span>
                    <span className="text-xs font-semibold">{v}</span>
                  </div>
                ))}
                <div className="mt-2 space-y-2">
                  {Object.entries(user?.socialLinks || {}).filter(([,v]) => v).map(([k,v]) => (
                    <a key={k} href={v} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-[#64748b] hover:text-indigo-2 transition-colors">
                      <span>{k === 'github' ? '🐙' : k === 'linkedin' ? '💼' : k === 'leetcode' ? '💻' : '⚡'}</span>
                      <span className="truncate">{v}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {/* Coding Stats */}
            <div className="card">
              <div className="section-title mb-4">💻 Update Coding Stats</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input label="LC Total" type="number" value={statsForm.leetcodeSolved} onChange={setStats('leetcodeSolved')} />
                <Input label="LC Easy" type="number" value={statsForm.leetcodeEasy} onChange={setStats('leetcodeEasy')} />
                <Input label="LC Medium" type="number" value={statsForm.leetcodeMedium} onChange={setStats('leetcodeMedium')} />
                <Input label="LC Hard" type="number" value={statsForm.leetcodeHard} onChange={setStats('leetcodeHard')} />
                <Input label="CF Rating" type="number" value={statsForm.codeforcesRating} onChange={setStats('codeforcesRating')} />
                <Input label="GH Contributions" type="number" value={statsForm.githubContributions} onChange={setStats('githubContributions')} />
                <Input label="GH Repos" type="number" value={statsForm.githubRepos} onChange={setStats('githubRepos')} />
                <Input label="Contests" type="number" value={statsForm.contestsParticipated} onChange={setStats('contestsParticipated')} />
              </div>
              <Button variant="cyan" onClick={saveStats} loading={loading} className="w-full">Update Stats</Button>
            </div>

            {/* Achievements */}
            <div className="card">
              <div className="section-title mb-4">🏅 Achievements ({achievements.length})</div>
              {achievements.length === 0
                ? <p className="text-sm text-[#475569] text-center py-4">Complete goals to earn badges!</p>
                : <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                    {achievements.map((a, i) => (
                      <div key={i} className="flex items-center gap-3 bg-[#0b1630] rounded-xl p-3">
                        <span className="text-2xl">{a.achievement?.icon || '🏅'}</span>
                        <div>
                          <div className="text-xs font-bold">{a.achievement?.title}</div>
                          <div className="text-[11px] text-[#64748b]">{a.achievement?.description}</div>
                        </div>
                        <Badge variant="amber" className="ml-auto text-[10px]">+{a.achievement?.xpReward} XP</Badge>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
