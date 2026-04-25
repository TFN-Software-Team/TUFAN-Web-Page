import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sections from './components/Sections';
import Modals from './components/Modals';

export default function App() {
  const [activeModal, setActiveModal] = useState(null);

  const openAdminModal = () => setActiveModal('admin');
  const openApplicationModal = () => setActiveModal('application');
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <Navbar 
        onOpenAdminModal={openAdminModal} 
        onOpenApplicationModal={openApplicationModal} 
      />
      
      <main>
        <Sections />
      </main>

      <Modals 
        activeModal={activeModal} 
        onClose={closeModal} 
      />
    </>
  );
}
