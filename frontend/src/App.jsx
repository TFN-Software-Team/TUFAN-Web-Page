import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sections from './components/Sections';
import Modals from './components/Modals';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const openAdminModal = () => setActiveModal('admin');
  const openApplicationModal = () => setActiveModal('application');
  const closeModal = () => setActiveModal(null);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    closeModal();
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

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
      />
      
      <main>
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <Sections />
        )}
      </main>

      <Modals 
        activeModal={activeModal} 
        onClose={closeModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
