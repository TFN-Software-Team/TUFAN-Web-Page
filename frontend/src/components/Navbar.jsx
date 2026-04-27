import React, { useState, useEffect } from 'react';
import { Moon, Sun, MoreVertical, LogOut, Settings } from 'lucide-react';

export default function Navbar({ onOpenAdminModal, onOpenApplicationModal, isAdmin, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="#" className="nav-logo" onClick={() => isAdmin && onLogout()} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/tufan.jpg" alt="TUFAN" style={{ height: '50px', width: '50px', objectFit: 'contain', borderRadius: '50%', filter: isDark ? 'invert(1)' : 'none', transition: 'filter 0.3s ease' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '800', lineHeight: '1' }}>TUFAN</span>
              <span style={{ fontSize: '0.65rem', fontWeight: '400', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>ELEKTROMOBİL</span>
            </div>
            {isAdmin && <span style={{fontSize:'0.8rem', color:'var(--text-secondary)', marginLeft: '0.5rem'}}>ADMIN</span>}
          </a>
        </div>

        <div className="nav-links">
          {!isAdmin ? (
            <>
              <a href="#about" className="nav-link">Biz Kimiz</a>
              <a href="#projects" className="nav-link">Projeler</a>
              <a href="#media" className="nav-link">Medya</a>
              <button onClick={onOpenApplicationModal} className="btn btn-primary">
                Başvuru Yap
              </button>
            </>
          ) : (
            <button onClick={onLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Çıkış Yap
            </button>
          )}
          
          <button onClick={toggleTheme} className="btn-icon" title="Tema Değiştir" style={{ marginLeft: '1rem' }}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!isAdmin && (
            <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
              <button onClick={() => setShowDropdown(!showDropdown)} className="btn-icon" title="Daha Fazla">
                <MoreVertical size={18} />
              </button>
              {showDropdown && (
                <div className="premium-card animate-fade-in" style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: 0, 
                  marginTop: '0.5rem', 
                  minWidth: '150px', 
                  padding: '0.5rem', 
                  zIndex: 1000,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}>
                  <button 
                    onClick={() => { onOpenAdminModal(); setShowDropdown(false); }} 
                    style={{ 
                      width: '100%', 
                      textAlign: 'left', 
                      padding: '0.75rem 1rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    className="hover:bg-gray-50"
                  >
                    <Settings size={16} /> Admin Girişi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
