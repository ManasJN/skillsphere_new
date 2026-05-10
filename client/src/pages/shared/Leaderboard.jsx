import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../../components/layout';
import { Avatar, Badge, Spinner, Tabs } from '../../components/ui';
import { leaderboardAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Leaderboard() {
  const { user } = useAuth();
  const [data,    setData]    = useState([]);
  const [myRank,  setMyRank]  = useState(null);
  const [type,    setType]    = useState('xp');
  const [dept,    setDept]    = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    leaderboardAPI
      .get({ type, dept: dept === 'ALL' ? undefined : dept, limit: 30 })
      .then(r => { setData(r.data.data); setMyRank(r.data.myRank); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [type, dept]);

  const rankLabel = i => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
  const rankColor = i =>
    i === 0 ? 'text-amber' : i === 1 ? 'text-[#94a3b8]' : i === 2 ? 'text-[#cd7c2f]' : 'text-[#475569]';

  return (
    <Layout title="Leaderboard">
      {/* My rank banner */}
      {myRank && (
        <div className="card mb-5 flex items-center gap-3 bg-gradient-to-r from-indigo/10 to-cyan/5 border-indigo/20">
          <span className="text-2xl">🏆</span>
          <div>
            <div className="font-bold text-sm">Your current rank</div>
            <div className="text-xs text-[#64748b]">You're #{myRank} on the {type} leaderboard</div>
          </div>
          <div className="ml-auto text-3xl font-extrabold font-mono gradient-text">#{myRank}</div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <Tabs
          tabs={[
            { value: 'xp',          label: '⭐ XP'        },
            { value: 'cgpa',        label: '📚 CGPA'      },
            { value: 'leetcode',    label: '💻 LeetCode'  },
            { value: 'codeforces',  label: '⚡ CF Rating' },
          ]}
          active={type}
          onChange={setType}
        />
        <div className="flex gap-1 flex-wrap">
          {['ALL', 'CSE', 'ECE', 'IT', 'MECH', 'EEE'].map(d => (
            <button key={d} onClick={() => setDept(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer
                ${dept === d
                  ? 'bg-indigo text-white border-indigo'
                  : 'bg-[#0b1630] text-[#64748b] border-[#1e2d4a] hover:text-white'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        {loading
          ? <div className="flex justify-center py-16"><Spinner size={32} /></div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#1e2d4a]">
                    {['Rank', 'Student', 'Dept', 'CGPA', 'LeetCode', 'CF Rating', 'XP', 'Aspiration'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-[10px] uppercase tracking-[.8px] text-[#475569] font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((s, i) => (
                    <motion.tr
                      key={s._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className={`border-b border-[#1e2d4a] hover:bg-[#0b1630] transition-colors
                        ${s._id === user?._id ? 'bg-indigo/5' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <span className={`text-base font-bold ${rankColor(i)}`}>{rankLabel(i)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} size={32} />
                          <div>
                            <div className="font-semibold text-sm text-[#f1f5f9]">{s.name}</div>
                            <div className="text-[10px] text-[#475569]">{s.rollNumber || s.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="indigo" className="text-[10px]">{s.department}</Badge>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald font-mono text-sm">{s.cgpa || '—'}</td>
                      <td className="py-3 px-4 text-sm text-[#94a3b8] font-mono">{s.codingStats?.leetcodeSolved || 0}</td>
                      <td className="py-3 px-4 text-sm text-[#94a3b8] font-mono">{s.codingStats?.codeforcesRating || '—'}</td>
                      <td className="py-3 px-4 font-bold text-amber font-mono text-sm">{s.xpPoints?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant="purple" className="text-[10px]">{s.aspiration}</Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </Layout>
  );
}
