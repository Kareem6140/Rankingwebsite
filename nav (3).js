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
      { label: 'Accreditation',       href: home + '#accreditation' },
      { label: 'Rankings',            href: 'rankings.html' },
      { label: 'Researchers',         href: home + '#researchers' },
      { label: 'Sustainability Office',href: home + '#sustainability' },
      { label: 'Contact Us',          href: home + '#contact' },
    ];
  }

  class UJNavbar extends HTMLElement {
    connectedCallback() {
      if (this._mounted) return;
      this._mounted = true;

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
          </a>
          <div class="links">
            ${LINKS.map(l => {
              const cls = l.label === active ? 'active' : '';
              if (l.menu) {
                const caret = '<svg class="caret" viewBox="0 0 10 10" fill="none"><path d="M1 3l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                const sub = l.menu.map(m => `<a href="${m.href}">${m.label}</a>`).join('');
                return `<div class="item"><a href="${l.href}" class="${cls}">${l.label}${caret}<span class="ul"></span></a><div class="dropdown">${sub}</div></div>`;
              }
              return `<div class="item"><a href="${l.href}" class="${cls}">${l.label}<span class="ul"></span></a></div>`;
            }).join('')}
          </div>
        </nav>`;
    }
  }

  if (!customElements.get('uj-navbar')) customElements.define('uj-navbar', UJNavbar);
})();
