import Head from 'next/head'
import { useEffect } from 'react'

export default function Home(){
  useEffect(()=>{
    const loader = document.getElementById('loader')
    document.body.classList.add('loaded')
    setTimeout(() => {
      loader && loader.remove()
    }, 500)

    // replicate client-side interactions from static build
    const roles = ["Full-Stack Developer","AI Engineer","MERN Stack Developer","Generative AI Enthusiast"]
    let roleIndex = 0
    let charIndex = 0
    const roleEl = document.getElementById('roleType')
    function typeRole(){
      const current = roles[roleIndex]
      if(charIndex <= current.length){
        roleEl && (roleEl.textContent = current.slice(0,charIndex))
        charIndex++
        setTimeout(typeRole,60)
      } else setTimeout(()=>eraseRole(),1200)
    }
    function eraseRole(){
      const current = roles[roleIndex]
      if(charIndex>=0){
        roleEl && (roleEl.textContent = current.slice(0,charIndex))
        charIndex--
        setTimeout(eraseRole,30)
      } else {roleIndex = (roleIndex+1)%roles.length; setTimeout(typeRole,200)}
    }

    setTimeout(()=>{
      const left = document.querySelector('.hero-left')
      const right = document.querySelector('.hero-right')
      left && left.classList.add('in')
      right && right.classList.add('in')
      setTimeout(()=>typeRole(),380)
    },220)

    // simple interactions reused from static site
    document.getElementById('year').textContent = new Date().getFullYear()

    // nav toggle
    const navToggle = document.getElementById('nav-toggle')
    const navList = document.getElementById('nav-list')
    if(navToggle){navToggle.addEventListener('click',()=>{const open = navList.classList.toggle('open'); navToggle.setAttribute('aria-expanded', open ? 'true' : 'false')})}
    document.querySelectorAll('#nav-list a').forEach(a=>a.addEventListener('click',()=>{if(navList.classList.contains('open')){navList.classList.remove('open');navToggle && navToggle.setAttribute('aria-expanded','false')}}))

    // scroll progress
    document.addEventListener('scroll',()=>{const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;const pct = (scrollTop/height)*100;document.getElementById('progress').style.width = pct + '%'
    })

    // filtering - basic
    document.querySelectorAll('.projects-filter .filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.projects-filter .filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const filter = btn.dataset.filter;const cards = Array.from(document.querySelectorAll('#projectsGrid .project'));cards.forEach(card=>{const tags = card.dataset.tags.split(',');if(filter==='all' || tags.includes(filter)){card.style.display='';requestAnimationFrame(()=>card.classList.remove('project--hidden'))} else {card.classList.add('project--hidden');const onEnd=(e)=>{if(e.propertyName==='opacity'){card.style.display='none';card.removeEventListener('transitionend',onEnd)}};card.addEventListener('transitionend',onEnd)}})})})

    // counters
    const statEls = document.querySelectorAll('.stat-value')
    const io = new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(entry.isIntersecting){const el = entry.target;const target = +el.dataset.target;let v = 0;const step = Math.max(1, Math.floor(target/40));const t = setInterval(()=>{v += step;if(v>=target){el.textContent = target+'+';clearInterval(t)} else el.textContent = v},25);observer.unobserve(el)}})}, {threshold:0.4})
    statEls.forEach(e=>io.observe(e))

    // reveal
    document.querySelectorAll('.card, .project, .timeline-item, .stack-category').forEach(el=>el.classList.add('reveal'))
    const revealObserver = new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in')}})}, {threshold:0.12})
    document.querySelectorAll('.reveal').forEach(e=>revealObserver.observe(e))

    // timeline stagger
    const timelineItems = Array.from(document.querySelectorAll('.timeline .timeline-item'))
    timelineItems.forEach((it, idx)=>{it.style.transitionDelay = (idx * 120) + 'ms'})

    // contact form (no backend)
    const form = document.getElementById('contactForm')
    if(form) form.addEventListener('submit',(e)=>{e.preventDefault();alert('Thank you - message captured locally. Replace with your backend to receive messages.');form.reset()})

    // Interactive Canvas Particles
    const canvas = document.getElementById('bgCanvas')
    let cleanupCanvas = () => {}
    if (canvas) {
      const ctx = canvas.getContext('2d')
      let animationFrameId
      let width = (canvas.width = window.innerWidth)
      let height = (canvas.height = window.innerHeight)

      const handleResize = () => {
        if (!canvas) return
        width = canvas.width = window.innerWidth
        height = canvas.height = window.innerHeight
      }
      window.addEventListener('resize', handleResize)

      const particles = []
      const particleCount = Math.min(50, Math.floor((width * height) / 25000))
      const connectionDistance = 120
      const mouse = { x: null, y: null, radius: 160 }

      const handleMouseMove = (e) => {
        mouse.x = e.clientX
        mouse.y = e.clientY
      }
      const handleMouseLeave = () => {
        mouse.x = null
        mouse.y = null
      }
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseleave', handleMouseLeave)

      class Particle {
        constructor() {
          this.x = Math.random() * width
          this.y = Math.random() * height
          this.vx = (Math.random() - 0.5) * 0.45
          this.vy = (Math.random() - 0.5) * 0.45
          this.radius = Math.random() * 1.5 + 1
        }
        update() {
          this.x += this.vx
          this.y += this.vy
          if (this.x < 0 || this.x > width) this.vx = -this.vx
          if (this.y < 0 || this.y > height) this.vy = -this.vy
        }
        draw() {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(141, 104, 255, 0.45)'
          ctx.fill()
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }

      const animate = () => {
        ctx.clearRect(0, 0, width, height)
        particles.forEach((p) => {
          p.update()
          p.draw()
        })

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < connectionDistance) {
              const alpha = (1 - dist / connectionDistance) * 0.16
              ctx.strokeStyle = `rgba(98, 216, 197, ${alpha})`
              ctx.lineWidth = 0.8
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }

          if (mouse.x !== null && mouse.y !== null) {
            const dx = particles[i].x - mouse.x
            const dy = particles[i].y - mouse.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < mouse.radius) {
              const alpha = (1 - dist / mouse.radius) * 0.28
              ctx.strokeStyle = `rgba(255, 157, 115, ${alpha})`
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(mouse.x, mouse.y)
              ctx.stroke()
            }
          }
        }

        animationFrameId = requestAnimationFrame(animate)
      }
      animate()

      cleanupCanvas = () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseleave', handleMouseLeave)
        cancelAnimationFrame(animationFrameId)
      }
    }

    return () => {
      cleanupCanvas()
    }
  },[])

  return (
    <>
      <Head>
        <title>Varun Jadhav - Full-Stack Developer & AI Engineer</title>
        <meta name="description" content="Full-Stack Developer specializing in scalable web apps, Generative AI integrations, and MERN stack development." />
      </Head>

      <div id="loader"><div className="spinner"></div></div>
      <div id="progress"></div>

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-3" aria-hidden="true"></div>

      <div className="portfolio-shell">
      <header className="site-header">
        <nav className="nav container" aria-label="Primary navigation">
          <a className="brand" href="#">VJ</a>
          <button id="nav-toggle" className="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-list">Menu</button>
          <ul id="nav-list" className="nav-list">
            <li>
              <a href="#about">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                About
              </a>
            </li>
            <li>
              <a href="#experience">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                Experience
              </a>
            </li>
            <li>
              <a href="#projects">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                  <polyline points="2 17 12 22 22 17"/>
                  <polyline points="2 12 12 17 22 12"/>
                </svg>
                Work
              </a>
            </li>
            <li>
              <a href="#achievements">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/>
                  <path d="M12 2a5 5 0 0 0-5 5v3c0 2.76 2.24 5 5 5s5-2.24 5-5V7a5 5 0 0 0-5-5z"/>
                </svg>
                Award
              </a>
            </li>
            <li>
              <a href="#developer">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                </svg>
                Education
              </a>
            </li>
            <li>
              <a href="#skills">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
                  <rect x="9" y="9" width="6" height="6"/>
                  <line x1="9" y1="1" x2="9" y2="4"/>
                  <line x1="15" y1="1" x2="15" y2="4"/>
                  <line x1="9" y1="20" x2="9" y2="23"/>
                  <line x1="15" y1="20" x2="15" y2="23"/>
                  <line x1="20" y1="9" x2="23" y2="9"/>
                  <line x1="20" y1="15" x2="23" y2="15"/>
                  <line x1="1" y1="9" x2="4" y2="9"/>
                  <line x1="1" y1="15" x2="4" y2="15"/>
                </svg>
                Skill
              </a>
            </li>
            <li>
              <a href="#contact">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Contact
              </a>
            </li>
          </ul>
          <div className="nav-actions">
            <a className="btn ghost" id="resumeBtn" href="/resume.pdf" target="_blank" rel="noopener">Resume</a>
            <a className="btn" id="githubBtn" href="https://github.com/jadhavvarun20-stack" target="_blank" rel="noopener">GitHub</a>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero container" id="home">
          <div className="hero-left">
            <p className="eyebrow">Full-stack developer portfolio</p>
            <h1>I build <span className="name">web apps, APIs, and AI features</span> that feel production-ready.</h1>
            <p className="lead">I am Varun Jadhav, a MERN-focused developer building clean interfaces, secure backend APIs, MongoDB data flows, and practical Generative AI integrations.</p>
            <div className="signal-row" aria-label="Highlights">
              <span><strong>Frontend</strong> React UI, responsive layouts, polished UX</span>
              <span><strong>Backend</strong> Node APIs, auth flows, database logic</span>
              <span><strong>AI</strong> prompt flows, automation, intelligent features</span>
            </div>
            <div className="roles" aria-hidden="false">
              <span className="role static">I am a</span>
              <span className="role type" id="roleType" aria-live="polite"></span><span className="typed-cursor" aria-hidden="true">|</span>
            </div>
            <div className="hero-ctas">
              <a className="btn large" href="/resume.pdf" target="_blank" rel="noopener">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Resume
              </a>
              <a className="btn outline" href="https://github.com/jadhavvarun20-stack" target="_blank" rel="noopener">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z"/>
                </svg>
                View GitHub
              </a>
              <a className="btn ghost" href="#contact">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Contact
              </a>
            </div>
            <ul className="social-compact"><li><a href="https://github.com/jadhavvarun20-stack" target="_blank" rel="noopener">GitHub</a></li><li><a href="mailto:jadhavvarun449@gmail.com">Email</a></li></ul>
          </div>

          <div className="hero-right">
            <div className="card glass">
              <div className="card-topline"><span></span><span></span><span></span></div>
              <div className="code-window" aria-hidden="true">
                <div className="code-line"><span>const</span> developer = "Varun";</div>
                <div className="code-line"><span>await</span> buildProduct();</div>
                <div className="code-line"><span>return</span> scalableUI;</div>
              </div>
              
              <div className="ai-core-container">
                <svg className="ai-core-svg" viewBox="0 0 400 400" width="100%" height="100%">
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="12" result="blur1" />
                      <feGaussianBlur stdDeviation="4" result="blur2" />
                      <feMerge>
                        <feMergeNode in="blur1" />
                        <feMergeNode in="blur2" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8d68ff" />
                      <stop offset="50%" stopColor="#ff9d73" />
                      <stop offset="100%" stopColor="#62d8c5" />
                    </linearGradient>
                  </defs>

                  <g className="network-connections" opacity="0.6">
                    <line x1="200" y1="200" x2="100" y2="100" stroke="#8d68ff" strokeWidth="1.5" className="data-line line-1"/>
                    <line x1="200" y1="200" x2="300" y2="100" stroke="#ff9d73" strokeWidth="1.5" className="data-line line-2"/>
                    <line x1="200" y1="200" x2="100" y2="300" stroke="#62d8c5" strokeWidth="1.5" className="data-line line-3"/>
                    <line x1="200" y1="200" x2="300" y2="300" stroke="#ffcb66" strokeWidth="1.5" className="data-line line-4"/>
                    
                    <line x1="100" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    <line x1="300" y1="100" x2="300" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    <line x1="300" y1="300" x2="100" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    <line x1="100" y1="300" x2="100" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                  </g>

                  <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(141,104,255,0.15)" strokeWidth="1.5" strokeDasharray="20,10,5,10" className="orbital-ring ring-outer"/>
                  <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(255,157,115,0.2)" strokeWidth="1" strokeDasharray="40,15" className="orbital-ring ring-inner"/>

                  <g className="core-hub">
                    <circle cx="200" cy="200" r="32" fill="url(#core-grad)" filter="url(#glow-strong)" className="core-circle"/>
                    <text x="200" y="204" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900" letterSpacing="1" className="core-text">AI CORE</text>
                  </g>

                  <g className="net-node node-react" transform="translate(100, 100)">
                    <circle cx="0" cy="0" r="14" fill="#0c101b" stroke="#8d68ff" strokeWidth="2.5" filter="url(#glow)" />
                    <circle cx="0" cy="0" r="6" fill="#8d68ff" />
                    <text x="0" y="-22" textAnchor="middle" fill="#8d68ff" fontSize="11" fontWeight="800">React UI</text>
                  </g>

                  <g className="net-node node-node" transform="translate(300, 100)">
                    <circle cx="0" cy="0" r="14" fill="#0c101b" stroke="#ff9d73" strokeWidth="2.5" filter="url(#glow)" />
                    <circle cx="0" cy="0" r="6" fill="#ff9d73" />
                    <text x="0" y="-22" textAnchor="middle" fill="#ff9d73" fontSize="11" fontWeight="800">Node API</text>
                  </g>

                  <g className="net-node node-db" transform="translate(100, 300)">
                    <circle cx="0" cy="0" r="14" fill="#0c101b" stroke="#62d8c5" strokeWidth="2.5" filter="url(#glow)" />
                    <circle cx="0" cy="0" r="6" fill="#62d8c5" />
                    <text x="0" y="26" textAnchor="middle" fill="#62d8c5" fontSize="11" fontWeight="800">MongoDB</text>
                  </g>

                  <g className="net-node node-ai" transform="translate(300, 300)">
                    <circle cx="0" cy="0" r="14" fill="#0c101b" stroke="#ffcb66" strokeWidth="2.5" filter="url(#glow)" />
                    <circle cx="0" cy="0" r="6" fill="#ffcb66" />
                    <text x="0" y="26" textAnchor="middle" fill="#ffcb66" fontSize="11" fontWeight="800">GenAI/LLM</text>
                  </g>
                </svg>
              </div>

              <p className="eyebrow">Developer console</p>
              <h3>Varun Jadhav</h3>
              <p className="muted">Full-Stack Developer | AI Engineer | MERN Stack Developer</p>
              <div className="terminal-card">
                <div><span>focus</span> frontend + backend + AI</div>
                <div><span>build</span> dashboards, portals, APIs</div>
                <div><span>stack</span> React, Node, Express, MongoDB</div>
                <div><span>extra</span> Python, analytics, GenAI</div>
              </div>
              <div className="live-stack" aria-label="Live stack status">
                <span>React</span><span>Node</span><span>MongoDB</span><span>GenAI</span>
              </div>
              <div className="metrics"><div><strong>2+</strong><span>Years Coding</span></div><div><strong>10+</strong><span>Projects</span></div><div><strong>15+</strong><span>Technologies</span></div></div>
            </div>
          </div>
        </section>

        <section className="about container" id="about">
          <h2>About</h2>
          <p className="section-kicker">AI/ML Enthusiast & Full-Stack Developer</p>
          <p className="lead">AI/ML enthusiast and full-stack developer with hands-on experience in MERN stack, generative AI tools, and real-world product development within a startup environment. Skilled in building scalable applications, integrating AI-driven features, and managing end-to-end project workflows. Passionate about creating impactful solutions and looking to leverage my experience in a growth-oriented organization.</p>

          <div className="about-grid"><div><h3>Current</h3><p><strong>X38 AI Labs</strong><br/>Full-Stack Developer - September 2025 to Present</p></div><div><h3>Previous</h3><p><strong>V2V EdTech LLP</strong><br/>Python Data Science & Analytics Intern - 03/06/2024 - 15/07/2024</p></div><div><h3>Contact</h3><p>Email: <a href="mailto:jadhavvarun449@gmail.com">jadhavvarun449@gmail.com</a><br/>Phone: <a href="tel:+918446649261">8446649261</a></p></div></div>
        </section>

        <section className="developer container" id="developer">
          <h2>Developer Strengths</h2>
          <p className="section-kicker">The areas where I bring the most value while building real applications.</p>
          <div className="dev-grid">
            <div className="dev-card">
              <div className="dev-card-header">
                <span>01</span>
                <svg className="dev-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                  <polyline points="2 17 12 22 22 17"/>
                  <polyline points="2 12 12 17 22 12"/>
                </svg>
              </div>
              <h3>Frontend Engineering</h3>
              <p>Responsive React interfaces, reusable components, clean page structure, interactive states, and UI polish.</p>
            </div>
            
            <div className="dev-card">
              <div className="dev-card-header">
                <span>02</span>
                <svg className="dev-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                  <line x1="6" y1="6" x2="6.01" y2="6"/>
                  <line x1="6" y1="18" x2="6.01" y2="18"/>
                </svg>
              </div>
              <h3>Backend APIs</h3>
              <p>Express routes, REST APIs, secure data handling, authentication flows, validation, and MongoDB integration.</p>
            </div>
            
            <div className="dev-card">
              <div className="dev-card-header">
                <span>03</span>
                <svg className="dev-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                  <path d="M12 6v12M6 12h12M12 6a6 6 0 0 1 6 6M12 18a6 6 0 0 1-6-6"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                </svg>
              </div>
              <h3>AI Product Features</h3>
              <p>Generative AI workflows, prompt engineering, assistant-style features, automation, and LangChain exploration.</p>
            </div>
            
            <div className="dev-card">
              <div className="dev-card-header">
                <span>04</span>
                <svg className="dev-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                  <line x1="9" y1="18" x2="15" y2="18"/>
                  <line x1="10" y1="22" x2="14" y2="22"/>
                </svg>
              </div>
              <h3>Problem Solving</h3>
              <p>Breaking product ideas into screens, data models, endpoints, states, and deployable features.</p>
            </div>
          </div>
        </section>

        <section className="skills container" id="skills">
          <h2>Technical Skills</h2>
          <p className="section-kicker">Core tools and technologies I use to build scalable solutions.</p>
          <div className="stack-grid">
            <div className="stack-category"><h4>Programming Languages</h4><span className="badge">JavaScript</span><span className="badge">Python</span><span className="badge">Dart</span></div>
            <div className="stack-category"><h4>Frontend Development</h4><span className="badge">HTML5</span><span className="badge">CSS3</span><span className="badge">Responsive Web Design</span></div>
            <div className="stack-category"><h4>Mobile App Development</h4><span className="badge">Flutter</span><span className="badge">Cross-platform Development</span><span className="badge">Android/iOS</span></div>
            <div className="stack-category"><h4>Backend Development</h4><span className="badge">Node.js</span><span className="badge">Express.js</span><span className="badge">RESTful APIs</span></div>
            <div className="stack-category"><h4>Database</h4><span className="badge">MongoDB</span></div>
            <div className="stack-category"><h4>AI / Machine Learning / Generative AI</h4><span className="badge">Supervised Learning</span><span className="badge">Model Building</span><span className="badge">Generative AI</span><span className="badge">LLMs</span><span className="badge">Prompt Engineering</span><span className="badge">LangChain</span></div>
            <div className="stack-category"><h4>Tools & Technologies</h4><span className="badge">Git</span><span className="badge">GitHub</span><span className="badge">Postman</span><span className="badge">VS Code</span><span className="badge">Antigravity</span></div>
            <div className="stack-category"><h4>Other Skills</h4><span className="badge">Full-Stack Development (MERN)</span><span className="badge">API Integration</span><span className="badge">Project Management</span><span className="badge">Problem Solving</span></div>
          </div>
        </section>

        <section className="experience container" id="experience">
          <h2>Experience</h2>
          <p className="section-kicker">Hands-on work across frontend, backend, data, and AI-integrated product development.</p>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-point"><div className="dot"></div></div>
              <div className="timeline-date">Sep 2025 - Present</div>
              <div className="timeline-body"><h3>X38 AI Labs - Full-Stack Developer</h3><ul><li>Developed and maintained full-stack web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js)</li><li>Integrated generative AI features and APIs into applications to enhance functionality and user experience</li><li>Built and optimized RESTful APIs for scalable and efficient backend services</li><li>Collaborated with cross-functional teams to design, develop, and deploy end-to-end solutions</li><li>Managed project workflows, including requirement analysis, development, testing, and deployment</li><li>Contributed to performance optimization and debugging of applications in a fast-paced startup environment</li><li>Developed a responsive matrimonial website with user registration, profile management, matchmaking features, and secure database integration</li><li>Designed and developed a hospitality and mess food website with online menu display, food ordering, user management, and responsive UI features</li><li>Built a To-Do List application with task creation, editing, deletion, and status tracking to improve daily task management efficiency</li><li>Created modern and responsive landing pages with attractive UI/UX design to improve user engagement and product presentation</li></ul></div>
            </div>

            <div className="timeline-item">
              <div className="timeline-point"><div className="dot"></div></div>
              <div className="timeline-date">03/06/2024 - 15/07/2024</div>
              <div className="timeline-body"><h3>V2V EdTech LLP - Python Data Science & Analytics Intern</h3><ul><li>Completed Python Data Science & Analytics training, gaining hands-on experience in data analysis, visualization, and basic machine learning concepts using Python libraries</li></ul></div>
            </div>
          </div>
        </section>

        <section className="projects container" id="projects">
          <h2>Featured Projects</h2>
          <p className="section-kicker">Selected builds with emphasis on product thinking, reliable backend flows, and usable interfaces.</p>
          <div className="projects-grid" id="projectsGrid">
            <article className="project card" data-tags="tool,ai">
              <div className="project-media neon-scene">
                <div className="scene-planet"></div>
                <div className="scene-figure"></div>
                <div className="scene-trail"></div>
                <div className="scene-rocket"></div>
              </div>
              <div className="project-body">
                <h3>Python to Java Converter - Final Year Project</h3>
                <p className="muted">A comprehensive final year academic project demonstrating advanced programming and code conversion techniques.</p>
                <ul className="project-points">
                  <li>Complex language conversion logic</li>
                  <li>Parser implementation</li>
                  <li>Academic excellence</li>
                </ul>
                <div className="badges">
                  <span className="badge">Python</span>
                  <span className="badge">Java</span>
                  <span className="badge">Compiler Design</span>
                </div>
              </div>
            </article>

            <article className="project card" data-tags="web">
              <div className="project-media neon-scene teal">
                <div className="scene-planet"></div>
                <div className="scene-figure"></div>
                <div className="scene-trail"></div>
                <div className="scene-rocket"></div>
              </div>
              <div className="project-body">
                <h3>Matrimonial Platform</h3>
                <p className="muted">Full-stack matchmaking application with user registration, profile management, matchmaking features, and secure database integration.</p>
                <ul className="project-points">
                  <li>User Authentication</li>
                  <li>Profile Management & CRUD</li>
                  <li>MongoDB Schema Design</li>
                  <li>Secure Database Integration</li>
                </ul>
                <div className="badges">
                  <span className="badge">MERN</span>
                  <span className="badge">React</span>
                  <span className="badge">Node.js</span>
                  <span className="badge">MongoDB</span>
                </div>
              </div>
            </article>

            <article className="project card" data-tags="web">
              <div className="project-media neon-scene orange">
                <div className="scene-planet"></div>
                <div className="scene-figure"></div>
                <div className="scene-trail"></div>
                <div className="scene-rocket"></div>
              </div>
              <div className="project-body">
                <h3>Hospitality & Mess Food Management System</h3>
                <p className="muted">Ordering and management platform with online menu display, food ordering, user management, and responsive UI features.</p>
                <ul className="project-points">
                  <li>Online Menu Display</li>
                  <li>Food Ordering System</li>
                  <li>User & Admin Management</li>
                  <li>Responsive UI Design</li>
                </ul>
                <div className="badges">
                  <span className="badge">React</span>
                  <span className="badge">Node.js</span>
                  <span className="badge">MongoDB</span>
                  <span className="badge">Express</span>
                </div>
              </div>
            </article>

            <article className="project card" data-tags="web,tool">
              <div className="project-media neon-scene pink">
                <div className="scene-planet"></div>
                <div className="scene-figure"></div>
                <div className="scene-trail"></div>
                <div className="scene-rocket"></div>
              </div>
              <div className="project-body">
                <h3>To-Do List Application</h3>
                <p className="muted">Task management app with task creation, editing, deletion, and status tracking to improve daily task management efficiency.</p>
                <ul className="project-points">
                  <li>Task Creation & CRUD Operations</li>
                  <li>Status Tracking</li>
                  <li>Efficient Task Management</li>
                </ul>
                <div className="badges">
                  <span className="badge">React</span>
                  <span className="badge">Node.js</span>
                  <span className="badge">MongoDB</span>
                </div>
              </div>
            </article>

            <article className="project card" data-tags="web">
              <div className="project-media neon-scene gold">
                <div className="scene-planet"></div>
                <div className="scene-figure"></div>
                <div className="scene-trail"></div>
                <div className="scene-rocket"></div>
              </div>
              <div className="project-body">
                <h3>Modern Landing Pages Collection</h3>
                <p className="muted">Modern and responsive landing pages with attractive UI/UX design to improve user engagement and product presentation.</p>
                <ul className="project-points">
                  <li>Responsive Design</li>
                  <li>Modern UI/UX</li>
                  <li>User Engagement Optimization</li>
                </ul>
                <div className="badges">
                  <span className="badge">HTML5</span>
                  <span className="badge">CSS3</span>
                  <span className="badge">JavaScript</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="developer container" id="developer">
          <h2>Education</h2>
          <p className="section-kicker">Academic background in AI and Machine Learning.</p>
          <div className="dev-grid">
            <div className="dev-card"><span>01</span><h3>Diploma in Artificial Intelligence and Machine Learning</h3><p>Alamuri Ratnamala Institute of Engineering and Technology (SHAHAPUR)<br/><strong>2023-2025</strong> | <strong>Percentage: 77.00%</strong></p></div>
            <div className="dev-card"><span>02</span><h3>X-Saraswati Vidyalaya & Junior College</h3><p>Vsaind, Shahapur, Thane<br/><strong>2022</strong> | <strong>Percentage: 68.80%</strong></p></div>
          </div>
        </section>

        <section className="achievements container" id="achievements"><h2>Impact Snapshot</h2><p className="section-kicker">A quick read on the breadth of my current engineering practice.</p><div className="stats-grid"><div className="stat card"><h3 className="stat-value" data-target="2">0</h3><p>Years of Coding Experience</p></div><div className="stat card"><h3 className="stat-value" data-target="10">0</h3><p>Projects Completed</p></div><div className="stat card"><h3 className="stat-value" data-target="15">0</h3><p>Technologies Worked With</p></div><div className="stat card"><h3 className="stat-value" data-target="5">0</h3><p>AI Integrations Built</p></div></div></section>

        <section className="contact container" id="contact"><h2>Contact</h2><p className="section-kicker">Interested in building innovative products, AI solutions, or scalable applications? Let's connect.</p><div className="contact-grid">            <div className="card glass contact-card">
              <h3>Get in touch</h3>
              <p className="contact-method">
                <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href="mailto:jadhavvarun449@gmail.com">jadhavvarun449@gmail.com</a>
              </p>
              <p className="contact-method">
                <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a href="tel:+918446649261">8446649261</a>
              </p>
              <a className="btn" href="mailto:jadhavvarun449@gmail.com">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email Me
              </a>
            </div>
        <form className="card form" id="contactForm" aria-label="Contact form"><label htmlFor="name">Name</label><input id="name" name="name" required/><label htmlFor="email">Email</label><input id="email" name="email" type="email" required/><label htmlFor="message">Message</label><textarea id="message" name="message" rows="4" required></textarea><button type="submit" className="btn large">Send Message</button></form></div></section>
      </main>

      <footer className="site-footer"><div className="container"><p><span id="year"></span> Varun Jadhav - Full-Stack Developer | AI Engineer</p><p className="muted">Built with Next.js and React</p></div></footer>
      </div>

      <div id="cursor"></div>
      <canvas id="bgCanvas" aria-hidden="true"></canvas>
    </>
  )
}
