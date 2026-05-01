import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTarget, FiPlus, FiX, FiCheck, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = ['Fitness','Nutrition','Sleep','Mindfulness','Weight','Other'];
const CAT_COLORS  = { Fitness:'#8b5cf6', Nutrition:'#10b981', Sleep:'#06b6d4', Mindfulness:'#f59e0b', Weight:'#f43f5e', Other:'#64748b' };

const seedGoals = [
  { id:1, title:'Run 5K under 25 minutes',   category:'Fitness',     progress:72,  deadline:'2026-05-01', completed:false },
  { id:2, title:'Drink 3L water daily',       category:'Nutrition',   progress:85,  deadline:'2026-04-15', completed:false },
  { id:3, title:'Sleep 8 hours consistently', category:'Sleep',       progress:60,  deadline:'2026-04-30', completed:false },
  { id:4, title:'Meditate 10 min daily',      category:'Mindfulness', progress:45,  deadline:'2026-04-20', completed:false },
  { id:5, title:'Lose 5kg body weight',       category:'Weight',      progress:100, deadline:'2026-03-31', completed:true  },
];

const card = {
  background:'rgba(255,255,255,0.04)',
  backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
  border:'1px solid rgba(255,255,255,0.1)', borderRadius:16,
};

function ProgressRing({ progress, color, size=64 }) {
  const r = (size-8)/2, circ = 2*Math.PI*r, pct = Math.min(Math.max(progress,0),100);
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)', flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5}/>
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset:circ }}
        animate={{ strokeDashoffset: circ - (circ*pct)/100 }}
        transition={{ duration:1.4, ease:'easeOut' }}/>
    </svg>
  );
}

export default function Goals() {
  const [goals, setGoals] = useState(() => {
    try { const s = localStorage.getItem('vf_goals'); return s ? JSON.parse(s) : seedGoals; }
    catch { return seedGoals; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', category:'Fitness', deadline:'' });

  const save = d => { setGoals(d); localStorage.setItem('vf_goals', JSON.stringify(d)); };

  const handleAdd = e => {
    e.preventDefault();
    if (!form.title.trim() || !form.deadline) { toast.error('Fill in all fields'); return; }
    save([{ id:Date.now(), ...form, title:form.title.trim(), progress:0, completed:false }, ...goals]);
    setForm({ title:'', category:'Fitness', deadline:'' });
    setShowForm(false);
    toast.success('Goal created! 🎯');
  };

  const updateProgress = (id, delta) => save(goals.map(g => {
    if (g.id !== id) return g;
    const p = Math.max(0, Math.min(100, g.progress + delta));
    return { ...g, progress:p, completed:p>=100 };
  }));

  const handleDelete = id => { save(goals.filter(g => g.id !== id)); toast.success('Goal removed'); };

  const active    = goals.filter(g => !g.completed);
  const completed = goals.filter(g =>  g.completed);

  return (
    <div className="page-wrapper" style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
          <h2 style={{ fontSize:26, fontWeight:700, color:'white', marginBottom:4 }}>Your Goals 🎯</h2>
          <p style={{ color:'#64748b', fontSize:15 }}>Set targets and track your progress</p>
        </motion.div>
        <motion.button initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
          onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <><FiX size={16}/> Cancel</> : <><FiPlus size={16}/> New Goal</>}
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }} style={{ overflow:'hidden' }}>
            <div style={{ ...card, padding:'24px' }}>
              <h3 style={{ fontSize:16, fontWeight:600, color:'white', marginBottom:20 }}>Create Goal</h3>
              <form onSubmit={handleAdd}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:16 }}>
                  <div>
                    <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:7, fontWeight:500 }}>Goal Title</label>
                    <input type="text" value={form.title} onChange={e => setForm({...form,title:e.target.value})}
                      placeholder="e.g. Run 10K" className="input-glass"/>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:7, fontWeight:500 }}>Category</label>
                    <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} className="input-glass">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:7, fontWeight:500 }}>Deadline</label>
                    <input type="date" value={form.deadline} onChange={e => setForm({...form,deadline:e.target.value})} className="input-glass"/>
                  </div>
                </div>
                <button type="submit" className="btn-primary">Create Goal</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Goals */}
      {active.length > 0 && (
        <div>
          <h3 style={{ fontSize:16, fontWeight:600, color:'white', marginBottom:16 }}>
            Active Goals <span style={{ color:'#475569', fontWeight:400 }}>({active.length})</span>
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }} className="goals-grid">
            {active.map((g,i) => {
              const col = CAT_COLORS[g.category] || '#64748b';
              return (
                <motion.div key={g.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:i*0.06 }}
                  style={{ ...card, padding:'20px', display:'flex', gap:18 }}>
                  {/* Ring */}
                  <div style={{ position:'relative', width:64, height:64, flexShrink:0 }}>
                    <ProgressRing progress={g.progress} color={col} size={64}/>
                    <span style={{
                      position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:12, fontWeight:700, color:'white',
                    }}>{g.progress}%</span>
                  </div>

                  {/* Content */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:15, fontWeight:600, color:'white', marginBottom:8, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {g.title}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, flexWrap:'wrap' }}>
                      <span style={{ fontSize:11, padding:'2px 10px', borderRadius:20, fontWeight:600, background:`${col}20`, color:col }}>{g.category}</span>
                      <span style={{ fontSize:12, color:'#475569' }}>Due {g.deadline}</span>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height:4, borderRadius:4, background:'rgba(255,255,255,0.08)', marginBottom:12, overflow:'hidden' }}>
                      <motion.div style={{ height:'100%', borderRadius:4, background:col }}
                        initial={{ width:0 }} animate={{ width:`${g.progress}%` }} transition={{ duration:1.2, ease:'easeOut' }}/>
                    </div>

                    {/* Buttons */}
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <button onClick={() => updateProgress(g.id,-10)} className="btn-secondary"
                        style={{ padding:'5px 12px', fontSize:12 }}>-10%</button>
                      <button onClick={() => updateProgress(g.id,10)} className="btn-primary"
                        style={{ padding:'5px 12px', fontSize:12 }}>+10%</button>
                      <button onClick={() => handleDelete(g.id)}
                        style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#475569', padding:4, transition:'color 0.2s', display:'flex' }}
                        onMouseEnter={e => e.currentTarget.style.color='#fb7185'}
                        onMouseLeave={e => e.currentTarget.style.color='#475569'}>
                        <FiTrash2 size={15}/>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {active.length === 0 && completed.length === 0 && (
        <div style={{ ...card, padding:'64px', textAlign:'center' }}>
          <FiTarget size={40} style={{ color:'#334155', margin:'0 auto 12px', display:'block' }}/>
          <p style={{ color:'#475569' }}>No goals yet. Create your first one!</p>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h3 style={{ fontSize:16, fontWeight:600, color:'white', marginBottom:16 }}>
            Completed 🎉 <span style={{ color:'#475569', fontWeight:400 }}>({completed.length})</span>
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {completed.map(g => (
              <div key={g.id} style={{ ...card, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', opacity:0.65 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <FiCheck size={16} style={{ color:'#34d399' }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:500, color:'white', textDecoration:'line-through' }}>{g.title}</div>
                    <div style={{ fontSize:12, color:'#475569' }}>{g.category}</div>
                  </div>
                </div>
                <button onClick={() => handleDelete(g.id)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'#475569', display:'flex', transition:'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color='#fb7185'}
                  onMouseLeave={e => e.currentTarget.style.color='#475569'}>
                  <FiTrash2 size={15}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@media(max-width:768px){ .goals-grid{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}
