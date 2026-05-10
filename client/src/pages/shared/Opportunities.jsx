import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../../components/layout';
import { Badge, Button, Spinner, EmptyState, Tabs } from '../../components/ui';
import { opportunitiesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { fmtDate } from '../../utils';
import toast from 'react-hot-toast';

const TYPE_COLOR = {
  Internship: 'indigo', Hackathon: 'cyan', Research: 'purple',
  Competition: 'amber', Workshop: 'green', Scholarship: 'pink', Job: 'green',
};

export default function Opportunities() {
  const { isStaff } = useAuth();
  const [opps,    setOpps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [type,    setType]    = useState('all');
  const [applied, setApplied] = useState(new Set());

  useEffect(() => {
    setLoading(true);
    opportunitiesAPI
      .getAll({ type: type === 'all' ? undefined : type })
      .then(r => setOpps(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [type]);

  const apply = async (id) => {
    try {
      await opportunitiesAPI.apply(id);
      setApplied(prev => new Set([...prev, id]));
      toast.success('Application submitted! ✅');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to apply');
    }
  };

  return (
    <Layout title="Opportunities">
      <div className="mb-5">
        <Tabs
          tabs={[
            { value: 'all',         label: 'All'          },
            { value: 'Internship',  label: '💼 Internships' },
            { value: 'Hackathon',   label: '⚡ Hackathons' },
            { value: 'Research',    label: '🔬 Research'  },
            { value: 'Competition', label: '🏆 Competitions' },
            { value: 'Workshop',    label: '🎓 Workshops' },
          ]}
          active={type}
          onChange={setType}
        />
      </div>

      {loading
        ? <div className="flex justify-center mt-16"><Spinner size={32} /></div>
        : opps.length === 0
          ? <EmptyState icon="💼" title="No opportunities posted yet" desc="Check back soon!" />
          : (
            <div className="flex flex-col gap-4">
              {opps.map((o, i) => (
                <motion.div
                  key={o._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-[#0b1630] border border-[#1e2d4a] flex items-center justify-center text-2xl flex-shrink-0">
                      {o.type === 'Internship' ? '💼' : o.type === 'Hackathon' ? '⚡' : o.type === 'Research' ? '🔬' : o.type === 'Competition' ? '🏆' : '🎓'}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                        <div>
                          <div className="font-bold text-[15px]">{o.title}</div>
                          <div className="text-xs text-[#64748b] mt-0.5">
                            {o.company} · Due {fmtDate(o.deadline)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {o.matchScore !== undefined && (
                            <Badge variant="green" className="text-xs">{o.matchScore}% Match</Badge>
                          )}
                          <Badge variant={TYPE_COLOR[o.type] || 'indigo'} className="text-xs">{o.type}</Badge>
                        </div>
                      </div>

                      {/* Description */}
                      {o.description && (
                        <p className="text-xs text-[#64748b] mb-3 line-clamp-2 leading-relaxed">{o.description}</p>
                      )}

                      {/* Required skills */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {o.requiredSkills?.map((s, j) => (
                          <span key={j} className="text-[10px] bg-[#0b1630] border border-[#1e2d4a] text-[#64748b] px-2 py-0.5 rounded font-mono">
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {o.stipend  && <span className="text-xs text-emerald font-semibold">💰 {o.stipend}</span>}
                        {o.location && <span className="text-xs text-[#64748b]">📍 {o.location}</span>}
                        {o.duration && <span className="text-xs text-[#64748b]">⏱ {o.duration}</span>}
                        <div className="ml-auto flex gap-2">
                          {!isStaff && (
                            applied.has(o._id)
                              ? <Button variant="success" className="text-xs py-1.5 px-3" disabled>✓ Applied</Button>
                              : <Button variant="primary" className="text-xs py-1.5 px-3" onClick={() => apply(o._id)}>Apply Now →</Button>
                          )}
                          {isStaff && (
                            <Button variant="ghost" className="text-xs py-1.5 px-3">View Applicants</Button>
                          )}
                          {o.applyUrl && (
                            <a href={o.applyUrl} target="_blank" rel="noreferrer">
                              <Button variant="ghost" className="text-xs py-1.5 px-3">Official Page ↗</Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
      }
    </Layout>
  );
}
