import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import API_BASE from '../config';

const CLASS_OPTIONS = ['Hazırlık', '1', '2', '3', '4', '5', '6', 'Yüksek Lisans', 'Diğer'];
const CLASS_OPTIONS_EN = ['Prep', '1', '2', '3', '4', '5', '6', 'Graduate', 'Other'];
const MAX_CHARS = 3000;

export default function Modals({ activeModal, onClose, onLoginSuccess, lang }) {
  const classOptions = lang === 'tr' ? CLASS_OPTIONS : CLASS_OPTIONS_EN;

  const t = {
    // Admin modal
    adminTitle: lang === 'tr' ? 'Admin Girişi' : 'Admin Login',
    username: lang === 'tr' ? 'Kullanıcı Adı' : 'Username',
    password: lang === 'tr' ? 'Şifre' : 'Password',
    loginBtn: lang === 'tr' ? 'Giriş Yap' : 'Sign In',
    wrongCredentials: lang === 'tr' ? 'Hatalı kullanıcı adı veya şifre!' : 'Incorrect username or password!',

    // Application modal
    appTitle: lang === 'tr' ? 'Takım Başvuru Formu' : 'Team Application Form',
    appsClosedTitle: lang === 'tr' ? 'Başvurular Henüz Açılmadı' : 'Applications Not Open Yet',
    appsClosedDesc: lang === 'tr'
      ? 'TUFAN Elektromobil takımı yeni dönem başvuruları şu anda kapalıdır. Gelişmeler için bizi takip etmeye devam edin.'
      : 'TUFAN Electric Vehicle Team applications for the new term are currently closed. Stay tuned for updates.',
    close: lang === 'tr' ? 'Kapat' : 'Close',

    // Form fields
    firstName: lang === 'tr' ? 'Adınız' : 'First Name',
    lastName: lang === 'tr' ? 'Soyadınız' : 'Last Name',
    phone: lang === 'tr' ? 'Telefon Numarası' : 'Phone Number',
    email: lang === 'tr' ? 'E-posta Adresi' : 'Email Address',
    faculty: lang === 'tr' ? 'Fakülte' : 'Faculty',
    department: lang === 'tr' ? 'Bölüm' : 'Department',
    studentClass: lang === 'tr' ? 'Sınıf' : 'Year / Class',
    selectClass: lang === 'tr' ? 'Sınıfınızı Seçiniz' : 'Select your year',
    teamLabel: lang === 'tr' ? 'Başvurmak İstediğiniz Ekip' : 'Team You Want to Apply For',
    selectTeam: lang === 'tr' ? 'Ekip Seçiniz' : 'Select a Team',
    noActiveTeams: lang === 'tr' ? 'Aktif alım yapan ekip bulunmamaktadır' : 'No teams are currently recruiting',
    whyTufan: lang === 'tr' ? 'Neden TUFAN Takımına Katılmak İstiyorsunuz?' : 'Why Do You Want to Join the TUFAN Team?',
    whyPlaceholder: lang === 'tr' ? 'Motivasyonunuzu ve beklentilerinizi açıklayınız...' : 'Describe your motivation and expectations...',
    aboutMe: lang === 'tr' ? 'Kendinizden ve Deneyimlerinizden Bahsedin' : 'Tell Us About Yourself and Your Experience',
    aboutMePlaceholder: lang === 'tr' ? 'Daha önceki projeleriniz, yetenekleriniz ve ilgi alanlarınız...' : 'Previous projects, skills, and areas of interest...',
    submit: lang === 'tr' ? 'Başvuruyu Gönder' : 'Submit Application',
    submitting: lang === 'tr' ? 'Gönderiliyor...' : 'Submitting...',
    successMsg: lang === 'tr' ? 'Başvurunuz başarıyla alınmıştır! Teşekkür ederiz.' : 'Your application has been received successfully! Thank you.',

    // Placeholders
    firstNamePlaceholder: lang === 'tr' ? 'Ahmet' : 'John',
    lastNamePlaceholder: lang === 'tr' ? 'Yılmaz' : 'Smith',
    facultyPlaceholder: lang === 'tr' ? 'Mühendislik Fakültesi' : 'Faculty of Engineering',
    departmentPlaceholder: lang === 'tr' ? 'Bilgisayar Mühendisliği' : 'Computer Engineering',

    // Validation errors
    errFirstName: lang === 'tr' ? 'Lütfen adınızı giriniz.' : 'Please enter your first name.',
    errLastName: lang === 'tr' ? 'Lütfen soyadınızı giriniz.' : 'Please enter your last name.',
    errPhone11: lang === 'tr' ? 'Telefon numarası 11 haneli olmalıdır (05XX...)' : 'Phone number must be 11 digits (05XX...)',
    errPhone05: lang === 'tr' ? 'Telefon numarası 05 ile başlamalıdır' : 'Phone number must start with 05',
    errEmail: lang === 'tr' ? 'Geçerli bir e-posta adresi giriniz.' : 'Please enter a valid email address.',
    errFaculty: lang === 'tr' ? 'Fakülte alanı gereklidir.' : 'Faculty field is required.',
    errDepartment: lang === 'tr' ? 'Bölüm alanı gereklidir.' : 'Department field is required.',
    errClass: lang === 'tr' ? 'Sınıf seçimi gereklidir.' : 'Year/class selection is required.',
    errTeam: lang === 'tr' ? 'Ekip seçimi gereklidir.' : 'Team selection is required.',
    errRequired: lang === 'tr' ? 'Bu alan zorunludur.' : 'This field is required.',
  };

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    faculty: '',
    department: '',
    student_class: '',
    team: '',
    reason: '',
    about_me: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const appsOpen = localStorage.getItem('site_apps_open') !== 'false';

  const DEFAULT_TEAMS = [
    { id: 1, name: 'Batarya Ekibi', active: true },
    { id: 2, name: 'Yazılım Ekibi', active: true },
    { id: 3, name: 'Motor Ekibi', active: true },
    { id: 4, name: 'Motor Sürücü Ekibi', active: true },
    { id: 5, name: 'Yerleşik Şarj Ekibi', active: true },
    { id: 6, name: 'Mekanik Ekibi', active: true }
  ];

  const savedTeamsRaw = localStorage.getItem('site_teams');
  const teamsData = savedTeamsRaw ? JSON.parse(savedTeamsRaw) : DEFAULT_TEAMS;

  const activeTeams = teamsData
    .filter(tm => tm.active)
    .map(tm => tm.name)
    .sort((a, b) => a.localeCompare(b, 'tr'));

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

    if (!formData.first_name.trim()) newErrors.first_name = t.errFirstName;
    if (!formData.last_name.trim()) newErrors.last_name = t.errLastName;

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      newErrors.phone = t.errPhone11;
    } else if (!phoneDigits.startsWith('05')) {
      newErrors.phone = t.errPhone05;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = t.errEmail;
    }

    if (!formData.faculty.trim()) newErrors.faculty = t.errFaculty;
    if (!formData.department.trim()) newErrors.department = t.errDepartment;
    if (!formData.student_class) newErrors.student_class = t.errClass;
    if (!formData.team) newErrors.team = t.errTeam;
    if (!formData.reason.trim()) newErrors.reason = t.errRequired;
    if (!formData.about_me.trim()) newErrors.about_me = t.errRequired;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const payload = { ...formData, phone: formatPhone(formData.phone) };

    const saveToLocalStorage = (appData) => {
      try {
        const existing = JSON.parse(localStorage.getItem('site_local_applications') || '[]');
        const newApp = { id: appData.id || Date.now(), ...appData };
        const filtered = existing.filter(a => !(a.email === newApp.email && a.phone === newApp.phone));
        const updated = [newApp, ...filtered];
        localStorage.setItem('site_local_applications', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving local application backup:', err);
      }
    };

    try {
      const response = await fetch(`${API_BASE}/applications/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const resultData = await response.json();
        saveToLocalStorage(resultData);
      } else {
        saveToLocalStorage({ id: Date.now(), ...payload });
      }

      alert(t.successMsg);
      onClose();
      setFormData({ first_name: '', last_name: '', phone: '', email: '', faculty: '', department: '', student_class: '', team: '', reason: '', about_me: '' });
      setErrors({});
    } catch (error) {
      console.error('Error submitting application:', error);
      saveToLocalStorage({ id: Date.now(), ...payload });
      alert(t.successMsg);
      onClose();
      setFormData({ first_name: '', last_name: '', phone: '', email: '', faculty: '', department: '', student_class: '', team: '', reason: '', about_me: '' });
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === 'admin' && password === '1234') {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      alert(t.wrongCredentials);
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
            <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>{t.adminTitle}</h2>
            <form onSubmit={handleAdminSubmit}>
              <div className="form-group">
                <label className="form-label">{t.username}</label>
                <input type="text" name="username" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">{t.password}</label>
                <input type="password" name="password" className="form-input" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                {t.loginBtn}
              </button>
            </form>
          </div>
        )}

        {activeModal === 'application' && (
          <div className="animate-fade-in">
            <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>{t.appTitle}</h2>

            {!appsOpen ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <Lock size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t.appsClosedTitle}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{t.appsClosedDesc}</p>
                <button onClick={onClose} className="btn btn-outline" style={{ marginTop: '2rem' }}>{t.close}</button>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} noValidate>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 2rem' }}>
                  {/* Ad */}
                  <div className="form-group">
                    <label className="form-label">{t.firstName}</label>
                    <input
                      type="text" name="first_name" className="form-input"
                      value={formData.first_name} onChange={handleNameChange}
                      placeholder={t.firstNamePlaceholder}
                      style={errors.first_name ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.first_name && <div style={errorStyle}>{errors.first_name}</div>}
                  </div>
                  {/* Soyad */}
                  <div className="form-group">
                    <label className="form-label">{t.lastName}</label>
                    <input
                      type="text" name="last_name" className="form-input"
                      value={formData.last_name} onChange={handleNameChange}
                      placeholder={t.lastNamePlaceholder}
                      style={errors.last_name ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.last_name && <div style={errorStyle}>{errors.last_name}</div>}
                  </div>

                  {/* Telefon */}
                  <div className="form-group">
                    <label className="form-label">{t.phone}</label>
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
                    <label className="form-label">{t.email}</label>
                    <input
                      type="email" name="email" className="form-input"
                      value={formData.email} onChange={handleChange}
                      placeholder="example@mail.com"
                      style={errors.email ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.email && <div style={errorStyle}>{errors.email}</div>}
                  </div>

                  {/* Fakülte */}
                  <div className="form-group">
                    <label className="form-label">{t.faculty}</label>
                    <input
                      type="text" name="faculty" className="form-input"
                      value={formData.faculty} onChange={handleChange}
                      placeholder={t.facultyPlaceholder}
                      style={errors.faculty ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.faculty && <div style={errorStyle}>{errors.faculty}</div>}
                  </div>
                  {/* Bölüm */}
                  <div className="form-group">
                    <label className="form-label">{t.department}</label>
                    <input
                      type="text" name="department" className="form-input"
                      value={formData.department} onChange={handleChange}
                      placeholder={t.departmentPlaceholder}
                      style={errors.department ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.department && <div style={errorStyle}>{errors.department}</div>}
                  </div>
                </div>

                {/* Sınıf - Dropdown */}
                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="form-label">{t.studentClass}</label>
                  <select
                    name="student_class" className="form-input"
                    value={formData.student_class} onChange={handleChange}
                    style={{ width: '100%', ...(errors.student_class ? { borderColor: '#ef4444' } : {}) }}
                  >
                    <option value="" disabled>{t.selectClass}</option>
                    {classOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.student_class && <div style={errorStyle}>{errors.student_class}</div>}
                </div>

                {/* Ekip Seçimi */}
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">{t.teamLabel}</label>
                  <select
                    name="team" className="form-input"
                    value={formData.team} onChange={handleChange}
                    style={{ width: '100%', ...(errors.team ? { borderColor: '#ef4444' } : {}) }}
                  >
                    <option value="" disabled>{t.selectTeam}</option>
                    {activeTeams.length > 0 ? (
                      activeTeams.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))
                    ) : (
                      <option disabled>{t.noActiveTeams}</option>
                    )}
                  </select>
                  {errors.team && <div style={errorStyle}>{errors.team}</div>}
                </div>

                {/* Neden TUFAN */}
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label className="form-label">{t.whyTufan}</label>
                  <textarea
                    name="reason" className="form-textarea"
                    value={formData.reason} onChange={handleLimitedChange}
                    maxLength={MAX_CHARS}
                    placeholder={t.whyPlaceholder}
                    style={errors.reason ? { borderColor: '#ef4444' } : {}}
                  ></textarea>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {errors.reason ? <div style={errorStyle}>{errors.reason}</div> : <div></div>}
                    <div style={counterStyle}>{formData.reason.length}/{MAX_CHARS}</div>
                  </div>
                </div>

                {/* Kendinden Bahset */}
                <div className="form-group">
                  <label className="form-label">{t.aboutMe}</label>
                  <textarea
                    name="about_me" className="form-textarea"
                    value={formData.about_me} onChange={handleLimitedChange}
                    maxLength={MAX_CHARS}
                    placeholder={t.aboutMePlaceholder}
                    style={errors.about_me ? { borderColor: '#ef4444' } : {}}
                  ></textarea>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {errors.about_me ? <div style={errorStyle}>{errors.about_me}</div> : <div></div>}
                    <div style={counterStyle}>{formData.about_me.length}/{MAX_CHARS}</div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? t.submitting : t.submit}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
