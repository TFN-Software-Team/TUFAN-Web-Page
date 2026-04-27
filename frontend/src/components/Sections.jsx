import React, { useState, useEffect } from 'react';
import { Users, LayoutGrid, ShieldCheck, Cpu, Smartphone, Network, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import API_BASE from '../config';

export default function Sections() {
  const [siteText, setSiteText] = useState('');
  const [heroTitle1, setHeroTitle1] = useState('');
  const [heroTitle2, setHeroTitle2] = useState('');
  const [projects, setProjects] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [socialLinks, setSocialLinks] = useState({});
  const [featureCards, setFeatureCards] = useState([]);
  const [lastModified, setLastModified] = useState({ about: null, features: null });

  useEffect(() => {
    // Biz Kimiz
    const savedText = localStorage.getItem('site_about_text');
    setSiteText(savedText || 'TUFAN, teknoloji ve verimliliği merkeze alan kurumsal bir öğrenci ağıdır. Üniversite ekosistemini optimize etmek, operasyonel zorlukları dijital araçlarla çözmek ve sürdürülebilir altyapılar inşa etmek için çalışıyoruz.');
    
    setHeroTitle1(localStorage.getItem('site_hero_title1') || 'Dijital Çözümler.');
    setHeroTitle2(localStorage.getItem('site_hero_title2') || 'Maksimum Etki.');
    
    // Feature Cards
    const savedFeatures = localStorage.getItem('site_feature_cards');
    if (savedFeatures) {
      setFeatureCards(JSON.parse(savedFeatures));
    } else {
      setFeatureCards([
        { id: 1, title: 'Bütünleşik Altyapı', description: 'Farklı disiplinlerden gelen yetenekleri tek bir sistem altında birleştirerek yüksek performanslı bir ağ oluşturuyoruz.' },
        { id: 2, title: 'İleri Teknoloji', description: 'Modern framework\'ler ve ölçeklenebilir mimariler ile sektörel standartlarda ürünler geliştiriyoruz.' },
        { id: 3, title: 'Güvenilirlik', description: 'Sistemlerimiz, yüksek trafikli kampüs gereksinimlerini karşılamak üzere kesintisiz ve güvenli şekilde tasarlanmıştır.' }
      ]);
    }

    // Last Modified
    setLastModified({
      about: localStorage.getItem('last_mod_about'),
      features: localStorage.getItem('last_mod_features')
    });

    // Medya
    const savedMedia = localStorage.getItem('site_media_items');
    if (savedMedia) {
      setMediaItems(JSON.parse(savedMedia));
    } else {
      setMediaItems([
        { id: 1, title: 'HACKATHON 2025' },
        { id: 2, title: 'KURUMSAL TANITIM' },
        { id: 3, title: 'BASIN KİTİ' }
      ]);
    }

    // Sosyal Medya
    const savedSocial = localStorage.getItem('site_social_links');
    if (savedSocial) {
      setSocialLinks(JSON.parse(savedSocial));
    } else {
      setSocialLinks({
        instagram: 'https://instagram.com/tufan',
        linkedin: 'https://linkedin.com/company/tufan'
      });
    }

    // Projeler (from API)
    fetch(`${API_BASE}/projeler/`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Error fetching projects:', err));
      
  }, []);

  return (
    <div className="container" style={{ marginTop: '6rem' }}>
      
      {/* Page Header Indicator */}
      <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: 0.8 }} className="animate-fade-in">
        <span style={{ 
          fontSize: '0.8rem', 
          fontWeight: '700', 
          letterSpacing: '0.4em', 
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem'
        }}>
          TUFAN ELEKTROMOBİL
        </span>
      </div>

      {/* Corporate Hero / About Section */}
      <section id="about" className="section animate-fade-in">
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', maxWidth: '800px', fontWeight: '800' }}>
          {heroTitle1}<br />
          <span style={{ color: 'var(--text-secondary)' }}>{heroTitle2}</span>
        </h1>
        <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 0 2rem 0', fontWeight: '400', lineHeight: '1.8' }} className="markdown-content">
          <ReactMarkdown>{siteText}</ReactMarkdown>
        </div>

        {lastModified.about && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.6, marginBottom: '2rem' }}>
            <Clock size={12} /> Son değiştirme tarihi: {lastModified.about}
          </div>
        )}
        
        <div className="premium-grid">
          {featureCards.map((card, index) => {
            const icons = [Users, Cpu, ShieldCheck];
            const Icon = icons[index % icons.length];
            return (
              <div className="premium-card" key={card.id}>
                <Icon size={28} style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }} strokeWidth={1.5} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{card.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
        {lastModified.features && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.6, marginTop: '1rem', justifyContent: 'flex-end' }}>
            <Clock size={12} /> Son değiştirme tarihi: {lastModified.features}
          </div>
        )}
      </section>

      {/* Corporate Projects Section */}
      <section id="projects" className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Projeler ve Ürünler</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {projects.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Henüz proje eklenmemiş. Lütfen admin panelinden proje ekleyin.</p>
          ) : (
            projects.map((project, index) => (
              <div key={project.id} className="premium-card" style={{ display: 'flex', gap: '3rem', alignItems: 'center', padding: '3rem' }}>
                <div style={{ flex: '0 0 auto', padding: '1.5rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  {index % 2 === 0 ? <Smartphone size={32} strokeWidth={1.5} /> : <Network size={32} strokeWidth={1.5} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1rem', maxWidth: '600px' }}>
                    {project.description}
                  </p>
                  <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Detayları Görüntüle</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Corporate Media Section */}
      <section id="media" className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Medya ve Arşiv</h2>
        
        <div className="premium-grid">
          {mediaItems.map(item => (
            <div key={item.id} style={{ height: '250px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem', letterSpacing: '0.05em' }}>{item.title}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ padding: '4rem 0 2rem 0', borderTop: '1px solid var(--border-color)', marginTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ fontWeight: '700', fontSize: '1.2rem', letterSpacing: '-0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/tufan.jpg" alt="TUFAN" className="logo-themed" style={{ height: '28px', width: '28px', objectFit: 'contain', borderRadius: '50%' }} />
          TUFAN.
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href={socialLinks.instagram} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Instagram</a>
          <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>LinkedIn</a>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          &copy; 2026 TUFAN. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
