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

  },[])

  return (
    <>
      <Head>
        <title>Varun Jadhav - Full-Stack Developer & AI Engineer</title>
        <meta name="description" content="Full-Stack Developer specializing in scalable web apps, Generative AI integrations, and MERN stack development." />
      </Head>

      <div id="loader"><div className="spinner"></div></div>
      <div id="progress"></div>

      <div className="portfolio-shell">
      <header className="site-header">
        <nav className="nav container" aria-label="Primary navigation">
          <a className="brand" href="#">VJ</a>
          <button id="nav-toggle" className="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-list">Menu</button>
          <ul id="nav-list" className="nav-list">
            <li><a href="#about">About</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#projects">Work</a></li>
            <li><a href="#achievements">Award</a></li>
            <li><a href="#developer">Education</a></li>
            <li><a href="#skills">Skill</a></li>
            <li><a href="#contact">Contact</a></li>
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
              <a className="btn large" href="/resume.pdf" target="_blank" rel="noopener">Download Resume</a>
              <a className="btn outline" href="https://github.com/jadhavvarun20-stack" target="_blank" rel="noopener">View GitHub</a>
              <a className="btn ghost" href="#contact">Contact</a>
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
              <div className="avatar"></div>
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
            <div className="dev-card"><span>01</span><h3>Frontend Engineering</h3><p>Responsive React interfaces, reusable components, clean page structure, interactive states, and UI polish.</p></div>
            <div className="dev-card"><span>02</span><h3>Backend APIs</h3><p>Express routes, REST APIs, secure data handling, authentication flows, validation, and MongoDB integration.</p></div>
            <div className="dev-card"><span>03</span><h3>AI Product Features</h3><p>Generative AI workflows, prompt engineering, assistant-style features, automation, and LangChain exploration.</p></div>
            <div className="dev-card"><span>04</span><h3>Problem Solving</h3><p>Breaking product ideas into screens, data models, endpoints, states, and deployable features.</p></div>
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
            <article className="project card" data-tags="tool,ai"><div className="project-body"><h3>Python to Java Converter - Final Year Project</h3><p className="muted">A comprehensive final year academic project demonstrating advanced programming and code conversion techniques.</p><ul className="project-points"><li>Complex language conversion logic</li><li>Parser implementation</li><li>Academic excellence</li></ul><div className="badges"><span className="badge">Python</span><span className="badge">Java</span><span className="badge">Compiler Design</span></div></div></article>
            <article className="project card" data-tags="web"><div className="project-body"><h3>Matrimonial Platform</h3><p className="muted">Full-stack matchmaking application with user registration, profile management, matchmaking features, and secure database integration.</p><ul className="project-points"><li>User Authentication</li><li>Profile Management & CRUD</li><li>MongoDB Schema Design</li><li>Secure Database Integration</li></ul><div className="badges"><span className="badge">MERN</span><span className="badge">React</span><span className="badge">Node.js</span><span className="badge">MongoDB</span></div></div></article>
            <article className="project card" data-tags="web"><div className="project-body"><h3>Hospitality & Mess Food Management System</h3><p className="muted">Ordering and management platform with online menu display, food ordering, user management, and responsive UI features.</p><ul className="project-points"><li>Online Menu Display</li><li>Food Ordering System</li><li>User & Admin Management</li><li>Responsive UI Design</li></ul><div className="badges"><span className="badge">React</span><span className="badge">Node.js</span><span className="badge">MongoDB</span><span className="badge">Express</span></div></div></article>
            <article className="project card" data-tags="web,tool"><div className="project-body"><h3>To-Do List Application</h3><p className="muted">Task management app with task creation, editing, deletion, and status tracking to improve daily task management efficiency.</p><ul className="project-points"><li>Task Creation & CRUD Operations</li><li>Status Tracking</li><li>Efficient Task Management</li></ul><div className="badges"><span className="badge">React</span><span className="badge">Node.js</span><span className="badge">MongoDB</span></div></div></article>
            <article className="project card" data-tags="web"><div className="project-body"><h3>Modern Landing Pages Collection</h3><p className="muted">Modern and responsive landing pages with attractive UI/UX design to improve user engagement and product presentation.</p><ul className="project-points"><li>Responsive Design</li><li>Modern UI/UX</li><li>User Engagement Optimization</li></ul><div className="badges"><span className="badge">HTML5</span><span className="badge">CSS3</span><span className="badge">JavaScript</span></div></div></article>
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

        <section className="contact container" id="contact"><h2>Contact</h2><p className="section-kicker">Interested in building innovative products, AI solutions, or scalable applications? Let's connect.</p><div className="contact-grid"><div className="card glass contact-card"><h3>Get in touch</h3><p>Email: <a href="mailto:jadhavvarun449@gmail.com">jadhavvarun449@gmail.com</a></p><p>Phone: <a href="tel:+918446649261">8446649261</a></p><a className="btn" href="mailto:jadhavvarun449@gmail.com">Email Me</a></div>
        <form className="card form" id="contactForm" aria-label="Contact form"><label htmlFor="name">Name</label><input id="name" name="name" required/><label htmlFor="email">Email</label><input id="email" name="email" type="email" required/><label htmlFor="message">Message</label><textarea id="message" name="message" rows="4" required></textarea><button type="submit" className="btn large">Send Message</button></form></div></section>
      </main>

      <footer className="site-footer"><div className="container"><p><span id="year"></span> Varun Jadhav - Full-Stack Developer | AI Engineer</p><p className="muted">Built with Next.js and React</p></div></footer>
      </div>

      <div id="cursor"></div>
      <canvas id="bgCanvas" aria-hidden="true"></canvas>
    </>
  )
}
