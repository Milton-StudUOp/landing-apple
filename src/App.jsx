import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import './App.css'

/* ---------- Animated Counter ---------- */
function AnimatedCounter({ from = 0, to, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(from)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const elapsed = (ts - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCount(Math.floor(from + (to - from) * eased))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, from, to, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ---------- Scroll Reveal Wrapper ---------- */
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 60 : direction === 'down' ? -60 : 0,
      x: direction === 'left' ? -60 : direction === 'right' ? 60 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay },
    },
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Stagger Grid ---------- */
function StaggerGrid({ children, className = '', staggerDelay = 0.08 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Glassmorphism Card Wrapper ---------- */
function GlassCard({ children, className = '' }) {
  return (
    <motion.div
      className={`glass-card ${className}`}
      whileHover={{ scale: 1.03, y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Ripple Button ---------- */
function RippleButton({ children, className = '', href, ...props }) {
  const [ripples, setRipples] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((prev) => [...prev, { x, y, id }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700)
  }

  const Comp = href ? motion.a : motion.button
  return (
    <Comp
      className={`ripple-btn ${className}`}
      href={href}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {children}
      <span className="ripple-container">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="ripple-drop"
            style={{ left: r.x, top: r.y }}
          />
        ))}
      </span>
    </Comp>
  )
}

/* ---------- Floating Particles ---------- */
function FloatingParticles() {
  return (
    <div className="particles" aria-hidden="true">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            opacity: 0.15 + Math.random() * 0.2,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            scale: [1, 1.3, 1],
            opacity: [0.15 + Math.random() * 0.2, 0.3 + Math.random() * 0.2, 0.15 + Math.random() * 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>
  )
}

/* ---------- Intro Loading Screen ---------- */
function IntroLoader({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1800)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <motion.div
      className="intro-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
    >
      <motion.div
        className="intro-loader-icon"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="#0071e3" />
          <path d="M14 28L20 34L34 18" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
      <motion.div
        className="intro-loader-text"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        PortfolioPro
      </motion.div>
      <motion.div
        className="intro-loader-bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
      />
    </motion.div>
  )
}

/* ============================================================
   MAIN APP COMPONENT
   ============================================================ */
function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.85])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroGlowY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const heroGlowScale = useTransform(scrollYProgress, [0, 1], [1, 1.4])

  const navLinks = ['Portfolio', 'Serviços', 'Equipe', 'Contato']

  const smoothSpring = { type: 'spring', stiffness: 260, damping: 28 }
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.12 },
    }),
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <IntroLoader key="loader" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {!loading && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* ========== Glass Navigation ========== */}
            <motion.nav
              className="nav"
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...smoothSpring, delay: 0.2 }}
            >
              <div className="nav-inner">
                <motion.div
                  className="nav-logo"
                  whileHover={{ scale: 1.04 }}
                >
                  <span className="nav-logo-icon"></span>
                  PortfolioPro
                </motion.div>
                <ul className="nav-links">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                    >
                      <a href={`#${link.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>{link}</a>
                    </motion.li>
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
            </motion.nav>

            {/* ========== Hero Section (Dark) ========== */}
            <section className="hero" id="hero" ref={heroRef}>
              <FloatingParticles />

              {/* Parallax gradient glow layer */}
              <motion.div
                className="hero-glow"
                style={{ y: heroGlowY, scale: heroGlowScale }}
              />

              <motion.div className="hero-inner" style={{ opacity: heroOpacity, y: heroY }}>
                <motion.p
                  className="hero-eyebrow"
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={0}
                >
                  Agência Criativa
                </motion.p>
                <motion.h1
                  className="hero-title"
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={1}
                >
                  Criamos experiências{' '}
                  <motion.span
                    className="text-gradient"
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  >
                    digitais extraordinárias
                  </motion.span>
                </motion.h1>
                <motion.p
                  className="hero-subtitle"
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={2}
                >
                  Design thinking, tecnologia de ponta e estratégia digital para transformar seu negócio.
                </motion.p>
                <motion.div
                  className="hero-cta-group"
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={3}
                >
                  <RippleButton href="#portfolio" className="btn btn-primary">
                    Ver portfólio
                  </RippleButton>
                  <RippleButton href="#contato" className="btn btn-outline">
                    Fale conosco
                  </RippleButton>
                </motion.div>
              </motion.div>

              {/* Hero mockup with zoom-on-scroll */}
              <motion.div
                className="hero-mockup-wrapper"
                style={{ scale: heroScale, opacity: heroOpacity }}
              >
                <motion.div
                  className="hero-mockup placeholder-img"
                  style={{ height: 400, borderRadius: 18 }}
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                  whileHover={{ scale: 1.02, boxShadow: '0 30px 80px rgba(0,113,227,0.25)' }}
                >
                  <span>Produto Mockup</span>
                </motion.div>
              </motion.div>
            </section>

            {/* ========== Stats / Metrics Section (Dark) ========== */}
            <section className="section section-dark section-bg-transition" id="stats">
              <div className="section-inner">
                <Reveal>
                  <p className="section-label">Resultados</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="section-title">Números que falam por si</h2>
                </Reveal>
                <div className="stats-grid">
                  {[
                    { to: 250, suffix: '+', label: 'Projetos Entregues' },
                    { to: 98, suffix: '%', label: 'Satisfação dos Clientes' },
                    { to: 50, suffix: '+', label: 'Prêmios de Design' },
                    { to: 12, suffix: '', label: 'Anos de Experiência' },
                  ].map((stat, i) => (
                    <Reveal key={i} delay={0.15 + i * 0.1}>
                      <div className="stat-item">
                        <span className="stat-number">
                          <AnimatedCounter to={stat.to} suffix={stat.suffix} duration={2.2} />
                        </span>
                        <span className="stat-label">{stat.label}</span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ========== Portfolio Section (Light) ========== */}
            <section className="section section-light section-bg-transition" id="portfolio">
              <div className="section-inner">
                <Reveal>
                  <p className="section-label">Portfolio</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="section-title">Projetos que inspiram</h2>
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="section-subtitle">
                    Cada projeto é uma história única. Conheça alguns de nossos trabalhos.
                  </p>
                </Reveal>
                <StaggerGrid className="portfolio-grid" staggerDelay={0.1}>
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
                    <StaggerItem key={i}>
                      <GlassCard className="portfolio-card">
                        <motion.div
                          className="portfolio-card-img placeholder-img"
                          style={{ background: item.color }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                        >
                          <span>{item.title}</span>
                        </motion.div>
                        <div className="portfolio-card-body">
                          <p className="portfolio-card-tag">{item.tag}</p>
                          <h3 className="portfolio-card-title">{item.title}</h3>
                          <p className="portfolio-card-text">{item.text}</p>
                        </div>
                      </GlassCard>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            </section>

            {/* ========== Services Section (White) ========== */}
            <section className="section section-white section-bg-transition" id="servicos">
              <div className="section-inner">
                <Reveal>
                  <p className="section-label">Serviços</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="section-title">O que fazemos</h2>
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="section-subtitle">
                    Da estratégia à execução, entregamos soluções completas.
                  </p>
                </Reveal>
                <StaggerGrid className="services-grid" staggerDelay={0.07}>
                  {[
                    { icon: '🎨', name: 'Design UI/UX', desc: 'Interfaces intuitivas e experiências memoráveis que encantam usuários.' },
                    { icon: '⚡', name: 'Desenvolvimento Web', desc: 'Aplicações rápidas, escaláveis e modernas com as melhores tecnologias.' },
                    { icon: '📱', name: 'Apps Mobile', desc: 'Apps nativos e híbridos para iOS e Android com performance nativa.' },
                    { icon: '🔍', name: 'SEO & Performance', desc: 'Otimização para mecanismos de busca e performance de carregamento.' },
                    { icon: '🎯', name: 'Estratégia Digital', desc: 'Planejamento estratégico para maximizar presença e resultados online.' },
                    { icon: '🏷️', name: 'Branding', desc: 'Identidade visual completa, naming e posicionamento de marca.' },
                  ].map((s, i) => (
                    <StaggerItem key={i}>
                      <GlassCard className="service-tile">
                        <motion.div
                          className="service-icon"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {s.icon}
                        </motion.div>
                        <h3 className="service-name">{s.name}</h3>
                        <p className="service-desc">{s.desc}</p>
                      </GlassCard>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            </section>

            {/* ========== Testimonials Section (Light) ========== */}
            <section className="section section-light section-bg-transition" id="depoimentos">
              <div className="section-inner">
                <Reveal>
                  <p className="section-label">Depoimentos</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="section-title">O que nossos clientes dizem</h2>
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="section-subtitle">
                    A confiança de quem já trabalhou conosco é o nosso maior patrimônio.
                  </p>
                </Reveal>
                <StaggerGrid className="testimonials-grid" staggerDelay={0.12}>
                  {[
                    {
                      name: 'Carlos Mendes',
                      role: 'CEO, TechVentures',
                      text: 'A PortfolioPro transformou completamente nossa presença digital. O redesign do nosso app resultou em um aumento de 40% na retenção de usuários.',
                      avatar: 'CM',
                      color: '#0071e3',
                    },
                    {
                      name: 'Juliana Alves',
                      role: 'CMO, BrandHouse',
                      text: 'Trabalhar com essa equipe foi uma experiência incrível. Entregaram um site que superou todas as expectativas, com performance impecável e design deslumbrante.',
                      avatar: 'JA',
                      color: '#34c759',
                    },
                    {
                      name: 'Roberto Lima',
                      role: 'Founder, StartUpLab',
                      text: 'Precisávamos de um MVP em tempo recorde e eles entregaram em 3 semanas. Qualidade, agilidade e profissionalismo em cada detalhe.',
                      avatar: 'RL',
                      color: '#ff9500',
                    },
                  ].map((t, i) => (
                    <StaggerItem key={i}>
                      <GlassCard className="testimonial-card">
                        <motion.div
                          className="testimonial-stars"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {'★★★★★'.split('').map((s, j) => (
                            <motion.span
                              key={j}
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 + j * 0.08 }}
                            >
                              {s}
                            </motion.span>
                          ))}
                        </motion.div>
                        <p className="testimonial-text">"{t.text}"</p>
                        <div className="testimonial-author">
                          <motion.div
                            className="testimonial-avatar"
                            style={{ background: t.color }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {t.avatar}
                          </motion.div>
                          <div>
                            <div className="testimonial-name">{t.name}</div>
                            <div className="testimonial-role">{t.role}</div>
                          </div>
                        </div>
                      </GlassCard>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            </section>

            {/* ========== Team Section (Light) ========== */}
            <section className="section section-light section-bg-transition" id="equipe">
              <div className="section-inner">
                <Reveal>
                  <p className="section-label">Equipe</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="section-title">Quem somos</h2>
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="section-subtitle">
                    Profissionais apaixonados por criar o extraordinário.
                  </p>
                </Reveal>
                <StaggerGrid className="team-grid" staggerDelay={0.12}>
                  {[
                    { name: 'Ana Silva', role: 'CEO & Fundadora', bio: '15 anos de experiência em design e inovação digital. Ex-Apple, ex-Google.', initials: 'AS' },
                    { name: 'Lucas Oliveira', role: 'CTO', bio: 'Arquiteto de soluções full-stack. Especialista em React, Node.js e cloud.', initials: 'LO' },
                    { name: 'Marina Costa', role: 'Head de Design', bio: 'Designer premiada com foco em UI/UX e sistemas de design escaláveis.', initials: 'MC' },
                  ].map((m, i) => (
                    <StaggerItem key={i}>
                      <GlassCard className="team-card">
                        <motion.div
                          className="team-avatar placeholder-avatar"
                          whileHover={{ scale: 1.04 }}
                        >
                          {m.initials}
                        </motion.div>
                        <div className="team-info">
                          <h3 className="team-name">{m.name}</h3>
                          <p className="team-role">{m.role}</p>
                          <p className="team-bio">{m.bio}</p>
                        </div>
                      </GlassCard>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            </section>

            {/* ========== Process Section (White) ========== */}
            <section className="section section-white section-bg-transition" id="processo">
              <div className="section-inner">
                <Reveal>
                  <p className="section-label">Processo</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="section-title">Como trabalhamos</h2>
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="section-subtitle">
                    Metodologia ágil e transparente, do briefing ao lançamento.
                  </p>
                </Reveal>
                <StaggerGrid className="process-grid" staggerDelay={0.1}>
                  {[
                    { num: '1', title: 'Descoberta', desc: 'Entendemos seu negócio, público-alvo e objetivos para alinhar expectativas.' },
                    { num: '2', title: 'Estratégia', desc: 'Definimos roadmap, arquitetura de informação e wireframes interativos.' },
                    { num: '3', title: 'Design & Dev', desc: 'Criamos protótipos de alta fidelidade e desenvolvemos com entregas contínuas.' },
                    { num: '4', title: 'Lançamento', desc: 'Testes rigorosos, deploy e acompanhamento pós-lançamento com métricas.' },
                  ].map((step, i) => (
                    <StaggerItem key={i}>
                      <motion.div
                        className="process-step"
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      >
                        <motion.div
                          className="process-step-number"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          {step.num}
                        </motion.div>
                        <h3 className="process-step-title">{step.title}</h3>
                        <p className="process-step-desc">{step.desc}</p>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            </section>

            {/* ========== CTA Section (Dark) ========== */}
            <section className="cta-section section-bg-transition" id="contato">
              <div className="section-inner">
                <Reveal>
                  <h2 className="cta-title">Vamos criar algo extraordinário juntos?</h2>
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="cta-text">
                    Transforme sua ideia em realidade. Nossa equipe está pronta para o próximo grande desafio.
                  </p>
                </Reveal>
                <Reveal delay={0.25}>
                  <RippleButton href="mailto:ola@portfoliopro.com" className="cta-btn">
                    Iniciar projeto
                  </RippleButton>
                </Reveal>
              </div>
            </section>

            {/* ========== Contact Form Section (White) ========== */}
            <section className="section section-white section-bg-transition" id="contato-form">
              <div className="section-inner">
                <Reveal>
                  <p className="section-label">Contato</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="section-title">Vamos conversar</h2>
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="section-subtitle">
                    Preencha o formulário abaixo e nossa equipe entrará em contato em até 24 horas.
                  </p>
                </Reveal>
                <Reveal delay={0.2}>
                  <motion.div
                    className="contact-form-wrapper"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                      <div className="form-row">
                        <motion.div
                          className="form-group"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 }}
                        >
                          <label className="form-label" htmlFor="name">Nome</label>
                          <input className="form-input" id="name" type="text" placeholder="Seu nome" />
                        </motion.div>
                        <motion.div
                          className="form-group"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 }}
                        >
                          <label className="form-label" htmlFor="email">Email</label>
                          <input className="form-input" id="email" type="email" placeholder="seu@email.com" />
                        </motion.div>
                      </div>
                      <motion.div
                        className="form-group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="form-label" htmlFor="subject">Assunto</label>
                        <input className="form-input" id="subject" type="text" placeholder="Como podemos ajudar?" />
                      </motion.div>
                      <motion.div
                        className="form-group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                      >
                        <label className="form-label" htmlFor="message">Mensagem</label>
                        <textarea className="form-textarea" id="message" placeholder="Conte-nos sobre seu projeto..." />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <RippleButton type="submit" className="form-submit">
                          Enviar mensagem
                        </RippleButton>
                      </motion.div>
                    </form>
                  </motion.div>
                </Reveal>
              </div>
            </section>

            {/* ========== Footer ========== */}
            <footer className="footer">
              <div className="footer-inner">
                <div className="footer-grid">
                  {[
                    { title: 'PortfolioPro', links: [
                      { label: 'Sobre nós', href: '#hero' },
                      { label: 'Portfolio', href: '#portfolio' },
                      { label: 'Equipe', href: '#equipe' },
                      { label: 'Contato', href: '#contato' },
                    ]},
                    { title: 'Serviços', links: [
                      { label: 'Design UI/UX', href: '#servicos' },
                      { label: 'Desenvolvimento', href: '#servicos' },
                      { label: 'Apps Mobile', href: '#servicos' },
                      { label: 'Branding', href: '#servicos' },
                    ]},
                    { title: 'Recursos', links: [
                      { label: 'Blog', href: '#' },
                      { label: 'Cases', href: '#' },
                      { label: 'FAQ', href: '#' },
                      { label: 'Suporte', href: '#' },
                    ]},
                    { title: 'Legal', links: [
                      { label: 'Privacidade', href: '#' },
                      { label: 'Termos', href: '#' },
                      { label: 'Cookies', href: '#' },
                      { label: 'LGPD', href: '#' },
                    ]},
                  ].map((col, i) => (
                    <motion.div
                      className="footer-col"
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                    >
                      <h4>{col.title}</h4>
                      <ul>
                        {col.links.map((link, j) => (
                          <li key={j}><a href={link.href}>{link.label}</a></li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
