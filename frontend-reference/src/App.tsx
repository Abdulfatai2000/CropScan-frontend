import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState } from 'react'

type Page = 'home' | 'dashboard' | 'scan' | 'history' | 'guide' | 'settings' | 'help'
type Crop = 'Tomato' | 'Maize' | 'Bell pepper' | 'Citrus' | 'Potato'
type Language = 'English' | 'Yoruba'
type ResultStatus =
  | 'success'
  | 'inconclusive_low_confidence'
  | 'unreliable_image_quality'
  | 'crop_mismatch'
  | 'unsupported_crop'
  | 'request_error'

type ApiResult = {
  status?: string
  prediction?: string | { label?: string; class_name?: string }
  confidence?: number
  crop_compatibility?: string | boolean
  guidance?: string | { description?: string; recommendations?: string[] }
  message?: string
}

const crops: { name: Crop; eyebrow: string; image: string; position?: string }[] = [
  {
    name: 'Tomato',
    eyebrow: 'Fruit crop',
    image:
      'https://images.unsplash.com/photo-1530541835461-dedaf9cf368a?auto=format&fit=crop&w=900&q=82',
  },
  {
    name: 'Maize',
    eyebrow: 'Cereal crop',
    image:
      'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=900&q=82',
  },
  {
    name: 'Bell pepper',
    eyebrow: 'Fruit crop',
    image:
      'https://images.unsplash.com/photo-1721520290342-7d4362e180bb?auto=format&fit=crop&w=900&q=82',
  },
  {
    name: 'Citrus',
    eyebrow: 'Tree crop',
    image:
      'https://images.unsplash.com/photo-1735992522542-90e535107e76?auto=format&fit=crop&w=900&q=82',
  },
  {
    name: 'Potato',
    eyebrow: 'Root crop',
    image:
      'https://images.unsplash.com/photo-1529313780224-1a12b68bed16?auto=format&fit=crop&w=900&q=82',
    position: 'center 72%',
  },
]

const heroImage =
  'https://images.unsplash.com/photo-1721520290342-7d4362e180bb?auto=format&fit=crop&w=1400&q=88'

const copy = {
  English: {
    scan: 'Scan a Plant',
    welcome: 'Welcome to CropScan AI',
    welcomeBody: 'Check a leaf for potential crop health problems.',
  },
  Yoruba: {
    scan: 'Ṣàyẹ̀wò Ohun Ọ̀gbìn',
    welcome: 'Káàbọ̀ sí CropScan AI',
    welcomeBody: 'Ṣàyẹ̀wò ewé fún àwọn ìṣòro ìlera ohun ọ̀gbìn.',
  },
}

const navItems: { page: Page; label: string; icon: IconName }[] = [
  { page: 'dashboard', label: 'Overview', icon: 'grid' },
  { page: 'scan', label: 'New Assessment', icon: 'scan' },
  { page: 'history', label: 'Assessment History', icon: 'history' },
  { page: 'guide', label: 'Crop Guide', icon: 'book' },
  { page: 'settings', label: 'Settings', icon: 'settings' },
  { page: 'help', label: 'Help', icon: 'help' },
]

type IconName =
  | 'leaf'
  | 'scan'
  | 'upload'
  | 'camera'
  | 'arrow'
  | 'check'
  | 'grid'
  | 'history'
  | 'book'
  | 'settings'
  | 'help'
  | 'alert'
  | 'image'
  | 'chevron'
  | 'globe'
  | 'shield'
  | 'menu'
  | 'close'
  | 'spark'
  | 'refresh'
  | 'trash'
  | 'search'
  | 'info'

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    leaf: (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15 4.6 19 6 21 3c1 9-3.5 14-10 14" />
        <path d="M2 21c3-6 7-9 13-11" />
      </>
    ),
    scan: (
      <>
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
        <path d="M8 12h8M12 8v8" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M20 15v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" />
      </>
    ),
    camera: (
      <>
        <path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5M12 7v5l3 2" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5z" />
        <path d="M4 6.5v13" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.6 9a2.5 2.5 0 1 1 3.2 2.4c-.8.3-.8 1-.8 1.6M12 17h.01" />
      </>
    ),
    alert: (
      <>
        <path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m21 15-5-5L5 20" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    spark: (
      <>
        <path d="m12 3-1.2 3.8L7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2z" />
        <path d="m5 14-.7 2.3L2 17l2.3.7L5 20l.7-2.3L8 17l-2.3-.7z" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 7h-5V2M4 17h5v5" />
        <path d="M6.1 9a7 7 0 0 1 11.7-2L20 9M4 15l2.2 2a7 7 0 0 0 11.7-2" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
  }
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <button className={`logo ${light ? 'logo-light' : ''}`} onClick={() => window.scrollTo(0, 0)}>
      <span className="logo-mark">
        <Icon name="leaf" size={21} />
        <i />
      </span>
      <span>
        CropScan <b>AI</b>
      </span>
    </button>
  )
}

function Button({
  children,
  variant = 'primary',
  icon,
  onClick,
  type = 'button',
  disabled = false,
  full = false,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  icon?: IconName
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  full?: boolean
}) {
  return (
    <button
      className={`btn btn-${variant}${full ? ' btn-full' : ''}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {variant === 'primary' && !icon && <Icon name="arrow" size={17} />}
    </button>
  )
}

function LanguageSelect({
  value,
  onChange,
  dark = false,
}: {
  value: Language
  onChange: (value: Language) => void
  dark?: boolean
}) {
  return (
    <label className={`language-select ${dark ? 'language-dark' : ''}`}>
      <Icon name="globe" size={17} />
      <span className="sr-only">Language</span>
      <select value={value} onChange={(event) => onChange(event.target.value as Language)}>
        <option>English</option>
        <option>Yoruba</option>
      </select>
      <Icon name="chevron" size={14} />
    </label>
  )
}

function Landing({
  language,
  setLanguage,
  navigate,
}: {
  language: Language
  setLanguage: (language: Language) => void
  navigate: (page: Page) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="landing">
      <header className="public-header">
        <div className="public-nav wrap">
          <Logo />
          <nav className={menuOpen ? 'public-links open' : 'public-links'} aria-label="Main navigation">
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="#how" onClick={() => setMenuOpen(false)}>
              How It Works
            </a>
            <a href="#crops" onClick={() => setMenuOpen(false)}>
              Supported Crops
            </a>
            <a href="#responsible" onClick={() => setMenuOpen(false)}>
              About
            </a>
          </nav>
          <div className="public-actions">
            <LanguageSelect value={language} onChange={setLanguage} />
            <Button onClick={() => navigate('scan')}>{copy[language].scan}</Button>
          </div>
          <button
            className="icon-button menu-button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span>
                  <Icon name="spark" size={15} />
                </span>
                AI-assisted crop screening
              </div>
              <h1>
                Spot Crop Problems.
                <br />
                <em>Make Better Farming Decisions.</em>
              </h1>
              <p>
                Use AI-assisted plant leaf screening to identify potential crop diseases and access practical
                agricultural guidance in English or Yoruba.
              </p>
              <div className="hero-actions">
                <Button onClick={() => navigate('scan')}>Start a Scan</Button>
                <Button variant="outline" onClick={() => document.querySelector('#how')?.scrollIntoView()}>
                  How It Works
                </Button>
              </div>
              <div className="trust-line">
                <span>
                  <Icon name="shield" size={16} /> AI-assisted screening
                </span>
                <span>Five crop groups</span>
                <span>English & Yoruba</span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image">
                <img src={heroImage} alt="Healthy green crop leaf in a field" />
                <div className="scan-frame">
                  <i />
                  <i />
                  <i />
                  <i />
                  <span className="scan-line" />
                </div>
                <div className="image-pill image-pill-top">
                  <span className="live-dot" />
                  Leaf ready to scan
                </div>
                <div className="image-card">
                  <span className="image-card-icon">
                    <Icon name="leaf" />
                  </span>
                  <span>
                    <small>Clear photo detected</small>
                    <strong>Good image quality</strong>
                  </span>
                  <Icon name="check" size={18} />
                </div>
              </div>
              <p className="photo-credit">Photo by Anna Evans on Unsplash</p>
            </div>
          </div>
        </section>

        <section className="section wrap" id="how">
          <div className="section-heading centered">
            <span className="kicker">Simple by design</span>
            <h2>From leaf to guidance in three steps</h2>
            <p>No specialist equipment. Just one clear photo of the affected leaf.</p>
          </div>
          <div className="steps-grid">
            {[
              ['camera', '01', 'Take a clear photo', 'Capture or upload one leaf in natural, even light.'],
              ['leaf', '02', 'Choose the crop', 'Select the crop that genuinely matches the plant.'],
              ['scan', '03', 'Review the assessment', 'See the model result and safe next steps.'],
            ].map(([icon, number, title, body]) => (
              <article className="step-card" key={number}>
                <span className="step-number">{number}</span>
                <div className="step-icon">
                  <Icon name={icon as IconName} size={27} />
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section crops-section" id="crops">
          <div className="wrap">
            <div className="section-heading row-heading">
              <div>
                <span className="kicker">Supported today</span>
                <h2>Five crop groups, one simple workflow</h2>
              </div>
              <p>
                Only select a crop when it matches your plant. More crop support may be added as the model
                evolves.
              </p>
            </div>
            <div className="crop-grid">
              {crops.map((crop) => (
                <article className="crop-card" key={crop.name}>
                  <img src={crop.image} style={{ objectPosition: crop.position }} alt={`${crop.name} crop`} />
                  <div>
                    <small>{crop.eyebrow}</small>
                    <h3>{crop.name}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="responsible wrap" id="responsible">
          <div className="responsible-copy">
            <span className="kicker kicker-light">Responsible by design</span>
            <h2>Useful insight, without false certainty.</h2>
            <p>
              CropScan AI is a screening tool—not a laboratory diagnosis. We clearly explain when an image
              cannot be assessed or when the model is uncertain.
            </p>
            <Button variant="secondary" onClick={() => navigate('help')}>
              Read our responsible-use guide
            </Button>
          </div>
          <div className="responsible-list">
            {[
              ['image', 'Image quality matters', 'Lighting, focus and framing can affect the result.'],
              ['alert', 'Uncertainty is shown clearly', 'Low-confidence results never include specific treatment guidance.'],
              ['help', 'Know when to ask for help', 'Consult an agricultural extension professional for severe or unclear symptoms.'],
            ].map(([icon, title, body]) => (
              <div className="responsible-item" key={title}>
                <span>
                  <Icon name={icon as IconName} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer navigate={navigate} />
    </div>
  )
}

function Footer({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p>Accessible AI-assisted crop-health screening for better-informed farming decisions.</p>
        </div>
        <div>
          <h4>Product</h4>
          <button onClick={() => navigate('scan')}>Start a scan</button>
          <button onClick={() => navigate('guide')}>Supported crops</button>
          <button onClick={() => navigate('help')}>How it works</button>
        </div>
        <div>
          <h4>Support</h4>
          <button onClick={() => navigate('help')}>Help & FAQ</button>
          <button onClick={() => navigate('help')}>Responsible AI</button>
          <button>Privacy placeholder</button>
        </div>
        <div>
          <h4>Languages</h4>
          <p>English</p>
          <p>Yoruba</p>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2025 CropScan AI. Screening support, not a confirmed diagnosis.</span>
        <span>Built for farmers and extension workers.</span>
      </div>
    </footer>
  )
}

function AppShell({
  page,
  navigate,
  language,
  setLanguage,
  children,
}: {
  page: Page
  navigate: (page: Page) => void
  language: Language
  setLanguage: (language: Language) => void
  children: ReactNode
}) {
  const current = navItems.find((item) => item.page === page)?.label || 'Overview'
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <nav aria-label="Dashboard navigation">
          <span className="nav-label">Workspace</span>
          {navItems.map((item) => (
            <button
              className={page === item.page ? 'active' : ''}
              key={item.page}
              onClick={() => navigate(item.page)}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span>
            <Icon name="shield" />
          </span>
          <strong>Screen responsibly</strong>
          <p>AI results are advisory, not confirmed diagnoses.</p>
        </div>
        <button className="back-site" onClick={() => navigate('home')}>
          <Icon name="arrow" size={16} />
          Back to website
        </button>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <div className="mobile-logo">
            <Logo />
          </div>
          <div className="topbar-title">
            <span>CropScan AI</span>
            <strong>{current}</strong>
          </div>
          <div className="topbar-actions">
            <LanguageSelect value={language} onChange={setLanguage} />
            <div className="avatar" aria-label="Guest profile">
              FA
            </div>
          </div>
        </header>
        <main className="app-content">{children}</main>
      </div>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.slice(0, 5).map((item) => (
          <button
            className={page === item.page ? 'active' : ''}
            key={item.page}
            onClick={() => navigate(item.page)}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label.replace('Assessment ', '').replace('New ', '')}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function Dashboard({ language, onStart }: { language: Language; onStart: () => void }) {
  return (
    <div className="dashboard">
      <div className="page-intro">
        <div>
          <span className="kicker">Good morning</span>
          <h1>{copy[language].welcome}</h1>
          <p>{copy[language].welcomeBody}</p>
        </div>
        <Button onClick={onStart} icon="scan">
          New Assessment
        </Button>
      </div>
      <section className="start-card">
        <div className="start-card-art">
          <div className="mini-scan">
            <Icon name="leaf" size={42} />
            <i />
          </div>
        </div>
        <div className="start-card-copy">
          <span className="small-badge">
            <Icon name="spark" size={14} /> AI-assisted screening
          </span>
          <h2>Start a Plant Assessment</h2>
          <p>Upload a leaf photo to begin an AI-assisted screening. It only takes a few simple steps.</p>
          <Button onClick={onStart}>Start New Scan</Button>
        </div>
        <div className="start-meta">
          <span>Before you begin</span>
          <strong>Use one clear leaf</strong>
          <strong>Choose the matching crop</strong>
        </div>
      </section>
      <div className="dashboard-grid">
        <section className="panel supported-panel">
          <div className="panel-head">
            <div>
              <span className="kicker">Ready to scan</span>
              <h2>Supported crops</h2>
            </div>
            <span className="count-badge">5 crops</span>
          </div>
          <div className="compact-crops">
            {crops.map((crop) => (
              <button key={crop.name} onClick={onStart}>
                <img src={crop.image} alt="" />
                <span>{crop.name}</span>
                <Icon name="arrow" size={16} />
              </button>
            ))}
          </div>
        </section>
        <section className="panel tips-panel">
          <div className="panel-head">
            <div>
              <span className="kicker">Photo checklist</span>
              <h2>Get a better result</h2>
            </div>
            <span className="panel-icon">
              <Icon name="camera" />
            </span>
          </div>
          <ul className="check-list">
            {[
              'Photograph one leaf clearly',
              'Use natural, even lighting',
              'Keep the leaf in sharp focus',
              'Keep your fingers out of frame',
            ].map((tip) => (
              <li key={tip}>
                <span>
                  <Icon name="check" size={15} />
                </span>
                {tip}
              </li>
            ))}
          </ul>
          <div className="tip-note">
            <Icon name="info" size={18} />
            <span>JPG, PNG or WebP · Up to 10 MB</span>
          </div>
        </section>
      </div>
      <section className="panel empty-history">
        <div className="panel-head">
          <div>
            <span className="kicker">Your activity</span>
            <h2>Recent assessments</h2>
          </div>
          <span className="future-tag">Requires backend history</span>
        </div>
        <div className="empty-row">
          <span className="empty-icon">
            <Icon name="history" size={28} />
          </span>
          <div>
            <strong>No assessments yet</strong>
            <p>Your first scan starts here. Results are not persisted on this device.</p>
          </div>
          <Button variant="outline" onClick={onStart}>
            Start a scan
          </Button>
        </div>
      </section>
    </div>
  )
}

function Progress({ step }: { step: number }) {
  return (
    <div className="progress" aria-label={`Step ${step} of 4`}>
      {['Add Photo', 'Select Crop', 'Review', 'Assessment'].map((label, index) => (
        <div className={`progress-step ${step > index ? 'done' : ''} ${step === index + 1 ? 'current' : ''}`} key={label}>
          <span>{step > index + 1 ? <Icon name="check" size={14} /> : index + 1}</span>
          <strong>{label}</strong>
          {index < 3 && <i />}
        </div>
      ))}
    </div>
  )
}

function Assessment({ language, setLanguage, onDashboard }: { language: Language; setLanguage: (value: Language) => void; onDashboard: () => void }) {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [crop, setCrop] = useState<Crop | ''>('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [resultStatus, setResultStatus] = useState<ResultStatus | null>(null)
  const [result, setResult] = useState<ApiResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0]
    if (!next) return
    const accepted = ['image/jpeg', 'image/png', 'image/webp']
    if (!accepted.includes(next.type)) {
      setError('Please choose a JPG, PNG, or WebP image.')
      return
    }
    if (next.size > 10 * 1024 * 1024) {
      setError('This image is larger than 10 MB. Please choose a smaller file.')
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setFile(next)
    setPreview(URL.createObjectURL(next))
    setError('')
  }

  function removeFile() {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview('')
    setCrop('')
    setStep(1)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!file || !crop) return
    setStep(4)
    setResultStatus(null)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('crop', crop)
    formData.append('language', language.toLowerCase())
    try {
      const response = await fetch('/api/predict', { method: 'POST', body: formData })
      const data = (await response.json()) as ApiResult
      if (!response.ok) throw new Error(data.message || 'The assessment request could not be completed.')
      setResult(data)
      const status = data.status || 'success'
      const known: ResultStatus[] = [
        'success',
        'inconclusive_low_confidence',
        'unreliable_image_quality',
        'crop_mismatch',
        'unsupported_crop',
      ]
      setResultStatus(known.includes(status as ResultStatus) ? (status as ResultStatus) : 'success')
    } catch (requestError) {
      setResult({ message: requestError instanceof Error ? requestError.message : 'Please try again.' })
      setResultStatus('request_error')
    }
  }

  function retry(resetPhoto = false) {
    setResult(null)
    setResultStatus(null)
    if (resetPhoto) removeFile()
    else setStep(2)
  }

  const unsupported = search && !crops.some((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="assessment-page">
      <div className="assessment-head">
        <div>
          <span className="kicker">New assessment</span>
          <h1>Check a plant leaf</h1>
          <p>Follow each step to prepare a clear, reliable screening request.</p>
        </div>
        <span className="secure-note">
          <Icon name="shield" size={17} /> Secure image upload
        </span>
      </div>
      <Progress step={step} />

      {step === 1 && (
        <section className="assessment-card upload-card">
          <div className="card-title">
            <span>Step 1 of 4</span>
            <h2>Add a leaf photo</h2>
            <p>Use one leaf and make sure its surface and symptoms are clearly visible.</p>
          </div>
          <input ref={inputRef} className="sr-only" type="file" accept=".jpg,.jpeg,.png,.webp" onChange={chooseFile} />
          <input ref={cameraRef} className="sr-only" type="file" accept="image/*" capture="environment" onChange={chooseFile} />
          {!file ? (
            <div className={`drop-zone ${error ? 'has-error' : ''}`} onClick={() => inputRef.current?.click()}>
              <span className="upload-icon">
                <Icon name="upload" size={29} />
              </span>
              <h3>Upload a clear photo of a plant leaf</h3>
              <p>Drag and drop a photo here, or choose one from your device.</p>
              <div className="upload-actions">
                <Button variant="primary" icon="image" onClick={() => inputRef.current?.click()}>
                  Choose Photo
                </Button>
                <Button variant="outline" icon="camera" onClick={() => cameraRef.current?.click()}>
                  Take Photo
                </Button>
              </div>
              <small>JPG, PNG or WebP · Maximum 10 MB</small>
            </div>
          ) : (
            <div className="preview-panel">
              <img src={preview} alt="Selected leaf preview" />
              <div className="preview-details">
                <span className="success-badge">
                  <Icon name="check" size={15} /> Photo added
                </span>
                <h3>{file.name}</h3>
                <p>{(file.size / 1024 / 1024).toFixed(2)} MB · {file.type.replace('image/', '').toUpperCase()}</p>
                <div className="preview-actions">
                  <Button variant="outline" icon="refresh" onClick={() => inputRef.current?.click()}>
                    Change Photo
                  </Button>
                  <Button variant="ghost" icon="trash" onClick={removeFile}>
                    Remove
                  </Button>
                </div>
              </div>
              <div className="preview-check">
                <strong>Before continuing</strong>
                <p>Can you clearly see the whole leaf and the affected area?</p>
              </div>
            </div>
          )}
          {error && (
            <div className="inline-error" role="alert">
              <Icon name="alert" size={18} /> {error}
            </div>
          )}
          <div className="photo-tips">
            <strong>For a better photo</strong>
            <span><Icon name="check" size={14} /> Use even daylight</span>
            <span><Icon name="check" size={14} /> Hold the camera steady</span>
            <span><Icon name="check" size={14} /> Fill the frame with the leaf</span>
          </div>
          <div className="card-actions right">
            <Button disabled={!file} onClick={() => setStep(2)}>
              Continue to Crop
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="assessment-card crop-select-card">
          <div className="card-title">
            <span>Step 2 of 4</span>
            <h2>Select the matching crop</h2>
            <p>The crop you select must match the plant in your photo.</p>
          </div>
          <div className="form-layout">
            <div className="mini-preview">
              <img src={preview} alt="Selected plant leaf" />
              <div>
                <span>Selected photo</span>
                <strong>{file?.name}</strong>
                <button onClick={() => setStep(1)}>Change</button>
              </div>
            </div>
            <div className="fields">
              <label className="field">
                <span>Search or choose a crop</span>
                <div className="search-field">
                  <Icon name="search" size={18} />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="e.g. Tomato" />
                </div>
              </label>
              {unsupported ? (
                <div className="unsupported-box">
                  <Icon name="alert" size={20} />
                  <div>
                    <strong>Crop not supported yet</strong>
                    <p>CropScan AI currently supports tomato, maize, bell pepper, citrus, and potato.</p>
                  </div>
                </div>
              ) : (
                <div className="crop-options" role="radiogroup" aria-label="Supported crops">
                  {crops
                    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
                    .map((item) => (
                      <button
                        className={crop === item.name ? 'selected' : ''}
                        role="radio"
                        aria-checked={crop === item.name}
                        key={item.name}
                        onClick={() => setCrop(item.name)}
                      >
                        <img src={item.image} alt="" />
                        <span>{item.name}</span>
                        <i>{crop === item.name && <Icon name="check" size={14} />}</i>
                      </button>
                    ))}
                </div>
              )}
              <label className="field">
                <span>Guidance language</span>
                <div className="select-field">
                  <Icon name="globe" size={18} />
                  <select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>
                    <option>English</option>
                    <option>Yoruba</option>
                  </select>
                  <Icon name="chevron" size={16} />
                </div>
                <small>Available guidance will be shown in this language.</small>
              </label>
            </div>
          </div>
          <div className="card-actions between">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button disabled={!crop} onClick={() => setStep(3)}>Review Assessment</Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <form className="assessment-card review-card" onSubmit={submit}>
          <div className="card-title">
            <span>Step 3 of 4</span>
            <h2>Review before submitting</h2>
            <p>Confirm the photo and crop are correct. Your image will not be cleared if a request fails.</p>
          </div>
          <div className="review-grid">
            <img src={preview} alt="Leaf being submitted for assessment" />
            <div className="review-details">
              <div><span>Crop</span><strong>{crop}</strong><button type="button" onClick={() => setStep(2)}>Edit</button></div>
              <div><span>Language</span><strong>{language}</strong><button type="button" onClick={() => setStep(2)}>Edit</button></div>
              <div><span>Photo</span><strong>{file?.name}</strong><small>{file && (file.size / 1024 / 1024).toFixed(2)} MB</small></div>
            </div>
          </div>
          <div className="advisory">
            <Icon name="info" size={20} />
            <p><strong>Important:</strong> CropScan AI provides an AI-assisted screening, not a confirmed agricultural diagnosis.</p>
          </div>
          <div className="card-actions between">
            <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
            <Button type="submit" icon="scan">Analyze Leaf</Button>
          </div>
        </form>
      )}

      {step === 4 && !resultStatus && <Processing preview={preview} crop={crop as Crop} />}
      {step === 4 && resultStatus && (
        <ResultState
          status={resultStatus}
          result={result}
          preview={preview}
          crop={crop as Crop}
          onRetry={retry}
          onDashboard={onDashboard}
        />
      )}
    </div>
  )
}

function Processing({ preview, crop }: { preview: string; crop: Crop }) {
  return (
    <section className="assessment-card processing" aria-live="polite">
      <div className="processing-visual">
        <img src={preview} alt="" />
        <div className="processing-scan"><span /></div>
      </div>
      <span className="processing-badge"><i /> Assessment in progress</span>
      <h2>Analyzing your leaf…</h2>
      <p>CropScan AI is examining the image for patterns associated with supported crop-health conditions.</p>
      <div className="processing-meta">
        <span><Icon name="leaf" size={17} /> Selected crop: <strong>{crop}</strong></span>
        <span><Icon name="shield" size={17} /> Please keep this page open</span>
      </div>
      <small>This may take a moment. We will not submit the image twice.</small>
    </section>
  )
}

function ResultState({
  status,
  result,
  preview,
  crop,
  onRetry,
  onDashboard,
}: {
  status: ResultStatus
  result: ApiResult | null
  preview: string
  crop: Crop
  onRetry: (resetPhoto?: boolean) => void
  onDashboard: () => void
}) {
  const label =
    typeof result?.prediction === 'string'
      ? result.prediction
      : result?.prediction?.label || result?.prediction?.class_name || 'Backend prediction'
  if (status === 'success') {
    const confidence = result?.confidence != null ? (result.confidence <= 1 ? result.confidence * 100 : result.confidence) : null
    const guidance = typeof result?.guidance === 'string' ? result.guidance : result?.guidance?.description
    const recommendations = typeof result?.guidance === 'object' ? result.guidance.recommendations : []
    return (
      <section className="result-page">
        <div className="result-heading">
          <div><span className="success-badge"><Icon name="check" size={15} /> Assessment complete</span><h1>Assessment Results</h1><p>Review the model output and next steps carefully.</p></div>
          <Button variant="outline" onClick={() => onRetry(true)}>Scan Another Leaf</Button>
        </div>
        <div className="result-grid">
          <div className="result-photo"><img src={preview} alt="Assessed plant leaf" /><span>Uploaded leaf · {crop}</span></div>
          <div className="prediction-card">
            <span className="ai-label"><Icon name="spark" size={15} /> AI assessment</span>
            <small>Predicted condition</small>
            <h2>{label}</h2>
            {confidence != null && (
              <div className="confidence">
                <div><span>Model confidence</span><strong>{confidence.toFixed(1)}%</strong></div>
                <div className="confidence-track"><i style={{ width: `${Math.min(confidence, 100)}%` }} /></div>
                <p>Confidence reflects the model output, not diagnostic certainty.</p>
              </div>
            )}
          </div>
        </div>
        <div className="guidance-grid">
          <article className="guidance-card">
            <span className="panel-icon"><Icon name="book" /></span>
            <h3>Available guidance</h3>
            <p>{guidance || 'No disease-specific guidance was returned by the backend for this assessment.'}</p>
            {recommendations && recommendations.length > 0 && <ul>{recommendations.map((item) => <li key={item}>{item}</li>)}</ul>}
          </article>
          <article className="guidance-card">
            <span className="panel-icon"><Icon name="shield" /></span>
            <h3>Recommended next step</h3>
            <p>Monitor the plant and verify concerning or severe symptoms with a qualified agricultural extension professional.</p>
          </article>
        </div>
        <div className="responsible-note"><Icon name="info" /><p>This is an AI-assisted screening result, not a confirmed agricultural diagnosis. Verify the result with a qualified agricultural extension professional when necessary.</p></div>
        <div className="card-actions between"><Button variant="ghost" onClick={onDashboard}>Back to Dashboard</Button><Button onClick={() => onRetry(true)}>Scan Another Leaf</Button></div>
      </section>
    )
  }

  const states: Record<Exclude<ResultStatus, 'success'>, { icon: IconName; eyebrow: string; title: string; body: string; tips: string[]; primary: string; reset: boolean }> = {
    inconclusive_low_confidence: {
      icon: 'help',
      eyebrow: 'Inconclusive assessment',
      title: 'We Couldn’t Identify the Condition Confidently',
      body: 'The model did not produce a sufficiently confident prediction. This does not mean your plant is healthy.',
      tips: ['Take another photo in even lighting', 'Focus closely on the affected leaf', 'Avoid motion blur and excessive shadows', 'Confirm the selected crop matches the plant'],
      primary: 'Try Another Photo',
      reset: true,
    },
    unreliable_image_quality: {
      icon: 'camera',
      eyebrow: 'Image quality issue',
      title: 'Please Try a Clearer Photo',
      body: 'The photo may be too dark, too bright, too blurry, or too uniform for a reliable assessment.',
      tips: ['Move to even natural lighting', 'Keep the camera steady', 'Make sure the leaf fills the frame', 'Avoid plain images that do not clearly show a leaf'],
      primary: 'Upload Another Photo',
      reset: true,
    },
    crop_mismatch: {
      icon: 'alert',
      eyebrow: 'Crop selection warning',
      title: 'The Predicted Crop May Not Match Your Selection',
      body: 'The image’s predicted plant category does not match the crop you selected. Disease-specific guidance has been withheld.',
      tips: ['Review the selected crop', 'Choose only the crop that genuinely matches your plant', 'Upload a different photo if this is not the intended leaf'],
      primary: 'Choose the Correct Crop',
      reset: false,
    },
    unsupported_crop: {
      icon: 'leaf',
      eyebrow: 'Unsupported crop',
      title: 'Crop Not Supported Yet',
      body: 'CropScan AI currently supports tomato, maize, bell pepper, citrus, and potato.',
      tips: ['Do not mislabel an unsupported crop', 'Only continue if one of the supported crops genuinely matches your plant'],
      primary: 'Choose a Supported Crop',
      reset: false,
    },
    request_error: {
      icon: 'refresh',
      eyebrow: 'Connection problem',
      title: 'We Couldn’t Complete the Assessment',
      body: result?.message || 'The server could not process this request. Your photo and selection have been kept.',
      tips: ['Check your connection', 'Wait a moment and try again', 'Your selected image will not be lost'],
      primary: 'Try Again',
      reset: false,
    },
  }
  const state = states[status]
  return (
    <section className={`assessment-card state-card state-${status}`}>
      <div className="state-icon"><Icon name={state.icon} size={30} /></div>
      <span className="kicker">{state.eyebrow}</span>
      <h2>{state.title}</h2>
      <p className="state-body">{state.body}</p>
      <div className="state-context"><img src={preview} alt="Submitted leaf" /><div><span>Selected crop</span><strong>{crop}</strong><small>Your image is still available.</small></div></div>
      <div className="state-tips"><strong>What to do next</strong>{state.tips.map((tip) => <span key={tip}><Icon name="check" size={15} />{tip}</span>)}</div>
      <div className="card-actions center"><Button variant="outline" onClick={onDashboard}>Back to Dashboard</Button><Button onClick={() => onRetry(state.reset)}>{state.primary}</Button></div>
    </section>
  )
}

function HistoryPage({ onStart }: { onStart: () => void }) {
  return (
    <SimplePage kicker="Assessment history" title="Your previous scans" body="Review completed assessments when history storage is connected.">
      <div className="future-banner"><Icon name="info" /><div><strong>Backend support required</strong><p>This version does not have a server history endpoint, so no records are presented as saved.</p></div></div>
      <div className="toolbar"><div className="search-field disabled"><Icon name="search" /><input disabled placeholder="Search assessments" /></div><button disabled>All crops <Icon name="chevron" size={15} /></button><button disabled>Any date <Icon name="chevron" size={15} /></button></div>
      <section className="panel large-empty"><span className="empty-icon"><Icon name="history" size={32} /></span><h2>No saved assessments</h2><p>When persistence is implemented, your completed scans will appear here with crop, status, confidence and date.</p><Button onClick={onStart}>Start Your First Scan</Button></section>
    </SimplePage>
  )
}

function GuidePage({ onStart }: { onStart: () => void }) {
  return (
    <SimplePage kicker="Crop guide" title="Learn about supported crops" body="Photo tips and model-backed crop categories, without invented treatment advice.">
      <div className="future-banner mint"><Icon name="book" /><div><strong>Learning library foundation</strong><p>Disease descriptions and recommendations should be populated only from the backend catalog when that data is available.</p></div></div>
      <div className="guide-grid">
        {crops.map((crop) => <article className="guide-card" key={crop.name}><img src={crop.image} alt={`${crop.name} plant`} /><div><span>{crop.eyebrow}</span><h2>{crop.name}</h2><p>Supported for image assessment. Select this crop only when it matches your plant.</p><button onClick={onStart}>Scan {crop.name} <Icon name="arrow" size={16} /></button></div></article>)}
      </div>
    </SimplePage>
  )
}

function SettingsPage({ language, setLanguage }: { language: Language; setLanguage: (language: Language) => void }) {
  return (
    <SimplePage kicker="Preferences" title="Settings & language" body="Choose how CropScan AI presents guidance on this device.">
      <div className="settings-layout">
        <section className="panel settings-card"><div className="settings-title"><span className="panel-icon"><Icon name="globe" /></span><div><h2>Preferred language</h2><p>Used for interface text and available guidance.</p></div></div><div className="language-options">{(['English', 'Yoruba'] as Language[]).map((item) => <button className={language === item ? 'selected' : ''} onClick={() => setLanguage(item)} key={item}><span>{item === 'English' ? 'EN' : 'YO'}</span><div><strong>{item}</strong><small>{item === 'English' ? 'English' : 'Èdè Yorùbá'}</small></div><i>{language === item && <Icon name="check" size={14} />}</i></button>)}</div></section>
        <section className="panel settings-card"><div className="settings-title"><span className="panel-icon"><Icon name="shield" /></span><div><h2>Privacy & data</h2><p>How this frontend handles your current session.</p></div></div><div className="privacy-list"><div><strong>No account required</strong><span>The core assessment flow remains available without sign-in.</span></div><div><strong>No claimed cloud history</strong><span>This interface does not imply that results persist without backend storage.</span></div><div><strong>Image submission</strong><span>Your selected image is sent only when you choose Analyze Leaf.</span></div></div></section>
      </div>
    </SimplePage>
  )
}

function HelpPage() {
  const faqs = [
    ['Which crops does CropScan AI support?', 'Tomato, maize, bell pepper, citrus, and potato. Do not select a supported crop for a plant that does not match it.'],
    ['What images can I upload?', 'JPG, PNG, and WebP files up to 10 MB. A clear, well-lit photo of one leaf works best.'],
    ['Why was my result inconclusive?', 'The model did not reach a sufficient confidence level. This does not mean the plant is healthy, and specific treatment guidance is intentionally withheld.'],
    ['What does crop mismatch mean?', 'The predicted plant category did not align with your selected crop. Review the crop selection or use another photo.'],
    ['Can I use this as a confirmed diagnosis?', 'No. CropScan AI provides AI-assisted screening. Consult a qualified agricultural extension professional when symptoms are unclear or severe.'],
    ['Why are some crops unsupported?', 'The current model supports only its supplied crop groups. Unsupported crops should never be relabeled to force a prediction.'],
  ]
  return (
    <SimplePage kicker="Help centre" title="Clear answers, safer decisions" body="Learn how to get a useful screening result and understand its limitations.">
      <div className="help-grid">
        <section className="faq-list"><h2>Frequently asked questions</h2>{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<Icon name="chevron" size={17} /></summary><p>{answer}</p></details>)}</section>
        <aside className="responsible-aside"><span><Icon name="shield" size={26} /></span><h2>Responsible-use reminder</h2><p>Image quality affects results. AI predictions can be incorrect, and uncertain assessments intentionally withhold disease-specific guidance.</p><hr /><strong>Symptoms unclear or severe?</strong><p>Speak with a qualified agricultural extension professional before taking action.</p></aside>
      </div>
    </SimplePage>
  )
}

function SimplePage({ kicker, title, body, children }: { kicker: string; title: string; body: string; children: ReactNode }) {
  return <div className="simple-page"><div className="page-intro"><div><span className="kicker">{kicker}</span><h1>{title}</h1><p>{body}</p></div></div>{children}</div>
}

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('cropscan-language') as Language) || 'English')

  function setLanguage(value: Language) {
    setLanguageState(value)
    localStorage.setItem('cropscan-language', value)
  }
  function navigate(next: Page) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (page === 'home') return <Landing language={language} setLanguage={setLanguage} navigate={navigate} />
  return (
    <AppShell page={page} navigate={navigate} language={language} setLanguage={setLanguage}>
      {page === 'dashboard' && <Dashboard language={language} onStart={() => navigate('scan')} />}
      {page === 'scan' && <Assessment language={language} setLanguage={setLanguage} onDashboard={() => navigate('dashboard')} />}
      {page === 'history' && <HistoryPage onStart={() => navigate('scan')} />}
      {page === 'guide' && <GuidePage onStart={() => navigate('scan')} />}
      {page === 'settings' && <SettingsPage language={language} setLanguage={setLanguage} />}
      {page === 'help' && <HelpPage />}
    </AppShell>
  )
}
