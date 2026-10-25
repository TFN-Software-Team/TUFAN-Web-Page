import React, { useState, useEffect } from 'react';
import {
  Users, ShieldCheck, Cpu, X, Calendar, Camera, Settings,
  Monitor, Megaphone, Wrench, Zap, BatteryCharging,
  Trophy, CheckCircle2, Gauge, Layers, Sparkles, ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import API_BASE from '../config';
import MediaMarquee from './MediaMarquee';

const DEFAULT_FEATURE_CARDS_TR = [
  { id: 1, title: 'Disiplinler Arası Ekip Çalışması', description: 'Mühendislik, yazılım ve tasarım alanlarında yetkin öğrencilerle geleceğin araçlarını tasarlıyoruz.' },
  { id: 2, title: 'Yerli ve Milli Üretim', description: 'Batarya yönetim sisteminden motor sürücüsüne kadar kritik bileşenleri yerli imkanlarla geliştiriyoruz.' },
  { id: 3, title: 'Yarışma ve Performans', description: 'Teknofest ve Uluslararası Efficiency Challenge Elektrikli Araç Yarışlarında derece hedefiyle çalışıyoruz.' }
];

const DEFAULT_FEATURE_CARDS_EN = [
  { id: 1, title: 'Cross-Disciplinary Teamwork', description: 'We design the vehicles of the future alongside talented students in engineering, software, and design.' },
  { id: 2, title: 'Domestic & National Production', description: 'From battery management systems to motor drivers, we develop critical components with local capabilities.' },
  { id: 3, title: 'Competition & Performance', description: 'We compete with a podium goal at TEKNOFEST and the International Efficiency Challenge Electric Vehicle Races.' }
];

const DEFAULT_PROJECTS_TR = [
  {
    id: 1,
    title: 'TUFAN Elektromobil v1',
    description: 'TEKNOFEST Efficiency Challenge için geliştirilen yüksek verimli, özel tasarım motor sürücüsü ve hafif karbon-fiber kompozit şasiye sahip elektrikli yarış aracı.',
    category: 'Elektromobil & Efficiency Challenge',
    status: 'Yarış Aracı',
    badge: 'TEKNOFEST EC',
    subsystems: ['Yerli Motor Sürücü', 'Özel BMS (Batarya Yönetim Sistemi)', 'Karbon Fiber Şasi', 'Telemetri & CAN-Bus'],
    specs: [
      { label: 'Azami Hız', value: '110 km/s' },
      { label: 'Batarya Kapasitesi', value: '4.2 kWh Li-Ion' },
      { label: 'Şasi Malzemesi', value: 'Karbon Fiber Kompozit' },
      { label: 'Sürücü Verimi', value: '%94 Peak Verim' },
      { label: 'Araç Ağırlığı', value: '170 kg' },
      { label: 'Menzil', value: '80+ km' }
    ],
    highlights: [
      'Tamamen takım bünyesinde tasarlanıp üretilen yerli FOC motor sürücü mimarisi.',
      'Hücre bazında sıcaklık, gerilim ve akım denetimi sağlayan güvenli Batarya Yönetim Sistemi (BMS).',
      'Havacılık standartlarında vakum infüzyon yöntemiyle üretilen hafif karbon fiber kompozit monokok şasi.',
      'Yarış esnasında tüm kritik araç verilerini canlı olarak pit istasyonuna aktaran telemetri yazılımı.'
    ]
  },
  {
    id: 2,
    title: 'TUFAN Otonom',
    description: 'LiDAR, stereo kamera ve yapay zeka algoritmalarıyla donatılmış, sürücüsüz seyrüsefer kabiliyetine sahip yeni nesil elektrikli araç platformu.',
    category: 'Otonom Araç & Robotaksi',
    status: 'Geliştirme Aşamasında',
    badge: 'Robotaksi Otonom',
    subsystems: ['Sensör Füzyonu (LiDAR & Kamera)', 'Derin Öğrenme Şerit/Engel Tespiti', 'ROS 2 Haberleşme', 'Drive-by-Wire Elektronik Kontrol'],
    specs: [
      { label: 'İşlem Birimi', value: 'NVIDIA Jetson / Endüstriyel PC' },
      { label: 'Algılama Menzili', value: '360° LiDAR + Stereo RGB' },
      { label: 'Yazılım Mimarisi', value: 'ROS 2 Humble / C++ & Python' },
      { label: 'Navigasyon', value: 'SLAM & Dinamik Engel Sakınma' },
      { label: 'Aktüasyon', value: 'Drive-by-Wire Direksiyon & Fren' },
      { label: 'Tepki Süresi', value: '< 40 ms' }
    ],
    highlights: [
      'Gerçek zamanlı derin öğrenme tabanlı nesne tespiti, yaya algılama ve trafik işaretleri tanıma.',
      'LiDAR nokta bulutu ile 3 boyutlu çevre haritalama ve anlık konumlandırma (SLAM).',
      'Araç fren ve direksiyon mekanizmalarını bilgisayar kontrollü çalıştıran elektronik donanım arabirimi.',
      'Donanımsal ve yazılımsal yedekli acil durum durdurma (E-Stop) güvenlik protokolü.'
    ]
  }
];

const DEFAULT_PROJECTS_EN = [
  {
    id: 1,
    title: 'TUFAN Electric Vehicle v1',
    description: 'High efficiency, custom-designed motor driver and lightweight carbon-fiber composite chassis electric race vehicle developed for TEKNOFEST Efficiency Challenge.',
    category: 'Electric Vehicle & Efficiency Challenge',
    status: 'Racing Vehicle',
    badge: 'TEKNOFEST EC',
    subsystems: ['In-house Motor Driver', 'Custom BMS (Battery Management System)', 'Carbon Fiber Chassis', 'Telemetry & CAN-Bus'],
    specs: [
      { label: 'Top Speed', value: '110 km/h' },
      { label: 'Battery Capacity', value: '4.2 kWh Li-Ion' },
      { label: 'Chassis Material', value: 'Carbon Fiber Composite' },
      { label: 'Driver Efficiency', value: '94% Peak Efficiency' },
      { label: 'Vehicle Weight', value: '170 kg' },
      { label: 'Range', value: '80+ km' }
    ],
    highlights: [
      'In-house designed and fabricated field-oriented control (FOC) motor driver architecture.',
      'Cell-level thermal, voltage, and current monitoring battery management system (BMS).',
      'Ultra-lightweight vacuum infusion carbon fiber composite monocoque chassis.',
      'Wireless telemetry system streaming live diagnostics directly to the pit station.'
    ]
  },
  {
    id: 2,
    title: 'TUFAN Autonomous',
    description: 'Next-generation electric vehicle platform equipped with LiDAR, stereo camera, and deep learning algorithms capable of autonomous navigation.',
    category: 'Autonomous Vehicle & Robotaxi',
    status: 'In Active Development',
    badge: 'Robotaksi Autonomous',
    subsystems: ['Sensor Fusion (LiDAR & Camera)', 'Deep Learning Lane/Obstacle Detection', 'ROS 2 Framework', 'Drive-by-Wire Electronic Control'],
    specs: [
      { label: 'Compute Unit', value: 'NVIDIA Jetson / Industrial PC' },
      { label: 'Detection Range', value: '360° LiDAR + Stereo RGB' },
      { label: 'Software Stack', value: 'ROS 2 Humble / C++ & Python' },
      { label: 'Navigation', value: 'SLAM & Dynamic Obstacle Avoidance' },
      { label: 'Actuation', value: 'Drive-by-Wire Steering & Braking' },
      { label: 'Response Time', value: '< 40 ms' }
    ],
    highlights: [
      'Real-time deep learning computer vision for object detection, pedestrians, and road signs.',
      '3D LiDAR point cloud processing for SLAM (Simultaneous Localization and Mapping).',
      'Custom drive-by-wire electronic interface for steering and brake actuation.',
      'Hardware and software fail-safe emergency stop (E-Stop) protocol.'
    ]
  }
];

const DEFAULT_SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/tufanelektromobil?igsh=bW0zemZ0YW9tNXM2',
  linkedin: 'https://www.linkedin.com/company/akdeniz-tufan-elektromobil/'
};

export default function Sections({ onOpenAdminModal, onOpenApplicationModal, lang, mediaRefreshKey = 0 }) {
  const [siteText, setSiteText] = useState('');
  const [heroTitle1, setHeroTitle1] = useState('');
  const [heroTitle2, setHeroTitle2] = useState('');
  const [projects, setProjects] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);
  const [featureCards, setFeatureCards] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const t = {
    teamLabel: lang === 'tr' ? 'TUFAN ELEKTROMOBİL TAKIMI' : 'TUFAN ELECTRIC VEHICLE TEAM',
    hero1Default: lang === 'tr' ? 'Geleceğin Elektrikli Araç Teknolojileri' : 'Electric Vehicle Technologies of the Future',
    hero2Default: lang === 'tr' ? 'TUFAN Elektromobil ile Yollarda.' : 'On the Road with TUFAN Electric.',
    aboutDefault: lang === 'tr'
      ? 'TUFAN Elektromobil Takımı, Akdeniz Üniversitesi bünyesinde yerli ve milli elektrikli araç teknolojileri geliştirmek amacıyla kurulmuş disiplinler arası bir mühendislik takımıdır.'
      : 'TUFAN Electric Vehicle Team is an interdisciplinary engineering team founded at Akdeniz University with the aim of developing domestic and national electric vehicle technologies.',
    projectsTitle: lang === 'tr' ? 'Projelerimiz' : 'Our Projects',
    noProjects: lang === 'tr' ? 'Henüz eklenmiş bir proje bulunmamaktadır.' : 'No projects have been added yet.',
    viewDetails: lang === 'tr' ? 'Detayları İncele' : 'View Details',
    projectDetailsTitle: lang === 'tr' ? 'Proje Detayları' : 'Project Details',
    techSpecs: lang === 'tr' ? 'Teknik Özellikler' : 'Technical Specifications',
    subsystems: lang === 'tr' ? 'Geliştirilen Alt Sistemler' : 'Developed Subsystems',
    highlights: lang === 'tr' ? 'Öne Çıkan Mühendislik Başarıları' : 'Key Engineering Highlights',
    applyForProject: lang === 'tr' ? 'Takıma Katıl / Başvuru Yap' : 'Join the Team / Apply',
    mediaTitle: lang === 'tr' ? 'Medya & Etkinlikler' : 'Media & Events',
    noMedia: lang === 'tr' ? 'Henüz medya öğesi bulunmamaktadır.' : 'No media items available yet.',
    dragHint: lang === 'tr' ? 'Sürükleyerek inceleyin' : 'Drag to explore',
    noDescription: lang === 'tr' ? 'Bu etkinlik hakkında henüz ayrıntılı bir açıklama eklenmemiş.' : 'No detailed description has been added for this event yet.',
    close: lang === 'tr' ? 'Kapat' : 'Close',
    rights: lang === 'tr' ? '© TUFAN Elektromobil Takımı. Tüm hakları saklıdır.' : '© TUFAN Electric Vehicle Team. All rights reserved.',
    adminLogin: lang === 'tr' ? 'Yönetici Girişi' : 'Admin Login',
    explore: lang === 'tr' ? 'İncele' : 'Explore',
  };

  useEffect(() => {
    // Hero Titles — localStorage'dan hızlıca yükle (flash önleme)
    const savedText = localStorage.getItem('site_about_text');
    setSiteText(savedText || '');
    setHeroTitle1(localStorage.getItem('site_hero_title1') || '');
    setHeroTitle2(localStorage.getItem('site_hero_title2') || '');

    // Feature Cards — localStorage'dan hızlıca yükle
    const savedFeatures = localStorage.getItem('site_feature_cards');
    if (savedFeatures) {
      try { setFeatureCards(JSON.parse(savedFeatures)); } catch (e) { setFeatureCards(null); }
    } else {
      setFeatureCards(null);
    }

    // Social Links — localStorage'dan hızlıca yükle
    const savedSocial = localStorage.getItem('site_social_links');
    if (savedSocial) {
      try { setSocialLinks(JSON.parse(savedSocial)); } catch (e) { /* default kalır */ }
    }

    // Settings API'den güncel verileri çek (localStorage'ı override eder)
    fetch(`${API_BASE}/settings/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const settingsMap = {};
          data.forEach(s => { settingsMap[s.key] = s.value; });
          if (settingsMap.site_about_text) setSiteText(settingsMap.site_about_text);
          if (settingsMap.site_hero_title1) setHeroTitle1(settingsMap.site_hero_title1);
          if (settingsMap.site_hero_title2) setHeroTitle2(settingsMap.site_hero_title2);
          if (settingsMap.site_feature_cards) {
            try { setFeatureCards(JSON.parse(settingsMap.site_feature_cards)); } catch (e) { /* localStorage değeri kalır */ }
          }
          if (settingsMap.site_social_links) {
            try { setSocialLinks(JSON.parse(settingsMap.site_social_links)); } catch (e) { /* default kalır */ }
          }
        }
      })
      .catch(err => console.error('Error fetching settings from API:', err));

    // Medya (from DB API)
    fetch(`${API_BASE}/media/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setMediaItems(data);
      })
      .catch(err => console.error('Error fetching media from API:', err));

    // Projeler (from DB API)
    fetch(`${API_BASE}/projeler/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(err => console.error('Error fetching projects from API:', err));

  }, [lang, mediaRefreshKey]);

  const MEDIA_TRANSLATIONS_EN = {
    'TEKNOFEST Hackathon 2025': {
      title: 'TEKNOFEST Hackathon 2025',
      date: 'May 2025',
      description: 'As the TUFAN Electric Vehicle team, we were awarded first place at the TEKNOFEST 2025 Hackathon event for our local battery management software and telemetry infrastructure.'
    },
    'Elektromobil Şasi Test Etkinliği': {
      title: 'Electric Vehicle Chassis Testing',
      date: 'April 2025',
      description: 'We successfully completed tests on our next-generation carbon fiber chassis. Aerodynamic drag coefficient and structural strength tests exceeded targeted standards.'
    },
    'Kurumsal Sponsorluk Zirvesi': {
      title: 'Corporate Sponsorship Summit',
      date: 'March 2025',
      description: 'Our gala organization bringing together our industry partners and main sponsors to introduce the TUFAN Electric vision and our new vehicle concept.'
    },
    'Otonom Sürüş Çalıştayı': {
      title: 'Autonomous Driving Workshop',
      date: 'February 2025',
      description: 'In-vehicle image processing and lane tracking systems were tested live during a 3-day campus workshop organized by our AI and computer vision team.'
    },
    'Yerli İnovasyon Sergisi': {
      title: 'Local Innovation Exhibition',
      date: 'January 2025',
      description: 'We presented our self-developed high-efficiency motor driver boards and on-board charger units to students and academics at our university innovation exhibition.'
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null);
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const PROJECT_TRANSLATIONS_EN = {
    'TUFAN Elektromobil v1': DEFAULT_PROJECTS_EN[0],
    'TUFAN Otonom': DEFAULT_PROJECTS_EN[1]
  };

  const translateDate = (dateStr) => {
    if (!dateStr || lang !== 'en') return dateStr;
    const months = {
      'Ocak': 'January', 'Şubat': 'February', 'Mart': 'March', 'Nisan': 'April',
      'Mayıs': 'May', 'Haziran': 'June', 'Temmuz': 'July', 'Ağustos': 'August',
      'Eylül': 'September', 'Ekim': 'October', 'Kasım': 'November', 'Aralık': 'December'
    };
    let res = dateStr;
    Object.keys(months).forEach(m => { res = res.replace(m, months[m]); });
    return res;
  };

  // Varsayılan ve dile göre belirlenen değerler
  const displayHero1 = lang === 'en' ? t.hero1Default : (heroTitle1 || t.hero1Default);
  const displayHero2 = lang === 'en' ? t.hero2Default : (heroTitle2 || t.hero2Default);
  const displayAbout = lang === 'en' ? t.aboutDefault : (siteText || t.aboutDefault);
  const displayFeatureCards = lang === 'en' ? DEFAULT_FEATURE_CARDS_EN : (featureCards || DEFAULT_FEATURE_CARDS_TR);

  const displayMediaItems = mediaItems.map(item => {
    if (lang === 'en') {
      const trans = MEDIA_TRANSLATIONS_EN[item.title];
      if (trans) {
        return { ...item, title: trans.title, date: trans.date, description: trans.description };
      }
      return { ...item, date: translateDate(item.date) };
    }
    return item;
  });

  const rawProjects = (projects && projects.length > 0)
    ? projects
    : (lang === 'en' ? DEFAULT_PROJECTS_EN : DEFAULT_PROJECTS_TR);

  const displayProjects = rawProjects.map(proj => {
    const defaultList = lang === 'en' ? DEFAULT_PROJECTS_EN : DEFAULT_PROJECTS_TR;
    let enriched = { ...proj };

    if (lang === 'en' && PROJECT_TRANSLATIONS_EN[proj.title]) {
      enriched = { ...enriched, ...PROJECT_TRANSLATIONS_EN[proj.title] };
    }

    const match = defaultList.find(d =>
      (d.title && proj.title && d.title.toLowerCase() === proj.title.toLowerCase()) ||
      d.id === proj.id
    );

    if (match) {
      enriched = {
        ...match,
        ...enriched,
        specs: match.specs,
        subsystems: match.subsystems,
        highlights: match.highlights,
        badge: enriched.badge || match.badge,
        category: enriched.category || match.category,
        status: enriched.status || match.status
      };
    }
    return enriched;
  });

  const getIconForFeature = (title, index) => {
    const fallbackIcons = [Users, Cpu, ShieldCheck];
    if (!title) {
      return fallbackIcons[index % fallbackIcons.length];
    }
    const upperTitle = title.toUpperCase();
    if (upperTitle.includes('MEKANİK') || upperTitle.includes('MEKANIK') || upperTitle.includes('MECHANICAL')) return Settings;
    if (upperTitle.includes('MOTOR SÜRÜCÜ') || upperTitle.includes('MOTOR SURUCU') || upperTitle.includes('DRIVER')) return Cpu;
    if (upperTitle.includes('YAZILIM') || upperTitle.includes('SOFTWARE')) return Monitor;
    if (upperTitle.includes('İLETİŞİM') || upperTitle.includes('ILETISIM') || upperTitle.includes('DISCIPLINARY') || upperTitle.includes('TEAMWORK')) return Users;
    if (upperTitle.includes('MOTOR')) return Wrench;
    if (upperTitle.includes('ŞARJ') || upperTitle.includes('SARJ')) return Zap;
    if (upperTitle.includes('BATARYA') || upperTitle.includes('BATTERY')) return BatteryCharging;
    if (upperTitle.includes('DOMESTIC') || upperTitle.includes('YERLİ') || upperTitle.includes('PRODUCTION')) return ShieldCheck;
    if (upperTitle.includes('COMPETITION') || upperTitle.includes('PERFORMANCE') || upperTitle.includes('YARIŞMA')) return Zap;
    return fallbackIcons[index % fallbackIcons.length];
  };

  return (
    <div className="container" style={{ marginTop: '6rem' }}>

      {/* Page Header Indicator */}
      <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: 0.8 }} className="animate-fade-in">
        <span className="gradient-text" style={{
          fontSize: '0.85rem',
          fontWeight: '800',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
          display: 'inline-block'
        }}>
          {t.teamLabel}
        </span>
      </div>

      {/* Corporate Hero / About Section */}
      <section id="about" className="section animate-fade-in">
        <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', marginBottom: '1.5rem', maxWidth: '800px', fontWeight: '800', lineHeight: '1.1' }}>
          <span className="gradient-text">{displayHero1}</span><br />
          <span className="gradient-text-reverse">{displayHero2}</span>
        </h1>
        <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 0 2rem 0', fontWeight: '400', lineHeight: '1.8' }} className="markdown-content">
          <ReactMarkdown>{displayAbout}</ReactMarkdown>
        </div>

        <div className="premium-grid">
          {displayFeatureCards.map((card, index) => {
            const Icon = getIconForFeature(card.title, index);
            return (
              <div className="premium-card" key={card.id}>
                <div className="animate-float" style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: 'var(--tfn-blue)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px -5px rgba(17, 57, 150, 0.4)'
                }}>
                  <Icon size={26} strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{card.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="projects" className="section reveal" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6rem' }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: '3rem', color: 'var(--text-primary)' }}>{t.projectsTitle}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {displayProjects.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>{t.noProjects}</p>
          ) : (
            displayProjects.map((project, index) => (
              <div
                key={project.id || index}
                className="premium-card project-card-interactive"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  alignItems: 'center',
                  padding: 'clamp(1.25rem, 3vw, 3rem)'
                }}
              >
                <div style={{ flex: '0 0 auto', padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/teknofest.webp" alt="Teknofest Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'grayscale(100%) contrast(1.2) opacity(0.85)' }} />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <h3
                      className="project-title-interactive"
                      onClick={() => setSelectedProject(project)}
                      style={{
                        fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                        margin: 0,
                        cursor: 'pointer'
                      }}
                      title={t.viewDetails}
                    >
                      {project.title}
                    </h3>
                    {project.badge && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: 'var(--tfn-blue)',
                        backgroundColor: 'rgba(17, 57, 150, 0.08)',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '999px',
                        border: '1px solid rgba(17, 57, 150, 0.15)'
                      }}>
                        {project.badge}
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1rem', maxWidth: '650px', lineHeight: '1.6' }}>
                    {project.description}
                  </p>
                  <button
                    className="btn btn-outline"
                    onClick={() => setSelectedProject(project)}
                    style={{
                      fontSize: '0.85rem',
                      padding: '0.55rem 1.25rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{t.viewDetails}</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Media & Archive Section */}
      <section id="media" className="section reveal" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6rem', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>{t.mediaTitle}</h2>

        {displayMediaItems.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>{t.noMedia}</p>
        ) : (
          <MediaMarquee
            items={displayMediaItems}
            onSelectMedia={(item) => setSelectedMedia(item)}
            dragHint={t.dragHint}
            lang={lang}
          />
        )}
      </section>

      {/* Media Item Detail Modal */}
      {selectedMedia && (
        <div className="modal-overlay active" onClick={() => setSelectedMedia(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '650px', padding: '2rem' }}
          >
            <button className="modal-close" onClick={() => setSelectedMedia(null)}>
              <X size={24} />
            </button>

            {/* Image display */}
            <div style={{
              width: '100%',
              maxHeight: '380px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)'
            }}>
              {selectedMedia.imageUrl ? (
                <img
                  src={selectedMedia.imageUrl}
                  alt={selectedMedia.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '380px', display: 'block' }}
                />
              ) : (
                <div style={{ padding: '3rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Camera size={48} />
                  <span>TUFAN {lang === 'tr' ? 'Elektromobil' : 'Electric'}</span>
                </div>
              )}
            </div>

            {/* Date Tag */}
            {selectedMedia.date && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                color: 'var(--tfn-orange)',
                fontWeight: '600',
                backgroundColor: 'rgba(255, 100, 10, 0.1)',
                padding: '0.3rem 0.8rem',
                borderRadius: '999px',
                marginBottom: '0.75rem'
              }}>
                <Calendar size={13} /> {selectedMedia.date}
              </span>
            )}

            {/* Event Title */}
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {selectedMedia.title}
            </h3>

            {/* Event Description */}
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
              {selectedMedia.description || t.noDescription}
            </div>

            <button className="btn btn-outline" onClick={() => setSelectedMedia(null)} style={{ width: '100%' }}>
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="modal-overlay active" onClick={() => setSelectedProject(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '740px',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label={t.close}
            >
              <X size={24} />
            </button>

            {/* Top Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                color: 'var(--tfn-blue)',
                fontWeight: '700',
                backgroundColor: 'rgba(17, 57, 150, 0.1)',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                border: '1px solid rgba(17, 57, 150, 0.2)'
              }}>
                <Trophy size={14} />
                {selectedProject.badge || (lang === 'tr' ? 'TEKNOFEST Projesi' : 'TEKNOFEST Project')}
              </span>

              {selectedProject.category && (
                <span style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border-color)'
                }}>
                  {selectedProject.category}
                </span>
              )}

              {selectedProject.status && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  color: 'var(--tfn-orange)',
                  fontWeight: '600',
                  backgroundColor: 'rgba(255, 100, 10, 0.1)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px'
                }}>
                  <Sparkles size={13} />
                  {selectedProject.status}
                </span>
              )}
            </div>

            {/* Project Title */}
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
              fontWeight: '800',
              lineHeight: '1.2',
              marginBottom: '1.25rem',
              color: 'var(--text-primary)'
            }}>
              {selectedProject.title}
            </h2>

            {/* Banner card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(17, 57, 150, 0.08) 0%, rgba(255, 100, 10, 0.06) 100%)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: 'var(--shadow-sm)'
              }}>
                <img
                  src="/teknofest.webp"
                  alt="Teknofest"
                  style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                />
              </div>
              <div style={{ flex: '1 1 220px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--tfn-blue)', marginBottom: '0.2rem' }}>
                  Akdeniz Üniversitesi TUFAN Takımı
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {lang === 'tr'
                    ? 'Yerli ve milli imkanlarla geliştirilen yüksek teknolojili mühendislik aracı.'
                    : 'High-tech engineering vehicle developed with domestic and national capabilities.'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                color: 'var(--text-primary)',
                fontSize: '1rem',
                lineHeight: '1.8'
              }} className="markdown-content">
                <ReactMarkdown>{selectedProject.description}</ReactMarkdown>
              </div>
            </div>

            {/* Technical Specifications */}
            {selectedProject.specs && selectedProject.specs.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Gauge size={17} color="var(--tfn-blue)" />
                  {t.techSpecs}
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {selectedProject.specs.map((spec, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        padding: '0.85rem 1rem',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem'
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {spec.label}
                      </span>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subsystems */}
            {selectedProject.subsystems && selectedProject.subsystems.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Layers size={17} color="var(--tfn-blue)" />
                  {t.subsystems}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedProject.subsystems.map((sub, subIdx) => (
                    <span
                      key={subIdx}
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        color: 'var(--text-primary)',
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {selectedProject.highlights && selectedProject.highlights.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckCircle2 size={17} color="var(--tfn-blue)" />
                  {t.highlights}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {selectedProject.highlights.map((hl, hlIdx) => (
                    <div
                      key={hlIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                        fontSize: '0.95rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6'
                      }}
                    >
                      <CheckCircle2 size={16} color="var(--tfn-orange)" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              {onOpenApplicationModal && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedProject(null);
                    onOpenApplicationModal();
                  }}
                  style={{
                    flex: '1 1 220px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Users size={16} />
                  <span>{t.applyForProject}</span>
                </button>
              )}
              <button
                className="btn btn-outline"
                onClick={() => setSelectedProject(null)}
                style={{ flex: onOpenApplicationModal ? '0 1 120px' : '1 1 100%' }}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ padding: '4rem 0 2rem 0', borderTop: '1px solid var(--border-color)', marginTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ fontWeight: '700', fontSize: '1.2rem', letterSpacing: '-0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/tufan.jpg" alt="TUFAN" className="logo-themed" style={{ height: '28px', width: '28px', objectFit: 'contain', borderRadius: '50%' }} />
          TUFAN
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href={socialLinks.instagram} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Instagram</a>
          <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>LinkedIn</a>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>{t.rights}</span>
          <button
            onClick={onOpenAdminModal}
            style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-secondary)', opacity: 0.15, cursor: 'pointer', fontSize: '0.8rem', transition: 'opacity 0.2s ease' }}
            onMouseEnter={(e) => e.target.style.opacity = 0.7}
            onMouseLeave={(e) => e.target.style.opacity = 0.15}
          >
            {t.adminLogin}
          </button>
        </div>
      </footer>
    </div>
  );
}
