import React from 'react';
import { Users, Rocket, Image as ImageIcon, Video, Code, Shield } from 'lucide-react';

export default function Sections() {
  return (
    <div className="container" style={{ marginTop: '5rem' }}>
      
      {/* Hero / About Section */}
      <section id="about" className="section animate-fade-in">
        <h1 className="section-title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Biz Kimiz?</h1>
        <p style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          TUFAN, üniversite öğrencilerinin kampüs hayatını kolaylaştırmak, dijital çözümler üretmek ve
          modern teknolojileri kullanarak yenilikçi projeler geliştirmek amacıyla kurulmuş bir öğrenci topluluğudur.
        </p>
        
        <div className="grid-3">
          <div className="card glass">
            <Users size={40} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
            <h3>Büyük Bir Aile</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Farklı fakültelerden bir araya gelen tutkulu öğrencilerin oluşturduğu güçlü bir ağ.
            </p>
          </div>
          <div className="card glass">
            <Code size={40} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
            <h3>Modern Teknolojiler</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              En güncel yazılım dilleri ve framework'ler ile projeler geliştiriyoruz.
            </p>
          </div>
          <div className="card glass">
            <Shield size={40} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
            <h3>Güvenilir Çözümler</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Öğrencilerin gerçek sorunlarına kalıcı ve güvenilir dijital çözümler üretiyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <h2 className="section-title">Projelerimiz</h2>
        
        <div className="grid-2">
          <div className="card glass" style={{ padding: '2rem' }}>
            <Rocket size={32} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>TUFAN Mobil Uygulama</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Öğrencilerin ders notlarına, etkinliklere ve kampüs içi duyurulara tek tıkla ulaşmasını sağlayan kapsamlı mobil uygulamamız.
            </p>
            <button className="btn btn-outline">İncele</button>
          </div>
          
          <div className="card glass" style={{ padding: '2rem' }}>
            <Code size={32} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Gönüllü Eşleştirme Platformu</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Sosyal sorumluluk projeleri ile gönüllü öğrencileri saniyeler içinde bir araya getiren yapay zeka destekli eşleştirme sistemi.
            </p>
            <button className="btn btn-outline">İncele</button>
          </div>
        </div>
      </section>

      {/* Media Section */}
      <section id="media" className="section">
        <h2 className="section-title">Medya ve Galeri</h2>
        
        <div className="grid-3">
          <div className="card glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
            <ImageIcon size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ color: 'var(--text-secondary)' }}>Hackathon 2025</h4>
          </div>
          <div className="card glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
            <Video size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ color: 'var(--text-secondary)' }}>Tanıtım Filmi</h4>
          </div>
          <div className="card glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
            <ImageIcon size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ color: 'var(--text-secondary)' }}>Topluluk Buluşması</h4>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', marginTop: '2rem' }}>
        <p>&copy; 2026 TUFAN. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
