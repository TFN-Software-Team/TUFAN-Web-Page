import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, UserCircle, Send } from 'lucide-react';

export default function Navbar({ onOpenAdminModal, onOpenApplicationModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check initial theme
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

  const navLinks = [
    { name: 'Biz Kimiz', href: '#about' },
    { name: 'Projeler', href: '#projects' },
    { name: 'Medya', href: '#media' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#" className="nav-logo">TUFAN</a>

        {/* Desktop Menu */}
        <div className="nav-links" style={{ display: 'none' /* Will use media queries in real CSS or handle inline for simplicity. Let's just flex it for now */ }}>
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="nav-link">
              {link.name}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <button onClick={onOpenApplicationModal} className="btn btn-primary">
            <Send size={18} style={{ marginRight: '0.5rem' }} />
            Başvuru
          </button>
          <button onClick={onOpenAdminModal} className="btn btn-outline" title="Admin Login">
            <UserCircle size={20} />
          </button>
          <button onClick={toggleTheme} className="btn-icon">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
