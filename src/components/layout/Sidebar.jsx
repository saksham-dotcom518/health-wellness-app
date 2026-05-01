import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiActivity, FiHeart, FiTarget, FiZap, FiUser, FiLogOut, FiX, FiInfo } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/',               icon: FiHome,     label: 'Dashboard'     },
  { path: '/workouts',       icon: FiActivity, label: 'Workouts'      },
  { path: '/health',         icon: FiHeart,    label: 'Health Metrics' },
  { path: '/goals',          icon: FiTarget,   label: 'Goals'         },
  { path: '/ai-suggestions', icon: FiZap,      label: 'AI Insights'   },
  { path: '/profile',        icon: FiUser,     label: 'Profile'       },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showAbout, setShowAbout] = useState(false);

  // On large screens: always visible (no overlay, no transform)
  // On small screens: slide in/out based on isOpen
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

  return (
    <>
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 40,
            }}
            className="lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0, left: 0,
          height: '100%',
          width: '256px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(10,10,26,0.97)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          transform: isOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s ease',
        }}
        className={`sidebar-panel ${isOpen ? 'sidebar-open' : ''}`}
      >
        {/* Logo */}
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FiActivity size={18} color="white" />
            </div>
            <span className="gradient-text" style={{ fontSize: '18px', fontWeight: 700 }}>VitalFlow</span>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94a3b8', padding: '4px',
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 12px 16px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 600, color: '#475569',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            padding: '0 12px', marginBottom: '12px',
          }}>
            Menu
          </div>

          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  color: active ? '#ffffff' : '#94a3b8',
                  background: active
                    ? 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))'
                    : 'transparent',
                  border: active
                    ? '1px solid rgba(139,92,246,0.2)'
                    : '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <item.icon size={18} style={{ color: active ? '#a78bfa' : 'inherit', flexShrink: 0 }} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User card at bottom */}
        <div style={{
          margin: '0 12px 12px',
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '12px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || ''}
              </div>
            </div>
          </div>

          {/* About Us Button */}
          <button
            onClick={() => setShowAbout(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '14px', color: '#94a3b8',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'color 0.2s ease',
              padding: 0, marginBottom: '10px',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <FiInfo size={16} /> About Us
          </button>

          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '14px', color: '#94a3b8',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'color 0.2s ease', padding: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fb7185'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <FiLogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* About Us Overlay */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setShowAbout(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'rgba(10,10,26,0.97)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '36px 32px',
                width: '90%', maxWidth: '420px',
                boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
              }}
            >
              {/* Avatar + Name */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
                <div style={{
                  width: '68px', height: '68px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', fontWeight: 700, color: 'white',
                  marginBottom: '14px',
                  boxShadow: '0 0 28px rgba(139,92,246,0.45)',
                }}>
                  S
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'white', letterSpacing: '0.01em' }}>Saksham</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Creator &amp; Developer</div>
              </div>

              {/* Info rows */}
              {[
                { label: 'Education',  value: 'B.Tech — 1st Year' },
                { label: 'University', value: 'Chitkara University' },
                { label: 'Project',    value: 'VitalFlow — Health & Wellness' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px', padding: '12px 16px', marginBottom: '10px',
                }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
                  <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500 }}>{value}</span>
                </div>
              ))}

              {/* Tech stack */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px', padding: '14px 16px', marginBottom: '22px',
              }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Languages &amp; Technologies</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['React', 'Vite', 'JavaScript', 'JSX', 'CSS', 'HTML', 'Node.js', 'Framer Motion'].map(tech => (
                    <span key={tech} style={{
                      padding: '4px 11px',
                      background: 'rgba(139,92,246,0.15)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      borderRadius: '20px',
                      fontSize: '12px', color: '#a78bfa', fontWeight: 500,
                    }}>{tech}</span>
                  ))}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowAbout(false)}
                style={{
                  width: '100%', padding: '11px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0', fontSize: '14px', fontWeight: 500,
                  cursor: 'pointer', transition: 'background 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive CSS */}
      <style>{`
        .sidebar-panel {
          transform: translateX(0);
        }
        @media (max-width: 1023px) {
          .sidebar-panel {
            transform: translateX(-100%);
          }
          .sidebar-panel.sidebar-open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
