import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Cpu, Smartphone, Network, X, Calendar, Camera } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import API_BASE from '../config';
import { translations } from '../translations';
import MediaMarquee from './MediaMarquee';

export default function Sections({ onOpenAdminModal, lang }) {
  const [siteText, setSiteText] = useState('');
  const [heroTitle1, setHeroTitle1] = useState('');
  const [heroTitle2, setHeroTitle2] = useState('');
  const [projects, setProjects] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [socialLinks, setSocialLinks] = useState({});
  const [featureCards, setFeatureCards] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const t = translations[lang];

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
      setFeatureCards(null); // null = dile göre translations'dan al
    }

    // Medya
    const savedMedia = localStorage.getItem('site_media_items');
    if (savedMedia) {
      try {
        setMediaItems(JSON.parse(savedMedia));
      } catch (e) {
        setMediaItems(null);
      }
    } else {
      setMediaItems(null); // null = dile göre translations'dan al
    }

    // Sosyal Medya
    const savedSocial = localStorage.getItem('site_social_links');
    if (savedSocial) {
      try {
        const parsed = JSON.parse(savedSocial);
        if (parsed.instagram === 'https://instagram.com/tufan') {
          parsed.instagram = 'https://www.instagram.com/tufanelektromobil?igsh=bW0zemZ0YW9tNXM2';
        }
        if (parsed.linkedin === 'https://linkedin.com/company/tufan') {
          parsed.linkedin = 'https://www.linkedin.com/company/akdeniz-tufan-elektromobil/';
        }
        localStorage.setItem('site_social_links', JSON.stringify(parsed));
        setSocialLinks(parsed);
      } catch (e) {
        setSocialLinks({
          instagram: 'https://www.instagram.com/tufanelektromobil?igsh=bW0zemZ0YW9tNXM2',
          linkedin: 'https://www.linkedin.com/company/akdeniz-tufan-elektromobil/'
        });
      }
    } else {
      setSocialLinks({
        instagram: 'https://www.instagram.com/tufanelektromobil?igsh=bW0zemZ0YW9tNXM2',
        linkedin: 'https://www.linkedin.com/company/akdeniz-tufan-elektromobil/'
      });
    }

    // Projeler (from API)
    fetch(`${API_BASE}/projeler/`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Error fetching projects:', err));

  }, []);

  // Dile göre çözümlenen değerler
  const displayHero1 = heroTitle1 || t.heroTitle1Default;
  const displayHero2 = heroTitle2 || t.heroTitle2Default;
  const displayAbout = siteText || t.aboutTextDefault;
  const displayFeatureCards = featureCards || t.featureCards;
  const displayMediaItems = mediaItems || t.mediaItems;

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
          TUFAN {t.brandSubtitle}
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
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: '3rem', color: 'var(--tfn-blue)' }}>{t.projectsSectionTitle}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {projects.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>{t.noProjectsMsg}</p>
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
                  <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>{t.projectDetailsBtn}</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Media & Archive Section */}
      <section id="media" className="section reveal" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6rem', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--tfn-blue)' }}>{t.mediaSectionTitle}</h2>

        {displayMediaItems.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>{t.noMediaMsg}</p>
        ) : (
          <MediaMarquee
            items={displayMediaItems}
            onSelectMedia={(item) => setSelectedMedia(item)}
            dragHint={t.mediaDragHint}
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
                  <span>TUFAN Elektromobil</span>
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
              {selectedMedia.description || 'Bu etkinlik hakkında henüz ayrıntılı bir açıklama eklenmemiş.'}
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
          <span>{t.footerRights}</span>
          <button
            onClick={onOpenAdminModal}
            style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-secondary)', opacity: 0.15, cursor: 'pointer', fontSize: '0.8rem', transition: 'opacity 0.2s ease' }}
            onMouseEnter={(e) => e.target.style.opacity = 0.7}
            onMouseLeave={(e) => e.target.style.opacity = 0.15}
          >
            {t.footerManage}
          </button>
        </div>
      </footer>
    </div>
  );
}

