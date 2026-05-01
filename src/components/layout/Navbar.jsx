import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiBell, FiSearch, FiX, FiActivity, FiTarget, FiHeart, FiClock, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

/* ─── SEARCH ─────────────────────────────────────────── */
function useSearchData() {
  const getWorkouts = () => { try { return JSON.parse(localStorage.getItem('vf_workouts') || '[]'); } catch { return []; } };
  const getGoals    = () => { try { return JSON.parse(localStorage.getItem('vf_goals')    || '[]'); } catch { return []; } };
  const getMetrics  = () => { try { return JSON.parse(localStorage.getItem('vf_metrics')  || '[]'); } catch { return []; } };

  const search = (query) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results = [];

    getWorkouts().forEach(w => {
      if (w.type?.toLowerCase().includes(q) || w.notes?.toLowerCase().includes(q)) {
        results.push({ type: 'workout', icon: FiActivity, label: w.type, sub: `${w.date} · ${w.duration} min · ${w.calories} kcal`, path: '/workouts', color: '#a78bfa' });
      }
    });

    getGoals().forEach(g => {
      if (g.title?.toLowerCase().includes(q) || g.category?.toLowerCase().includes(q)) {
        results.push({ type: 'goal', icon: FiTarget, label: g.title, sub: `${g.category} · ${g.progress}% complete`, path: '/goals', color: '#34d399' });
      }
    });

    getMetrics().forEach(m => {
      if (m.date?.toLowerCase().includes(q)) {
        results.push({ type: 'health', icon: FiHeart, label: `Health Log — ${m.date}`, sub: `${m.weight}kg · ${m.sleep}hrs sleep · ${m.steps} steps`, path: '/health', color: '#fb7185' });
      }
    });

    // Static page results
    const pages = [
      { label: 'Dashboard',      sub: 'Overview & stats',            path: '/',               color: '#a78bfa' },
      { label: 'Workouts',       sub: 'Track your exercise',         path: '/workouts',        color: '#22d3ee' },
      { label: 'Health Metrics', sub: 'Weight, sleep, heart rate',   path: '/health',          color: '#fb7185' },
      { label: 'Goals',          sub: 'Your fitness targets',        path: '/goals',           color: '#34d399' },
      { label: 'AI Insights',    sub: 'Smart recommendations',       path: '/ai-suggestions',  color: '#fbbf24' },
      { label: 'Profile',        sub: 'Account & settings',          path: '/profile',         color: '#a78bfa' },
    ];
    pages.forEach(p => {
      if (p.label.toLowerCase().includes(q)) results.push({ ...p, type: 'page', icon: FiSearch });
    });

    return results.slice(0, 8);
  };

  return { search };
}

function SearchModal({ onClose }) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const { search } = useSearchData();
  const navigate   = useNavigate();
  const inputRef   = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    setResults(search(query));
  }, [query]);

  const go = (path) => { navigate(path); onClose(); };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:100, display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:80 }}
    >
      <motion.div
        initial={{ opacity:0, y:-20, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-20 }}
        transition={{ duration:0.2 }}
        onClick={e => e.stopPropagation()}
        style={{
          width:'100%', maxWidth:560,
          background:'rgba(15,15,28,0.97)', backdropFilter:'blur(40px)', WebkitBackdropFilter:'blur(40px)',
          border:'1px solid rgba(255,255,255,0.12)', borderRadius:20,
          overflow:'hidden', boxShadow:'0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Input */}
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <FiSearch size={18} style={{ color:'#64748b', flexShrink:0 }}/>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search workouts, goals, pages..."
            style={{
              flex:1, background:'none', border:'none', outline:'none',
              color:'white', fontSize:16, fontFamily:'Inter,sans-serif',
            }}
            onKeyDown={e => { if (e.key === 'Escape') onClose(); if (e.key === 'Enter' && results[0]) go(results[0].path); }}
          />
          <button onClick={onClose}
            style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'4px 10px', color:'#64748b', cursor:'pointer', fontSize:12, fontFamily:'inherit' }}>
            esc
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight:380, overflowY:'auto' }}>
          {query && results.length === 0 && (
            <div style={{ padding:'32px', textAlign:'center', color:'#475569', fontSize:14 }}>
              No results for "{query}"
            </div>
          )}

          {results.length > 0 && results.map((r, i) => (
            <motion.button key={i}
              initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04 }}
              onClick={() => go(r.path)}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:14,
                padding:'13px 20px', background:'none', border:'none', cursor:'pointer',
                fontFamily:'inherit', transition:'background 0.15s', textAlign:'left',
                borderBottom:'1px solid rgba(255,255,255,0.05)',
              }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background='none'}
            >
              <div style={{ width:36, height:36, borderRadius:10, background:`${r.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <r.icon size={17} style={{ color:r.color }}/>
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:500, color:'white' }}>{r.label}</div>
                <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{r.sub}</div>
              </div>
              <div style={{ marginLeft:'auto', fontSize:11, color:'#334155', fontWeight:500, textTransform:'uppercase' }}>{r.type}</div>
            </motion.button>
          ))}

          {!query && (
            <div style={{ padding:'20px 20px 24px' }}>
              <div style={{ fontSize:12, color:'#475569', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600 }}>Quick Links</div>
              {[
                { label:'Dashboard',     path:'/',              color:'#a78bfa', icon:FiSearch },
                { label:'Workouts',      path:'/workouts',      color:'#22d3ee', icon:FiActivity },
                { label:'Goals',         path:'/goals',         color:'#34d399', icon:FiTarget },
                { label:'Health Metrics',path:'/health',        color:'#fb7185', icon:FiHeart },
              ].map((p, i) => (
                <button key={i} onClick={() => go(p.path)}
                  style={{
                    width:'100%', display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
                    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12,
                    cursor:'pointer', fontFamily:'inherit', marginBottom:8, transition:'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                >
                  <p.icon size={15} style={{ color:p.color }}/> <span style={{ fontSize:14, color:'#cbd5e1' }}>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── NOTIFICATIONS ──────────────────────────────────── */
function buildNotifications() {
  const notes = [];
  const today = new Date().toISOString().split('T')[0];

  // Check last workout
  try {
    const workouts = JSON.parse(localStorage.getItem('vf_workouts') || '[]');
    const lastDate = workouts[0]?.date;
    if (!lastDate || lastDate < today) {
      notes.push({ id:'w1', type:'reminder', icon:FiActivity, title:'Workout Reminder', body:"You haven't logged a workout today. Stay consistent!", color:'#a78bfa', time:'Now' });
    } else {
      notes.push({ id:'w2', type:'success', icon:FiCheckCircle, title:'Workout Logged!', body:`Great job! You logged a ${workouts[0].type} session today.`, color:'#34d399', time:'Today' });
    }
  } catch {}

  // Check goals nearing deadline
  try {
    const goals = JSON.parse(localStorage.getItem('vf_goals') || '[]');
    goals.filter(g => !g.completed).forEach(g => {
      const daysLeft = Math.ceil((new Date(g.deadline) - new Date()) / 86400000);
      if (daysLeft >= 0 && daysLeft <= 7) {
        notes.push({ id:`g${g.id}`, type:'warning', icon:FiAlertCircle, title:'Goal Deadline Soon', body:`"${g.title}" is due in ${daysLeft} day${daysLeft===1?'':'s'}. You're at ${g.progress}%.`, color:'#fbbf24', time:`${daysLeft}d left` });
      }
    });
  } catch {}

  // Water intake reminder
  notes.push({ id:'h1', type:'info', icon:FiInfo, title:'Hydration Check', body:'Remember to drink water! Aim for 3L today to stay at peak performance.', color:'#22d3ee', time:'2h ago' });

  // Sleep reminder
  notes.push({ id:'s1', type:'reminder', icon:FiClock, title:'Sleep Goal', body:'Consistent sleep improves recovery. Try to get 7-8 hours tonight.', color:'#6366f1', time:'6h ago' });

  return notes.slice(0, 6);
}

function NotificationsPanel({ onClose, anchorRef }) {
  const [notifications, setNotifications] = useState(buildNotifications);
  const [read, setRead] = useState(new Set());
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const unread = notifications.filter(n => !read.has(n.id)).length;

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && !anchorRef.current?.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const markAllRead = () => setRead(new Set(notifications.map(n => n.id)));
  const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity:0, y:-10, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-10, scale:0.97 }}
      transition={{ duration:0.18 }}
      style={{
        position:'absolute', top:'calc(100% + 12px)', right:0,
        width:360, maxHeight:480,
        background:'rgba(12,12,24,0.97)', backdropFilter:'blur(40px)', WebkitBackdropFilter:'blur(40px)',
        border:'1px solid rgba(255,255,255,0.12)', borderRadius:18,
        boxShadow:'0 20px 60px rgba(0,0,0,0.6)',
        overflow:'hidden', display:'flex', flexDirection:'column',
        zIndex:200,
      }}
    >
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <span style={{ fontSize:15, fontWeight:700, color:'white' }}>Notifications</span>
          {unread > 0 && <span style={{ marginLeft:8, fontSize:11, padding:'2px 8px', borderRadius:20, background:'rgba(139,92,246,0.25)', color:'#c4b5fd', fontWeight:600 }}>{unread} new</span>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            style={{ fontSize:12, color:'#64748b', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', transition:'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color='#a78bfa'}
            onMouseLeave={e => e.currentTarget.style.color='#64748b'}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ overflowY:'auto', flex:1 }}>
        {notifications.length === 0 && (
          <div style={{ padding:'40px', textAlign:'center', color:'#475569', fontSize:14 }}>All caught up! 🎉</div>
        )}
        {notifications.map((n, i) => {
          const isRead = read.has(n.id);
          return (
            <motion.div key={n.id}
              initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}
              style={{
                display:'flex', gap:12, padding:'14px 18px',
                borderBottom:'1px solid rgba(255,255,255,0.05)',
                background: isRead ? 'transparent' : 'rgba(139,92,246,0.04)',
                transition:'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background= isRead ? 'transparent' : 'rgba(139,92,246,0.04)'}
            >
              <div style={{ width:36, height:36, borderRadius:10, background:`${n.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                <n.icon size={17} style={{ color:n.color }}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight:600, color: isRead ? '#94a3b8' : 'white' }}>{n.title}</span>
                  <span style={{ fontSize:11, color:'#475569', flexShrink:0, marginLeft:8 }}>{n.time}</span>
                </div>
                <p style={{ fontSize:12, color:'#64748b', lineHeight:1.55, margin:0 }}>{n.body}</p>
              </div>
              <button onClick={() => dismiss(n.id)}
                style={{ background:'none', border:'none', cursor:'pointer', color:'#334155', flexShrink:0, padding:'2px', display:'flex', alignSelf:'flex-start', transition:'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color='#fb7185'}
                onMouseLeave={e => e.currentTarget.style.color='#334155'}
              >
                <FiX size={13}/>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding:'12px 18px', borderTop:'1px solid rgba(255,255,255,0.08)', textAlign:'center' }}>
        <button
          onClick={() => { navigate('/profile'); onClose(); }}
          style={{ fontSize:13, color:'#64748b', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', transition:'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color='#a78bfa'}
          onMouseLeave={e => e.currentTarget.style.color='#64748b'}
        >
          Manage notification settings →
        </button>
      </div>
    </motion.div>
  );
}

/* ─── NAVBAR ─────────────────────────────────────────── */
export default function Navbar({ title, onMenuClick }) {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen,  setNotifOpen]  = useState(false);
  const bellRef = useRef(null);

  // Keyboard shortcut: Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setNotifOpen(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Unread count
  const unreadCount = buildNotifications().length;

  const iconBtn = (onClick, ref, children, badge) => (
    <button ref={ref} onClick={onClick}
      style={{
        width:36, height:36, borderRadius:10, position:'relative',
        display:'flex', alignItems:'center', justifyContent:'center',
        background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
        cursor:'pointer', color:'#94a3b8', transition:'all 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='white'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; }}
      onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}
    >
      {children}
      {badge && (
        <span style={{ position:'absolute', top:7, right:7, width:7, height:7, borderRadius:'50%', background:'#8b5cf6', boxShadow:'0 0 6px rgba(139,92,246,0.9)' }}/>
      )}
    </button>
  );

  return (
    <>
      <header style={{
        position:'sticky', top:0, zIndex:30,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'13px 24px',
        background:'rgba(6,6,14,0.88)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(255,255,255,0.07)',
      }}>
        {/* Left */}
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button onClick={onMenuClick} className="lg:hidden"
            style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex', padding:4 }}>
            <FiMenu size={22}/>
          </button>
          <h1 style={{ fontSize:18, fontWeight:700, color:'white' }}>{title}</h1>
        </div>

        {/* Right */}
        <div style={{ display:'flex', alignItems:'center', gap:8, position:'relative' }}>
          {/* Search button */}
          {iconBtn(() => setSearchOpen(true), null,
            <>
              <FiSearch size={17}/>
            </>
          )}

          {/* Bell button */}
          {iconBtn(() => setNotifOpen(o => !o), bellRef,
            <FiBell size={17}/>,
            unreadCount > 0
          )}

          {/* Notifications panel */}
          <AnimatePresence>
            {notifOpen && (
              <NotificationsPanel onClose={() => setNotifOpen(false)} anchorRef={bellRef}/>
            )}
          </AnimatePresence>

          {/* Avatar */}
          <div style={{
            width:36, height:36, borderRadius:'50%',
            background:'linear-gradient(135deg,#8b5cf6,#06b6d4)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:14, fontWeight:700, color:'white', cursor:'pointer', flexShrink:0,
            boxShadow:'0 0 0 2px rgba(139,92,246,0.3)',
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      {/* Search Modal (portal-like, covers full screen) */}
      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)}/>}
      </AnimatePresence>
    </>
  );
}
