import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiActivity, FiTrendingUp, FiDroplet, FiMoon, FiChevronRight } from 'react-icons/fi';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import StatCard from '../components/ui/StatCard';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';

const weeklyData = [
  { day: 'Mon', calories: 420 }, { day: 'Tue', calories: 380 },
  { day: 'Wed', calories: 510 }, { day: 'Thu', calories: 290 },
  { day: 'Fri', calories: 460 }, { day: 'Sat', calories: 580 },
  { day: 'Sun', calories: 340 },
];
const trendData = [
  { week: 'W1', weight: 74, sleep: 6.5 }, { week: 'W2', weight: 73.5, sleep: 7.0 },
  { week: 'W3', weight: 73.2, sleep: 6.8 }, { week: 'W4', weight: 72.8, sleep: 7.2 },
  { week: 'W5', weight: 72.5, sleep: 7.5 }, { week: 'W6', weight: 72.0, sleep: 7.3 },
];
const recentWorkouts = [
  { id: 1, type: 'Running',         duration: 45, calories: 420, date: '2026-04-01', icon: '🏃' },
  { id: 2, type: 'Weight Training', duration: 60, calories: 380, date: '2026-03-31', icon: '🏋️' },
  { id: 3, type: 'Yoga',            duration: 30, calories: 150, date: '2026-03-30', icon: '🧘' },
  { id: 4, type: 'Cycling',         duration: 50, calories: 460, date: '2026-03-29', icon: '🚴' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(15,15,30,0.95)', border: '1px solid rgba(139,92,246,0.3)',
      borderRadius: '12px', padding: '10px 14px', backdropFilter: 'blur(20px)',
    }}>
      <p style={{ color: 'white', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 12 }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Use only the first word, and only up to the @ or a number
  const firstName = user?.name?.split(/[\s@0-9]/)[0] || 'there';

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Greeting */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: 'white', marginBottom: 4 }}>
          {getGreeting()}, {firstName}! 👋
        </h2>
        <p style={{ color: '#64748b', fontSize: 15 }}>Here's your wellness overview for today</p>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
        className="stat-grid">
        <StatCard icon={FiActivity}   label="Calories Burned"    value={2480} suffix=" kcal" trend={12} color="purple"  delay={0.1} />
        <StatCard icon={FiTrendingUp} label="Workouts This Week" value={5}               trend={8}  color="cyan"    delay={0.2} />
        <StatCard icon={FiDroplet}    label="Water Intake"       value={2.4}  suffix=" L" trend={-3} color="emerald" delay={0.3} />
        <StatCard icon={FiMoon}       label="Avg Sleep"          value={7.3}  suffix=" hrs" trend={5} color="amber"  delay={0.4} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="chart-grid">
        <GlassCard hover={false} delay={0.3}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 16 }}>Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData} barSize={28}>
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="calories" fill="url(#purpleGrad)" radius={[6, 6, 0, 0]} name="Calories" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard hover={false} delay={0.4}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 16 }}>Health Trends</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 4 }} name="Weight (kg)" />
              <Line type="monotone" dataKey="sleep"  stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name="Sleep (hrs)" />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Recent Workouts */}
      <GlassCard hover={false} delay={0.5}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>Recent Workouts</h3>
          <button
            onClick={() => navigate('/workouts')}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 13, color: '#a78bfa', background: 'none',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'}
            onMouseLeave={e => e.currentTarget.style.color = '#a78bfa'}
          >
            View All <FiChevronRight size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {recentWorkouts.map((w, i) => (
            <motion.div key={w.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 12,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 26 }}>{w.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{w.type}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{w.date} · {w.duration} min</div>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#a78bfa' }}>{w.calories} kcal</div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Responsive grid styles */}
      <style>{`
        @media (max-width: 1024px) {
          .stat-grid  { grid-template-columns: repeat(2, 1fr) !important; }
          .chart-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .stat-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
