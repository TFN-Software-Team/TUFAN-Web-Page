import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sections from './components/Sections';
import Modals from './components/Modals';
import AdminDashboard from './components/AdminDashboard';
import API_BASE from './config';

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lang, setLang] = useState('tr');
  const [mediaRefreshKey, setMediaRefreshKey] = useState(0);

  const openAdminModal = () => {
    if (window.location.hash !== '#admin-login') {
      window.history.pushState({ modal: 'admin' }, '', '#admin-login');
    }
    setActiveModal('admin');
  };

  const openApplicationModal = () => {
    if (window.location.hash !== '#apply') {
      window.history.pushState({ modal: 'application' }, '', '#apply');
    }
    setActiveModal('application');
  };

  const closeModal = () => {
    const hash = window.location.hash;
    if (hash === '#apply' || hash === '#admin-login') {
      window.history.back();
    } else {
      setActiveModal(null);
    }
  };

  // Sync activeModal with browser history stack (popstate / hashchange)
  useEffect(() => {
    const syncModalWithHash = () => {
      const hash = window.location.hash;
      if (hash === '#apply') {
        setActiveModal('application');
      } else if (hash === '#admin-login') {
        setActiveModal('admin');
      } else {
        setActiveModal(null);
      }
    };

    // Initial check on page load
    syncModalWithHash();

    window.addEventListener('popstate', syncModalWithHash);
    window.addEventListener('hashchange', syncModalWithHash);
    return () => {
      window.removeEventListener('popstate', syncModalWithHash);
      window.removeEventListener('hashchange', syncModalWithHash);
    };
  }, []);

  // Close active modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeModal) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    closeModal();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
    // Admin panelinden çıkışta medyayı yeniden yükle
    setMediaRefreshKey(prev => prev + 1);
  };

  // Render.com'daki backend uyku modundaysa uyandır
  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        // Sessizce arka planda backend'e ping at
        await fetch(`${API_BASE}/media/`, { signal: AbortSignal.timeout(30000) });
      } catch (e) {
        // Sessizce devam et - sadece uyandırmak için
      }
    };
    wakeUpBackend();
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const progress = document.getElementById('scroll-progress');
      if (progress) progress.style.width = scrolled + '%';
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reveal animations on scroll
  React.useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => revealElements.forEach(el => observer.unobserve(el));
  }, [isAdmin]);

  return (
    <>
      <div id="scroll-progress"></div>
      <Navbar
        onOpenAdminModal={openAdminModal}
        onOpenApplicationModal={openApplicationModal}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        lang={lang}
        onLangChange={setLang}
      />

      <main>
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <Sections
            onOpenAdminModal={openAdminModal}
            onOpenApplicationModal={openApplicationModal}
            lang={lang}
            mediaRefreshKey={mediaRefreshKey}
          />
        )}
      </main>

      <Modals
        activeModal={activeModal}
        onClose={closeModal}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />
    </>
  );
}
