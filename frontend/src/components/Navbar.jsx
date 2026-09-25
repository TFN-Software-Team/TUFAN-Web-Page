import React, { useState, useEffect } from 'react';
import { Moon, Sun, LogOut, X } from 'lucide-react';
import { translations } from '../translations';

export default function Navbar({ onOpenAdminModal, onOpenApplicationModal, isAdmin, onLogout, lang, onLangChange }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark) || document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
          setIsDark(true);
        } else {
          document.documentElement.classList.remove('dark');
          setIsDark(false);
        }
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
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
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  const LangToggle = ({ mobile = false }) => (
    <button
      onClick={() => onLangChange(lang === 'tr' ? 'en' : 'tr')}
      title={lang === 'tr' ? 'Switch to English' : "Türkçe'ye Geç"}
      style={{
        background: 'none',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.3rem 0.55rem',
        fontSize: '0.8rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        letterSpacing: '0.05em',
        transition: 'all 0.2s ease',
        ...(mobile ? { width: 'fit-content', fontSize: '1rem', padding: '0.55rem 1rem' } : {}),
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
    >
      <span style={{ fontSize: mobile ? '1.3rem' : '1.1rem' }}>
        {lang === 'tr' ? '🇹🇷' : '🇬🇧'}
      </span>
      {lang === 'tr' ? 'TR' : 'EN'}
    </button>
  );

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{ zIndex: 50 }}>
        <div className="container nav-container">

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="#"
              className="nav-logo"
              onClick={() => { closeMobile(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <img
                src="/tufan.jpg"
                alt="TUFAN"
                style={{ height: '50px', width: '50px', objectFit: 'contain', borderRadius: '50%', filter: isDark ? 'invert(1)' : 'none', transition: 'filter 0.3s ease' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: '800', lineHeight: '1' }}>TUFAN</span>
                  {isAdmin && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.2rem' }}>ADMIN</span>}
                </div>
                {!isAdmin && <span style={{ fontSize: '0.65rem', fontWeight: '400', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>{t.brandSubtitle}</span>}
              </div>
            </a>
          </div>

          {/* Desktop nav links */}
          <div className="nav-links">
            {!isAdmin ? (
              <>
                <a href="#about" className="nav-link">{t.navAbout}</a>
                <a href="#projects" className="nav-link">{t.navProjects}</a>
                <a href="#media" className="nav-link">{t.navMedia}</a>
                <button onClick={onOpenApplicationModal} className="btn btn-primary">{t.navApply}</button>
              </>
            ) : (
              <button onClick={onLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={16} /> {t.navLogout}
              </button>
            )}

            <button onClick={toggleTheme} className="btn-icon" title="Tema Değiştir" style={{ marginLeft: '1rem' }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {!isAdmin && (
              <div style={{ marginLeft: '0.5rem' }}>
                <LangToggle />
              </div>
            )}

          </div>

          {/* Mobile: hamburger */}
          <div className="mobile-actions">
            <button
              onClick={toggleTheme}
              className="btn-icon"
              title="Tema Değiştir"
              style={{ marginRight: '0.5rem', padding: '0.5rem', color: 'var(--text-primary)' }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
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
            <a href="#about" className="nav-mobile-link" onClick={closeMobile}>{t.navAbout}</a>
            <a href="#projects" className="nav-mobile-link" onClick={closeMobile}>{t.navProjects}</a>
            <a href="#media" className="nav-mobile-link" onClick={closeMobile}>{t.navMedia}</a>
            <button
              onClick={() => { onOpenApplicationModal(); closeMobile(); }}
              className="btn btn-primary"
              style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}
            >
              {t.navApply}
            </button>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
              <LangToggle mobile />
              <button
                onClick={toggleTheme}
                title="Tema Değiştir"
                style={{
                  background: 'none',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1rem',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s ease',
                  width: 'fit-content',
                }}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                {lang === 'tr' ? (isDark ? 'AÇIK' : 'KARANLIK') : (isDark ? 'LIGHT' : 'DARK')}
              </button>
            </div>
          </>
        ) : (
          <>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Admin Paneli</span>
            <button
              onClick={() => { onLogout(); closeMobile(); }}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: '0.85rem 2rem' }}
            >
              <LogOut size={16} /> {t.navLogout}
            </button>

            <button
              onClick={toggleTheme}
              title="Tema Değiştir"
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1rem',
                fontSize: '1.05rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
                width: 'fit-content',
                marginTop: '1rem'
              }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              {lang === 'tr' ? (isDark ? 'AÇIK' : 'KARANLIK') : (isDark ? 'LIGHT' : 'DARK')}
            </button>
          </>
        )}
      </div>
    </>
  );
}
