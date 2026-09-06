/* =====================================================================
   UJ Global Rankings & International Accreditation Office — Navigation bar
   ONE shared file for the whole site. Include on any page:

       <script src="nav.js"></script>
       <uj-navbar active="Home"></uj-navbar>

   Attributes:
     active  — label of the current page  (e.g. "Home", "Rankings")
     home    — path to home page          (default "index.html")

   Mobile: below 900px the desktop links collapse into a hamburger menu
   that opens a full-height drawer. The "About Us" sub-menu becomes a
   tap-to-expand accordion (no hover required).
   ===================================================================== */
(function () {
  const TEAL  = '#0C5A63';
  const AMBER = '#DE8A1B';
  const INK   = '#0F1A1B';

  function buildLinks(home) {
    return [
      { label: 'Home', href: home + '#top' },
      {
        label: 'About Us',
        href: home + '#about',
        menu: [
          { label: 'Our Strategy',                       href: home + '#about' },
          { label: 'Organizational Structure and Board', href: 'structure.html' },
          { label: 'Office Forms',                        href: 'office-forms.html' },
        ],
      },
      { label: 'Accreditation',        href: 'colleges-accreditation.html' },
      { label: 'Rankings',             href: 'rankings.html' },
      { label: 'Researchers',          href: 'https://offices.ju.edu.jo/en/gco/researchersranking.aspx', external: true },
      { label: 'Sustainability Office',href: 'https://ujsustainability.org/sustainability-home.html',   external: true },
      { label: 'Contact Us',           href: 'contact.html' },
    ];
  }

  class UJNavbar extends HTMLElement {
    connectedCallback() {
      if (this._mounted) return;
      this._mounted = true;

      // Ensure anchored sections aren't hidden under the sticky navbar when
      // scrolled to (works for both smooth-scroll and native hash jumps).
      if (!document.getElementById('uj-navbar-scroll-fix')) {
        const s = document.createElement('style');
        s.id = 'uj-navbar-scroll-fix';
        s.textContent =
          'html{scroll-behavior:smooth;scroll-padding-top:90px;}' +
          '@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto;}}';
        document.head.appendChild(s);
      }

      const active = this.getAttribute('active') || 'Home';
      const accent = this.getAttribute('accent') || TEAL;
      const home   = this.getAttribute('home')   || 'index.html';
      const LINKS  = buildLinks(home);

      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>
          :host { display:block; position:sticky; top:0; z-index:1000; font-family:'Outfit',system-ui,sans-serif; }
          *,*::before,*::after { box-sizing:border-box; }

          nav.bar {
            display:flex; align-items:center; justify-content:space-between;
            background:#FCFDFD; border-bottom:1px solid #E4EAEA;
            padding:24px 48px;
            box-shadow:0 4px 20px -12px rgba(7,60,66,.35);
          }
          .brand { display:flex; align-items:center; gap:16px; text-decoration:none; }
          .brand-logo { height:56px; width:auto; display:block; }
          .brand-name {
            font-size:20px; font-weight:700; letter-spacing:-.01em;
            color:${INK}; line-height:1.1; white-space:nowrap;
          }

          /* ── Desktop links ── */
          .links { display:flex; align-items:center; gap:34px; }
          .item  { position:relative; }

          .links a {
            position:relative; text-decoration:none; color:${INK};
            font-size:17px; font-weight:500; letter-spacing:.005em;
            padding:6px 0; white-space:nowrap; transition:color .15s ease;
            display:inline-flex; align-items:center; gap:6px;
          }
          .links a:hover { color:${accent}; }
          .links a .ul {
            position:absolute; left:0; right:100%; bottom:-2px; height:2px;
            background:${AMBER}; transition:right .2s ease;
          }
          .links a:hover .ul { right:0; }
          .links a.active { color:${accent}; font-weight:600; }
          .links a.active .ul { right:0; background:${accent}; }

          .caret { width:9px; height:9px; flex:0 0 auto; transition:transform .18s ease; }
          .item:hover .caret { transform:rotate(180deg); }

          .dropdown {
            position:absolute; top:100%; left:0; margin-top:10px;
            min-width:300px; background:#FCFDFD;
            border:1px solid #E4EAEA; border-radius:14px;
            box-shadow:0 18px 40px -18px rgba(7,60,66,.45);
            padding:8px; opacity:0; visibility:hidden; transform:translateY(6px);
            transition:opacity .16s ease, transform .16s ease, visibility .16s;
            z-index:1200;
          }
          .dropdown::before {
            content:''; position:absolute; top:-12px; left:0; right:0; height:12px;
          }
          .item:hover .dropdown,
          .item:focus-within .dropdown { opacity:1; visibility:visible; transform:translateY(0); }
          .dropdown a {
            display:block; padding:11px 14px; border-radius:9px;
            font-size:15.5px; font-weight:500; color:${INK}; white-space:normal;
            transition:background .14s ease, color .14s ease;
          }
          .dropdown a:hover { background:#F1F6F5; color:${accent}; }
          .dropdown a .ul { display:none; }

          /* ── Hamburger button (hidden on desktop) ── */
          .burger {
            display:none; flex:0 0 auto;
            width:46px; height:46px; padding:11px;
            background:transparent; border:1px solid #E4EAEA; border-radius:10px;
            cursor:pointer; align-items:center; justify-content:center;
          }
          .burger:active { background:#F1F6F5; }
          .burger span {
            position:relative; display:block; width:22px; height:2px;
            background:${INK}; border-radius:2px;
            transition:transform .25s ease, opacity .2s ease;
          }
          .burger span::before, .burger span::after {
            content:''; position:absolute; left:0; width:22px; height:2px;
            background:${INK}; border-radius:2px;
            transition:transform .25s ease;
          }
          .burger span::before { top:-7px; }
          .burger span::after  { top:7px; }
          :host([data-open]) .burger span { background:transparent; }
          :host([data-open]) .burger span::before { transform:translateY(7px) rotate(45deg); }
          :host([data-open]) .burger span::after  { transform:translateY(-7px) rotate(-45deg); }

          /* dim backdrop behind the drawer */
          .scrim {
            position:fixed; inset:0; background:rgba(7,26,27,.42);
            opacity:0; visibility:hidden; transition:opacity .25s ease, visibility .25s;
            z-index:1100;
          }
          :host([data-open]) .scrim { opacity:1; visibility:visible; }

          /* ── Mobile layout ── */
          @media (max-width:900px){
            nav.bar { padding:16px 20px; }
            .brand-logo { height:44px; }
            .brand-name { font-size:16px; white-space:normal; max-width:180px; }
            .burger { display:inline-flex; }

            /* turn the horizontal link row into a slide-in drawer */
            .links {
              position:fixed; top:0; right:0; bottom:0;
              width:min(84vw,340px);
              flex-direction:column; align-items:stretch; gap:0;
              background:#FCFDFD; padding:88px 22px 32px;
              box-shadow:-14px 0 40px -18px rgba(7,60,66,.45);
              transform:translateX(100%); transition:transform .28s ease;
              overflow-y:auto; z-index:1150;
            }
            :host([data-open]) .links { transform:translateX(0); }

            .item { width:100%; border-bottom:1px solid #EEF3F2; }
            .links a {
              font-size:17px; padding:16px 4px; width:100%; white-space:normal;
              justify-content:space-between;
            }
            .links a .ul { display:none; }         /* no underline animation on mobile */
            .caret { width:13px; height:13px; }

            /* dropdown becomes a tap-to-expand accordion, in normal flow */
            .dropdown {
              position:static; opacity:1; visibility:visible; transform:none;
              min-width:0; margin:0 0 6px; padding:0 0 6px;
              border:0; border-radius:0; box-shadow:none;
              max-height:0; overflow:hidden;
              transition:max-height .28s ease;
            }
            .item.open .dropdown { max-height:340px; }
            .item.open .caret { transform:rotate(180deg); }
            .dropdown::before { display:none; }
            .dropdown a { padding:12px 14px; font-size:15.5px; background:#F7FBFA; margin-bottom:4px; border-radius:8px; }
          }

          @media (max-width:360px){
            .brand-name { font-size:15px; max-width:150px; }
          }
        </style>

        <nav class="bar">
          <a class="brand" href="${home}#top">
            <img class="brand-logo" src="assets/Home/main_logo.png"
                 alt="University of Jordan — Global Rankings & Accreditation">
            <span class="brand-name">Ranking and Accreditation</span>
          </a>

          <button class="burger" type="button" aria-label="Open menu" aria-expanded="false">
            <span></span>
          </button>

          <div class="links" role="navigation">
            ${LINKS.map(l => {
              const cls = l.label === active ? 'active' : '';
              if (l.menu) {
                const caret = '<svg class="caret" viewBox="0 0 10 10" fill="none"><path d="M1 3l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                const sub = l.menu.map(m => `<a href="${m.href}">${m.label}</a>`).join('');
                return `<div class="item has-menu"><a href="${l.href}" class="${cls}">${l.label}${caret}<span class="ul"></span></a><div class="dropdown">${sub}</div></div>`;
              }
              const ext = l.external ? ' target="_blank" rel="noopener noreferrer"' : '';
              return `<div class="item"><a href="${l.href}"${ext} class="${cls}">${l.label}<span class="ul"></span></a></div>`;
            }).join('')}
          </div>
        </nav>
        <div class="scrim"></div>`;

      // ── Mobile drawer wiring ────────────────────────────────────────
      const host   = this;
      const burger = root.querySelector('.burger');
      const scrim  = root.querySelector('.scrim');
      const isMobile = () => window.matchMedia('(max-width:900px)').matches;

      function openMenu()  { host.setAttribute('data-open',''); burger.setAttribute('aria-expanded','true');  document.documentElement.style.overflow='hidden'; }
      function closeMenu() { host.removeAttribute('data-open'); burger.setAttribute('aria-expanded','false'); document.documentElement.style.overflow=''; }
      function toggleMenu(){ host.hasAttribute('data-open') ? closeMenu() : openMenu(); }

      burger.addEventListener('click', toggleMenu);
      scrim.addEventListener('click', closeMenu);
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
      // If the viewport grows back to desktop, reset everything.
      window.addEventListener('resize', () => { if (!isMobile()) closeMenu(); });

      // "About Us" (and any parent link with a sub-menu): on mobile the first
      // tap expands the accordion instead of navigating; a second tap follows.
      root.querySelectorAll('.item.has-menu').forEach(item => {
        const parentLink = item.querySelector(':scope > a');
        parentLink.addEventListener('click', (e) => {
          if (!isMobile()) return;                 // desktop keeps hover behaviour
          if (!item.classList.contains('open')) {
            e.preventDefault();
            root.querySelectorAll('.item.has-menu.open').forEach(o => { if (o !== item) o.classList.remove('open'); });
            item.classList.add('open');
          }
        });
      });

      // ── Anchor handling ──────────────────────────────────────────────
      const currentPage = location.pathname.split('/').pop() || 'index.html';

      function scrollToId(id, smooth) {
        let tries = 0;
        (function attempt() {
          const el = document.getElementById(id);
          if (el) { el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' }); return true; }
          if (++tries <= 40) setTimeout(attempt, 100);  // up to ~4s
          return false;
        })();
      }

      function handleAnchorClick(e, a) {
        const raw = a.getAttribute('href') || '';
        const hashIndex = raw.indexOf('#');
        if (hashIndex === -1) return false;
        const targetPage = raw.slice(0, hashIndex).split('/').pop() || currentPage;
        const id = raw.slice(hashIndex + 1);
        if (!id) return false;
        const samePage = targetPage === currentPage
          || (targetPage === 'index.html' && (currentPage === '' || currentPage === 'index.html'));
        if (!samePage) return false;
        e.preventDefault();
        scrollToId(id, true);
        history.replaceState(null, '', '#' + id);
        return true;
      }

      // navbar links (inside this component's shadow DOM)
      root.querySelectorAll('a[href]').forEach(a => {
        a.addEventListener('click', (e) => {
          // On mobile, tapping any real navigation link closes the drawer.
          if (isMobile() && !(a.closest('.item.has-menu') && a === a.closest('.item.has-menu').querySelector(':scope > a') && !a.closest('.item.has-menu').classList.contains('open'))) {
            closeMenu();
          }
          handleAnchorClick(e, a);
        });
      });

      // every OTHER same-page anchor on the page (hero buttons, footer, tiles)
      if (!document.__ujAnchorSmooth) {
        document.__ujAnchorSmooth = true;
        document.addEventListener('click', (e) => {
          const a = e.target.closest && e.target.closest('a[href*="#"]');
          if (!a) return;
          handleAnchorClick(e, a);
        });
      }

      // arrived with a #hash already in the URL
      if (location.hash.length > 1) {
        setTimeout(() => scrollToId(location.hash.slice(1), true), 60);
      }
    }
  }

  if (!customElements.get('uj-navbar')) customElements.define('uj-navbar', UJNavbar);
})();
