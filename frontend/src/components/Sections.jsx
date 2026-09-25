import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Cpu, Smartphone, Network, X, Calendar, Camera } from 'lucide-react';
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

const DEFAULT_MEDIA_ITEMS = [
  {
    id: 1,
    title: 'TEKNOFEST Hackathon 2025',
    date: 'May 2025',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    description: 'As the TUFAN Electric Vehicle team, we were honored with first place at the TEKNOFEST 2025 Hackathon with our domestically developed battery management software and telemetry infrastructure.'
  },
  {
    id: 2,
    title: 'Electric Vehicle Chassis Test Event',
    date: 'April 2025',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'We successfully completed our next-generation carbon fiber chassis tests. The aerodynamic drag coefficient and strength tests of our vehicle exceeded the targeted standards.'
  },
  {
    id: 3,
    title: 'Corporate Sponsorship Summit',
    date: 'March 2025',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    description: 'A gala event where we gathered with our industry partners and main sponsors to introduce the TUFAN Electric Vehicle vision and our new vehicle concept.'
  },
  {
    id: 4,
    title: 'Autonomous Driving Workshop',
    date: 'February 2025',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    description: 'During a 3-day campus workshop organized by our AI and computer vision team, in-vehicle image processing and lane-following systems were tested live.'
  },
  {
    id: 5,
    title: 'Domestic Innovation Exhibition',
    date: 'January 2025',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'We presented our self-developed high-efficiency motor driver cards and on-board charging units to students and academics at our university\'s innovation exhibition.'
  }
];

const DEFAULT_MEDIA_ITEMS_TR = [
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
];

export default function Sections({ onOpenAdminModal, lang, mediaRefreshKey = 0 }) {
  const [siteText, setSiteText] = useState('');
  const [heroTitle1, setHeroTitle1] = useState('');
  const [heroTitle2, setHeroTitle2] = useState('');
  const [projects, setProjects] = useState([]);
  const [mediaItems, setMediaItems] = useState(() => {
    try {
      const saved = localStorage.getItem('site_media_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_MEDIA_ITEMS_TR;
  });
  const [socialLinks, setSocialLinks] = useState({});
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
    // Hero Titles — admin tarafından özelleştirilebilir, yoksa dile göre default
    const savedText = localStorage.getItem('site_about_text');
    setSiteText(savedText || '');

    setHeroTitle1(localStorage.getItem('site_hero_title1') || '');
    setHeroTitle2(localStorage.getItem('site_hero_title2') || '');

    // Feature Cards — admin özelleştirmesi varsa onu kullan
    const savedFeatures = localStorage.getItem('site_feature_cards');
    if (savedFeatures) {
      setFeatureCards(JSON.parse(savedFeatures));
    } else {
      setFeatureCards(null);
    }

    // Medya (from DB API)
    fetch(`${API_BASE}/media/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMediaItems(data);
      })
      .catch(err => console.error('Error fetching media from API:', err));

    // Projeler (from DB API)
    fetch(`${API_BASE}/projeler/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(err => console.error('Error fetching projects from API:', err));

  }, [lang, mediaRefreshKey]);

  // Varsayılan değerler
  const displayHero1 = heroTitle1 || t.hero1Default;
  const displayHero2 = heroTitle2 || t.hero2Default;
  const displayAbout = siteText || t.aboutDefault;
  const defaultFeatureCards = lang === 'tr' ? DEFAULT_FEATURE_CARDS_TR : DEFAULT_FEATURE_CARDS_EN;
  const displayFeatureCards = featureCards || defaultFeatureCards;
  const defaultMediaItems = lang === 'tr' ? DEFAULT_MEDIA_ITEMS_TR : DEFAULT_MEDIA_ITEMS;
  const displayMediaItems = (mediaItems && mediaItems.length > 0) ? mediaItems : defaultMediaItems;

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
            const icons = [Users, Cpu, ShieldCheck];
            const Icon = icons[index % icons.length];
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
          {projects.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>{t.noProjects}</p>
          ) : (
            projects.map((project, index) => (
              <div key={project.id} className="premium-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', padding: 'clamp(1.25rem, 3vw, 3rem)' }}>
                <div style={{ flex: '0 0 auto', padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  {index % 2 === 0 ? <Smartphone size={32} strokeWidth={1.5} /> : <Network size={32} strokeWidth={1.5} />}
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
