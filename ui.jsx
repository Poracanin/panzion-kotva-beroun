/* ============================================================
   Penzion Kotva — shared UI (exposes window.UI)
   ============================================================ */
(function () {
  "use strict";
  var h = React.createElement;

  // ---------- translate helpers ----------
  function tx(obj, lang) { if (!obj) return ""; return obj[lang] || obj.cz || ""; }
  function t(key, lang) { var o = window.PKB.T[key]; return o ? (o[lang] || o.cz) : key; }

  // ---------- ICONS ----------
  var P = {
    anchor: 'M12 3a2.2 2.2 0 0 0-2.2 2.2c0 .98.64 1.8 1.5 2.1V9H8.5v2H11v7.93A7 7 0 0 1 5.07 13H7l-3-3.5L1 13h2.05A9 9 0 0 0 12 21a9 9 0 0 0 8.95-8H23l-3-3.5L17 13h1.93A7 7 0 0 1 13 18.93V11h2.5V9H13V7.3c.86-.3 1.5-1.12 1.5-2.1A2.2 2.2 0 0 0 12 3Z',
    menu: 'M3 6h18M3 12h18M3 18h18',
    close: 'M6 6l12 12M18 6L6 18',
    phone: 'M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l-2 5v0a16 16 0 0 1-14-14Z',
    mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
    pin: 'M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z|M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    wifi: 'M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M12 18.5h.01',
    tv: 'M3 5h18v12H3zM8 21h8M9 2l3 3 3-3',
    kitchen: 'M6 3v8M9 3v8a3 3 0 0 1-6 0M6 11v10M18 3c-2 0-3 2-3 5s1 4 3 4 3-1 3-4-1-5-3-5ZM18 12v9',
    bath: 'M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM6 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2M7 19l-1 2M18 19l1 2',
    coffee: 'M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 9h2a2 2 0 0 1 0 5h-2M7 5c0-1 1-1 1-2M11 5c0-1 1-1 1-2',
    snow: 'M12 2v20M4 6l16 12M20 6L4 18M12 5l2-2M12 5l-2-2M12 19l2 2M12 19l-2 2',
    nosmoke: 'M3 12h13v3H3zM18 12h3v3h-3M18 8c1-1 1-2 0-3M21 12V9',
    parking: 'M6 4h6a4 4 0 0 1 0 8H9v8H6zM9 7v2h3a1 1 0 0 0 0-2z',
    wine: 'M8 3h8l-1 6a3 3 0 0 1-6 0zM12 12v6M9 21h6M7 5h10',
    sauna: 'M3 20h18M5 20v-7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v7M9 6c0-1 1-1 1-2M13 6c0-1 1-1 1-2',
    brick: 'M3 6h18v4H3zM3 14h18v4H3zM9 6v4M15 6v4M6 14v4M12 14v4M18 14v4',
    users: 'M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM21 19v-1a4 4 0 0 0-3-3.8M16 4.2a3 3 0 0 1 0 5.6',
    bed: 'M3 7v12M3 13h18v6M21 19v-3a3 3 0 0 0-3-3H8M8 9h3a2 2 0 0 1 2 2v2',
    calendar: 'M4 5h16v16H4zM4 9h16M8 3v4M16 3v4',
    check: 'M5 13l4 4L19 7',
    arrowR: 'M5 12h14M13 6l6 6-6 6',
    chevL: 'M15 6l-6 6 6 6', chevR: 'M9 6l6 6-6 6',
    chevDown: 'M6 9l6 6 6-6',
    star: 'M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.2l5.9-.9z',
    ruler: 'M3 17L17 3l4 4L7 21zM7 11l2 2M11 7l2 2M15 11l2 2',
    building: 'M4 21V5l8-3 8 3v16M9 9h2M9 13h2M13 9h2M13 13h2M9 21v-4h6v4',
    key: 'M14 7a4 4 0 1 1-5.5 5.5L3 18v3h3l1-1h2v-2h2l1.5-1.5A4 4 0 0 1 14 7ZM16 9h.01',
    shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
    lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3M12 15v2',
    card: 'M3 6h18v12H3zM3 10h18M7 15h3',
    fb: 'M14 9h3V5h-3a4 4 0 0 0-4 4v2H8v4h2v6h4v-6h3l1-4h-4V9a1 1 0 0 1 1-1Z',
    ig: 'M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM17.5 6.5h.01',
    expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
    plus: 'M12 5v14M5 12h14', minus: 'M5 12h14',
    clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
    sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM5 4v3M6.5 5.5h-3',
    heart: 'M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9Z',
    info: 'M12 8h.01M11 12h1v4h1M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
    coffee2: 'M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z',
    leaf: 'M5 19c0-8 6-14 14-14 0 8-6 14-14 14ZM5 19c3-3 6-5 9-6',
    gift: 'M4 11h16v9H4zM4 11V8h16v3M12 8V20M12 8S10 4 7.5 5 9 8 12 8ZM12 8s2-4 4.5-3S15 8 12 8Z'
  };

  function Icon(props) {
    var d = P[props.name] || P.info;
    var parts = d.split('|');
    var fill = props.fill;
    return h('svg', {
      viewBox: '0 0 24 24', width: props.size || 24, height: props.size || 24,
      fill: fill || 'none', stroke: fill ? 'none' : 'currentColor',
      strokeWidth: props.sw || 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
      style: props.style, className: props.className, 'aria-hidden': true
    }, parts.map(function (p, i) { return h('path', { key: i, d: p }); }));
  }

  // ---------- LOGO ----------
  function Logo(props) {
    return h('div', { className: 'logo' },
      h('img', { className: 'logo-img', src: 'img/logo.png', alt: 'Penzion Kotva Beroun' })
    );
  }

  // ---------- reveal-on-scroll hook ----------
  function useReveal() {
    React.useEffect(function () {
      var els = document.querySelectorAll('.reveal:not(.in)');
      if (!('IntersectionObserver' in window)) {
        els.forEach(function (e) { e.classList.add('in'); }); return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      els.forEach(function (e) { io.observe(e); });
      return function () { io.disconnect(); };
    });
  }

  // ---------- NAV ----------
  function Nav(props) {
    var lang = props.lang, go = props.go, route = props.route;
    var c = window.PKB.contact;
    var solid = props.solid;
    var open = props.menuOpen, setOpen = props.setMenuOpen;
    var ontop = props.ontop && !solid;
    var cls = 'nav' + (solid ? ' solid' : '') + (ontop ? ' ontop' : '') + (props.onlight ? ' onlight' : '');

    // third value = locked (shown but not clickable in this demo build)
    var soon = lang === 'cz' ? 'Připravujeme' : 'Coming soon';
    var links = [
      ['home', t('nav_home', lang), false],
      ['apartments', t('nav_apts', lang), true],
      ['reservation', t('nav_res', lang), false],
      ['about', t('nav_about', lang), true]
    ];

    function LinkBtn(l) {
      if (l[2]) {
        return h('span', { key: l[0], className: 'nav-link locked', title: soon }, l[1]);
      }
      var active = route === l[0] || (l[0] === 'apartments' && route === 'apartment');
      return h('a', {
        key: l[0], href: '#', className: 'nav-link' + (active ? ' active' : ''),
        onClick: function (e) { e.preventDefault(); go(l[0]); }
      }, l[1]);
    }

    return h(React.Fragment, null,
      h('header', { className: cls },
        h('div', { className: 'nav-in' },
          h('a', { href: '#', onClick: function (e){ e.preventDefault(); go('home'); } }, h(Logo)),
          h('nav', { className: 'nav-links' }, links.map(LinkBtn)),
          h('div', { className: 'nav-right' },
            h('div', { className: 'lang' },
              h('button', { className: 'lang-btn' + (lang === 'cz' ? ' on' : ''), onClick: function(){ props.setLang('cz'); } }, 'CZ'),
              h('button', { className: 'lang-btn' + (lang === 'en' ? ' on' : ''), onClick: function(){ props.setLang('en'); } }, 'EN')
            ),
            h('a', { className: 'nav-phone', href: 'tel:' + c.phoneHref }, h(Icon, { name: 'phone', size: 16 }), c.phone),
            h('button', { className: 'btn btn-amber', onClick: function(){ go('reservation'); } }, t('book_now', lang)),
            h('button', { className: 'burger', 'aria-label': 'Menu', onClick: function(){ setOpen(true); } },
              h('span'), h('span'), h('span'))
          )
        )
      ),
      // mobile drawer
      h('div', { className: 'drawer' + (open ? ' open' : ''), onClick: function(){ setOpen(false); } },
        h('div', { className: 'drawer-panel', onClick: function(e){ e.stopPropagation(); } },
          h('div', { style: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 } },
            h(Logo),
            h('button', { className: 'burger', style:{ border:'1px solid var(--line-2)' }, onClick: function(){ setOpen(false); } },
              h(Icon, { name:'close', size:20 }))
          ),
          h('nav', { className:'drawer-nav' },
            links.map(function (l) {
              if (l[2]) {
                return h('span', { key: l[0], className:'drawer-link locked' },
                  l[1], h('span', { className:'soon-tag' }, soon));
              }
              return h('a', { key: l[0], href:'#', className:'drawer-link',
                onClick: function(e){ e.preventDefault(); go(l[0]); setOpen(false); } },
                l[1], h(Icon, { name:'arrowR', size:19 }));
            })
          ),
          h('div', { style:{ marginTop:'auto', paddingTop:24 } },
            h('div', { className:'lang', style:{ marginBottom:18 } },
              h('button', { className:'lang-btn'+(lang==='cz'?' on':''), onClick:function(){ props.setLang('cz'); } }, 'CZ'),
              h('button', { className:'lang-btn'+(lang==='en'?' on':''), onClick:function(){ props.setLang('en'); } }, 'EN')
            ),
            h('a', { className:'btn btn-amber btn-block', href:'#', onClick:function(e){ e.preventDefault(); go('reservation'); setOpen(false); } }, t('book_now', lang)),
            h('a', { className:'nav-phone', href:'tel:'+c.phoneHref, style:{ marginTop:18, justifyContent:'center' } },
              h(Icon,{ name:'phone', size:16 }), c.phone)
          )
        )
      )
    );
  }

  // ---------- FOOTER ----------
  function Footer(props) {
    var lang = props.lang, go = props.go, c = window.PKB.contact;
    return h('footer', { className: 'footer' },
      h('div', { className: 'wrap' },
        h('div', { className: 'footer-grid' },
          h('div', null,
            h(Logo),
            h('p', { style:{ marginTop:18, maxWidth:'32ch', color:'#cfc7b8' } },
              lang==='cz'
                ? 'Vkusně zařízené apartmány v historickém centru Berouna, pár kroků od Plzeňské brány.'
                : 'Tastefully furnished apartments in the historic centre of Beroun, steps from the Pilsen Gate.'),
            h('div', { className:'social' },
              h('a', { href:'#', 'aria-label':'Facebook' }, h(Icon,{ name:'fb', size:18 })),
              h('a', { href:'#', 'aria-label':'Instagram' }, h(Icon,{ name:'ig', size:18 }))
            )
          ),
          h('div', null,
            h('h4', null, lang==='cz'?'Navigace':'Navigation'),
            h('div', { className:'stack-sm' },
              [['home',t('nav_home',lang),false],['apartments',t('nav_apts',lang),true],['reservation',t('nav_res',lang),false],['about',t('nav_about',lang),true]].map(function(l){
                if (l[2]) return h('div',{ key:l[0] }, h('span',{ className:'foot-locked' }, l[1]));
                return h('div',{ key:l[0] }, h('a',{ href:'#', onClick:function(e){ e.preventDefault(); go(l[0]); } }, l[1]));
              })
            )
          ),
          h('div', null,
            h('h4', null, lang==='cz'?'Apartmány':'Apartments'),
            h('div', { className:'stack-sm' },
              window.PKB.apartments.map(function(a){
                return h('div',{ key:a.id }, h('span',{ className:'foot-locked' }, tx(a.name, lang)));
              })
            )
          ),
          h('div', null,
            h('h4', null, lang==='cz'?'Kontakt':'Contact'),
            h('div', { className:'foot-contact' },
              h('div', null, h(Icon,{ name:'pin', size:17 }), h('span', null, c.street + ', ' + c.city)),
              h('div', null, h(Icon,{ name:'phone', size:17 }), h('a',{ href:'tel:'+c.phoneHref }, c.phone)),
              h('div', null, h(Icon,{ name:'mail', size:17 }), h('a',{ href:'mailto:'+c.email }, c.email)),
              h('div', null, h(Icon,{ name:'clock', size:17 }), h('span', null, (lang==='cz'?'Check-in ':'Check-in ')+c.checkin))
            )
          )
        ),
        h('div', { className:'map-card', style:{ marginTop:48, border:'1px solid rgba(255,255,255,.12)' } },
          h('iframe', {
            className:'map-embed', style:{ minHeight:280 },
            title: lang==='cz' ? 'Mapa — Penzion Kotva Beroun' : 'Map — Penzion Kotva Beroun',
            src:'https://maps.google.com/maps?q=' + encodeURIComponent(c.street + ', ' + c.city) + '&z=17&output=embed',
            loading:'lazy', referrerPolicy:'no-referrer-when-downgrade', allowFullScreen:true
          })
        ),
        h('div', { className:'footer-bot' },
          h('span', null, '© ' + new Date().getFullYear() + ' Penzion Kotva Beroun · ' + (lang==='cz'?'Všechna práva vyhrazena':'All rights reserved')),
          h('span', null, lang==='cz'?'Demo redesign · prototyp':'Demo redesign · prototype')
        )
      )
    );
  }

  // ---------- LIGHTBOX GALLERY ----------
  function Lightbox(props) {
    var imgs = props.images, idx = props.index, setIdx = props.setIndex, close = props.onClose;
    var open = idx >= 0;
    React.useEffect(function () {
      function key(e) {
        if (!open) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') setIdx((idx + 1) % imgs.length);
        if (e.key === 'ArrowLeft') setIdx((idx - 1 + imgs.length) % imgs.length);
      }
      window.addEventListener('keydown', key);
      return function(){ window.removeEventListener('keydown', key); };
    }, [open, idx]);
    return h('div', { className: 'lb' + (open ? ' open' : ''), onClick: close },
      open && h(React.Fragment, null,
        h('button', { className:'lb-close', onClick: close }, h(Icon,{ name:'close' })),
        h('button', { className:'lb-nav prev', onClick: function(e){ e.stopPropagation(); setIdx((idx-1+imgs.length)%imgs.length); } }, h(Icon,{ name:'chevL' })),
        h('img', { src: imgs[idx], alt:'', onClick: function(e){ e.stopPropagation(); } }),
        h('button', { className:'lb-nav next', onClick: function(e){ e.stopPropagation(); setIdx((idx+1)%imgs.length); } }, h(Icon,{ name:'chevR' })),
        h('div', { className:'lb-count' }, (idx+1) + ' / ' + imgs.length)
      )
    );
  }

  // mosaic gallery (uses .gal layout); first image big
  function Gallery(props) {
    var imgs = props.images;
    var st = React.useState(-1), idx = st[0], setIdx = st[1];
    var show = imgs.slice(0, 5);
    return h(React.Fragment, null,
      h('div', { className:'gal' },
        show.map(function (src, i) {
          var more = (i === 4 && imgs.length > 5);
          return h('div', { key:i, className:'gal-item' + (i===0?' big':''), onClick: function(){ setIdx(i); } },
            h('img', { src: src, alt:'', loading:'lazy' }),
            more && h('div', { className:'gal-more' }, '+' + (imgs.length - 5))
          );
        })
      ),
      h(Lightbox, { images: imgs, index: idx, setIndex: setIdx, onClose: function(){ setIdx(-1); } })
    );
  }

  window.UI = {
    h: h, Icon: Icon, Logo: Logo, Nav: Nav, Footer: Footer,
    Gallery: Gallery, Lightbox: Lightbox, useReveal: useReveal,
    tx: tx, t: t
  };
})();
