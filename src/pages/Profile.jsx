import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiSave, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const card = {
  background:'rgba(255,255,255,0.04)',
  backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
  border:'1px solid rgba(255,255,255,0.1)', borderRadius:16,
};

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name:   user?.name   || '',
    email:  user?.email  || '',
    height: user?.height || 170,
    weight: user?.weight || 70,
    age:    user?.age    || 25,
  });

  useEffect(() => {
    setForm({
      name:   user?.name   || '',
      email:  user?.email  || '',
      height: user?.height || 170,
      weight: user?.weight || 70,
      age:    user?.age    || 25,
    });
  }, [user]);

  const handleSave = e => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name cannot be empty'); return; }
    updateProfile({ name:form.name.trim(), email:form.email, height:+form.height, weight:+form.weight, age:+form.age });
    toast.success('Profile updated! ✅');
  };

  const workoutCount = (() => { try { return JSON.parse(localStorage.getItem('vf_workouts')||'[]').length; } catch { return 0; } })();
  const goalsAchieved = (() => { try { return JSON.parse(localStorage.getItem('vf_goals')||'[]').filter(x=>x.completed).length; } catch { return 0; } })();

  const bmi = form.height && form.weight ? (form.weight / Math.pow(form.height/100, 2)).toFixed(1) : null;
  const bmiLabel = !bmi ? '' : bmi<18.5?'Underweight':bmi<25?'Normal':bmi<30?'Overweight':'Obese';
  const bmiColor = !bmi ? '' : bmi<18.5?'#06b6d4':bmi<25?'#34d399':bmi<30?'#fbbf24':'#fb7185';

  const stats = [
    { label:'Member Since',   value:user?.joinDate||'N/A', color:'#a78bfa' },
    { label:'Total Workouts', value:workoutCount,          color:'#22d3ee' },
    { label:'Goals Achieved', value:goalsAchieved,         color:'#34d399' },
    { label:'Active Streak',  value:'8 days',              color:'#fbbf24' },
  ];

  const displayName = user?.name || 'User';

  return (
    <div className="page-wrapper" style={{ display:'flex', flexDirection:'column', gap:24, maxWidth:900 }}>

      <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
        <h2 style={{ fontSize:26, fontWeight:700, color:'white', marginBottom:4 }}>Profile 👤</h2>
        <p style={{ color:'#64748b', fontSize:15 }}>Manage your account and preferences</p>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
        style={{ ...card, padding:'24px 28px', display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
        <div style={{
          width:72, height:72, borderRadius:20, flexShrink:0,
          background:'linear-gradient(135deg,#8b5cf6,#06b6d4)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:28, fontWeight:700, color:'white',
          boxShadow:'0 8px 24px rgba(139,92,246,0.35)',
        }}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex:1 }}>
          <h3 style={{ fontSize:20, fontWeight:700, color:'white', marginBottom:6 }}>{displayName}</h3>
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'#64748b', fontSize:14, marginBottom:4 }}>
            <FiMail size={14}/> {user?.email||'user@example.com'}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'#64748b', fontSize:14 }}>
            <FiCalendar size={14}/> Joined {user?.joinDate||'N/A'}
          </div>
        </div>
        {bmi && (
          <div style={{ textAlign:'center', flexShrink:0 }}>
            <div style={{ fontSize:36, fontWeight:700, color:bmiColor, lineHeight:1 }}>{bmi}</div>
            <div style={{ fontSize:12, color:'#64748b', marginTop:4 }}>BMI · {bmiLabel}</div>
          </div>
        )}
      </motion.div>

      {/* Stats Row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }} className="profile-stats">
        {stats.map((s,i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2+i*0.08 }}
            style={{ ...card, padding:'18px 20px', textAlign:'center' }}>
            <div style={{ fontSize:24, fontWeight:700, color:s.color, marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:13, color:'#64748b' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Edit Form */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
        style={{ ...card, padding:'24px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
          <FiEdit2 size={17} style={{ color:'#a78bfa' }}/>
          <h3 style={{ fontSize:16, fontWeight:600, color:'white' }}>Edit Profile</h3>
        </div>
        <form onSubmit={handleSave}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
            {/* Name */}
            <div>
              <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:8, fontWeight:500 }}>Full Name</label>
              <div style={{ position:'relative' }}>
                <FiUser style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#475569' }} size={14}/>
                <input type="text" value={form.name} onChange={e => setForm({...form,name:e.target.value})}
                  className="input-glass" style={{ paddingLeft:40 }}/>
              </div>
            </div>
            {/* Email */}
            <div>
              <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:8, fontWeight:500 }}>Email</label>
              <div style={{ position:'relative' }}>
                <FiMail style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#475569' }} size={14}/>
                <input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}
                  className="input-glass" style={{ paddingLeft:40 }}/>
              </div>
            </div>
            {/* Height */}
            <div>
              <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:8, fontWeight:500 }}>Height (cm)</label>
              <input type="number" value={form.height} min={100} max={250}
                onChange={e => setForm({...form,height:e.target.value})} className="input-glass"/>
            </div>
            {/* Weight */}
            <div>
              <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:8, fontWeight:500 }}>Weight (kg)</label>
              <input type="number" step="0.1" value={form.weight} min={30} max={300}
                onChange={e => setForm({...form,weight:e.target.value})} className="input-glass"/>
            </div>
            {/* Age */}
            <div>
              <label style={{ display:'block', fontSize:13, color:'#cbd5e1', marginBottom:8, fontWeight:500 }}>Age</label>
              <input type="number" value={form.age} min={10} max={120}
                onChange={e => setForm({...form,age:e.target.value})} className="input-glass"/>
            </div>
            {/* Save */}
            <div style={{ display:'flex', alignItems:'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ width:'100%', padding:'12px' }}>
                <FiSave size={16}/> Save Changes
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      <style>{`
        @media(max-width:1024px){ .profile-stats{ grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:640px) { .profile-stats{ grid-template-columns:repeat(2,1fr) !important; } }
      `}</style>
    </div>
  );
}
