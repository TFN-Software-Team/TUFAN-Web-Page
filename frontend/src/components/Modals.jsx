import React from 'react';
import { X } from 'lucide-react';

export default function Modals({ activeModal, onClose }) {
  if (!activeModal) return null;

  return (
    <div className={`modal-overlay ${activeModal ? 'active' : ''}`} onClick={onClose}>
      <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {activeModal === 'admin' && (
          <div className="animate-fade-in">
            <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Admin Girişi</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Admin girişi yapıldı!'); onClose(); }}>
              <div className="form-group">
                <label className="form-label">Kullanıcı Adı</label>
                <input type="text" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Şifre</label>
                <input type="password" className="form-input" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Giriş Yap
              </button>
            </form>
          </div>
        )}

        {activeModal === 'application' && (
          <div className="animate-fade-in">
            <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Başvuru Formu</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Başvurunuz alındı!'); onClose(); }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Ad</label>
                  <input type="text" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Soyad</label>
                  <input type="text" className="form-input" required />
                </div>
              </div>
              
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Telefon No</label>
                  <input type="tel" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">E-posta</label>
                  <input type="email" className="form-input" required />
                </div>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Fakülte</label>
                  <input type="text" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Bölüm</label>
                  <input type="text" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sınıf</label>
                  <input type="text" className="form-input" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Neden TUFAN'ı Seçtin?</label>
                <textarea className="form-textarea" required></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Kendinden Bahset</label>
                <textarea className="form-textarea" required></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Başvuruyu Gönder
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
