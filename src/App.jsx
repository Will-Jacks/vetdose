import "./App.css";

function SearchIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 16L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20.84 4.61C19.83 3.6 18.48 3.04 17.08 3.04C15.68 3.04 14.33 3.6 13.32 4.61L12 5.93L10.68 4.61C8.57 2.5 5.15 2.5 3.04 4.61C0.93 6.72 0.93 10.14 3.04 12.25L12 21.21L20.96 12.25C23.07 10.14 23.07 6.72 20.96 4.61H20.84Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 12a9 9 0 1 0 3-6.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3 4.5V9h4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7v5l3.2 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3L19 6V11.5C19 16.1 16.1 19.4 12 21C7.9 19.4 5 16.1 5 11.5V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12 8V12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function CapsuleIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="5.2"
        y="2.8"
        width="8.8"
        height="19.5"
        rx="4.4"
        transform="rotate(45 5.2 2.8)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8.4 12.7L14.5 6.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <a href="/" className="brand">
            <div className="brand-icon">
              <CapsuleIcon />
            </div>

            <span className="brand-name">VetDose</span>
          </a>

          <nav className="navigation">
            <button className="nav-item">
              <SearchIcon size={20} />
              <span>Buscar</span>
            </button>

            <div className="nav-divider" />

            <button className="nav-item">
              <HeartIcon />
              <span>0 favoritos</span>
            </button>

            <div className="nav-divider" />

            <button className="nav-item">
              <HistoryIcon />
              <span>0 cálculos</span>
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>GUIA FARMACOLÓGICO VETERINÁRIO</span>
            </div>

            <h1>
              <span className="title-dark">Decisões mais rápidas.</span>
              <span className="title-blue">Cuidados mais precisos.</span>
            </h1>

            <p className="hero-description">
              Encontre informações farmacológicas e calcule doses com clareza
              <br className="desktop-break" />
              durante sua rotina clínica.
            </p>

            <div className="search-box">
              <SearchIcon size={27} />

              <input
                type="text"
                placeholder="Busque por medicamento ou princípio ativo..."
                aria-label="Buscar medicamento ou princípio ativo"
              />

              <div className="shortcut">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>

            <div className="disclaimer">
              <ShieldIcon />
              <span>Catálogo demonstrativo para estudo e apoio à consulta</span>
            </div>
          </div>
        </section>

        <section className="featured">
          <div className="section-header">
            <div>
              <div className="section-label">ACERVO RÁPIDO</div>
              <h2>Medicamentos em destaque</h2>
            </div>

            <span className="item-count">0 itens</span>
          </div>

          <div className="empty-state">
            <p>Nenhum medicamento em destaque.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
