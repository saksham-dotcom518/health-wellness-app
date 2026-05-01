import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const colorMap = {
  purple:  { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)',  text: '#a78bfa' },
  cyan:    { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)',   text: '#22d3ee' },
  emerald: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
  amber:   { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' },
  rose:    { bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.3)',  text: '#fb7185' },
};

export default function StatCard({ icon: Icon, label, value, suffix = '', trend, color = 'purple', delay = 0 }) {
  const num = typeof value === 'number' ? value : parseFloat(value) || 0;
  const isDecimal = num % 1 !== 0;
  const [display, setDisplay] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    if (animRef.current) clearInterval(animRef.current);
    const dur = 1400, start = Date.now();
    setDisplay(0);
    animRef.current = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = num * eased;
      setDisplay(isDecimal ? parseFloat(cur.toFixed(1)) : Math.round(cur));
      if (p >= 1) {
        setDisplay(isDecimal ? parseFloat(num.toFixed(1)) : Math.round(num));
        clearInterval(animRef.current);
      }
    }, 16);
    return () => clearInterval(animRef.current);
  }, [num, isDecimal]);

  const c = colorMap[color] || colorMap.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        padding: '18px 20px',
        cursor: 'default',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Top row: icon + trend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: c.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={20} style={{ color: c.text }} />
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: 12, fontWeight: 600,
            padding: '3px 9px', borderRadius: 20,
            color: trend >= 0 ? '#34d399' : '#fb7185',
            background: trend >= 0 ? 'rgba(52,211,153,0.1)' : 'rgba(251,113,133,0.1)',
          }}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      {/* Value */}
      <div style={{ fontSize: 26, fontWeight: 700, color: 'white', marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>
        {display}{suffix}
      </div>

      {/* Label */}
      <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
    </motion.div>
  );
}
