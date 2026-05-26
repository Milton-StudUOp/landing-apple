import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import './App.css'

/* ═══════════════════════════════════════════════════════
   MICRO-COMPONENTS
   ═══════════════════════════════════════════════════════ */

function AnimatedCounter({ from = 0, to, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(from)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  useEffect(() => {
    if (!inView) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const elapsed = (ts - start) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(from + (to - from) * eased))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, from, to, duration])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

function ScrollReveal({ children, delay = 0, direction = 'up', className = '' }) {
  const variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0, x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0 },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay } },
  }
  return (
    <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={variants}>
      {children}
    </motion.div>
  )
}

function StaggerContainer({ children, className = '', delay = 0.1 }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: delay } } }}>
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className = '' }) {
  return (
    <motion.div className={className}
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } } }}>
      {children}
    </motion.div>
  )
}

function RippleButton({ children, className = '', href, onClick }) {
  const [ripples, setRipples] = useState([])
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples(prev => [...prev, { x, y, id }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 800)
    if (onClick) onClick(e)
  }
  const Comp = href ? 'a' : 'button'
  const props = href ? { href, onClick: handleClick, className: `ripple-btn ${className}` } : { onClick: handleClick, className: `ripple-btn ${className}` }
  return (
    <Comp {...props}>
      <span className="btn-content">{children}</span>
      <span className="ripple-container">
        {ripples.map(r => <span key={r.id} className="ripple-drop" style={{ left: r.x, top: r.y }} />)}
      </span>
    </Comp>
  )
}

function FloatingParticles() {
  return (
    <div className="particles" aria-hidden="true">
      {[...Array(15)].map((_, i) => (
        <motion.div key={i} className="particle"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: 3 + Math.random() * 5, height: 3 + Math.random() * 5, opacity: 0.06 + Math.random() * 0.12 }}
          animate={{ y: [0, -40 - Math.random() * 50, 0], x: [0, (Math.random() - 0.5) * 30, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 6 + Math.random() * 8, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 5 }}
        />
      ))}
    </div>
  )
}

function IntroLoader({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t) }, [onDone])
  return (
    <motion.div className="loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}>
      <div className="loader__content">
        <motion.svg width="56" height="56" viewBox="0 0 60 60" fill="none"
          initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}>
          <rect width="60" height="60" rx="30" fill="url(#g)" />
          <path d="M22 30c0-6.627 5.373-12 12-12M38 30c0 6.627-5.373 12-12 12" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <circle cx="34" cy="18" r="3" fill="white" />
          <circle cx="26" cy="42" r="3" fill="white" />
          <defs><linearGradient id="g" x1="0" y1="0" x2="60" y2="60"><stop stopColor="#0071e3" /><stop offset="1" stopColor="#00c6ff" /></linearGradient></defs>
        </motion.svg>
        <motion.h2 className="loader__title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>PortfolioPro</motion.h2>
        <div className="loader__bar">
          <motion.div className="loader__fill" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }} />
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const NAV = ['Portfolio', 'Services', 'Process', 'Reviews', 'Team']

const STATS = [
  { to: 280, suffix: '+', label: 'Projects Completed' },
  { to: 99, suffix: '%', label: 'Client Loyalty' },
  { to: 32, suffix: '', label: 'Design Awards' },
  { to: 12, suffix: 'Y', label: 'Combined Expertise' },
]

const PORTFOLIO = [
  { img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80', tag: 'Interactive Design', title: 'Aura Commerce', excerpt: 'Redefining high-end fashion browsing with zero-friction spatial mockups.' },
  { img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80', tag: 'Mobile App', title: 'Apex Wallet', excerpt: 'A crypto dashboard putting visual clarity and secure telemetry first.' },
  { img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80', tag: 'Brand Strategy', title: 'Nova Identity', excerpt: 'A minimalist design framework for autonomous logistics.' },
  { img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', tag: 'Web Platform', title: 'Stratum Suite', excerpt: 'Enterprise analytics in a high-performance web architecture.' },
  { img: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600&q=80', tag: 'Fintech', title: 'ClearPay', excerpt: 'Redesigning the mobile payment experience for Gen Z users.' },
  { img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80', tag: 'SaaS', title: 'Flowboard', excerpt: 'Project management reimagined with AI-assisted workflow automation.' },
]

const SERVICES = [
  { icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', title: 'Brand Identity', desc: 'Crafting memorable brand systems that resonate across every touchpoint.' },
  { icon: 'M16.5 9.4 7.55 4.24a1.79 1.79 0 0 0-2.5 1.55v12.42a1.79 1.79 0 0 0 2.5 1.55l8.95-5.16a1.79 1.79 0 0 0 0-3.1z', title: 'UX/UI Design', desc: 'Spatial typography, interactive elegance, and pixel-perfect interfaces.' },
  { icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z', title: 'Product Engineering', desc: 'Scalable React architectures optimized for sub-second loading.' },
  { icon: 'M4.5 16.5c-1.5 1.26-2 3.1-1.5 4.5.9.9 2.5.5 3.5-.5a6 6 0 0 0 3-4M19.5 7.5c1.5-1.26 2-3.1 1.5-4.5-.9-.9-2.5-.5-3.5.5a6 6 0 0 0-3 4', title: 'Design Advisory', desc: 'UX audits, technical roadmapping, and workshops to unlock growth.' },
  { icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', title: 'Motion Design', desc: 'Cinematic micro-interactions and fluid transitions that delight.' },
  { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Security & Reliability', desc: 'Enterprise-grade infrastructure with 99.99% uptime guarantee.' },
]

const PROCESS = [
  { step: '01', title: 'Discovery', desc: 'Unearthing business goals, audience insights, and technical constraints to define a precise roadmap.' },
  { step: '02', title: 'Strategy', desc: 'Spatial UX architectures, wireframes, and cinematic motion prototypes that tell a story.' },
  { step: '03', title: 'Design', desc: 'Breathtaking interfaces, clean layouts, and semantic modular React components.' },
  { step: '04', title: 'Launch', desc: 'Automated audits, multi-device stress-testing, and smooth deployment to production.' },
]

const TESTIMONIALS = [
  { name: 'Isabella Torres', role: 'CEO, Aura Commerce', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80', quote: 'PortfolioPro completely transformed our digital presence. The attention to detail and cinematic quality exceeded every expectation.' },
  { name: 'Marcus Chen', role: 'Founder, Flowboard', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', quote: 'Working with this team was a masterclass in design. Our conversion rate increased 340% after the redesign.' },
  { name: 'Sofia Laurent', role: 'CMO, Nova Logistics', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80', quote: 'The brand strategy they delivered was nothing short of brilliant. Our entire market positioning was elevated overnight.' },
]

const TEAM = [
  { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', name: 'Alex Rivera', role: 'Creative Director' },
  { img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', name: 'Maya Patel', role: 'Lead Designer' },
  { img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80', name: 'James Okonkwo', role: 'Engineering Lead' },
  { img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80', name: 'Lena Schmidt', role: 'Motion Director' },
  { img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80', name: 'David Kim', role: 'Strategy Lead' },
  { img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80', name: 'Priya Sharma', role: 'Project Manager' },
  { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', name: 'Tomás Silva', role: 'Frontend Developer' },
  { img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', name: 'Emma Black', role: 'UX Researcher' },
]

/* ═══════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════ */

export default function App() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [formSent, setFormSent] = useState(false)
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroImgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const heroImgY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.3])

  const scrollTo = useCallback((id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 48
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.name && form.email && form.message) {
      setFormSent(true)
      setTimeout(() => { setFormSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }, 5000)
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <IntroLoader key="loader" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {!loading && (
          <motion.div key="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="app">

            {/* Header */}
            <header className="header">
              <div className="header__inner">
                <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero') }} className="header__logo">
                  <span className="header__logo-icon" />PortfolioPro
                </a>
                <nav className="header__nav">
                  {NAV.map(n => <a key={n} href={`#${n.toLowerCase()}`} onClick={(e) => { e.preventDefault(); scrollTo(n.toLowerCase()) }} className="nav-link">{n}</a>)}
                </nav>
                <div className="header__actions">
                  <RippleButton href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact') }} className="btn--pill btn--blue">Let's Talk</RippleButton>
                  <button className={`hamburger${menuOpen ? ' is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                    <span className="l t" /><span className="l m" /><span className="l b" />
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div className="mobile-nav" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <div className="mobile-nav__links">
                      {NAV.map(n => <a key={n} href={`#${n.toLowerCase()}`} onClick={(e) => { e.preventDefault(); scrollTo(n.toLowerCase()) }} className="mobile-link">{n}</a>)}
                      <RippleButton href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact') }} className="btn--pill btn--blue mobile-cta">Start Project</RippleButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            {/* Hero */}
            <section ref={heroRef} id="hero" className="hero">
              <FloatingParticles />
              <motion.div className="hero__glow" style={{ y: glowY, scale: glowScale }} />
              <div className="hero__container">
                <motion.div className="hero__text" style={{ y: heroY, opacity: heroOpacity }}>
                  <motion.span className="hero__eyebrow" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>CREATIVE PARTNER</motion.span>
                  <motion.h1 className="hero__title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    We design digital experiences that <span className="gradient-text">define premium brands</span>
                  </motion.h1>
                  <motion.p className="hero__sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    Uniting cinematic craftsmanship with world-class engineering to shape clean, memorable digital landscapes.
                  </motion.p>
                  <motion.div className="hero__actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <RippleButton href="#portfolio" onClick={(e) => { e.preventDefault(); scrollTo('portfolio') }} className="btn--pill btn--blue">View Showcase</RippleButton>
                    <RippleButton href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact') }} className="btn--pill btn--outline-white">Consult Strategy</RippleButton>
                  </motion.div>
                </motion.div>
                <motion.div className="hero__image" style={{ scale: heroImgScale, y: heroImgY }} initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1], delay: 0.4 }}>
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80" alt="Creative Workspace" />
                  <div className="hero__img-overlay" />
                </motion.div>
              </div>
            </section>

            {/* Stats */}
            <section className="stats">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">AGENCY PERFORMANCE</span>
                  <h2 className="section-heading-dark">Crafted to scale. Quantified by impact.</h2>
                </ScrollReveal>
                <div className="stats__grid">
                  {STATS.map((s, i) => (
                    <div key={i} className="stat-card">
                      <span className="stat-value"><AnimatedCounter to={s.to} suffix={s.suffix} /></span>
                      <span className="stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Portfolio */}
            <section id="portfolio" className="section-dark portfolio">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">SELECTED WORK</span>
                  <h2 className="section-heading-light">Projects that set a new paradigm</h2>
                  <p className="section-desc-light">Every project is a rigorous pursuit of design simplicity, fast interaction, and timeless aesthetics.</p>
                </ScrollReveal>
                <StaggerContainer className="portfolio__grid" delay={0.12}>
                  {PORTFOLIO.map((p, i) => (
                    <StaggerItem key={i} className="portfolio__card">
                      <div className="portfolio__img-wrap">
                        <img src={p.img} alt={p.title} loading="lazy" />
                        <div className="portfolio__img-glow" />
                      </div>
                      <div className="portfolio__info">
                        <span className="portfolio__tag">{p.tag}</span>
                        <h3>{p.title}</h3>
                        <p>{p.excerpt}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </section>

            {/* Services */}
            <section id="services" className="section-light services">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">OUR EXPERTISE</span>
                  <h2 className="section-heading-dark">Capabilities driven by strategy.</h2>
                  <p className="section-desc-dark">We operate at the convergence of artistic design, premium interfaces, and solid engineering.</p>
                </ScrollReveal>
                <StaggerContainer className="services__grid" delay={0.08}>
                  {SERVICES.map((s, i) => (
                    <StaggerItem key={i} className="service-card">
                      <div className="service-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={s.icon} /></svg>
                      </div>
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </section>

            {/* Process */}
            <section id="process" className="section-dark process">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">METHODOLOGY</span>
                  <h2 className="section-heading-light">How we achieve premium outcomes</h2>
                  <p className="section-desc-light">A rigorous 4-step execution flow engineered to minimize cycle times and prevent product drift.</p>
                </ScrollReveal>
                <div className="process__flow">
                  {PROCESS.map((p, i) => (
                    <motion.div key={i} className="process__step"
                      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                      <div className="process__num">{p.step}</div>
                      <div className="process__connector" />
                      <h3>{p.title}</h3>
                      <p>{p.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section id="reviews" className="section-light testimonials">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">CLIENT WORDS</span>
                  <h2 className="section-heading-dark">Endorsed by industry innovators.</h2>
                </ScrollReveal>
                <StaggerContainer className="testimonials__grid" delay={0.12}>
                  {TESTIMONIALS.map((t, i) => (
                    <StaggerItem key={i} className="testimonial-card">
                      <div className="testimonial-stars">
                        {[...Array(5)].map((_, s) => (
                          <svg key={s} viewBox="0 0 24 24" fill="#0071e3" width="14"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        ))}
                      </div>
                      <p className="testimonial-quote">"{t.quote}"</p>
                      <div className="testimonial-author">
                        <img src={t.avatar} alt={t.name} loading="lazy" />
                        <div><strong>{t.name}</strong><span>{t.role}</span></div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </section>

            {/* Team */}
            <section id="team" className="section-dark team">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">OUR TEAM</span>
                  <h2 className="section-heading-light">The people behind the work.</h2>
                  <p className="section-desc-light">A collective of designers, engineers, and strategists united by a passion for craft.</p>
                </ScrollReveal>
                <StaggerContainer className="team__grid" delay={0.06}>
                  {TEAM.map((m, i) => (
                    <StaggerItem key={i} className="team__member">
                      <div className="team__avatar-wrap">
                        <img src={m.img} alt={m.name} loading="lazy" />
                      </div>
                      <strong>{m.name}</strong>
                      <span>{m.role}</span>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </section>

            {/* Contact CTA */}
            <section id="contact" className="contact">
              <div className="section-inner contact__inner">
                <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  Ready to create something <span className="gradient-text">extraordinary</span>?
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                  Let's discuss your project. No commitment, just ideas.
                </motion.p>

                <motion.form className="contact__form" onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                  <div className="form-row">
                    <input type="text" placeholder="Your Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    <input type="email" placeholder="Email Address" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <input type="text" placeholder="Subject (optional)" name="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  <textarea placeholder="Tell us about your project" name="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows="4" required />
                  <AnimatePresence mode="wait">
                    {formSent ? (
                      <motion.div key="sent" className="form-sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#15be53" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        Message sent! We'll be in touch soon.
                      </motion.div>
                    ) : (
                      <motion.button key="submit" type="submit" className="btn--pill btn--blue btn--submit"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Send Message
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.form>
              </div>
            </section>

            {/* Footer */}
            <footer className="footer">
              <div className="section-inner footer__inner">
                <div className="footer__brand">
                  <div className="brand-icon" />
                  <div>
                    <span className="footer__logo">PortfolioPro</span>
                    <span className="footer__tagline">Creative agency for the modern era.</span>
                  </div>
                </div>
                <div className="footer__grid">
                  {[
                    { title: 'Services', links: ['Brand Identity', 'UX/UI Design', 'Product Engineering', 'Motion Design', 'Strategy'] },
                    { title: 'Industries', links: ['Fintech', 'SaaS', 'E-Commerce', 'Healthcare', 'Enterprise'] },
                    { title: 'Resources', links: ['Blog', 'Case Studies', 'Portfolio', 'Process', 'FAQ'] },
                    { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact', 'Privacy'] },
                  ].map((col, i) => (
                    <div key={i} className="footer__col">
                      <h4>{col.title}</h4>
                      {col.links.map((l, j) => <a key={j} href="#">{l}</a>)}
                    </div>
                  ))}
                </div>
                <div className="footer__bottom">
                  <span>© 2026 PortfolioPro. All rights reserved.</span>
                  <div className="footer__socials">
                    {['Dribbble', 'Behance', 'GitHub', 'LinkedIn'].map((s, i) => (
                      <a key={i} href="#" aria-label={s}>{s}</a>
                    ))}
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
