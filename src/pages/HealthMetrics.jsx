import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiDroplet, FiMoon, FiTrendingUp, FiPlus, FiX } from 'react-icons/fi';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const seedMetrics = [
  { date:'Mar 25', weight:74.0, heartRate:72, sleep:6.5, water:2.0, steps:8200  },
  { date:'Mar 26', weight:73.8, heartRate:70, sleep:7.0, water:2.5, steps:9100  },
  { date:'Mar 27', weight:73.5, heartRate:68, sleep:6.8, water:2.2, steps:7600  },
  { date:'Mar 28', weight:73.2, heartRate:71, sleep:7.2, water:2.8, steps:10400 },
  { date:'Mar 29', weight:73.0, heartRate:69, sleep:7.5, water:3.0, steps:11200 },
  { date:'Mar 30', weight:72.8, heartRate:67, sleep:7.3, water:2.6, steps:9800  },
  { date:'Mar 31', weight:72.5, heartRate:66, sleep:7.8, water:2.4, steps:8500  },
  { date:'Apr 01', weight:72.0, heartRate:65, sleep:7.5, water:2.7, steps:10100 },
];

const emptyForm = { date:'', weight:'', heartRate:'', sleep:'', water:'', steps:'' };

const card = {
  background:'rgba(255,255,255,0.04)',
  backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
  border:'1px solid rgba(255,255,255,0.1)', borderRadius:16,
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'rgba(10,10,25,0.95)', border:'1px solid rgba(139,92,246,0.3)', borderRadius:12, padding:'10px 14px' }}>
      <p style={{ color:'white', fontWeight:600, fontSize:13, marginBottom:4 }}>{label}</p>
      {payload.map((p,i) => <p key={i} style={{ color:p.color, fontSize:12 }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function HealthMetrics() {
  const [metrics, setMetrics] = useState(() => {
    try { const s = localStorage.getItem('vf_metrics'); return s ? JSON.parse(s) : seedMetrics; }
    catch { return seedMetrics; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const save = d => { setMetrics(d); localStorage.setItem('vf_metrics', JSON.stringify(d)); };

  const handleAdd = e => {
    e.preventDefault();
    if (!form.date) { toast.error('Please enter a date'); return; }
    const d = new Date(form.date + 'T00:00:00');
    const label = d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
    const last = metrics[metrics.length-1] || {};
    save([...metrics, {
      date:      label,
      weight:    form.weight    ? parseFloat(form.weight)  : last.weight    || 70,
      heartRate: form.heartRate ? parseInt(form.heartRate) : last.heartRate || 70,
      sleep:     form.sleep     ? parseFloat(form.sleep)   : last.sleep     || 7,
      water:     form.water     ? parseFloat(form.water)   : last.water     || 2,
      steps:     form.steps     ? parseInt(form.steps)     : last.steps     || 8000,
    }]);
    setForm(emptyForm);
    setShowForm(false);
    toast.success('Health log added! 📊');
  };

  const latest = metrics[metrics.length - 1];

  const statCards = [
    { icon:FiTrendingUp, label:'Weight',     value:`${latest.weight} kg`,     color:'#a78bfa', bg:'rgba(139,92,246,0.12)',  border:'rgba(139,92,246,0.3)'  },
    { icon:FiHeart,      label:'Heart Rate', value:`${latest.heartRate} bpm`, color:'#fb7185', bg:'rgba(244,63,94,0.12)',   border:'rgba(244,63,94,0.3)'   },
    { icon:FiMoon,       label:'Sleep',      value:`${latest.sleep} hrs`,     color:'#22d3ee', bg:'rgba(6,182,212,0.12)',   border:'rgba(6,182,212,0.3)'   },
    { icon:FiDroplet,    label:'Water',      value:`${latest.water} L`,       color:'#34d399', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.3)'  },
  ];

  return (
    <div className="page-wrapper" style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
          <h2 style={{ fontSize:26, fontWeight:700, color:'white', marginBottom:4 }}>Health Metrics ❤️</h2>
          <p style={{ color:'#64748b', fontSize:15 }}>Monitor your vital signs and daily health data</p>
        </motion.div>
        <motion.button initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
          onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <><FiX size={16}/> Cancel</> : <><FiPlus size={16}/> Log Today</>}
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }} style={{ overflow:'hidden' }}>
            <div style={{ ...card, padding:'24px' }}>
              <h3 style={{ fontSize:16, fontWeight:600, color:'white', marginBottom:20 }}>Log Health Data</h3>
              <form onSubmit={handleAdd}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:16 }}>
                  {[
                    { key:'date',      label:'Date *',          type:'date',   ph:''      },
                    { key:'weight',    label:'Weight (kg)',      type:'number', ph:'72.5', step:'0.1' },
                    { key:'heartRate', label:'Heart Rate (bpm)', type:'number', ph:'70'   },
                    { key:'sleep',     label:'Sleep (hrs)',      type:'number', ph:'7.5',  step:'0.1' },
                    { key:'water',     label:'Water (L)',        type:'number', ph:'2.5',  step:'0.1' },
                    { key:'steps',     label:'Steps',            type:'number', ph:'8000' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:7, fontWeight:500 }}>{f.label}</label>
                      <input type={f.type} step={f.step} value={form[f.key]} placeholder={f.ph}
                        onChange={e => setForm({...form, [f.key]:e.target.value})} className="input-glass" />
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn-primary">Save Entry</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }} className="hm-stat-grid">
        {statCards.map((c,i) => (
          <motion.div key={c.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1+i*0.08 }}
            style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
              border:`1px solid ${c.border}`, borderRadius:16, padding:'18px 20px' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
              <c.icon size={20} style={{ color:c.color }} />
            </div>
            <div style={{ fontSize:22, fontWeight:700, color:'white', marginBottom:4 }}>{c.value}</div>
            <div style={{ fontSize:13, color:'#64748b' }}>{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts 2x2 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }} className="hm-chart-grid">
        {[
          { title:'Weight Trend', key:'weight', stroke:'#8b5cf6', gradId:'wg', gradColor:'139,92,246', type:'area', name:'Weight (kg)', domain:['dataMin - 0.5','dataMax + 0.5'] },
          { title:'Heart Rate',   key:'heartRate', stroke:'#f43f5e', gradId:'hg', gradColor:'244,63,94',  type:'line', name:'BPM',         domain:['dataMin - 2','dataMax + 2'] },
          { title:'Sleep Pattern',key:'sleep',  stroke:'#06b6d4', gradId:'sg', gradColor:'6,182,212',   type:'area', name:'Sleep (hrs)', domain:[5,10] },
          { title:'Daily Steps',  key:'steps',  stroke:'#10b981', gradId:'stg',gradColor:'16,185,129',  type:'area', name:'Steps',       domain:['auto','auto'] },
        ].map((ch,i) => (
          <motion.div key={ch.key} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.3+i*0.1 }}
            style={{ ...card, padding:'20px 24px' }}>
            <h3 style={{ fontSize:15, fontWeight:600, color:'white', marginBottom:16 }}>{ch.title}</h3>
            <ResponsiveContainer width="100%" height={210}>
              {ch.type === 'area' ? (
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id={ch.gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ch.stroke} stopOpacity={0.25}/>
                      <stop offset="100%" stopColor={ch.stroke} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                  <XAxis dataKey="date" tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis domain={ch.domain} tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<Tip/>}/>
                  <Area type="monotone" dataKey={ch.key} stroke={ch.stroke} fill={`url(#${ch.gradId})`} strokeWidth={2.5} name={ch.name}/>
                </AreaChart>
              ) : (
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                  <XAxis dataKey="date" tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis domain={ch.domain} tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<Tip/>}/>
                  <Line type="monotone" dataKey={ch.key} stroke={ch.stroke} strokeWidth={2.5} dot={{ fill:ch.stroke, r:4 }} name={ch.name}/>
                </LineChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media(max-width:1024px){ .hm-stat-grid{ grid-template-columns:repeat(2,1fr) !important; } .hm-chart-grid{ grid-template-columns:1fr !important; } }
        @media(max-width:640px) { .hm-stat-grid{ grid-template-columns:repeat(2,1fr) !important; } }
      `}</style>
    </div>
  );
}
