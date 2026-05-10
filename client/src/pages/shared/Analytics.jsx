import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Layout } from '../../components/layout';
import { StatCard, Spinner, ProgressBar } from '../../components/ui';
import { analyticsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PIE_COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0b1630] border border-[#1e2d4a] rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-[#94a3b8] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const { isStaff } = useAuth();
  const [myStats,    setMyStats]    = useState(null);
  const [overview,   setOverview]   = useState(null);
  const [skillDist,  setSkillDist]  = useState([]);
  const [aspirations,setAspirations]= useState([]);
  const [coding,     setCoding]     = useState(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const calls = [
      analyticsAPI.myStats(),
      analyticsAPI.skillsDistribution(),
      analyticsAPI.aspirations(),
      analyticsAPI.codingActivity(),
    ];
    if (isStaff) calls.push(analyticsAPI.overview());

    Promise.all(calls)
      .then(results => {
        setMyStats(results[0].data.data);
        setSkillDist(results[1].data.data);
        setAspirations(results[2].data.data);
        setCoding(results[3].data.data);
        if (results[4]) setOverview(results[4].data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isStaff]);

  if (loading) return (
    <Layout title="Analytics">
      <div className="flex justify-center mt-24"><Spinner size={36} /></div>
    </Layout>
  );

  return (
    <Layout title="Analytics">
      {/* Personal stats */}
      {myStats && (
        <>
          <h3 className="text-xs text-[#64748b] uppercase tracking-widest font-semibold mb-3">My Stats</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Skills"    value={myStats.totalSkills}            icon="🎯" gradient="from-indigo to-purple" />
            <StatCard label="Avg Skill Level" value={`${myStats.avgSkillLevel}%`}   icon="📈" gradient="from-cyan to-indigo" />
            <StatCard label="Goals Done"      value={myStats.completedGoals}         icon="🏁" gradient="from-emerald to-cyan" />
            <StatCard label="Projects"        value={myStats.totalProjects}          icon="🛠" gradient="from-amber to-rose" />
          </div>
        </>
      )}

      {/* Admin overview */}
      {overview && (
        <>
          <h3 className="text-xs text-[#64748b] uppercase tracking-widest font-semibold mb-3">Platform Overview</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Students"   value={overview.totalStudents}            icon="🎓" gradient="from-indigo to-purple" />
            <StatCard label="Active Students"  value={overview.activeStudents}           icon="⚡" gradient="from-cyan to-indigo" />
            <StatCard label="Skills Tracked"   value={overview.totalSkills?.toLocaleString()} icon="🎯" gradient="from-emerald to-cyan" />
            <StatCard label="Goal Completion"  value={`${overview.goalCompletionRate}%`} icon="🏁" gradient="from-amber to-rose" />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Skills bar chart */}
        {skillDist.length > 0 && (
          <div className="card">
            <div className="section-title mb-4">📊 Skills by Category</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={skillDist} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="_id" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Students" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Aspirations pie */}
        {aspirations.length > 0 && (
          <div className="card">
            <div className="section-title mb-4">🎯 Aspirations Breakdown</div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={aspirations} dataKey="count" cx="50%" cy="50%" outerRadius={70} stroke="none">
                    {aspirations.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {aspirations.slice(0, 6).map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs text-[#94a3b8] flex-1 truncate">{a.aspiration}</span>
                    <span className="text-xs font-mono text-[#64748b]">{a.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coding activity summary */}
      {coding?.summary && (
        <div className="card">
          <div className="section-title mb-4">💻 Coding Activity</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total LC Solved',    value: coding.summary.totalLCSolved     || 0, color: '#f59e0b' },
              { label: 'Avg LC Solved',      value: Math.round(coding.summary.avgLCSolved || 0), color: '#4f46e5' },
              { label: 'Avg CF Rating',      value: Math.round(coding.summary.avgCFRating || 0), color: '#06b6d4' },
              { label: 'GH Contributions',   value: coding.summary.totalGHContrib    || 0, color: '#10b981' },
              { label: 'Students on LC',     value: coding.summary.studentsOnLC      || 0, color: '#8b5cf6' },
              { label: 'Students on CF',     value: coding.summary.studentsOnCF      || 0, color: '#ec4899' },
            ].map((s, i) => (
              <div key={i} className="card-sm text-center">
                <div className="text-xl font-bold font-mono" style={{ color: s.color }}>
                  {s.value.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#64748b] mt-1 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
