import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiClock, FiZap, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TYPES = ['Running','Weight Training','Yoga','Cycling','Swimming','HIIT','Walking','Other'];
const ICONS = { Running:'🏃','Weight Training':'🏋️',Yoga:'🧘',Cycling:'🚴',Swimming:'🏊',HIIT:'🔥',Walking:'🚶',Other:'💪' };

const seedWorkouts = [
  { id:1, type:'Running',        duration:45, calories:420, notes:'Morning jog in the park', date:'2026-04-01' },
  { id:2, type:'Weight Training',duration:60, calories:380, notes:'Upper body focus',        date:'2026-03-31' },
  { id:3, type:'Yoga',           duration:30, calories:150, notes:'Vinyasa flow session',    date:'2026-03-30' },
  { id:4, type:'Cycling',        duration:50, calories:460, notes:'Hill intervals',          date:'2026-03-29' },
  { id:5, type:'HIIT',           duration:25, calories:320, notes:'Tabata circuits',         date:'2026-03-28' },
];

const card = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16,
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState(() => {
    try { const s = localStorage.getItem('vf_workouts'); return s ? JSON.parse(s) : seedWorkouts; }
    catch { return seedWorkouts; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type:'Running', duration:'', calories:'', notes:'' });
  const [filter, setFilter] = useState('All');

  const save = d => { setWorkouts(d); localStorage.setItem('vf_workouts', JSON.stringify(d)); };

  const handleAdd = e => {
    e.preventDefault();
    if (!form.duration || !form.calories) { toast.error('Fill in duration and calories'); return; }
    save([{ id:Date.now(), ...form, duration:+form.duration, calories:+form.calories, date:new Date().toISOString().split('T')[0] }, ...workouts]);
    setForm({ type:'Running', duration:'', calories:'', notes:'' });
    setShowForm(false);
    toast.success('Workout added! 💪');
  };

  const handleDelete = id => { save(workouts.filter(w => w.id !== id)); toast.success('Deleted'); };

  const filtered = filter === 'All' ? workouts : workouts.filter(w => w.type === filter);
  const totalCal = workouts.reduce((s,w) => s + w.calories, 0);
  const totalMin = workouts.reduce((s,w) => s + w.duration, 0);

  return (
    <div className="page-wrapper" style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
          <h2 style={{ fontSize:26, fontWeight:700, color:'white', marginBottom:4 }}>Your Workouts 💪</h2>
          <p style={{ color:'#64748b', fontSize:15 }}>Track and manage your exercise routine</p>
        </motion.div>
        <motion.button initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
          onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <><FiX size={16}/> Cancel</> : <><FiPlus size={16}/> Add Workout</>}
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {[
          { label:'Total Workouts', value:workouts.length,             color:'#a78bfa' },
          { label:'Total Minutes',  value:totalMin,                    color:'#22d3ee' },
          { label:'Calories Burned',value:totalCal.toLocaleString(),   color:'#34d399' },
        ].map((s,i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1+i*0.08 }}
            style={{ ...card, padding:'20px 24px', textAlign:'center' }}>
            <div style={{ fontSize:32, fontWeight:700, color:s.color, marginBottom:6 }}>{s.value}</div>
            <div style={{ fontSize:13, color:'#64748b' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }} style={{ overflow:'hidden' }}>
            <div style={{ ...card, padding:'24px' }}>
              <h3 style={{ fontSize:16, fontWeight:600, color:'white', marginBottom:20 }}>Log New Workout</h3>
              <form onSubmit={handleAdd}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                  <div>
                    <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:7, fontWeight:500 }}>Type</label>
                    <select value={form.type} onChange={e => setForm({...form,type:e.target.value})} className="input-glass">
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:7, fontWeight:500 }}>Duration (min)</label>
                    <input type="number" value={form.duration} onChange={e => setForm({...form,duration:e.target.value})}
                      placeholder="45" className="input-glass" />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:7, fontWeight:500 }}>Calories</label>
                    <input type="number" value={form.calories} onChange={e => setForm({...form,calories:e.target.value})}
                      placeholder="300" className="input-glass" />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:7, fontWeight:500 }}>Notes (optional)</label>
                    <input type="text" value={form.notes} onChange={e => setForm({...form,notes:e.target.value})}
                      placeholder="e.g. Morning run" className="input-glass" />
                  </div>
                </div>
                <button type="submit" className="btn-primary">Save Workout</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Pills */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {['All', ...TYPES].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{
              padding:'6px 14px', borderRadius:10, fontSize:13, fontWeight:500,
              cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s',
              background: filter===t ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
              color: filter===t ? '#c4b5fd' : '#94a3b8',
              border: filter===t ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Workout List */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map((w,i) => (
          <motion.div key={w.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:i*0.04 }}
            style={{ ...card, padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
          >
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <span style={{ fontSize:30 }}>{ICONS[w.type]||'💪'}</span>
              <div>
                <div style={{ fontSize:15, fontWeight:600, color:'white' }}>{w.type}</div>
                <div style={{ fontSize:12, color:'#64748b', marginTop:3 }}>
                  {w.date}{w.notes ? ` · ${w.notes}` : ''}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:20 }}>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:13, color:'#22d3ee', display:'flex', alignItems:'center', gap:5, justifyContent:'flex-end' }}>
                  <FiClock size={12}/> {w.duration} min
                </div>
                <div style={{ fontSize:13, color:'#fbbf24', display:'flex', alignItems:'center', gap:5, justifyContent:'flex-end', marginTop:3 }}>
                  <FiZap size={12}/> {w.calories} kcal
                </div>
              </div>
              <button onClick={() => handleDelete(w.id)} className="btn-danger" style={{ padding:'8px 10px' }}>
                <FiTrash2 size={14}/>
              </button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div style={{ ...card, padding:'48px', textAlign:'center', color:'#475569' }}>
            No workouts found for this filter
          </div>
        )}
      </div>

      <style>{`@media(max-width:640px){ .workout-summary-grid{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}
