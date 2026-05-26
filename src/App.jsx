import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import './App.css'

/* ============================================================
   1. ANIMATED MICRO-COMPONENTS
   ============================================================ */

// Animated Counter with custom easeOutCubic
function AnimatedCounter({ from = 0, to, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(from)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      
      // easeOutCubic: f(t) = 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setCount(Math.floor(from + (to - from) * eased))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [isInView, from, to, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// Scroll Reveal Wrapper for generic sections
function ScrollReveal({ children, delay = 0, direction = 'up', className = '' }) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1], // Apple cubic-bezier
        delay,
      },
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

// Grid Stagger Animation Wrappers
function StaggerContainer({ children, className = '', staggerDelay = 0.1 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay }
        }
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
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

// Ripple Button component
function RippleButton({ children, className = '', href, onClick, type = 'button', ...props }) {
  const [ripples, setRipples] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    
    setRipples((prev) => [...prev, { x, y, id }])
    
    // Clear ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 800)

    if (onClick) onClick(e)
  }

  const Comp = href ? 'a' : 'button'
  const componentProps = href 
    ? { href, onClick: handleClick, className: `ripple-btn ${className}`, ...props }
    : { type, onClick: handleClick, className: `ripple-btn ${className}`, ...props }

  return (
    <Comp {...componentProps}>
      <span className="btn-content">{children}</span>
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

// Subtle Floating Ambient Background Particles (Dark Hero Section Only)
function FloatingParticles() {
  return (
    <div className="particles-layer" aria-hidden="true">
      {[...Array(12)].map((_, i) => {
        const size = 3 + Math.random() * 5
        return (
          <motion.div
            key={i}
            className="ambient-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: size,
              height: size,
              opacity: 0.08 + Math.random() * 0.15,
            }}
            animate={{
              y: [0, -40 - Math.random() * 50, 0],
              x: [0, (Math.random() - 0.5) * 30, 0],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 5,
            }}
          />
        )
      })}
    </div>
  )
}

/* ============================================================
   2. INTRO LOADER SCREEN (1.8s)
   ============================================================ */
function IntroLoader({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1800)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <motion.div
      className="intro-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
    >
      <div className="loader-content">
        {/* Sleek Apple-inspired Creative Core Logo */}
        <motion.div
          className="loader-logo"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <rect width="60" height="60" rx="30" fill="url(#blue-gradient)" />
            <path d="M22 30C22 23.3726 27.3726 18 34 18M38 30C38 36.6274 32.6274 42 26 42" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <circle cx="34" cy="18" r="3" fill="white" />
            <circle cx="26" cy="42" r="3" fill="white" />
            <defs>
              <linearGradient id="blue-gradient" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0071e3" />
                <stop offset="1" stopColor="#00c6ff" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
        
        <motion.h2
          className="loader-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          PortfolioPro
        </motion.h2>
        
        <div className="loader-progress-track">
          <motion.div
            className="loader-progress-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

/* ============================================================
   3. MAIN APPLICATION COMPONENT
   ============================================================ */
export default function App() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const heroRef = useRef(null)
  
  // Hook scroll bounds for parallax mapping
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Apple cinematic scroll mappings
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const backdropGlowY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const backdropGlowScale = useTransform(scrollYProgress, [0, 1], [1, 1.3])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true)
      setTimeout(() => {
        setFormSubmitted(false)
        setFormData({ name: '', email: '', subject: '', message: '' })
      }, 5000)
    }
  }

  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    setMenuOpen(false)
    const element = document.getElementById(targetId)
    if (element) {
      const navOffset = 48
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - navOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      {/* Intro loading screen */}
      <AnimatePresence mode="wait">
        {loading && <IntroLoader key="loader" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {!loading && (
          <motion.div
            key="page-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="app-container"
          >
            {/* ==========================================
               1. NAV - STICKY GLASS
               ========================================== */}
            <header className="nav-header">
              <div className="nav-container">
                <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')} className="nav-logo">
                  <span className="logo-icon-accent"></span>
                  PortfolioPro
                </a>

                {/* Desktop Navigation links */}
                <nav className="desktop-nav">
                  <a href="#portfolio" onClick={(e) => handleNavClick(e, 'portfolio')} className="nav-link">Portfolio</a>
                  <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="nav-link">Services</a>
                  <a href="#process" onClick={(e) => handleNavClick(e, 'process')} className="nav-link">Process</a>
                  <a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} className="nav-link">Reviews</a>
                  <a href="#team" onClick={(e) => handleNavClick(e, 'team')} className="nav-link">Team</a>
                </nav>

                <div className="nav-actions">
                  <RippleButton href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="btn-nav-cta">
                    Let's Talk
                  </RippleButton>
                  
                  {/* Mobile burger toggle */}
                  <button 
                    className={`mobile-menu-toggle ${menuOpen ? 'is-open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                  >
                    <span className="line line-top"></span>
                    <span className="line line-mid"></span>
                    <span className="line line-bot"></span>
                  </button>
                </div>
              </div>

              {/* Mobile Glass Navigation Overlay */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="mobile-nav-overlay"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="mobile-nav-links">
                      <a href="#portfolio" onClick={(e) => handleNavClick(e, 'portfolio')} className="mobile-link">Portfolio</a>
                      <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="mobile-link">Services</a>
                      <a href="#process" onClick={(e) => handleNavClick(e, 'process')} className="mobile-link">Process</a>
                      <a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} className="mobile-link">Reviews</a>
                      <a href="#team" onClick={(e) => handleNavClick(e, 'team')} className="mobile-link">Team</a>
                      <RippleButton href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="btn-mobile-cta">
                        Start Project
                      </RippleButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            {/* ==========================================
               2. HERO SECTION (DARK)
               ========================================== */}
            <section ref={heroRef} id="hero" className="hero-section">
              <FloatingParticles />
              
              {/* Parallax ambient glow layer */}
              <motion.div 
                className="hero-backdrop-glow"
                style={{ y: backdropGlowY, scale: backdropGlowScale }}
              />

              <div className="hero-container">
                <motion.div 
                  className="hero-text-content"
                  style={{ y: heroContentY, opacity: heroContentOpacity }}
                >
                  <motion.span 
                    className="hero-eyebrow"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    CREATIVE PARTNER
                  </motion.span>
                  <motion.h1 
                    className="hero-headline"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    We design digital experiences that <span className="blue-gradient-text">define premium brands</span>
                  </motion.h1>
                  <motion.p 
                    className="hero-subheadline"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                  >
                    Uniting cinematic craftsmanship with world-class engineering to shape clean, memorable digital landscapes.
                  </motion.p>
                  
                  <motion.div 
                    className="hero-cta-buttons"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  >
                    <RippleButton href="#portfolio" onClick={(e) => handleNavClick(e, 'portfolio')} className="btn-pill btn-primary-blue">
                      View Showcase
                    </RippleButton>
                    <RippleButton href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="btn-pill btn-outline-white">
                      Consult Strategy
                    </RippleButton>
                  </motion.div>
                </motion.div>

                {/* Hero Creative Workspace Image with scroll parallax */}
                <motion.div 
                  className="hero-image-frame"
                  style={{ scale: heroImageScale, y: heroImageY }}
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1], delay: 0.4 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80" 
                    alt="Premium Creative Workspace" 
                    className="hero-parallax-img"
                  />
                  <div className="hero-img-overlay"></div>
                </motion.div>
              </div>
            </section>

            {/* ==========================================
               3. STATS SECTION (LIGHT)
               ========================================== */}
            <section id="stats" className="section-light stats-section">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">AGENCY PERFORMANCE</span>
                  <h2 className="section-heading-dark">Crafted to scale. Quantified by impact.</h2>
                </ScrollReveal>

                <div className="stats-layout-grid">
                  <div className="stat-card">
                    <span className="stat-value">
                      <AnimatedCounter to={280} suffix="+" />
                    </span>
                    <span className="stat-label">Projects Completed</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">
                      <AnimatedCounter to={99} suffix="%" />
                    </span>
                    <span className="stat-label">Client Loyalty Index</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">
                      <AnimatedCounter to={32} suffix="" />
                    </span>
                    <span className="stat-label">Design Honors Won</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">
                      <AnimatedCounter to={12} suffix="Y" />
                    </span>
                    <span className="stat-label">Combined Expertise</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ==========================================
               4. PORTFOLIO SHOWCASE (DARK)
               ========================================== */}
            <section id="portfolio" className="section-dark portfolio-section">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">SELECTED SHOWCASE</span>
                  <h2 className="section-heading-light">Projects that set a new paradigm</h2>
                  <p className="section-description-light">
                    Every project is a rigorous pursuit of design simplicity, fast interaction times, and timeless aesthetics.
                  </p>
                </ScrollReveal>

                <StaggerContainer className="portfolio-grid-layout" staggerDelay={0.15}>
                  {/* Card 1 */}
                  <StaggerItem className="portfolio-card-item">
                    <div className="portfolio-card-img-wrap">
                      <img 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80" 
                        alt="Aura Fine Design Asset" 
                        className="portfolio-img"
                      />
                      <div className="portfolio-img-glow" />
                    </div>
                    <div className="portfolio-info-wrap">
                      <span className="portfolio-tag">Interactive Design</span>
                      <h3 className="portfolio-title">Aura Commerce</h3>
                      <p className="portfolio-excerpt">Redefining high-end fashion browsing with zero-friction spatial mockups.</p>
                    </div>
                  </StaggerItem>

                  {/* Card 2 */}
                  <StaggerItem className="portfolio-card-item">
                    <div className="portfolio-card-img-wrap">
                      <img 
                        src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80" 
                        alt="Apex Application Dashboard" 
                        className="portfolio-img"
                      />
                      <div className="portfolio-img-glow" />
                    </div>
                    <div className="portfolio-info-wrap">
                      <span className="portfolio-tag">Mobile Application</span>
                      <h3 className="portfolio-title">Apex Wallet</h3>
                      <p className="portfolio-excerpt">A crypto dashboard putting visual clarity and secure telemetry first.</p>
                    </div>
                  </StaggerItem>

                  {/* Card 3 */}
                  <StaggerItem className="portfolio-card-item">
                    <div className="portfolio-card-img-wrap">
                      <img 
                        src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80" 
                        alt="Nova Brand Concept Art" 
                        className="portfolio-img"
                      />
                      <div className="portfolio-img-glow" />
                    </div>
                    <div className="portfolio-info-wrap">
                      <span className="portfolio-tag">Brand Strategy</span>
                      <h3 className="portfolio-title">Nova Identity</h3>
                      <p className="portfolio-excerpt">A minimalist, gravity-informed design framework for autonomous logistics.</p>
                    </div>
                  </StaggerItem>

                  {/* Card 4 */}
                  <StaggerItem className="portfolio-card-item">
                    <div className="portfolio-card-img-wrap">
                      <img 
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80" 
                        alt="Stratum Web Suite" 
                        className="portfolio-img"
                      />
                      <div className="portfolio-img-glow" />
                    </div>
                    <div className="portfolio-info-wrap">
                      <span className="portfolio-tag">Web Platforms</span>
                      <h3 className="portfolio-title">Stratum Suite</h3>
                      <p className="portfolio-excerpt">Enterprise analytics packed into a high-performance web architecture.</p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </section>

            {/* ==========================================
               5. SERVICES SECTION (LIGHT)
               ========================================== */}
            <section id="services" className="section-light services-section">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">OUR EXPERTISE</span>
                  <h2 className="section-heading-dark">Capabilities driven by strategy.</h2>
                  <p className="section-description-dark">
                    We operate at the convergence of artistic design, premium interface structures, and solid engineering.
                  </p>
                </ScrollReveal>

                <StaggerContainer className="services-grid-layout" staggerDelay={0.08}>
                  {/* Service 1 */}
                  <StaggerItem className="service-card">
                    <div className="service-icon-box">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8" />
                        <path d="M12 8v8" />
                      </svg>
                    </div>
                    <h3 className="service-title-dark">Interface UI/UX</h3>
                    <p className="service-text">Creating digital interfaces defined by spatial typography, interactive elegance, and clean ergonomics.</p>
                  </StaggerItem>

                  {/* Service 2 */}
                  <StaggerItem className="service-card">
                    <div className="service-icon-box">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16.5 9.4 7.55 4.24a1.79 1.79 0 0 0-2.5 1.55v12.42a1.79 1.79 0 0 0 2.5 1.55l8.95-5.16a1.79 1.79 0 0 0 0-3.1" />
                      </svg>
                    </div>
                    <h3 className="service-title-dark">Product Engineering</h3>
                    <p className="service-text">Developing scalable, high-performance React architectures optimized for sub-second loading speeds.</p>
                  </StaggerItem>

                  {/* Service 3 */}
                  <StaggerItem className="service-card">
                    <div className="service-icon-box">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                    </div>
                    <h3 className="service-title-dark">Creative Systems</h3>
                    <p className="service-text">Forging integrated branding guides, motion assets, and interactive frameworks that tell a story.</p>
                  </StaggerItem>

                  {/* Service 4 */}
                  <StaggerItem className="service-card">
                    <div className="service-icon-box">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4.5 16.5c-1.5 1.26-2 3.1-1.5 4.5.9.9 2.5.5 3.5-.5a6 6 0 0 0 3-4" />
                        <path d="M19.5 7.5c1.5-1.26 2-3.1 1.5-4.5-.9-.9-2.5-.5-3.5.5a6 6 0 0 0-3 4" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    </div>
                    <h3 className="service-title-dark">Design Advisory</h3>
                    <p className="service-text">Conducting deep audits, technical roadmapping, and UX workshops to unlock organic conversion growth.</p>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </section>

            {/* ==========================================
               6. PROCESS/WORKFLOW SECTION (DARK)
               ========================================== */}
            <section id="process" className="section-dark process-section">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">METHODOLOGY</span>
                  <h2 className="section-heading-light">How we achieve premium outcomes</h2>
                  <p className="section-description-light">
                    A rigorous 4-step execution flow engineered to minimize cycle times and prevent product drift.
                  </p>
                </ScrollReveal>

                <div className="process-flow-layout">
                  {/* Step 1 */}
                  <div className="process-step-item">
                    <div className="step-badge">01</div>
                    <h3 className="step-title">Discovery</h3>
                    <p className="step-details">Unearthing business telemetry, target expectations, and technological limits to define a precise plan.</p>
                  </div>

                  {/* Step 2 */}
                  <div className="process-step-item">
                    <div className="step-badge">02</div>
                    <h3 className="step-title">Strategy</h3>
                    <p className="step-details">Establishing spatial UX architectures, structural layout wireframes, and cinematic motion design prototypes.</p>
                  </div>

                  {/* Step 3 */}
                  <div className="process-step-item">
                    <div className="step-badge">03</div>
                    <h3 className="step-title">Design</h3>
                    <p className="step-details">Crafting breathtaking interfaces, clean layouts, and writing semantic modular React components.</p>
                  </div>

                  {/* Step 4 */}
                  <div className="process-step-item">
                    <div className="step-badge">04</div>
                    <h3 className="step-title">Launch</h3>
                    <p className="step-details">Carrying out rigorous automated audits, multi-device stress-testing, optimization, and smooth deployment.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ==========================================
               7. TESTIMONIALS SECTION (LIGHT)
               ========================================== */}
            <section id="testimonials" className="section-light testimonials-section">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">CLIENT WORDS</span>
                  <h2 className="section-heading-dark">Endorsed by industry innovators.</h2>
                </ScrollReveal>

                <StaggerContainer className="testimonials-grid-layout" staggerDelay={0.12}>
                  {/* Testimonial 1 */}
                  <StaggerItem className="testimonial-card">
                    <div className="testimonial-stars-rating">
                      {"★★★★★".split("").map((star, idx) => (
                        <span key={idx}>{star}</span>
                      ))}
                    </div>
                    <blockquote className="testimonial-quote">
                      "PortfolioPro created a design ecosystem that transformed our branding. Their technical excellence and precision are unmatched. The speed improvement was instant."
                    </blockquote>
                    <div className="testimonial-client-info">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" 
                        alt="Clara Dupont" 
                        className="testimonial-client-avatar"
                      />
                      <div>
                        <div className="client-fullname">Clara Dupont</div>
                        <div className="client-job-title">Design VP, Horizon Tech</div>
                      </div>
                    </div>
                  </StaggerItem>

                  {/* Testimonial 2 */}
                  <StaggerItem className="testimonial-card">
                    <div className="testimonial-stars-rating">
                      {"★★★★★".split("").map((star, idx) => (
                        <span key={idx}>{star}</span>
                      ))}
                    </div>
                    <blockquote className="testimonial-quote">
                      "From strategic roadmaps to complex animations, the team delivered perfect results. The communication was pristine, and their output exceeds the highest standards."
                    </blockquote>
                    <div className="testimonial-client-info">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" 
                        alt="Marcus Aurelius" 
                        className="testimonial-client-avatar"
                      />
                      <div>
                        <div className="client-fullname">Marcus Vance</div>
                        <div className="client-job-title">Technical Founder, Apex Systems</div>
                      </div>
                    </div>
                  </StaggerItem>

                  {/* Testimonial 3 */}
                  <StaggerItem className="testimonial-card">
                    <div className="testimonial-stars-rating">
                      {"★★★★★".split("").map((star, idx) => (
                        <span key={idx}>{star}</span>
                      ))}
                    </div>
                    <blockquote className="testimonial-quote">
                      "Working with this agency was an absolute revelation. They didn't just build a site; they created an interactive, glassmorphic work of art that drives sales daily."
                    </blockquote>
                    <div className="testimonial-client-info">
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80" 
                        alt="Sophia Thorne" 
                        className="testimonial-client-avatar"
                      />
                      <div>
                        <div className="client-fullname">Sophia Thorne</div>
                        <div className="client-job-title">Brand Director, Aura Studio</div>
                      </div>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </section>

            {/* ==========================================
               8. TEAM SECTION (DARK)
               ========================================== */}
            <section id="team" className="section-dark team-section">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">CORE FOUNDERS</span>
                  <h2 className="section-heading-light">The architects behind the work</h2>
                  <p className="section-description-light">
                    A multi-disciplinary collective of designers, programmers, and strategists obsessed with pixel perfection.
                  </p>
                </ScrollReveal>

                <StaggerContainer className="team-grid-layout" staggerDelay={0.12}>
                  {/* Member 1 */}
                  <StaggerItem className="team-member-card">
                    <div className="team-image-frame">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" 
                        alt="Director of Product Ana" 
                        className="team-photo-img"
                      />
                    </div>
                    <div className="team-member-bio-box">
                      <h3 className="member-name">Ana Silva</h3>
                      <span className="member-position">CEO & Strategy Director</span>
                      <p className="member-bio">Leading brand logic and visual ecosystems with 12 years of hardware design pedigree.</p>
                    </div>
                  </StaggerItem>

                  {/* Member 2 */}
                  <StaggerItem className="team-member-card">
                    <div className="team-image-frame">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" 
                        alt="CTO Lucas" 
                        className="team-photo-img"
                      />
                    </div>
                    <div className="team-member-bio-box">
                      <h3 className="member-name">Lucas Oliveira</h3>
                      <span className="member-position">CTO & Lead Engineer</span>
                      <p className="member-bio">Specializing in micro-frontend optimization, reactive animation hooks, and telemetry.</p>
                    </div>
                  </StaggerItem>

                  {/* Member 3 */}
                  <StaggerItem className="team-member-card">
                    <div className="team-image-frame">
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80" 
                        alt="Creative Director Marina" 
                        className="team-photo-img"
                      />
                    </div>
                    <div className="team-member-bio-box">
                      <h3 className="member-name">Marina Costa</h3>
                      <span className="member-position">Creative & Motion Director</span>
                      <p className="member-bio">Transforming screen real estate through micro-dynamics and glassmorphic layout assets.</p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </section>

            {/* ==========================================
               9. CTA SECTION (DARK)
               ========================================== */}
            <section className="cta-banner-section">
              <div className="section-inner cta-banner-inner">
                <ScrollReveal>
                  <h2 className="cta-banner-headline">Let's create something extraordinary</h2>
                  <p className="cta-banner-tagline">
                    Bring our cinematic interface thinking and rigorous implementation methodology to your next digital system.
                  </p>
                  <div className="cta-banner-btn-group">
                    <RippleButton href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="btn-pill btn-primary-blue">
                      Initiate Project
                    </RippleButton>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            {/* ==========================================
               10. CONTACT FORM SECTION (LIGHT)
               ========================================== */}
            <section id="contact" className="section-light contact-form-section">
              <div className="section-inner">
                <ScrollReveal>
                  <span className="section-badge">INTERACTION</span>
                  <h2 className="section-heading-dark">Initiate a consultation</h2>
                  <p className="section-description-dark">
                    Tell us about your goals, timelines, and target metrics. We will reply within one business day.
                  </p>
                </ScrollReveal>

                <div className="contact-form-layout-wrapper">
                  <AnimatePresence mode="wait">
                    {!formSubmitted ? (
                      <motion.form 
                        key="form"
                        onSubmit={handleFormSubmit} 
                        className="apple-style-contact-form"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="contact-form-row">
                          <div className="contact-form-group">
                            <label htmlFor="name" className="contact-input-label">Your Name</label>
                            <input 
                              id="name"
                              name="name"
                              type="text" 
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="e.g., Jane Sterling"
                              className="apple-styled-input"
                            />
                          </div>

                          <div className="contact-form-group">
                            <label htmlFor="email" className="contact-input-label">Corporate Email</label>
                            <input 
                              id="email"
                              name="email"
                              type="email" 
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="e.g., jane@company.com"
                              className="apple-styled-input"
                            />
                          </div>
                        </div>

                        <div className="contact-form-group">
                          <label htmlFor="subject" className="contact-input-label">Project Scope / Subject</label>
                          <input 
                            id="subject"
                            name="subject"
                            type="text"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="e.g., Interactive UI Refresh & Framework Design"
                            className="apple-styled-input"
                          />
                        </div>

                        <div className="contact-form-group">
                          <label htmlFor="message" className="contact-input-label">Project Details & Ambitions</label>
                          <textarea 
                            id="message"
                            name="message"
                            required
                            rows="6"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Briefly describe your objectives, timelines, and scope..."
                            className="apple-styled-textarea"
                          />
                        </div>

                        <div className="contact-form-footer">
                          <RippleButton type="submit" className="btn-pill btn-primary-blue contact-submit-button">
                            Transmit Inquiries
                          </RippleButton>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div 
                        key="success-box"
                        className="form-success-box"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                      >
                        <div className="success-icon-check">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </div>
                        <h3 className="success-title">Transmission Acknowledged</h3>
                        <p className="success-text">
                          Thank you for connecting, <strong>{formData.name}</strong>. Your inquiries have been securely transmitted to our lead strategist. We will review your brief and follow up shortly.
                        </p>
                        <div className="success-progress-bar">
                          <motion.div 
                            className="success-progress-timer" 
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: 5, ease: 'linear' }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* ==========================================
               11. FOOTER SECTION (DARK)
               ========================================== */}
            <footer className="footer-layout">
              <div className="footer-content-inner">
                <div className="footer-columns-grid">
                  <div className="footer-corporate-column">
                    <h3 className="footer-column-heading">PortfolioPro</h3>
                    <p className="footer-corporate-pitch">
                      Forging the next wave of high-performance interfaces, motion systems, and corporate identities for elite teams.
                    </p>
                    <div className="social-links-row">
                      <a href="#twitter" aria-label="Twitter" className="social-icon-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      </a>
                      <a href="#linkedin" aria-label="LinkedIn" className="social-icon-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                      <a href="#instagram" aria-label="Instagram" className="social-icon-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div className="footer-nav-column">
                    <h4 className="footer-column-subheading">Navigation</h4>
                    <ul className="footer-links-list">
                      <li><a href="#portfolio" onClick={(e) => handleNavClick(e, 'portfolio')}>Selected Showcase</a></li>
                      <li><a href="#services" onClick={(e) => handleNavClick(e, 'services')}>Capabilities & Services</a></li>
                      <li><a href="#process" onClick={(e) => handleNavClick(e, 'process')}>Methodology</a></li>
                      <li><a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')}>Client Reviews</a></li>
                    </ul>
                  </div>

                  <div className="footer-nav-column">
                    <h4 className="footer-column-subheading">Company</h4>
                    <ul className="footer-links-list">
                      <li><a href="#about">About the Collective</a></li>
                      <li><a href="#careers">Careers</a></li>
                      <li><a href="#press">Press Assets</a></li>
                      <li><a href="#security">Data Telemetry</a></li>
                    </ul>
                  </div>

                  <div className="footer-nav-column">
                    <h4 className="footer-column-subheading">Legal</h4>
                    <ul className="footer-links-list">
                      <li><a href="#privacy">Privacy Directives</a></li>
                      <li><a href="#terms">Terms of Agreement</a></li>
                      <li><a href="#cookies">Cookie Settings</a></li>
                      <li><a href="#licensing">IP Licensing</a></li>
                    </ul>
                  </div>
                </div>

                <div className="footer-legal-divider"></div>

                <div className="footer-bottom-row">
                  <span className="copyright-notice">
                    © {new Date().getFullYear()} PortfolioPro. All rights reserved. Designed in accordance with Apple Human Interface Guidelines.
                  </span>
                  <div className="footer-bottom-links">
                    <a href="#terms">Security</a>
                    <a href="#privacy">Privacy</a>
                    <a href="#cookies">Compliance</a>
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
