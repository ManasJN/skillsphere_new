import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout';
import { StatCard, Avatar, Badge, ProgressBar, Button, Spinner, EmptyState } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSkills, useGoals, useProjects } from '../../hooks';
import { analyticsAPI } from '../../services/api';
import { levelFromXP, xpProgress, fmtDate, priorityColor, statusColor } from '../../utils';
import { Link } from 'react-router-dom';
import DashboardRecommendationWidget from '../../components/recommendations/DashboardWidget';

const skillColors = {
  DSA: '#4f46e5',
  'Web Development': '#06b6d4',
  'AI/ML': '#8b5cf6',
  Cloud: '#10b981',
  'UI/UX': '#ec4899',
  Default: '#94a3b8',
};

const getColor = (cat) => skillColors[cat] || skillColors.Default;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function Dashboard() {
  const { user } = useAuth();
  const { skills, loading: sl } = useSkills();
  const { goals, loading: gl } = useGoals({ status: 'active' });
  const { projects, loading: pl } = useProjects();

  useEffect(() => {
    analyticsAPI.myStats().catch(() => {});
  }, []);

  const xp = user?.xpPoints || 0;
  const level = levelFromXP(xp);
  const prog = xpProgress(xp);
  const cs = user?.codingStats || {};
  const greeting = getGreeting();

  return (
    <Layout title="Dashboard">
      <p className="page-intro">
        Overview of your profile, skills, and recent activity. Data updates when you edit your profile or add entries.
      </p>

      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[#1e293b]">
        <Avatar name={user?.name} size={48} />
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">
            {greeting}, {user?.name?.split(' ')[0]}
          </h2>
          <p className="text-sm text-[#64748b] mt-0.5">
            {user?.department} · Semester {user?.semester} · {user?.rollNumber}
          </p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xl font-bold font-mono text-[#93c5fd]">{xp.toLocaleString()} XP</div>
          <div className="text-xs text-[#64748b] mt-0.5">
            {user?.streakDays || 0} day streak · Level {level}
          </div>
        </div>
      </div>

      <div className="card mb-5 py-3 px-4 border-[#253552]">
        <div className="flex justify-between text-xs text-[#64748b] mb-2">
          <span>Level {level}</span>
          <span className="font-mono">{prog}% to Level {level + 1}</span>
        </div>
        <ProgressBar pct={prog} color="#4f46e5" height={6} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="CGPA" value={user?.cgpa || '—'} change={0.2} />
        <StatCard label="LeetCode solved" value={cs.leetcodeSolved || 0} change={12} className="card-offset" />
        <StatCard label="CF rating" value={cs.codeforcesRating || '—'} />
        <StatCard label="GitHub contributions" value={cs.githubContributions || 0} change={28} className="mt-0.5" />
      </div>

      <div className="mb-6">
        <DashboardRecommendationWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-title">Top skills</span>
            <Link to="/skills">
              <Button variant="ghost" className="text-xs py-1 px-3">Manage</Button>
            </Link>
          </div>
          {sl ? (
            <Spinner className="mx-auto my-6" />
          ) : skills.length === 0 ? (
            <EmptyState
              title="No skills yet"
              desc="Add skills you are working on this semester."
              action={
                <Link to="/skills">
                  <Button variant="primary" className="text-xs">Add skill</Button>
                </Link>
              }
            />
          ) : (
            skills.slice(0, 5).map((sk, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{sk.name}</span>
                  <span className="text-xs text-[#64748b] font-mono">{sk.level}%</span>
                </div>
                <ProgressBar pct={sk.level} color={getColor(sk.category)} />
              </div>
            ))
          )}
        </div>

        <div className="card border-[#253552]">
          <div className="flex items-center justify-between mb-4">
            <span className="section-title">Active goals</span>
            <Link to="/skills">
              <Button variant="ghost" className="text-xs py-1 px-3">All goals</Button>
            </Link>
          </div>
          {gl ? (
            <Spinner className="mx-auto my-6" />
          ) : goals.length === 0 ? (
            <EmptyState
              title="No active goals"
              desc="Set a goal with a deadline to track progress here."
              action={
                <Link to="/skills">
                  <Button variant="primary" className="text-xs">Add goal</Button>
                </Link>
              }
            />
          ) : (
            goals.slice(0, 3).map((g, i) => (
              <div key={i} className="border-b border-[#1e293b] pb-3 mb-3 last:border-0 last:mb-0">
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-sm font-medium flex-1 pr-2">{g.title}</span>
                  <Badge variant={priorityColor(g.priority)} className="text-[10px]">{g.priority}</Badge>
                </div>
                <div className="flex justify-between text-xs text-[#64748b] mb-1.5">
                  <span>{g.progress}% complete</span>
                  <span>{fmtDate(g.deadline)}</span>
                </div>
                <ProgressBar pct={g.progress} color={g.priority === 'high' ? '#4f46e5' : '#64748b'} />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-title">Projects</span>
            <Link to="/projects">
              <Button variant="ghost" className="text-xs py-1 px-3">View all</Button>
            </Link>
          </div>
          {pl ? (
            <Spinner className="mx-auto my-6" />
          ) : projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              action={
                <Link to="/projects">
                  <Button variant="primary" className="text-xs">Add project</Button>
                </Link>
              }
            />
          ) : (
            projects.slice(0, 3).map((p, i) => (
              <div key={i} className="card-sm mb-2 last:mb-0">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-sm">{p.title}</span>
                  <Badge variant={statusColor(p.status)} className="text-[10px]">{p.status}</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.techStack?.slice(0, 3).map((t, j) => (
                    <span key={j} className="text-[10px] font-mono bg-[#081225] border border-[#1e293b] px-2 py-0.5 text-[#64748b]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card card-offset">
          <div className="flex items-center justify-between mb-4">
            <span className="section-title">Coding profile</span>
            <Link to="/profile">
              <Button variant="ghost" className="text-xs py-1 px-3">Update</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Easy', val: cs.leetcodeEasy || 0 },
              { label: 'Medium', val: cs.leetcodeMedium || 0 },
              { label: 'Hard', val: cs.leetcodeHard || 0 },
              { label: 'Contests', val: cs.contestsParticipated || 0 },
            ].map((s, i) => (
              <div key={i} className="card-sm text-center py-3">
                <div className="text-lg font-bold font-mono text-white">{s.val}</div>
                <div className="text-xs text-[#64748b] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {user?.socialLinks?.leetcode && (
              <a href={user.socialLinks.leetcode} target="_blank" rel="noreferrer"
                className="block text-xs text-[#64748b] hover:text-[#93c5fd] truncate transition-colors">
                LeetCode — {user.socialLinks.leetcode.replace(/^https?:\/\//, '')}
              </a>
            )}
            {user?.socialLinks?.codeforces && (
              <a href={user.socialLinks.codeforces} target="_blank" rel="noreferrer"
                className="block text-xs text-[#64748b] hover:text-[#93c5fd] truncate transition-colors">
                Codeforces — {user.socialLinks.codeforces.replace(/^https?:\/\//, '')}
              </a>
            )}
            {user?.socialLinks?.github && (
              <a href={user.socialLinks.github} target="_blank" rel="noreferrer"
                className="block text-xs text-[#64748b] hover:text-[#93c5fd] truncate transition-colors">
                GitHub — {user.socialLinks.github.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
