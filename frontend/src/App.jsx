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

  return (
    <>
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
