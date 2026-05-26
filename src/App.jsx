import { useState } from 'react'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = ['Portfolio', 'Serviços', 'Equipe', 'Contato']

  return (
    <>
      {/* ========== Glass Navigation ========== */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <span className="nav-logo-icon"></span>
            PortfolioPro
          </div>
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link}>
                <a href={`#${link.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>{link}</a>
              </li>
            ))}
          </ul>
          <button
            className="nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* ========== Hero Section (Dark) ========== */}
      <section className="hero" id="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Agência Criativa</p>
          <h1 className="hero-title">Criamos experiências digitais extraordinárias</h1>
          <p className="hero-subtitle">
            Design thinking, tecnologia de ponta e estratégia digital para transformar seu negócio.
          </p>
          <div className="hero-cta-group">
            <a href="#portfolio" className="btn btn-primary">Ver portfólio</a>
            <a href="#contato" className="btn btn-outline">Fale conosco</a>
          </div>
          <div className="hero-mockup placeholder-img" style={{ height: 400, borderRadius: 18 }}>
            <span>Produto Mockup</span>
          </div>
        </div>
      </section>

      {/* ========== Portfolio Section (Light) ========== */}
      <section className="section section-light" id="portfolio">
        <div className="section-inner">
          <p className="section-label">Portfolio</p>
          <h2 className="section-title">Projetos que inspiram</h2>
          <p className="section-subtitle">
            Cada projeto é uma história única. Conheça alguns de nossos trabalhos.
          </p>
          <div className="portfolio-grid">
            {[
              {
                tag: 'Web App',
                title: 'Plataforma Fintech',
                text: 'Dashboard financeiro completo com analytics em tempo real e integração bancária.',
                color: 'linear-gradient(135deg, #1a1a2e, #16213e)',
              },
              {
                tag: 'E-commerce',
                title: 'Marketplace Premium',
                text: 'Loja virtual com experiência de compra personalizada e checkout otimizado.',
                color: 'linear-gradient(135deg, #0f0c29, #302b63)',
              },
              {
                tag: 'Mobile',
                title: 'App Saúde & Bem-Estar',
                text: 'Aplicativo mobile com tracking de atividades, metas gamificadas e social feed.',
                color: 'linear-gradient(135deg, #2d1b69, #11998e)',
              },
              {
                tag: 'Branding',
                title: 'Identidade Visual',
                text: 'Rebranding completo com sistema de design, guideline e assets digitais.',
                color: 'linear-gradient(135deg, #000428, #004e92)',
              },
            ].map((item, i) => (
              <div className="portfolio-card" key={i}>
                <div
                  className="portfolio-card-img placeholder-img"
                  style={{ background: item.color }}
                >
                  <span>{item.title}</span>
                </div>
                <div className="portfolio-card-body">
                  <p className="portfolio-card-tag">{item.tag}</p>
                  <h3 className="portfolio-card-title">{item.title}</h3>
                  <p className="portfolio-card-text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Services Section (White) ========== */}
      <section className="section section-white" id="servicos">
        <div className="section-inner">
          <p className="section-label">Serviços</p>
          <h2 className="section-title">O que fazemos</h2>
          <p className="section-subtitle">
            Da estratégia à execução, entregamos soluções completas.
          </p>
          <div className="services-grid">
            {[
              { icon: '🎨', name: 'Design UI/UX', desc: 'Interfaces intuitivas e experiências memoráveis que encantam usuários.' },
              { icon: '⚡', name: 'Desenvolvimento Web', desc: 'Aplicações rápidas, escaláveis e modernas com as melhores tecnologias.' },
              { icon: '📱', name: 'Apps Mobile', desc: 'Apps nativos e híbridos para iOS e Android com performance nativa.' },
              { icon: '🔍', name: 'SEO & Performance', desc: 'Otimização para mecanismos de busca e performance de carregamento.' },
              { icon: '🎯', name: 'Estratégia Digital', desc: 'Planejamento estratégico para maximizar presença e resultados online.' },
              { icon: '🏷️', name: 'Branding', desc: 'Identidade visual completa, naming e posicionamento de marca.' },
            ].map((s, i) => (
              <div className="service-tile" key={i}>
                <div className="service-icon">{s.icon}</div>
                <h3 className="service-name">{s.name}</h3>
                <p className="service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Team Section (Light) ========== */}
      <section className="section section-light" id="equipe">
        <div className="section-inner">
          <p className="section-label">Equipe</p>
          <h2 className="section-title">Quem somos</h2>
          <p className="section-subtitle">
            Profissionais apaixonados por criar o extraordinário.
          </p>
          <div className="team-grid">
            {[
              { name: 'Ana Silva', role: 'CEO & Fundadora', bio: '15 anos de experiência em design e inovação digital. Ex-Apple, ex-Google.', initials: 'AS' },
              { name: 'Lucas Oliveira', role: 'CTO', bio: 'Arquiteto de soluções full-stack. Especialista em React, Node.js e cloud.', initials: 'LO' },
              { name: 'Marina Costa', role: 'Head de Design', bio: 'Designer premiada com foco em UI/UX e sistemas de design escaláveis.', initials: 'MC' },
            ].map((m, i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar placeholder-avatar">
                  {m.initials}
                </div>
                <div className="team-info">
                  <h3 className="team-name">{m.name}</h3>
                  <p className="team-role">{m.role}</p>
                  <p className="team-bio">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA Section (Dark) ========== */}
      <section className="cta-section" id="contato">
        <div className="section-inner">
          <h2 className="cta-title">Vamos criar algo extraordinário juntos?</h2>
          <p className="cta-text">
            Transforme sua ideia em realidade. Nossa equipe está pronta para o próximo grande desafio.
          </p>
          <a href="mailto:ola@portfoliopro.com" className="cta-btn">
            Iniciar projeto
          </a>
        </div>
      </section>

      {/* ========== Footer ========== */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>PortfolioPro</h4>
              <ul>
                <li><a href="#hero">Sobre nós</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#equipe">Equipe</a></li>
                <li><a href="#contato">Contato</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Serviços</h4>
              <ul>
                <li><a href="#servicos">Design UI/UX</a></li>
                <li><a href="#servicos">Desenvolvimento</a></li>
                <li><a href="#servicos">Apps Mobile</a></li>
                <li><a href="#servicos">Branding</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Recursos</h4>
              <ul>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Cases</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Suporte</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacidade</a></li>
                <li><a href="#">Termos</a></li>
                <li><a href="#">Cookies</a></li>
                <li><a href="#">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            <span>© 2026 PortfolioPro. Todos os direitos reservados.</span>
            <div className="footer-legal">
              <a href="#">Privacidade</a>
              <a href="#">Termos</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App