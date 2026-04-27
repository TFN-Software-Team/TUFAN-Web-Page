import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import API_BASE from '../config';

const MAX_CHARS = 3000;
const CLASS_OPTIONS = ['Hazırlık', '1', '2', '3', '4', '5', '6', 'Yüksek Lisans', 'Diğer'];

export default function Modals({ activeModal, onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    faculty: '',
    department: '',
    student_class: '',
    reason: '',
    about_me: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const appsOpen = localStorage.getItem('site_apps_open') !== 'false';

  // Only allow letters and spaces for name fields
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    const cleaned = value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜâÂîÎûÛ\s]/g, '');
    setFormData({ ...formData, [name]: cleaned });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  // Phone mask: (05XX) XXX XX XX
  const formatPhone = (raw) => {
    const digits = raw.replace(/\D/g, '');
    let result = '';
    if (digits.length > 0) result += '(' + digits.substring(0, Math.min(4, digits.length));
    if (digits.length >= 4) result += ') ';
    if (digits.length > 4) result += digits.substring(4, Math.min(7, digits.length));
    if (digits.length > 7) result += ' ' + digits.substring(7, Math.min(9, digits.length));
    if (digits.length > 9) result += ' ' + digits.substring(9, Math.min(11, digits.length));
    return result;
  };

  const handlePhoneChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    if (rawDigits.length <= 11) {
      setFormData({ ...formData, phone: rawDigits });
    }
    if (errors.phone) setErrors({ ...errors, phone: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleLimitedChange = (e) => {
    const { name, value } = e.target;
    if (value.length <= MAX_CHARS) {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'Ad alanı zorunludur.';
    if (!formData.last_name.trim()) newErrors.last_name = 'Soyad alanı zorunludur.';
    
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      newErrors.phone = 'Telefon numarası 11 haneli olmalıdır.';
    } else if (!phoneDigits.startsWith('05')) {
      newErrors.phone = 'Telefon numarası 05 ile başlamalıdır.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz.';
    }

    if (!formData.faculty.trim()) newErrors.faculty = 'Fakülte alanı zorunludur.';
    if (!formData.department.trim()) newErrors.department = 'Bölüm alanı zorunludur.';
    if (!formData.student_class) newErrors.student_class = 'Sınıf seçimi zorunludur.';
    if (!formData.reason.trim()) newErrors.reason = 'Bu alan zorunludur.';
    if (!formData.about_me.trim()) newErrors.about_me = 'Bu alan zorunludur.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE}/applications/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, phone: formatPhone(formData.phone) }),
      });

      if (response.ok) {
        onClose();
        setFormData({ first_name: '', last_name: '', phone: '', email: '', faculty: '', department: '', student_class: '', reason: '', about_me: '' });
        setErrors({});
      } else {
        alert('Başvuru sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Sunucuya bağlanırken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    if (username === 'admin' && password === 'admin') {
      if(onLoginSuccess) onLoginSuccess();
    } else {
      alert('Hatalı kullanıcı adı veya şifre!');
    }
  };

  if (!activeModal) return null;

  const errorStyle = { fontSize: '0.75rem', color: '#ef4444', marginTop: '0.3rem' };
  const counterStyle = { fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', opacity: 0.7 };

  return (
    <div className={`modal-overlay ${activeModal ? 'active' : ''}`} onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={activeModal === 'application' ? { maxWidth: '800px' } : { maxWidth: '400px' }}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {activeModal === 'admin' && (
          <div className="animate-fade-in">
            <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Admin Girişi</h2>
            <form onSubmit={handleAdminSubmit}>
              <div className="form-group">
                <label className="form-label">Kullanıcı Adı</label>
                <input type="text" name="username" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Şifre</label>
                <input type="password" name="password" className="form-input" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Giriş Yap
              </button>
            </form>
          </div>
        )}

        {activeModal === 'application' && (
          <div className="animate-fade-in">
            <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Başvuru Formu</h2>
            
            {!appsOpen ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <Lock size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Başvurular Geçici Olarak Kapalıdır</h3>
                <p style={{ color: 'var(--text-secondary)' }}>TUFAN Elektromobil ekibine gösterdiğiniz ilgi için teşekkür ederiz. Şu an yeni başvuru kabul edilmemektedir.</p>
                <button onClick={onClose} className="btn btn-outline" style={{ marginTop: '2rem' }}>Kapat</button>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} noValidate>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
                  {/* Ad */}
                  <div className="form-group">
                    <label className="form-label">Ad</label>
                    <input 
                      type="text" name="first_name" className="form-input" 
                      value={formData.first_name} onChange={handleNameChange} 
                      placeholder="Adınız"
                      style={errors.first_name ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.first_name && <div style={errorStyle}>{errors.first_name}</div>}
                  </div>
                  {/* Soyad */}
                  <div className="form-group">
                    <label className="form-label">Soyad</label>
                    <input 
                      type="text" name="last_name" className="form-input" 
                      value={formData.last_name} onChange={handleNameChange} 
                      placeholder="Soyadınız"
                      style={errors.last_name ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.last_name && <div style={errorStyle}>{errors.last_name}</div>}
                  </div>
                  
                  {/* Telefon */}
                  <div className="form-group">
                    <label className="form-label">Telefon No</label>
                    <input 
                      type="tel" name="phone" className="form-input" 
                      value={formData.phone ? formatPhone(formData.phone) : ''}
                      onChange={handlePhoneChange}
                      placeholder="(05__) ___ __ __"
                      style={errors.phone ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
                  </div>
                  {/* E-posta */}
                  <div className="form-group">
                    <label className="form-label">E-posta</label>
                    <input 
                      type="email" name="email" className="form-input" 
                      value={formData.email} onChange={handleChange} 
                      placeholder="ornek@mail.com"
                      style={errors.email ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.email && <div style={errorStyle}>{errors.email}</div>}
                  </div>

                  {/* Fakülte */}
                  <div className="form-group">
                    <label className="form-label">Fakülte</label>
                    <input 
                      type="text" name="faculty" className="form-input" 
                      value={formData.faculty} onChange={handleChange} 
                      placeholder="Fakülteniz"
                      style={errors.faculty ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.faculty && <div style={errorStyle}>{errors.faculty}</div>}
                  </div>
                  {/* Bölüm */}
                  <div className="form-group">
                    <label className="form-label">Bölüm</label>
                    <input 
                      type="text" name="department" className="form-input" 
                      value={formData.department} onChange={handleChange} 
                      placeholder="Bölümünüz"
                      style={errors.department ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.department && <div style={errorStyle}>{errors.department}</div>}
                  </div>
                </div>

                {/* Sınıf - Dropdown */}
                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="form-label">Sınıf</label>
                  <select 
                    name="student_class" className="form-input" 
                    value={formData.student_class} onChange={handleChange}
                    style={{ width: '50%', ...(errors.student_class ? { borderColor: '#ef4444' } : {}) }}
                  >
                    <option value="" disabled>Sınıf seçiniz</option>
                    {CLASS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.student_class && <div style={errorStyle}>{errors.student_class}</div>}
                </div>

                {/* Neden TUFAN */}
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label className="form-label">Neden TUFAN'ı Seçtin?</label>
                  <textarea 
                    name="reason" className="form-textarea" 
                    value={formData.reason} onChange={handleLimitedChange}
                    maxLength={MAX_CHARS}
                    placeholder="Neden TUFAN'da yer almak istiyorsunuz?"
                    style={errors.reason ? { borderColor: '#ef4444' } : {}}
                  ></textarea>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {errors.reason ? <div style={errorStyle}>{errors.reason}</div> : <div></div>}
                    <div style={counterStyle}>{formData.reason.length}/{MAX_CHARS}</div>
                  </div>
                </div>

                {/* Kendinden Bahset */}
                <div className="form-group">
                  <label className="form-label">Kendinden Bahset</label>
                  <textarea 
                    name="about_me" className="form-textarea" 
                    value={formData.about_me} onChange={handleLimitedChange}
                    maxLength={MAX_CHARS}
                    placeholder="Kendinizden kısaca bahsedin..."
                    style={errors.about_me ? { borderColor: '#ef4444' } : {}}
                  ></textarea>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {errors.about_me ? <div style={errorStyle}>{errors.about_me}</div> : <div></div>}
                    <div style={counterStyle}>{formData.about_me.length}/{MAX_CHARS}</div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
