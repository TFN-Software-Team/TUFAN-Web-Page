import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Cpu, X, Calendar, Camera, Settings, Monitor, Megaphone, Wrench, Zap, BatteryCharging } from 'lucide-react';
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



const DEFAULT_SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/tufanelektromobil?igsh=bW0zemZ0YW9tNXM2',
  linkedin: 'https://www.linkedin.com/company/akdeniz-tufan-elektromobil/'
};

export default function Sections({ onOpenAdminModal, lang, mediaRefreshKey = 0 }) {
  const [siteText, setSiteText] = useState('');
  const [heroTitle1, setHeroTitle1] = useState('');
  const [heroTitle2, setHeroTitle2] = useState('');
  const [projects, setProjects] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);
  const [featureCards, setFeatureCards] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

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

  const PROJECT_TRANSLATIONS_EN = {
    'TUFAN Elektromobil v1': {
      title: 'TUFAN Electric Vehicle v1',
      description: 'High efficiency, custom-designed motor driver and lightweight carbon-fiber composite chassis electric race vehicle developed for TEKNOFEST.'
    },
    'TUFAN Otonom': {
      title: 'TUFAN Autonomous',
      description: 'Next-generation electric vehicle platform equipped with LiDAR, camera, and deep learning algorithms capable of autonomous navigation.'
    }
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

  const displayProjects = projects.map(proj => {
    if (lang === 'en' && PROJECT_TRANSLATIONS_EN[proj.title]) {
      return { ...proj, ...PROJECT_TRANSLATIONS_EN[proj.title] };
    }
    return proj;
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
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: '3rem', color: 'var(--tfn-blue)' }}>{t.projectsTitle}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {displayProjects.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>{t.noProjects}</p>
          ) : (
            displayProjects.map((project, index) => (
              <div key={project.id} className="premium-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', padding: 'clamp(1.25rem, 3vw, 3rem)' }}>
                <div style={{ flex: '0 0 auto', padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/teknofest.webp" alt="Teknofest Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'grayscale(100%) contrast(1.2) opacity(0.85)' }} />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', margin: '0 0 0.5rem 0' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1rem', maxWidth: '600px' }}>
                    {project.description}
                  </p>
                  <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>{t.viewDetails}</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Media & Archive Section */}
      <section id="media" className="section reveal" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6rem', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--tfn-blue)' }}>{t.mediaTitle}</h2>

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
