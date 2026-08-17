/* =====================================================================
   UJ Global Rankings & International Accreditation Office — Navigation bar
   ONE shared file for the whole site. Include on any page:

       <script src="nav.js"></script>
       <uj-navbar active="Home"></uj-navbar>

   Attributes:
     active  — label of the current page  (e.g. "Home", "Rankings")
     home    — path to home page          (default "index.html")
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
          { label: 'Our Strategy',                      href: home + '#about' },
          { label: 'Organizational Structure and Board', href: 'structure.html' },
          { label: 'Office Forms',                       href: 'office-forms.html' },
        ],
      },
      { label: 'Accreditation',       href: 'colleges-accreditation.html' },
      { label: 'Rankings',            href: 'rankings.html' },
      { label: 'Researchers',         href: 'https://offices.ju.edu.jo/en/gco/researchersranking.aspx', external: true },
      { label: 'Sustainability Office',href: 'https://ujsustainability.org/sustainability-home.html',   external: true },
      { label: 'Contact Us',          href: 'contact.html' },
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
          'html{scroll-behavior:smooth;scroll-padding-top:110px;}' +
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
          @media (max-width:640px){
            .brand-name { font-size:16px; white-space:normal; max-width:150px; }
            .brand-logo { height:44px; }
          }

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

          @media (max-width:1080px){
            .links{ gap:20px }
            .links .item:nth-child(n+5):not(:has(.dropdown)){ display:none }
          }
        </style>

        <nav class="bar">
          <a class="brand" href="${home}#top">
            <img class="brand-logo" src="assets/Home/main_logo.png"
                 alt="University of Jordan — Global Rankings & Accreditation">
            <span class="brand-name">Ranking and Accreditation</span>
          </a>
          <div class="links">
            ${LINKS.map(l => {
              const cls = l.label === active ? 'active' : '';
              if (l.menu) {
                const caret = '<svg class="caret" viewBox="0 0 10 10" fill="none"><path d="M1 3l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                const sub = l.menu.map(m => `<a href="${m.href}">${m.label}</a>`).join('');
                return `<div class="item"><a href="${l.href}" class="${cls}">${l.label}${caret}<span class="ul"></span></a><div class="dropdown">${sub}</div></div>`;
              }
              const ext = l.external ? ' target="_blank" rel="noopener noreferrer"' : '';
              return `<div class="item"><a href="${l.href}"${ext} class="${cls}">${l.label}<span class="ul"></span></a></div>`;
            }).join('')}
          </div>
        </nav>`;

      // ── Anchor handling ──────────────────────────────────────────────
      // Two cases are handled:
      //  (1) Same-page anchor click (e.g. "About Us" while already on the
      //      home page, the hero "Vision & mission" button, footer links)
      //      -> smooth-scroll instead of a hard jump.
      //  (2) Landing on a page with a #hash in the URL (e.g. navigating from
      //      a sub-page to index.html#about). The home page renders its
      //      sections asynchronously, so the browser's native jump can fire
      //      before the target exists. We retry until it appears.
      const currentPage = location.pathname.split('/').pop() || 'index.html';

      // Scroll to an element by id, retrying while the page finishes rendering.
      function scrollToId(id, smooth) {
        let tries = 0;
        (function attempt() {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
            return true;
          }
          if (++tries <= 40) setTimeout(attempt, 100);  // up to ~4s
          return false;
        })();
      }

      // Shared handler for a same-page anchor link. Returns true if handled.
      function handleAnchorClick(e, a) {
        const raw = a.getAttribute('href') || '';
        const hashIndex = raw.indexOf('#');
        if (hashIndex === -1) return false;          // no anchor -> normal navigation
        const targetPage = raw.slice(0, hashIndex).split('/').pop() || currentPage;
        const id = raw.slice(hashIndex + 1);
        if (!id) return false;
        const samePage = targetPage === currentPage
          || (targetPage === 'index.html' && (currentPage === '' || currentPage === 'index.html'));
        if (!samePage) return false;                 // different page -> let browser navigate
        e.preventDefault();
        scrollToId(id, true);                        // always smooth for clicks
        history.replaceState(null, '', '#' + id);
        return true;
      }

      // Case (1a): navbar links (inside this component's shadow DOM).
      root.querySelectorAll('a[href]').forEach(a => {
        a.addEventListener('click', (e) => handleAnchorClick(e, a));
      });

      // Case (1b): every OTHER same-page anchor on the page (hero buttons,
      // footer links, tiles, etc.). One delegated listener on the document
      // catches them all, including elements added after the navbar mounts.
      if (!document.__ujAnchorSmooth) {
        document.__ujAnchorSmooth = true;
        document.addEventListener('click', (e) => {
          const a = e.target.closest && e.target.closest('a[href*="#"]');
          if (!a) return;
          handleAnchorClick(e, a);
        });
      }

      // Case (2): if we arrived with a #hash already in the URL, make sure we
      // actually reach it once the async sections have rendered — smoothly.
      if (location.hash.length > 1) {
        // Small delay so the smooth animation is visible after paint.
        setTimeout(() => scrollToId(location.hash.slice(1), true), 60);
      }
    }
  }

  if (!customElements.get('uj-navbar')) customElements.define('uj-navbar', UJNavbar);
})();
