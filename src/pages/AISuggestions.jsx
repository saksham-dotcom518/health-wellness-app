import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiActivity, FiHeart, FiSun, FiMoon, FiDroplet, FiRefreshCw } from 'react-icons/fi';

const allSuggestions = [
  { id:'s1', icon:FiActivity, title:'Try Interval Training',    category:'Workout',   color:'#8b5cf6', desc:'Based on your workout data, HIIT sessions 2-3 times per week could boost your calorie burn by 20%. Start with 20-minute sessions.' },
  { id:'s2', icon:FiDroplet,  title:'Increase Water Intake',    category:'Nutrition', color:'#06b6d4', desc:'Your average water consumption is 2.4L. Aim for 3L daily — try drinking a glass before each meal and keep a bottle at your desk.' },
  { id:'s3', icon:FiMoon,     title:'Optimize Sleep Schedule',  category:'Sleep',     color:'#6366f1', desc:'Your sleep varies between 6.5-7.8 hours. Consistency matters more than duration. Try sleeping and waking at the same time daily.' },
  { id:'s4', icon:FiHeart,    title:'Heart Rate Recovery',      category:'Health',    color:'#f43f5e', desc:'Your resting heart rate has dropped from 72 to 65 bpm — excellent progress! Continue with cardio 3-4 times per week.' },
  { id:'s5', icon:FiSun,      title:'Morning Routine Boost',    category:'Wellness',  color:'#f59e0b', desc:'Add 10 minutes of stretching to your morning routine. It can improve flexibility by 15% and reduce injury risk during workouts.' },
  { id:'s6', icon:FiActivity, title:'Progressive Overload',     category:'Workout',   color:'#8b5cf6', desc:'You have been lifting the same weights for 2 weeks. Try increasing weight by 5% or adding 2 more reps per set for continued gains.' },
  { id:'s7', icon:FiDroplet,  title:'Post-Workout Nutrition',   category:'Nutrition', color:'#10b981', desc:'Consume protein within 30 minutes after workouts. A shake with 25-30g protein and simple carbs accelerates recovery.' },
  { id:'s8', icon:FiHeart,    title:'Stress Management',        category:'Wellness',  color:'#f43f5e', desc:'Consider adding 5-minute breathing exercises between work sessions. Box breathing (4-4-4-4) can lower cortisol by up to 25%.' },
  { id:'s9', icon:FiSun,      title:'Active Recovery Days',     category:'Workout',   color:'#f59e0b', desc:'On rest days, light activities like a 20-min walk or gentle yoga help reduce soreness and improve overall recovery speed.' },
];

export default function AISuggestions() {
  const [displayed, setDisplayed] = useState(() => allSuggestions.slice(0,6).map(s => s.id));
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      const shuffled = [...allSuggestions].sort(() => Math.random()-0.5);
      setDisplayed(shuffled.slice(0,6).map(s => s.id));
      setRefreshing(false);
    }, 800);
  };

  const suggestions = displayed.map(id => allSuggestions.find(s => s.id===id)).filter(Boolean);

  return (
    <div className="page-wrapper" style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
          <h2 style={{ fontSize:26, fontWeight:700, color:'white', marginBottom:4 }}>AI Insights ⚡</h2>
          <p style={{ color:'#64748b', fontSize:15 }}>Personalized health recommendations powered by your data</p>
        </motion.div>
        <motion.button initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
          onClick={refresh} disabled={refreshing} className="btn-secondary">
          <FiRefreshCw size={15} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}/>
          Refresh
        </motion.button>
      </div>

      {/* Banner */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
        style={{
          background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
          border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'24px',
          position:'relative', overflow:'hidden',
        }}>
        <div style={{ position:'absolute', top:0, right:0, width:200, height:200, borderRadius:'50%', pointerEvents:'none',
          background:'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)', filter:'blur(40px)', transform:'translate(30%,-30%)' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:18, position:'relative' }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#8b5cf6,#06b6d4)',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            boxShadow:'0 6px 24px rgba(139,92,246,0.35)' }}>
            <FiZap size={24} color="white"/>
          </div>
          <div>
            <h3 style={{ fontSize:17, fontWeight:700, color:'white', marginBottom:6 }}>Smart Analysis</h3>
            <p style={{ fontSize:14, color:'#94a3b8', lineHeight:1.6 }}>
              Based on your recent activity data, sleep patterns, and health metrics, here are personalized recommendations to optimize your wellness journey.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cards Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }} className="ai-grid">
        <AnimatePresence mode="popLayout">
          {suggestions.map((s,i) => (
            <motion.div key={s.id}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
              transition={{ delay:i*0.07 }}
              style={{
                background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
                border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'20px',
                cursor:'default', transition:'all 0.25s ease',
              }}
              whileHover={{ y:-4, transition:{ duration:0.2 } }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; }}
            >
              {/* Icon + category */}
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:`${s.color}18`,
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <s.icon size={20} style={{ color:s.color }}/>
                </div>
                <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600,
                  background:`${s.color}18`, color:s.color }}>{s.category}</span>
              </div>
              <h4 style={{ fontSize:15, fontWeight:600, color:'white', marginBottom:8 }}>{s.title}</h4>
              <p style={{ fontSize:13, color:'#94a3b8', lineHeight:1.65 }}>{s.desc}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style>{`
        @media(max-width:1024px){ .ai-grid{ grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:640px) { .ai-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}
