import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../../components/layout';
import { StatCard, Avatar, Badge, ProgressBar, Button, Spinner, EmptyState } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSkills, useGoals, useProjects } from '../../hooks';
import { analyticsAPI } from '../../services/api';
import { timeAgo, levelFromXP, xpProgress, fmtDate, priorityColor, statusColor } from '../../utils';
import { Link } from 'react-router-dom';

const skillColors = {
  DSA: '#4f46e5',
  'Web Development': '#06b6d4',
  'AI/ML': '#8b5cf6',
  Cloud: '#10b981',
  'UI/UX': '#ec4899',
  Default: '#f59e0b'
};

const getColor = (cat) => skillColors[cat] || skillColors.Default;

export default function Dashboard() {
  const { user } = useAuth();
  const { skills, loading: sl } = useSkills();
  const { goals, loading: gl } = useGoals({ status: 'active' });
  const { projects, loading: pl } = useProjects();
  const [myStats, setMyStats] = useState(null);

  useEffect(() => {
    analyticsAPI
      .myStats()
      .then((r) => setMyStats(r.data.data))
      .catch(() => {});
  }, []);

  const xp = user?.xpPoints || 0;
  const level = levelFromXP(xp);
  const prog = xpProgress(xp);
  const cs = user?.codingStats || {};

  return (
    <Layout title="Dashboard">
      {/* Welcome */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar name={user?.name} size={52} />

        <div className="flex-1">
          <h2 className="text-xl font-extrabold tracking-tight">
            Good morning, {user?.name?.split(' ')[0]}! 👋
          </h2>

          <p className="text-sm text-[#64748b] mt-0.5">
            {user?.department} · Semester {user?.semester} · {user?.rollNumber}
          </p>
        </div>

        <div className="text-right hidden md:block">
          <div className="text-2xl font-extrabold font-mono gradient-text-amber">
            {xp.toLocaleString()} XP
          </div>

          <div className="text-xs text-[#64748b] mt-0.5">
            🔥 {user?.streakDays || 0} day streak · Level {level}
          </div>
        </div>
      </div>

      {/* XP bar */}
      <div className="card mb-5 py-3 px-4">
        <div className="flex justify-between text-xs text-[#64748b] mb-2">
          <span>Level {level} Progress</span>

          <span className="font-mono">
            {prog}% to Level {level + 1}
          </span>
        </div>

        <ProgressBar pct={prog} color="#f59e0b" height={8} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="CGPA"
          value={user?.cgpa || '—'}
          change={0.2}
          icon="📚"
          gradient="from-indigo to-purple"
        />

        <StatCard
          label="LeetCode"
          value={cs.leetcodeSolved || 0}
          change={12}
          icon="💻"
          gradient="from-amber to-rose"
        />

        <StatCard
          label="CF Rating"
          value={cs.codeforcesRating || '—'}
          change={5}
          icon="⚡"
          gradient="from-cyan to-indigo"
        />

        <StatCard
          label="GitHub"
          value={cs.githubContributions || 0}
          change={28}
          icon="🐙"
          gradient="from-emerald to-cyan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

        {/* Skills */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-title">🎯 Top Skills</span>

            <Link to="/skills">
              <Button variant="ghost" className="text-xs py-1 px-3">
                Manage →
              </Button>
            </Link>
          </div>

          {sl ? (
            <Spinner className="mx-auto my-6" />
          ) : skills.length === 0 ? (
            <EmptyState
              icon="🎯"
              title="No skills yet"
              desc="Add your first skill"
              action={
                <Link to="/skills">
                  <Button variant="primary" className="text-xs">
                    + Add Skill
                  </Button>
                </Link>
              }
            />
          ) : (
            skills.slice(0, 5).map((sk, i) => (
              <div key={i} className="mb-3 last:mb-0">

                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold">{sk.name}</span>

                  <span className="text-xs text-[#64748b] font-mono">
                    {sk.level}%
                  </span>
                </div>

                <ProgressBar
                  pct={sk.level}
                  color={getColor(sk.category)}
                />
              </div>
            ))
          )}
        </div>

        {/* Goals */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-title">🏁 Active Goals</span>

            <Link to="/skills">
              <Button variant="ghost" className="text-xs py-1 px-3">
                All Goals →
              </Button>
            </Link>
          </div>

          {gl ? (
            <Spinner className="mx-auto my-6" />
          ) : goals.length === 0 ? (
            <EmptyState
              icon="🏁"
              title="No active goals"
              desc="Set your first goal"
              action={
                <Link to="/skills">
                  <Button variant="primary" className="text-xs">
                    + Add Goal
                  </Button>
                </Link>
              }
            />
          ) : (
            goals.slice(0, 3).map((g, i) => (
              <div
                key={i}
                className="border-b border-[#1e2d4a] pb-3 mb-3 last:border-0 last:mb-0"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-sm font-semibold flex-1 pr-2">
                    {g.title}
                  </span>

                  <Badge
                    variant={priorityColor(g.priority)}
                    className="text-[10px]"
                  >
                    {g.priority}
                  </Badge>
                </div>

                <div className="flex justify-between text-xs text-[#64748b] mb-1.5">
                  <span>{g.progress}% complete</span>
                  <span>{fmtDate(g.deadline)}</span>
                </div>

                <ProgressBar
                  pct={g.progress}
                  color={g.priority === 'high' ? '#4f46e5' : '#10b981'}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-title">🛠 Projects</span>

            <Link to="/projects">
              <Button variant="ghost" className="text-xs py-1 px-3">
                All →
              </Button>
            </Link>
          </div>

          {pl ? (
            <Spinner className="mx-auto my-6" />
          ) : projects.length === 0 ? (
            <EmptyState
              icon="🛠"
              title="No projects yet"
              action={
                <Link to="/projects">
                  <Button variant="primary" className="text-xs">
                    + Add Project
                  </Button>
                </Link>
              }
            />
          ) : (
            projects.slice(0, 3).map((p, i) => (
              <div key={i} className="card-sm mb-2 last:mb-0">

                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-sm">{p.title}</span>

                  <Badge
                    variant={statusColor(p.status)}
                    className="text-[10px]"
                  >
                    {p.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {p.techStack?.slice(0, 3).map((t, j) => (
                    <span
                      key={j}
                      className="text-[10px] font-mono bg-[#0b1630] border border-[#1e2d4a] px-2 py-0.5 rounded text-[#64748b]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Coding Profile */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-title">💻 Coding Profile</span>

            <Link to="/profile">
              <Button variant="ghost" className="text-xs py-1 px-3">
                Update →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Easy', val: cs.leetcodeEasy || 0, color: '#10b981' },
              { label: 'Medium', val: cs.leetcodeMedium || 0, color: '#f59e0b' },
              { label: 'Hard', val: cs.leetcodeHard || 0, color: '#ef4444' },
              { label: 'Contests', val: cs.contestsParticipated || 0, color: '#8b5cf6' }
            ].map((s, i) => (
              <div key={i} className="card-sm text-center">

                <div
                  className="text-xl font-bold font-mono"
                  style={{ color: s.color }}
                >
                  {s.val}
                </div>

                <div className="text-xs text-[#64748b] mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">

            {user?.socialLinks?.leetcode && (
              <a
                href={user.socialLinks.leetcode}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-[#64748b] hover:text-[#f1f5f9] transition-colors"
              >
                <span>💻</span>
                {user.socialLinks.leetcode}
              </a>
            )}

            {user?.socialLinks?.codeforces && (
              <a
                href={user.socialLinks.codeforces}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-[#64748b] hover:text-[#f1f5f9] transition-colors"
              >
                <span>⚡</span>
                {user.socialLinks.codeforces}
              </a>
            )}

            {user?.socialLinks?.github && (
              <a
                href={user.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-[#64748b] hover:text-[#f1f5f9] transition-colors"
              >
                <span>🐙</span>
                {user.socialLinks.github}
              </a>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}