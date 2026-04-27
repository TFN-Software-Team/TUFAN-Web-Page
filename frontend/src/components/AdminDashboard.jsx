import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, Download, X, Trash2, Edit, Save, CheckCircle, XCircle } from 'lucide-react';
import API_BASE from '../config';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('about');

  // Data States
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [projects, setProjects] = useState([]);

  // Pagination State for Applications
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [showMediaModal, setShowMediaModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: null });

  // LocalStorage States
  const [aboutText, setAboutText] = useState(() => localStorage.getItem('site_about_text') || 'TUFAN, teknoloji ve verimliliği merkeze alan kurumsal bir öğrenci ağıdır...');
  const [heroTitle1, setHeroTitle1] = useState(() => localStorage.getItem('site_hero_title1') || 'Dijital Çözümler.');
  const [heroTitle2, setHeroTitle2] = useState(() => localStorage.getItem('site_hero_title2') || 'Maksimum Etki.');
  const [mediaItems, setMediaItems] = useState(() => JSON.parse(localStorage.getItem('site_media_items')) || [
    { id: 1, title: 'HACKATHON 2025' },
    { id: 2, title: 'KURUMSAL TANITIM' },
    { id: 3, title: 'BASIN KİTİ' }
  ]);
  const [socialLinks, setSocialLinks] = useState(() => JSON.parse(localStorage.getItem('site_social_links')) || {
    instagram: 'https://instagram.com/tufan',
    linkedin: 'https://linkedin.com/company/tufan'
  });
  const [featureCards, setFeatureCards] = useState(() => JSON.parse(localStorage.getItem('site_feature_cards')) || [
    { id: 1, title: 'Bütünleşik Altyapı', description: 'Farklı disiplinlerden gelen yetenekleri tek bir sistem altında birleştirerek yüksek performanslı bir ağ oluşturuyoruz.' },
    { id: 2, title: 'İleri Teknoloji', description: 'Modern framework\'ler ve ölçeklenebilir mimariler ile sektörel standartlarda ürünler geliştiriyoruz.' },
    { id: 3, title: 'Güvenilirlik', description: 'Sistemlerimiz, yüksek trafikli kampüs gereksinimlerini karşılamak üzere kesintisiz ve güvenli şekilde tasarlanmıştır.' }
  ]);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });

  const [appsOpen, setAppsOpen] = useState(() => {
    const saved = localStorage.getItem('site_apps_open');
    return saved === null ? true : saved === 'true';
  });

  // Forms State
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [newMediaTitle, setNewMediaTitle] = useState('');

  // Helper to format date
  const getNowString = () => new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // --- FEATURE CARDS ---
  const openFeatureModal = (feature = null) => {
    if (feature) {
      setEditingFeature(feature);
      setNewFeature({ title: feature.title, description: feature.description });
    } else {
      setEditingFeature(null);
      setNewFeature({ title: '', description: '' });
    }
    setShowFeatureModal(true);
  };

  const handleSaveFeature = (e) => {
    e.preventDefault();
    let updated;
    if (editingFeature) {
      updated = featureCards.map(f => f.id === editingFeature.id ? { ...f, title: newFeature.title, description: newFeature.description } : f);
    } else {
      updated = [...featureCards, { id: Date.now(), title: newFeature.title, description: newFeature.description }];
    }
    setFeatureCards(updated);
    localStorage.setItem('site_feature_cards', JSON.stringify(updated));
    localStorage.setItem('last_mod_features', getNowString());
    setShowFeatureModal(false);
  };

  const handleDeleteFeature = (id) => {
    requestConfirm('Özellik kartını silmek istediğinize emin misiniz?', () => {
      const updated = featureCards.filter(f => f.id !== id);
      setFeatureCards(updated);
      localStorage.setItem('site_feature_cards', JSON.stringify(updated));
      localStorage.setItem('last_mod_features', getNowString());
    });
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch('${API_BASE}/applications/');
      if (res.ok) setApplications(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('${API_BASE}/projeler/');
      if (res.ok) setProjects(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
      setSelectedApplication(null);
      setCurrentPage(1);
    }
    if (activeTab === 'projects') fetchProjects();
  }, [activeTab]);

  const exportToCSV = () => {
    const headers = ['ID', 'Ad', 'Soyad', 'Telefon', 'E-posta', 'Fakulte', 'Bolum', 'Sinif', 'Neden Tufan', 'Kendinden Bahset'];
    const csvData = applications.map(app => {
      const safeReason = `"${app.reason?.replace(/"/g, '""') || ''}"`;
      const safeAbout = `"${app.about_me?.replace(/"/g, '""') || ''}"`;
      return [app.id, app.first_name, app.last_name, app.phone, app.email, app.faculty, app.department, app.student_class, safeReason, safeAbout].join(',');
    });

    const csvContent = ["\ufeff" + headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tufan_basvurular.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const requestConfirm = (message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal({ isOpen: false, message: '', onConfirm: null });
      }
    });
  };

  // Handlers
  const handleSaveAbout = (e) => {
    e.preventDefault();
    localStorage.setItem('site_about_text', aboutText);
    localStorage.setItem('site_hero_title1', heroTitle1);
    localStorage.setItem('site_hero_title2', heroTitle2);
    localStorage.setItem('last_mod_about', getNowString());
  };

  const handleSaveSocial = (e) => {
    e.preventDefault();
    localStorage.setItem('site_social_links', JSON.stringify(socialLinks));
  };

  const toggleAppsOpen = () => {
    const newVal = !appsOpen;
    setAppsOpen(newVal);
    localStorage.setItem('site_apps_open', newVal);
  };

  // --- PROJECTS ---
  const openProjectModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setNewProject({ title: project.title, description: project.description });
    } else {
      setEditingProject(null);
      setNewProject({ title: '', description: '' });
    }
    setShowProjectModal(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const url = editingProject
        ? `${API_BASE}/projeler/${editingProject.id}`
        : `${API_BASE}/projeler/`;
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        setShowProjectModal(false);
        fetchProjects();
      }
    } catch (err) { alert('Hata oluştu.'); }
  };

  const handleDeleteProject = (id) => {
    requestConfirm("Bu projeyi kalıcı olarak silmek istediğinize emin misiniz?", async () => {
      try {
        const res = await fetch(`${API_BASE}/projeler/${id}`, { method: 'DELETE' });
        if (res.ok) fetchProjects();
      } catch (err) { alert('Hata oluştu.'); }
    });
  };

  const handleDeleteAllProjects = () => {
    requestConfirm("Tüm projeleri kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.", async () => {
      try {
        const res = await fetch(`${API_BASE}/projeler/`, { method: 'DELETE' });
        if (res.ok) fetchProjects();
      } catch (err) { alert('Hata oluştu.'); }
    });
  };

  // --- MEDIA ---
  const openMediaModal = (media = null) => {
    if (media) {
      setEditingMedia(media);
      setNewMediaTitle(media.title);
    } else {
      setEditingMedia(null);
      setNewMediaTitle('');
    }
    setShowMediaModal(true);
  };

  const handleSaveMedia = (e) => {
    e.preventDefault();
    let updated;
    if (editingMedia) {
      updated = mediaItems.map(m => m.id === editingMedia.id ? { ...m, title: newMediaTitle } : m);
    } else {
      updated = [...mediaItems, { id: Date.now(), title: newMediaTitle }];
    }
    setMediaItems(updated);
    localStorage.setItem('site_media_items', JSON.stringify(updated));
    setShowMediaModal(false);
  };

  const handleDeleteMedia = (id) => {
    requestConfirm("Bu medyayı kalıcı olarak silmek istediğinize emin misiniz?", () => {
      const updated = mediaItems.filter(m => m.id !== id);
      setMediaItems(updated);
      localStorage.setItem('site_media_items', JSON.stringify(updated));
    });
  };

  const handleDeleteAllMedia = () => {
    requestConfirm("Tüm medyaları kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.", () => {
      setMediaItems([]);
      localStorage.setItem('site_media_items', JSON.stringify([]));
    });
  };

  // --- APPLICATIONS ---
  const handleDeleteApplication = (id) => {
    requestConfirm("Bu başvuruyu kalıcı olarak silmek istediğinize emin misiniz?", async () => {
      try {
        const res = await fetch(`${API_BASE}/applications/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchApplications();
          setSelectedApplication(null);
        }
      } catch (err) { alert('Hata oluştu.'); }
    });
  };

  const handleDeleteAllApplications = () => {
    requestConfirm("Tüm başvuruları kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.", async () => {
      try {
        const res = await fetch(`${API_BASE}/applications/`, { method: 'DELETE' });
        if (res.ok) {
          fetchApplications();
          setSelectedApplication(null);
          setCurrentPage(1);
        }
      } catch (err) { alert('Hata oluştu.'); }
    });
  };

  // --- END APPLICATIONS ---

  // Pagination calculations
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const paginatedApplications = applications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container" style={{ marginTop: '8rem', minHeight: '80vh' }}>

      {/* CONFIRM MODAL */}
      <div className={`modal-overlay ${confirmModal.isOpen ? 'active' : ''}`} onClick={() => setConfirmModal({ isOpen: false, message: '', onConfirm: null })}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
          <button className="modal-close" onClick={() => setConfirmModal({ isOpen: false, message: '', onConfirm: null })}><X size={24} /></button>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#ef4444' }}>
            <Trash2 size={48} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Emin misiniz?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{confirmModal.message}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => setConfirmModal({ isOpen: false, message: '', onConfirm: null })}>İptal</button>
            <button className="btn btn-primary" style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }} onClick={confirmModal.onConfirm}>Evet, Sil</button>
          </div>
        </div>
      </div>

      {/* ADD/EDIT PROJECT MODAL */}
      <div className={`modal-overlay ${showProjectModal ? 'active' : ''}`} onClick={() => setShowProjectModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
          <button className="modal-close" onClick={() => setShowProjectModal(false)}><X size={24} /></button>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{editingProject ? 'Projeyi Güncelle' : 'Yeni Proje Ekle'}</h2>
          <form onSubmit={handleSaveProject}>
            <div className="form-group">
              <label className="form-label">Proje Başlığı</label>
              <input type="text" className="form-input" required value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Proje Açıklaması</label>
              <textarea className="form-textarea" required value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{editingProject ? 'Güncelle' : 'Kaydet'}</button>
          </form>
        </div>
      </div>

      {/* ADD/EDIT MEDIA MODAL */}
      <div className={`modal-overlay ${showMediaModal ? 'active' : ''}`} onClick={() => setShowMediaModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
          <button className="modal-close" onClick={() => setShowMediaModal(false)}><X size={24} /></button>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{editingMedia ? 'Medyayı Güncelle' : 'Yeni Medya Ekle'}</h2>
          <form onSubmit={handleSaveMedia}>
            <div className="form-group">
              <label className="form-label">Medya Başlığı (Örn: Hackathon 2026)</label>
              <input type="text" className="form-input" required value={newMediaTitle} onChange={(e) => setNewMediaTitle(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{editingMedia ? 'Güncelle' : 'Kaydet'}</button>
          </form>
        </div>
      </div>

      {/* ADD/EDIT FEATURE MODAL */}
      <div className={`modal-overlay ${showFeatureModal ? 'active' : ''}`} onClick={() => setShowFeatureModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
          <button className="modal-close" onClick={() => setShowFeatureModal(false)}><X size={24} /></button>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{editingFeature ? 'Kartı Güncelle' : 'Yeni Özellik Kartı'}</h2>
          <form onSubmit={handleSaveFeature}>
            <div className="form-group">
              <label className="form-label">Başlık</label>
              <input type="text" className="form-input" required value={newFeature.title} onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Açıklama</label>
              <textarea className="form-textarea" required value={newFeature.description} onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{editingFeature ? 'Güncelle' : 'Kaydet'}</button>
          </form>
        </div>
      </div>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Admin Paneli</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('about')} className={`btn ${activeTab === 'about' ? 'btn-primary' : 'btn-outline'}`}>Biz Kimiz</button>
        <button onClick={() => setActiveTab('features')} className={`btn ${activeTab === 'features' ? 'btn-primary' : 'btn-outline'}`}>Özellik Kartları</button>
        <button onClick={() => setActiveTab('projects')} className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-outline'}`}>Projeler</button>
        <button onClick={() => setActiveTab('media')} className={`btn ${activeTab === 'media' ? 'btn-primary' : 'btn-outline'}`}>Medya</button>
        <button onClick={() => setActiveTab('social')} className={`btn ${activeTab === 'social' ? 'btn-primary' : 'btn-outline'}`}>Sosyal Medya</button>
        <button onClick={() => setActiveTab('applications')} className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline'}`}>Gelen Başvurular</button>
      </div>

      <div className="premium-card">
        {/* --- ABOUT TAB --- */}
        {activeTab === 'about' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Biz Kimiz Düzenle</h2>
            <form onSubmit={handleSaveAbout}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Ana Başlık (1. Satır)</label>
                  <input type="text" className="form-input" value={heroTitle1} onChange={(e) => setHeroTitle1(e.target.value)} required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Vurgulu Başlık (2. Satır)</label>
                  <input type="text" className="form-input" value={heroTitle2} onChange={(e) => setHeroTitle2(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Açıklama Metni
                  <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>*Markdown desteklenir (**kalın**, *italik*, vb.)</span>
                </label>
                <textarea className="form-textarea" value={aboutText} onChange={(e) => setAboutText(e.target.value)} style={{ minHeight: '150px' }} />
              </div>
              <button type="submit" className="btn btn-primary">Kaydet</button>
            </form>
          </div>
        )}

        {/* --- FEATURES TAB --- */}
        {activeTab === 'features' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Özellik Kartları</h2>
              <button onClick={() => openFeatureModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={16} /> Yeni Kart
              </button>
            </div>

            {featureCards.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>Özellik kartı yok.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {featureCards.map((card) => (
                  <div key={card.id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{card.title}</h3>
                      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{card.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openFeatureModal(card)} className="btn-icon" style={{ color: 'var(--text-secondary)' }} title="Güncelle">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteFeature(card.id)} className="btn-icon" style={{ color: '#ef4444' }} title="Sil">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- PROJECTS TAB --- */}
        {activeTab === 'projects' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Mevcut Projeler</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleDeleteAllProjects} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }}>
                  <Trash2 size={16} /> Tümünü Sil
                </button>
                <button onClick={() => openProjectModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={16} /> Yeni Proje
                </button>
              </div>
            </div>

            {projects.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>Kayıtlı proje yok.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.map(p => (
                  <div key={p.id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{p.title}</h3>
                      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{p.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openProjectModal(p)} className="btn-icon" style={{ color: 'var(--text-secondary)' }} title="Güncelle">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteProject(p.id)} className="btn-icon" style={{ color: '#ef4444' }} title="Sil">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- MEDIA TAB --- */}
        {activeTab === 'media' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Medya Ögeleri</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleDeleteAllMedia} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }}>
                  <Trash2 size={16} /> Tümünü Sil
                </button>
                <button onClick={() => openMediaModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={16} /> Yeni Medya
                </button>
              </div>
            </div>

            {mediaItems.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>Medya ögesi yok.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {mediaItems.map((item) => (
                  <div key={item.id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{item.title}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openMediaModal(item)} className="btn-icon" style={{ color: 'var(--text-secondary)' }} title="Güncelle">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteMedia(item.id)} className="btn-icon" style={{ color: '#ef4444' }} title="Sil">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- SOCIAL TAB --- */}
        {activeTab === 'social' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Sosyal Medya Linkleri</h2>
            <form onSubmit={handleSaveSocial}>
              <div className="form-group">
                <label className="form-label">Instagram URL</label>
                <input type="url" className="form-input" value={socialLinks.instagram} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input type="url" className="form-input" value={socialLinks.linkedin} onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary">Kaydet</button>
            </form>
          </div>
        )}

        {/* --- APPLICATIONS TAB --- */}
        {activeTab === 'applications' && (
          <div className="animate-fade-in">
            {selectedApplication ? (
              // DETAILED VIEW
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <button onClick={() => setSelectedApplication(null)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                    <ChevronLeft size={16} /> Geri Dön
                  </button>
                  <button onClick={() => handleDeleteApplication(selectedApplication.id)} className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                    <Trash2 size={16} /> Başvuruyu Sil
                  </button>
                </div>

                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedApplication.first_name} {selectedApplication.last_name}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{selectedApplication.faculty} - {selectedApplication.department} (Sınıf: {selectedApplication.student_class})</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>İletişim</h4>
                    <p style={{ margin: 0, fontWeight: '500' }}>{selectedApplication.phone}</p>
                    <p style={{ margin: 0, fontWeight: '500' }}>{selectedApplication.email}</p>
                  </div>
                </div>
                <div style={{ padding: '2rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Neden TUFAN'ı Seçtin?</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedApplication.reason}</p>
                </div>
                <div style={{ padding: '2rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Kendinden Bahset</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedApplication.about_me}</p>
                </div>
              </div>
            ) : (
              // DATABASE CRUD VIEW
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Gelen Başvurular</h2>
                    {/* TOGGLE APPS */}
                    <button 
                      onClick={toggleAppsOpen} 
                      className={`btn ${appsOpen ? 'btn-primary' : 'btn-outline'}`}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        padding: '0.4rem 1rem', 
                        fontSize: '0.8rem',
                        borderColor: appsOpen ? 'var(--primary-color)' : '#ef4444',
                        color: appsOpen ? '#fff' : '#ef4444'
                      }}
                    >
                      {appsOpen ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      Başvurular: {appsOpen ? 'Açık' : 'Kapalı'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleDeleteAllApplications} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#ef4444', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                      <Trash2 size={16} /> Tümünü Sil
                    </button>
                    <button onClick={fetchApplications} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Yenile</button>
                  </div>
                </div>

                {applications.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Henüz başvuru bulunmamaktadır.</p>
                ) : (
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem', backgroundColor: 'var(--bg-color)' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                          <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>ID</th>
                          <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Ad Soyad</th>
                          <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Bölüm</th>
                          <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>E-posta</th>
                          <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedApplications.map((app) => (
                          <tr key={app.id} onClick={() => setSelectedApplication(app)} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s ease', cursor: 'pointer' }} className="hover:bg-gray-50">
                            <td style={{ padding: '1rem' }}>#{app.id}</td>
                            <td style={{ padding: '1rem', fontWeight: '500' }}>{app.first_name} {app.last_name}</td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{app.department}</td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{app.email}</td>
                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteApplication(app.id); }} className="btn-icon" style={{ color: '#ef4444', padding: '0.4rem' }} title="Sil">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sayfa başına:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                          style={{ padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none' }}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Toplam {applications.length} kayıttan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, applications.length)} arası
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.5 : 1 }}
                          >
                            Önceki
                          </button>
                          <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                            {currentPage} / {totalPages || 1}
                          </span>
                          <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages || totalPages === 0}
                            className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', opacity: currentPage >= totalPages || totalPages === 0 ? 0.5 : 1 }}
                          >
                            Sonraki
                          </button>
                          <button onClick={exportToCSV} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                            <Download size={16} /> Excel'e Aktar (CSV)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
