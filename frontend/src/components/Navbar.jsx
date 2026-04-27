import React, { useState, useEffect } from 'react';
import { Moon, Sun, LogOut, Settings, X, Menu } from 'lucide-react';

export default function Navbar({ onOpenAdminModal, onOpenApplicationModal, isAdmin, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    if (document.documentElement.classList.contains('dark')) setIsDark(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{ zIndex: 50 }}>
        <div className="container nav-container">

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="#"
              className="nav-logo"
              onClick={() => { isAdmin && onLogout(); closeMobile(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <img
                src="/tufan.jpg"
                alt="TUFAN"
                style={{ height: '50px', width: '50px', objectFit: 'contain', borderRadius: '50%', filter: isDark ? 'invert(1)' : 'none', transition: 'filter 0.3s ease' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '800', lineHeight: '1' }}>TUFAN</span>
                <span style={{ fontSize: '0.65rem', fontWeight: '400', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>ELEKTROMOBİL</span>
              </div>
              {isAdmin && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>ADMIN</span>}
            </a>
          </div>

          {/* Desktop nav links */}
          <div className="nav-links">
            {!isAdmin ? (
              <>
                <a href="#about" className="nav-link">Biz Kimiz</a>
                <a href="#projects" className="nav-link">Projeler</a>
                <a href="#media" className="nav-link">Medya</a>
                <button onClick={onOpenApplicationModal} className="btn btn-primary">Başvuru Yap</button>
              </>
            ) : (
              <button onClick={onLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={16} /> Çıkış Yap
              </button>
            )}

            <button onClick={toggleTheme} className="btn-icon" title="Tema Değiştir" style={{ marginLeft: '1rem' }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin giriş — desktop dropdown */}
            {!isAdmin && (
              <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
                <button
                  onClick={onOpenAdminModal}
                  className="btn-icon"
                  title="Admin Girişi"
                >
                  <Settings size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile: theme + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="mobile-actions">
            <button onClick={toggleTheme} className="btn-icon" title="Tema Değiştir">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className={`nav-hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menüyü aç/kapat"
            >
              <span />
              <span />
              <span />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div className={`nav-mobile-menu ${mobileOpen ? 'open' : ''}`} style={{ backgroundColor: 'var(--bg-color)' }}>
        {/* Close button */}
        <button
          onClick={closeMobile}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
        >
          <X size={28} />
        </button>

        {!isAdmin ? (
          <>
            <a href="#about" className="nav-mobile-link" onClick={closeMobile}>Biz Kimiz</a>
            <a href="#projects" className="nav-mobile-link" onClick={closeMobile}>Projeler</a>
            <a href="#media" className="nav-mobile-link" onClick={closeMobile}>Medya</a>
            <button
              onClick={() => { onOpenApplicationModal(); closeMobile(); }}
              className="btn btn-primary"
              style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}
            >
              Başvuru Yap
            </button>
            <button
              onClick={() => { onOpenAdminModal(); closeMobile(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              <Settings size={15} /> Admin Girişi
            </button>
          </>
        ) : (
          <>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Admin Paneli</span>
            <button
              onClick={() => { onLogout(); closeMobile(); }}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: '0.85rem 2rem' }}
            >
              <LogOut size={16} /> Çıkış Yap
            </button>
          </>
        )}
      </div>
    </>
  );
}
