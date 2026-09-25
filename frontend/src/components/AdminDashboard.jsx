import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, Download, X, Trash2, Edit, Save, CheckCircle, XCircle, Clock, Settings, ChevronDown, ChevronUp, Upload, Image as ImageIcon, FileText, FileSpreadsheet, FileCode, FileImage, Printer } from 'lucide-react';
import API_BASE from '../config';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('about');

  // Data States
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
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
    {
      id: 1,
      title: 'TEKNOFEST Hackathon 2025',
      date: 'Mayıs 2025',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      description: 'TUFAN Elektromobil ekibi olarak katıldığımız TEKNOFEST 2025 Hackathon etkinliğinde geliştirdiğimiz yerli batarya yönetim yazılımı ve telemetri altyapımızla birincilik ödülüne layık görüldük.'
    },
    {
      id: 2,
      title: 'Elektromobil Şasi Test Etkinliği',
      date: 'Nisan 2025',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      description: 'Yeni nesil karbon fiber şasi testlerimizi başarıyla tamamladık. Aracımızın aerodinamik sürtünme katsayısı ve mukavemet testleri hedeflenen standartların üzerine çıktı.'
    },
    {
      id: 3,
      title: 'Kurumsal Sponsorluk Zirvesi',
      date: 'Mart 2025',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      description: 'Sanayi ortaklarımız ve ana sponsorlarımızla bir araya gelerek TUFAN Elektromobil vizyonunu ve yeni araç konseptimizi tanıttığımız gala organizasyonumuz.'
    },
    {
      id: 4,
      title: 'Otonom Sürüş Çalıştayı',
      date: 'Şubat 2025',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      description: 'Yapay zeka ve bilgisayarlı görü ekibimizin düzenlediği 3 günlük kampüs çalıştayında araç içi görüntü işleme ve şerit takip sistemleri canlı olarak test edildi.'
    },
    {
      id: 5,
      title: 'Yerli İnovasyon Sergisi',
      date: 'Ocak 2025',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      description: 'Kendi geliştirdiğimiz yüksek verimlilikli motor sürücü kartlarımızı ve yerleşik şarj ünitelerimizi üniversitemiz inovasyon sergisinde öğrencilere ve akademisyenlere sunduk.'
    }
  ]);
  const [socialLinks, setSocialLinks] = useState(() => {
    try {
      const saved = localStorage.getItem('site_social_links');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.instagram === 'https://instagram.com/tufan') {
          parsed.instagram = 'https://www.instagram.com/tufanelektromobil?igsh=bW0zemZ0YW9tNXM2';
        }
        if (parsed.linkedin === 'https://linkedin.com/company/tufan') {
          parsed.linkedin = 'https://www.linkedin.com/company/akdeniz-tufan-elektromobil/';
        }
        localStorage.setItem('site_social_links', JSON.stringify(parsed));
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return {
      instagram: 'https://www.instagram.com/tufanelektromobil?igsh=bW0zemZ0YW9tNXM2',
      linkedin: 'https://www.linkedin.com/company/akdeniz-tufan-elektromobil/'
    };
  });
  const [featureCards, setFeatureCards] = useState(() => JSON.parse(localStorage.getItem('site_feature_cards')) || [
    { id: 1, title: 'Bütünleşik Altyapı', description: 'Farklı disiplinlerden gelen yetenekleri tek bir sistem altında birleştirerek yüksek performanslı bir ağ oluşturuyoruz.' },
    { id: 2, title: 'İleri Teknoloji', description: 'Modern framework\'ler ve ölçeklenebilir mimariler ile sektörel standartlarda ürünler geliştiriyoruz.' },
    { id: 3, title: 'Güvenilirlik', description: 'Sistemlerimiz, yüksek trafikli kampüs gereksinimlerini karşılamak üzere kesintisiz ve güvenli şekilde tasarlanmıştır.' }
  ]);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTarget, setExportTarget] = useState(null); // null = all, or application object

  const [appsOpen, setAppsOpen] = useState(() => {
    const saved = localStorage.getItem('site_apps_open');
    return saved === null ? true : saved === 'true';
  });

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('site_teams');
    const initialTeams = [
      { id: 1, name: 'Batarya Ekibi', active: true },
      { id: 2, name: 'Yazılım Ekibi', active: true },
      { id: 3, name: 'Motor Ekibi', active: true },
      { id: 4, name: 'Motor Sürücü Ekibi', active: true },
      { id: 5, name: 'Yerleşik Şarj Ekibi', active: true },
      { id: 6, name: 'Mekanik Ekibi', active: true }
    ];
    const data = saved ? JSON.parse(saved) : initialTeams;
    return data.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  });

  // Forms State
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [newMedia, setNewMedia] = useState({ title: '', imageUrl: '', description: '', date: '' });

  // Last Modified State
  const [lastModified, setLastModified] = useState({
    about: localStorage.getItem('last_mod_about'),
    features: localStorage.getItem('last_mod_features'),
    projects: localStorage.getItem('last_mod_projects'),
    media: localStorage.getItem('last_mod_media'),
    social: localStorage.getItem('last_mod_social'),
    teams: localStorage.getItem('last_mod_teams')
  });

  // Helper to format date
  const getNowString = () => new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const updateLastModified = (key) => {
    const now = getNowString();
    localStorage.setItem(`last_mod_${key}`, now);
    setLastModified(prev => ({ ...prev, [key]: now }));
  };

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
    updateLastModified('features');
    setShowFeatureModal(false);
  };

  const handleDeleteFeature = (id) => {
    requestConfirm('Özellik kartını silmek istediğinize emin misiniz?', () => {
      const updated = featureCards.filter(f => f.id !== id);
      setFeatureCards(updated);
      localStorage.setItem('site_feature_cards', JSON.stringify(updated));
      updateLastModified('features');
    });
  };

  const fetchApplications = async () => {
    let apiApps = [];
    try {
      const res = await fetch(`${API_BASE}/applications/`);
      if (res.ok) apiApps = await res.json();
    } catch (err) {
      console.error('Error fetching applications from API:', err);
    }

    try {
      const localApps = JSON.parse(localStorage.getItem('site_local_applications') || '[]');
      const combined = [...apiApps];
      
      localApps.forEach(lApp => {
        const exists = combined.some(a => a.id === lApp.id || (a.email === lApp.email && a.phone === lApp.phone));
        if (!exists) {
          combined.push(lApp);
        }
      });
      
      setApplications(combined);
    } catch (e) {
      setApplications(apiApps);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projeler/`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Error fetching projects from API:', err);
    }
  };

  const fetchMediaItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/media/`);
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data);
        localStorage.setItem('site_media_items', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error fetching media items from API:', err);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchProjects();
    fetchMediaItems();
    if (activeTab === 'applications') {
      setSelectedApplication(null);
      setCurrentPage(1);
    }
  }, [activeTab]);

  // --- MULTI-FORMAT EXPORTERS (CSV, WORD, PDF, PNG, JPEG, JSON) ---
  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCSVContent = (apps) => {
    const headers = ['ID', 'Ad', 'Soyad', 'Telefon', 'E-posta', 'Fakülte', 'Bölüm', 'Sınıf', 'Başvurulan Ekip', 'Neden TUFAN', 'Kendinden Bahset', 'Admin Notu'];
    const csvRows = apps.map(app => [
      app.id,
      `"${app.first_name?.replace(/"/g, '""') || ''}"`,
      `"${app.last_name?.replace(/"/g, '""') || ''}"`,
      `"${app.phone?.replace(/"/g, '""') || ''}"`,
      `"${app.email?.replace(/"/g, '""') || ''}"`,
      `"${app.faculty?.replace(/"/g, '""') || ''}"`,
      `"${app.department?.replace(/"/g, '""') || ''}"`,
      `"${app.student_class?.replace(/"/g, '""') || ''}"`,
      `"${app.team?.replace(/"/g, '""') || 'Belirtilmedi'}"`,
      `"${app.reason?.replace(/"/g, '""') || ''}"`,
      `"${app.about_me?.replace(/"/g, '""') || ''}"`,
      `"${app.admin_note?.replace(/"/g, '""') || ''}"`
    ].join(','));
    return "\ufeff" + [headers.join(','), ...csvRows].join('\n');
  };

  const handleExportCSV = (targetApps = null) => {
    const apps = targetApps ? [targetApps] : applications;
    const filename = targetApps ? `tufan_basvuru_${targetApps.first_name}_${targetApps.last_name}.csv` : 'tufan_basvurular.csv';
    const content = generateCSVContent(apps);
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, filename);
  };

  const handleExportJSON = (targetApps = null) => {
    const apps = targetApps ? targetApps : applications;
    const filename = targetApps ? `tufan_basvuru_${targetApps.first_name}_${targetApps.last_name}.json` : 'tufan_basvurular.json';
    const content = JSON.stringify(apps, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
    triggerDownload(blob, filename);
  };

  const handleExportWord = (targetApps = null) => {
    const isSingle = Boolean(targetApps);
    const apps = isSingle ? [targetApps] : applications;
    const filename = isSingle ? `tufan_basvuru_${targetApps.first_name}_${targetApps.last_name}.doc` : 'tufan_basvurular.doc';
    const dateStr = new Date().toLocaleDateString('tr-TR');

    let bodyContent = '';
    if (isSingle) {
      const app = apps[0];
      bodyContent = `
        <div style="border: 2px solid #113996; padding: 20px; border-radius: 8px; margin-top: 15px;">
          <h2 style="color: #113996; margin-top: 0;">${app.first_name} ${app.last_name}</h2>
          <p><b>Başvurulan Ekip:</b> <span style="color: #ff640a;">${app.team || 'Belirtilmedi'}</span></p>
          <p><b>Fakülte / Bölüm:</b> ${app.faculty} - ${app.department} (Sınıf: ${app.student_class})</p>
          <p><b>İletişim:</b> ${app.phone} | ${app.email}</p>
          <hr style="border: 1px solid #e5e7eb; margin: 15px 0;" />
          <h4 style="color: #ff640a; margin-bottom: 5px;">Neden TUFAN'ı Seçtin?</h4>
          <p style="background: #f8fafc; padding: 12px; border-left: 4px solid #ff640a; border: 1px solid #e2e8f0;">${app.reason || '-'}</p>
          <h4 style="color: #113996; margin-bottom: 5px; margin-top: 15px;">Kendinden Bahset</h4>
          <p style="background: #f8fafc; padding: 12px; border-left: 4px solid #113996; border: 1px solid #e2e8f0;">${app.about_me || '-'}</p>
          ${app.admin_note ? `<h4 style="color: #64748b; margin-top: 15px;">Admin Notu</h4><p style="background: #f1f5f9; padding: 10px;">${app.admin_note}</p>` : ''}
        </div>
      `;
    } else {
      const rows = apps.map(a => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">#${a.id}</td>
          <td style="padding: 8px; border: 1px solid #ddd;"><b>${a.first_name} ${a.last_name}</b></td>
          <td style="padding: 8px; border: 1px solid #ddd; color: #113996;"><b>${a.team || '-'}</b></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${a.department} (${a.student_class})</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${a.phone}<br/>${a.email}</td>
          <td style="padding: 8px; border: 1px solid #ddd; font-size: 11px;">${a.reason || '-'}</td>
          <td style="padding: 8px; border: 1px solid #ddd; font-size: 11px;">${a.about_me || '-'}</td>
          <td style="padding: 8px; border: 1px solid #ddd; font-size: 11px;">${a.admin_note || '-'}</td>
        </tr>
      `).join('');

      bodyContent = `
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px;">
          <thead>
            <tr style="background-color: #113996; color: #ffffff;">
              <th style="padding: 10px; border: 1px solid #ddd;">ID</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Ad Soyad</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Ekip</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Bölüm</th>
              <th style="padding: 10px; border: 1px solid #ddd;">İletişim</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Neden TUFAN</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Hakkında</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Admin Notu</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    const htmlDoc = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>TUFAN Başvuru Raporu</title>
        <style>
          body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; margin: 30px; color: #0f172a; }
          .header { border-bottom: 3px solid #ff640a; padding-bottom: 15px; margin-bottom: 20px; }
          .title { color: #113996; font-size: 24px; font-weight: bold; margin: 0; }
          .subtitle { color: #64748b; font-size: 13px; margin-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">⚡ TUFAN ELEKTROMOBİL</div>
          <div class="subtitle">Gelen Başvurular Raporu — Rapor Tarihi: ${dateStr}</div>
        </div>
        ${bodyContent}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlDoc], { type: 'application/msword;charset=utf-8' });
    triggerDownload(blob, filename);
  };

  const handleExportPDF = (targetApps = null) => {
    const isSingle = Boolean(targetApps);
    const apps = isSingle ? [targetApps] : applications;
    const titleName = isSingle ? `Başvuru Raporu - ${targetApps.first_name} ${targetApps.last_name}` : 'TUFAN Gelen Başvurular Raporu';
    const dateStr = new Date().toLocaleDateString('tr-TR');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up engelleyici aktif. Lütfen izin verin.');
      return;
    }

    let bodyContent = '';
    if (isSingle) {
      const app = apps[0];
      bodyContent = `
        <div style="border: 2px solid #113996; padding: 25px; border-radius: 12px; background: #fafafa;">
          <h2 style="color: #113996; margin-top: 0; font-size: 24px;">${app.first_name} ${app.last_name}</h2>
          <p style="font-size: 15px;"><strong>Başvurulan Ekip:</strong> <span style="color: #ff640a; font-weight: bold;">${app.team || 'Belirtilmedi'}</span></p>
          <p style="font-size: 14px;"><strong>Fakülte / Bölüm:</strong> ${app.faculty} - ${app.department} (Sınıf: ${app.student_class})</p>
          <p style="font-size: 14px;"><strong>İletişim:</strong> ${app.phone} | ${app.email}</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
          <h4 style="color: #ff640a; margin-bottom: 8px;">Neden TUFAN'ı Seçtin?</h4>
          <div style="background: #ffffff; padding: 15px; border-left: 4px solid #ff640a; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.6;">${app.reason || '-'}</div>
          <h4 style="color: #113996; margin-bottom: 8px; margin-top: 20px;">Kendinden Bahset</h4>
          <div style="background: #ffffff; padding: 15px; border-left: 4px solid #113996; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.6;">${app.about_me || '-'}</div>
          ${app.admin_note ? `<h4 style="color: #64748b; margin-top: 20px;">Gizli Admin Notu</h4><div style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 13px;">${app.admin_note}</div>` : ''}
        </div>
      `;
    } else {
      const rows = apps.map(a => `
        <tr>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">#${a.id}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${a.first_name} ${a.last_name}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; color: #113996; font-weight: bold;">${a.team || '-'}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${a.department} (${a.student_class})</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${a.phone}<br/><span style="color:#64748b; font-size:11px;">${a.email}</span></td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-size:12px;">${a.reason || '-'}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-size:12px;">${a.about_me || '-'}</td>
        </tr>
      `).join('');

      bodyContent = `
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background-color: #113996; color: #ffffff;">
              <th style="padding: 10px; border: 1px solid #cbd5e1;">ID</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1;">Ad Soyad</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1;">Ekip</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1;">Bölüm</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1;">İletişim</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1;">Neden TUFAN</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1;">Hakkında</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${titleName}</title>
        <style>
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 30px; color: #0f172a; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #ff640a; padding-bottom: 15px; margin-bottom: 25px; }
          .logo { font-size: 24px; font-weight: 800; color: #113996; letter-spacing: -0.03em; }
          .date { font-size: 12px; color: #64748b; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">⚡ TUFAN ELEKTROMOBİL</div>
            <div style="font-size: 14px; color: #475569; margin-top: 4px;">${titleName}</div>
          </div>
          <div class="date">Tarih: ${dateStr}</div>
        </div>
        ${bodyContent}
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportImage = (targetApps = null, format = 'png') => {
    const isSingle = Boolean(targetApps);
    const apps = isSingle ? [targetApps] : applications;
    const filename = isSingle
      ? `tufan_basvuru_${targetApps.first_name}_${targetApps.last_name}.${format}`
      : `tufan_basvurular.${format}`;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = isSingle ? 800 : 1200;
    const itemHeight = isSingle ? 540 : Math.max(300, 140 + apps.length * 55);
    canvas.width = width;
    canvas.height = itemHeight;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, itemHeight);

    // Header Banner
    ctx.fillStyle = '#113996';
    ctx.fillRect(0, 0, width, 80);

    ctx.fillStyle = '#ff640a';
    ctx.fillRect(0, 76, width, 4);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('⚡ TUFAN ELEKTROMOBİL', 30, 48);

    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`Gelen Başvuru Raporu (${new Date().toLocaleDateString('tr-TR')})`, width - 260, 48);

    if (isSingle && apps.length > 0) {
      const app = apps[0];
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`${app.first_name} ${app.last_name}`, 40, 130);

      ctx.fillStyle = '#ff640a';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`Başvurulan Ekip: ${app.team || 'Belirtilmedi'}`, 40, 160);

      ctx.fillStyle = '#475569';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Fakülte/Bölüm: ${app.faculty} - ${app.department} (${app.student_class}. Sınıf)`, 40, 190);
      ctx.fillText(`Telefon: ${app.phone}   |   E-posta: ${app.email}`, 40, 215);

      // Reason Box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(40, 240, width - 80, 100);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(40, 240, width - 80, 100);
      ctx.fillStyle = '#ff640a';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText("Neden TUFAN'ı Seçtin?", 55, 265);
      ctx.fillStyle = '#334155';
      ctx.font = '13px sans-serif';
      ctx.fillText((app.reason || '-').slice(0, 140), 55, 295);

      // About me Box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(40, 360, width - 80, 100);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(40, 360, width - 80, 100);
      ctx.fillStyle = '#113996';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('Kendinden Bahset', 55, 385);
      ctx.fillStyle = '#334155';
      ctx.font = '13px sans-serif';
      ctx.fillText((app.about_me || '-').slice(0, 140), 55, 415);
    } else {
      // Table Header
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(30, 100, width - 60, 40);
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('ID', 45, 125);
      ctx.fillText('Ad Soyad', 100, 125);
      ctx.fillText('Başvurulan Ekip', 320, 125);
      ctx.fillText('Bölüm', 540, 125);
      ctx.fillText('E-posta', 820, 125);

      let y = 165;
      apps.forEach((app, idx) => {
        ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        ctx.fillRect(30, y - 25, width - 60, 45);
        ctx.fillStyle = '#475569';
        ctx.font = '13px sans-serif';
        ctx.fillText(`#${app.id}`, 45, y);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`${app.first_name} ${app.last_name}`, 100, y);
        ctx.fillStyle = '#113996';
        ctx.fillText(app.team || '-', 320, y);
        ctx.fillStyle = '#475569';
        ctx.font = '13px sans-serif';
        ctx.fillText(app.department || '-', 540, y);
        ctx.fillText(app.email || '-', 820, y);

        ctx.strokeStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(30, y + 20);
        ctx.lineTo(width - 30, y + 20);
        ctx.stroke();
        y += 45;
      });
    }

    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = canvas.toDataURL(mimeType, 0.95);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openExportModal = (target = null) => {
    setExportTarget(target);
    setShowExportModal(true);
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
    updateLastModified('about');
  };

  const handleSaveSocial = (e) => {
    e.preventDefault();
    localStorage.setItem('site_social_links', JSON.stringify(socialLinks));
    updateLastModified('social');
  };

  const toggleAppsOpen = () => {
    const newVal = !appsOpen;
    setAppsOpen(newVal);
    localStorage.setItem('site_apps_open', newVal);
  };

  const toggleTeamActive = (id) => {
    const updated = teams.map(t => t.id === id ? { ...t, active: !t.active } : t);
    setTeams(updated);
    localStorage.setItem('site_teams', JSON.stringify(updated));
    updateLastModified('teams');
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
    const url = editingProject
      ? `${API_BASE}/projeler/${editingProject.id}`
      : `${API_BASE}/projeler/`;
    const method = editingProject ? 'PUT' : 'POST';

    let attempts = 0;
    let success = false;
    let lastError = null;

    while (attempts < 3 && !success) {
      attempts++;
      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProject)
        });

        if (res.ok) {
          success = true;
          setShowProjectModal(false);
          setNewProject({ title: '', description: '' });
          setEditingProject(null);
          await fetchProjects();
          updateLastModified('projects');
          return;
        } else {
          const errData = await res.json().catch(() => ({}));
          alert(`Hata oluştu (${res.status}): ${errData.detail || res.statusText || 'Proje kaydedilemedi'}`);
          return;
        }
      } catch (err) {
        lastError = err;
        if (attempts < 3) {
          await new Promise(r => setTimeout(r, 1200));
        }
      }
    }

    if (!success) {
      alert('Sunucu hatası: ' + (lastError?.message || 'Veritabanı sunucusuna bağlanılamadı. Lütfen sunucunun uyanması için birkaç saniye sonra tekrar deneyin.'));
    }
  };

  const handleDeleteProject = (id) => {
    requestConfirm("Bu projeyi kalıcı olarak silmek istediğinize emin misiniz?", async () => {
      try {
        const res = await fetch(`${API_BASE}/projeler/${id}`, { method: 'DELETE' });
        if (res.ok) {
          await fetchProjects();
          updateLastModified('projects');
        } else {
          alert('Proje silinirken hata oluştu.');
        }
      } catch (err) {
        alert('Sunucu hatası: Proje silinemedi.');
      }
    });
  };

  const handleDeleteAllProjects = () => {
    requestConfirm("Tüm projeleri kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.", async () => {
      try {
        const res = await fetch(`${API_BASE}/projeler/`, { method: 'DELETE' });
        if (res.ok) {
          await fetchProjects();
          updateLastModified('projects');
        } else {
          alert('Projeler silinirken hata oluştu.');
        }
      } catch (err) {
        alert('Sunucu hatası: Projeler silinemedi.');
      }
    });
  };

  // --- MEDIA ---
  const openMediaModal = (media = null) => {
    if (media) {
      setEditingMedia(media);
      setNewMedia({
        title: media.title || '',
        imageUrl: media.imageUrl || '',
        description: media.description || '',
        date: media.date || ''
      });
    } else {
      setEditingMedia(null);
      setNewMedia({ title: '', imageUrl: '', description: '', date: '' });
    }
    setShowMediaModal(true);
  };

  const handleMediaImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMedia(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMedia = async (e) => {
    e.preventDefault();
    try {
      const url = editingMedia
        ? `${API_BASE}/media/${editingMedia.id}`
        : `${API_BASE}/media/`;
      const method = editingMedia ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMedia)
      });

      if (res.ok) {
        setShowMediaModal(false);
        await fetchMediaItems();
        updateLastModified('media');
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Hata oluştu. (${res.status}): ${errData.detail || res.statusText}`);
      }
    } catch (err) {
      console.error('API Error saving media:', err);
      // Fallback: local state and localStorage if API fails
      let updated;
      if (editingMedia) {
        updated = mediaItems.map(m => m.id === editingMedia.id ? { ...m, ...newMedia } : m);
      } else {
        updated = [...mediaItems, { id: Date.now(), ...newMedia }];
      }
      setMediaItems(updated);
      localStorage.setItem('site_media_items', JSON.stringify(updated));
      updateLastModified('media');
      setShowMediaModal(false);
    }
  };

  const handleDeleteMedia = (id) => {
    requestConfirm("Bu medyayı kalıcı olarak silmek istediğinize emin misiniz?", async () => {
      try {
        await fetch(`${API_BASE}/media/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('API Error deleting media:', err);
      }
      const updated = mediaItems.filter(m => m.id !== id);
      setMediaItems(updated);
      localStorage.setItem('site_media_items', JSON.stringify(updated));
      updateLastModified('media');
      fetchMediaItems();
    });
  };

  const handleDeleteAllMedia = () => {
    requestConfirm("Tüm medyaları kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.", async () => {
      try {
        await fetch(`${API_BASE}/media/`, { method: 'DELETE' });
      } catch (err) {
        console.error('API Error deleting all media:', err);
      }
      setMediaItems([]);
      localStorage.setItem('site_media_items', JSON.stringify([]));
      updateLastModified('media');
    });
  };

  // --- APPLICATIONS ---
  const handleDeleteApplication = (id) => {
    requestConfirm("Bu başvuruyu kalıcı olarak silmek istediğinize emin misiniz?", async () => {
      try {
        await fetch(`${API_BASE}/applications/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error(err);
      }
      try {
        const localApps = JSON.parse(localStorage.getItem('site_local_applications') || '[]');
        const updatedLocal = localApps.filter(a => a.id !== id);
        localStorage.setItem('site_local_applications', JSON.stringify(updatedLocal));
      } catch (e) {}

      fetchApplications();
      setSelectedApplication(null);
    });
  };

  const handleDeleteAllApplications = () => {
    requestConfirm("Tüm başvuruları kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.", async () => {
      try {
        await fetch(`${API_BASE}/applications/`, { method: 'DELETE' });
      } catch (err) {
        console.error(err);
      }
      localStorage.removeItem('site_local_applications');
      setApplications([]);
      setSelectedApplication(null);
      setCurrentPage(1);
    });
  };

  const handleSelectApplication = (app) => {
    setSelectedApplication(app);
    setAdminNote(app.admin_note || '');
  };

  const handleSaveAdminNote = async () => {
    if (!selectedApplication) return;
    setIsSavingNote(true);
    try {
      const res = await fetch(`${API_BASE}/applications/${selectedApplication.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_note: adminNote })
      });
      if (res.ok) {
        const updatedApp = await res.json();
        setSelectedApplication(updatedApp);
        setApplications(apps => apps.map(a => a.id === updatedApp.id ? updatedApp : a));
      } else {
        console.error('Not kaydedilirken hata oluştu.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingNote(false);
    }
  };

  // --- END APPLICATIONS ---

  // Pagination calculations
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const paginatedApplications = applications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container" style={{ marginTop: 'clamp(5rem, 10vw, 8rem)', minHeight: '80vh' }}>

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
            <button className="btn btn-primary" style={{ backgroundColor: 'var(--tfn-orange)', borderColor: 'var(--tfn-orange)' }} onClick={confirmModal.onConfirm}>Evet, Sil</button>
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
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
          <button className="modal-close" onClick={() => setShowMediaModal(false)}><X size={24} /></button>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{editingMedia ? 'Medyayı / Etkinliği Güncelle' : 'Yeni Medya / Etkinlik Ekle'}</h2>
          <form onSubmit={handleSaveMedia}>
            <div className="form-group">
              <label className="form-label">Etkinlik / Fotoğraf Başlığı</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="Örn: TEKNOFEST Hackathon 2025"
                value={newMedia.title}
                onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tarih / Dönem (Opsiyonel)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Örn: Mayıs 2025"
                value={newMedia.date}
                onChange={(e) => setNewMedia({ ...newMedia, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Görsel Seçimi (URL veya Dosya Yükle)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://... resim adresi yapıştırın"
                  value={newMedia.imageUrl}
                  onChange={(e) => setNewMedia({ ...newMedia, imageUrl: e.target.value })}
                />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <label className="btn btn-outline" style={{ cursor: 'pointer', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Upload size={16} /> Bilgisayardan Fotoğraf Yükle
                    <input type="file" accept="image/*" onChange={handleMediaImageUpload} style={{ display: 'none' }} />
                  </label>
                  {newMedia.imageUrl && (
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>
                      ✓ Görsel hazır
                    </span>
                  )}
                </div>

                {newMedia.imageUrl && (
                  <div style={{ width: '100%', height: '140px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
                    <img src={newMedia.imageUrl} alt="Önizleme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Etkinlik Açıklaması (Fotoğrafa Tıklandığında Gösterilir)</label>
              <textarea
                className="form-textarea"
                placeholder="Etkinlik hakkında ayrıntılı bilgi yazın..."
                style={{ minHeight: '110px' }}
                value={newMedia.description}
                onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {editingMedia ? 'Güncelle' : 'Kaydet'}
            </button>
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

      {/* MULTI-FORMAT EXPORT SELECTION MODAL */}
      <div className={`modal-overlay ${showExportModal ? 'active' : ''}`} onClick={() => setShowExportModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', padding: '2rem' }}>
          <button className="modal-close" onClick={() => setShowExportModal(false)}><X size={24} /></button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.6rem', backgroundColor: 'rgba(17, 57, 150, 0.1)', color: 'var(--tfn-blue)', borderRadius: '12px' }}>
              <Download size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Dışa Aktar / İndir</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                {exportTarget ? `${exportTarget.first_name} ${exportTarget.last_name} kişisinin başvuru verisi` : `Tüm başvurular (${applications.length} kayıt)`}
              </p>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Aşağıdaki dosya formatlarından dilediğinizi seçerek verileri veri kaybı olmadan doğrudan cihazınıza indirebilirsiniz:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Excel / CSV */}
            <div
              onClick={() => { handleExportCSV(exportTarget); setShowExportModal(false); }}
              style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', backgroundColor: 'var(--bg-secondary)', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileSpreadsheet size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Excel / CSV (.csv)</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>E-tablo yazılımları için</span>
              </div>
            </div>

            {/* Word (.doc) */}
            <div
              onClick={() => { handleExportWord(exportTarget); setShowExportModal(false); }}
              style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', backgroundColor: 'var(--bg-secondary)', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Word Dokümanı (.doc)</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Antetli Microsoft Word</span>
              </div>
            </div>

            {/* PDF Report */}
            <div
              onClick={() => { handleExportPDF(exportTarget); setShowExportModal(false); }}
              style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', backgroundColor: 'var(--bg-secondary)', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Printer size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>PDF Raporu (.pdf)</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Resmi PDF çıktısı al</span>
              </div>
            </div>

            {/* PNG Image */}
            <div
              onClick={() => { handleExportImage(exportTarget, 'png'); setShowExportModal(false); }}
              style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', backgroundColor: 'var(--bg-secondary)', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileImage size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>PNG Görsel (.png)</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Yüksek netlikte resim</span>
              </div>
            </div>

            {/* JPEG Image */}
            <div
              onClick={() => { handleExportImage(exportTarget, 'jpeg'); setShowExportModal(false); }}
              style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', backgroundColor: 'var(--bg-secondary)', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageIcon size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>JPEG Fotoğraf (.jpg)</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sıkıştırılmış görsel</span>
              </div>
            </div>

            {/* JSON Backup */}
            <div
              onClick={() => { handleExportJSON(exportTarget); setShowExportModal(false); }}
              style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', backgroundColor: 'var(--bg-secondary)', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCode size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>JSON Paketi (.json)</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tam ham veri yedeği</span>
              </div>
            </div>
          </div>

          <button className="btn btn-outline" onClick={() => setShowExportModal(false)} style={{ width: '100%' }}>
            Kapat
          </button>
        </div>
      </div>

      <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', marginBottom: '2rem' }}>Admin Paneli</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('about')} className={`btn ${activeTab === 'about' ? 'btn-primary' : 'btn-outline'}`} style={activeTab === 'about' ? { borderBottom: '3px solid var(--tfn-orange)' } : {}}>Biz Kimiz</button>
        <button onClick={() => setActiveTab('features')} className={`btn ${activeTab === 'features' ? 'btn-primary' : 'btn-outline'}`} style={activeTab === 'features' ? { borderBottom: '3px solid var(--tfn-orange)' } : {}}>Özellik Kartları</button>
        <button onClick={() => setActiveTab('projects')} className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-outline'}`} style={activeTab === 'projects' ? { borderBottom: '3px solid var(--tfn-orange)' } : {}}>Projeler</button>
        <button onClick={() => setActiveTab('media')} className={`btn ${activeTab === 'media' ? 'btn-primary' : 'btn-outline'}`} style={activeTab === 'media' ? { borderBottom: '3px solid var(--tfn-orange)' } : {}}>Medya</button>
        <button onClick={() => setActiveTab('social')} className={`btn ${activeTab === 'social' ? 'btn-primary' : 'btn-outline'}`} style={activeTab === 'social' ? { borderBottom: '3px solid var(--tfn-orange)' } : {}}>Sosyal Medya</button>
        <button onClick={() => setActiveTab('applications')} className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline'}`} style={activeTab === 'applications' ? { borderBottom: '3px solid var(--tfn-orange)' } : {}}>Gelen Başvurular</button>
      </div>

      <div className="premium-card">
        {/* --- ABOUT TAB --- */}
        {activeTab === 'about' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Biz Kimiz Düzenle</h2>
              {lastModified.about && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.3rem 0.7rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
                  <Clock size={12} /> Son değişiklik: {lastModified.about}
                </span>
              )}
            </div>
            <form onSubmit={handleSaveAbout}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Özellik Kartları</h2>
                {lastModified.features && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.3rem 0.7rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
                    <Clock size={12} /> Son değişiklik: {lastModified.features}
                  </span>
                )}
              </div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Mevcut Projeler</h2>
                {lastModified.projects && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.3rem 0.7rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
                    <Clock size={12} /> Son değişiklik: {lastModified.projects}
                  </span>
                )}
              </div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Medya Ögeleri ve Etkinlikler</h2>
                {lastModified.media && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.3rem 0.7rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
                    <Clock size={12} /> Son değişiklik: {lastModified.media}
                  </span>
                )}
              </div>
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
                  <div key={item.id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Thumbnail Preview */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--bg-secondary)',
                      flex: '0 0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-color)'
                    }}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <ImageIcon size={24} style={{ color: 'var(--text-secondary)' }} />
                      )}
                    </div>

                    <div style={{ flex: '1 1 200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{item.title}</h3>
                        {item.date && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--tfn-orange)', backgroundColor: 'rgba(255, 100, 10, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '600' }}>
                            {item.date}
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description || 'Açıklama yok'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Sosyal Medya Linkleri</h2>
              {lastModified.social && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.3rem 0.7rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
                  <Clock size={12} /> Son değişiklik: {lastModified.social}
                </span>
              )}
            </div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <button onClick={() => setSelectedApplication(null)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                    <ChevronLeft size={16} /> Geri Dön
                  </button>
                  
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => openExportModal(selectedApplication)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      <Download size={16} /> Rapor İndir (Çoklu Format)
                    </button>
                    <button onClick={() => handleDeleteApplication(selectedApplication.id)} className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                      <Trash2 size={16} /> Başvuruyu Sil
                    </button>
                  </div>
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
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Başvurulan Ekip</h4>
                  <p style={{ color: 'var(--tfn-blue)', fontWeight: '700', fontSize: '1.2rem' }}>{selectedApplication.team || 'Belirtilmedi'}</p>
                </div>
                <div style={{ padding: '2rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Neden TUFAN'ı Seçtin?</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedApplication.reason}</p>
                </div>
                <div style={{ padding: '2rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Kendinden Bahset</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedApplication.about_me}</p>
                </div>
                
                <div style={{ padding: '2rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--primary-color)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--primary-color)', margin: 0 }}>Gizli Admin Notu</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>*Sadece adminler görebilir</span>
                  </div>
                  <textarea
                    className="form-textarea"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Bu başvuru hakkında kendinize not bırakın..."
                    style={{ minHeight: '100px', marginBottom: '1rem' }}
                  ></textarea>
                  <button 
                    onClick={handleSaveAdminNote} 
                    className="btn btn-primary" 
                    disabled={isSavingNote}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Save size={16} /> {isSavingNote ? 'Kaydediliyor...' : 'Notu Kaydet'}
                  </button>
                </div>
              </div>
            ) : (
              // DATABASE CRUD VIEW
              <div>
                {/* --- TEAMS SECTION (Moved from separate tab) --- */}
                <div style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Settings size={20} style={{ color: 'var(--text-secondary)' }} /> Başvuru Ayarları
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {lastModified.teams && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-color)', padding: '0.3rem 0.7rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
                          <Clock size={12} /> Son değişiklik: {lastModified.teams}
                        </span>
                      )}
                      <button onClick={() => setShowAppSettings(!showAppSettings)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                        {showAppSettings ? <><ChevronUp size={16} /> Gizle</> : <><ChevronDown size={16} /> Göster</>}
                      </button>
                    </div>
                  </div>
                  
                  {showAppSettings && (
                    <div className="animate-fade-in" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Buradan hangi ekipler için başvuru alınacağını belirleyebilirsiniz. Kapalı olan ekipler başvuru formunda görünmez.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {teams.map(team => (
                          <div key={team.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: team.active ? 'rgba(17, 57, 150, 0.05)' : 'var(--bg-color)' }}>
                            <span style={{ fontWeight: '600', color: team.active ? 'var(--tfn-blue)' : 'var(--text-secondary)', fontSize: '0.95rem' }}>{team.name}</span>
                            <button 
                              onClick={() => toggleTeamActive(team.id)} 
                              className={`btn ${team.active ? 'btn-primary' : 'btn-outline'}`}
                              style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}
                            >
                              {team.active ? 'Aktif' : 'Pasif'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

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

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button onClick={() => openExportModal(null)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                      <Download size={16} /> Dışa Aktar / İndir
                    </button>
                    <button onClick={handleDeleteAllApplications} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#ef4444', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                      <Trash2 size={16} /> Tümünü Sil
                    </button>
                    <button onClick={fetchApplications} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Yenile</button>
                  </div>
                </div>

                {applications.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Henüz başvuru bulunmamaktadır.</p>
                ) : (
                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem', backgroundColor: 'var(--bg-color)' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                          <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>ID</th>
                          <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Ad Soyad</th>
                          <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Başvurulan Ekip</th>
                          <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Bölüm</th>
                          <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>E-posta</th>
                          <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedApplications.map((app) => (
                          <tr key={app.id} onClick={() => handleSelectApplication(app)} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s ease', cursor: 'pointer' }} className="hover:bg-gray-50">
                            <td style={{ padding: '1rem' }}>#{app.id}</td>
                            <td style={{ padding: '1rem', fontWeight: '500' }}>{app.first_name} {app.last_name}</td>
                            <td style={{ padding: '1rem' }}><span style={{ padding: '0.3rem 0.6rem', backgroundColor: 'rgba(17, 57, 150, 0.1)', color: 'var(--tfn-blue)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{app.team || '-'}</span></td>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '0.75rem' }}>
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

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
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
                          <button onClick={() => handleExportCSV(null)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8rem', backgroundColor: 'var(--tfn-orange)', borderColor: 'var(--tfn-orange)' }}>
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
