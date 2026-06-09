/* ============================================================
   Penzion Kotva — Home page (window.PAGES.Home)
   ============================================================ */
(function () {
  "use strict";
  var h = React.createElement;
  var Icon = window.UI.Icon, tx = window.UI.tx, t = window.UI.t, Gallery = window.UI.Gallery;
  var PKB = window.PKB, money = window.RES.money;

  function Home(props) {
    var lang = props.lang, go = props.go;
    var BookBar = window.RES.BookBar;

    var features = [
      { ic: 'nosmoke', cz: ['Nekuřácké prostředí', 'Všechny prostory penzionu jsou nekuřácké.'], en: ['Non-smoking', 'All areas of the guesthouse are non-smoking.'] },
      { ic: 'wifi', cz: ['WiFi zdarma', 'Ve všech apartmánech bezplatné připojení k internetu.'], en: ['Free WiFi', 'Free internet access in all apartments.'] },
      { ic: 'bath', cz: ['Vlastní koupelna', 'Každý apartmán má vlastní koupelnu se sprchou.'], en: ['Private bathroom', 'Each apartment has its own bathroom with shower.'] },
      { ic: 'users', cz: ['Rodinné pokoje', 'Apartmány uzpůsobené pro rodiny s dětmi.'], en: ['Family rooms', 'Apartments suited for families with children.'] }
    ];

    var galleryImgs = ['img/hero.webp', 'img/a/01.webp', 'img/d/01.webp', 'img/cellar.webp', 'img/e/01.webp', 'img/b/01.webp', 'img/a/06.webp', 'img/d/04.webp'];

    return h('div', null,
      // ---------- HERO ----------
      h('section', { className: 'hero' },
        h('div', { className: 'hero-bg' }, h('img', { src: 'img/hero-street.jpg', alt: 'Plzeňská brána, historické centrum Berouna' })),
        h('div', { className: 'hero-in' },
          h('div', { className: 'hero-loc', style: { marginBottom: 20 } }, h(Icon, { name: 'pin', size: 17 }),
            lang === 'cz' ? 'Historické centrum Berouna · 30 km od Prahy' : 'Historic centre of Beroun · 30 km from Prague'),
          h('h1', { className: 'display' }, lang === 'cz' ? 'Váš domov v srdci Berouna' : 'Your home in the heart of Beroun'),
          h('p', { className: 'hero-sub' },
            lang === 'cz' ? 'Vkusně zařízené apartmány s plně vybavenou kuchyňkou a vlastní koupelnou — pár kroků od Plzeňské brány.'
              : 'Tastefully furnished apartments with a full kitchenette and private bathroom — steps from the Pilsen Gate.'),
          h(BookBar, { lang: lang, initGuests: 2, onSearch: function (q) { go('reservation', { res: q }); } })
        )
      ),

      // ---------- WELCOME / INTRO ----------
      h('section', { className: 'section' },
        h('div', { className: 'wrap split' },
          h('div', { className: 'reveal' },
            h('p', { className: 'eyebrow' }, lang === 'cz' ? 'Vítejte u nás' : 'Welcome'),
            h('h2', { className: 'h-lg', style: { marginTop: 16 } }, lang === 'cz' ? 'Klid, soukromí a pohodlí domova' : 'Calm, privacy and the comfort of home'),
            h('p', { className: 'lead', style: { marginTop: 18 } },
              lang === 'cz' ? 'Penzion Kotva se nachází v historickém centru Berouna, v těsné blízkosti Plzeňské brány a dalších historických budov. Nabízíme vkusně zařízené 2–4 lůžkové kompletně vybavené apartmány.'
                : 'Penzion Kotva sits in the historic centre of Beroun, right next to the Pilsen Gate and other landmarks. We offer tastefully furnished, fully-equipped apartments for 2–4 guests.'),
            h('div', { className: 'tag-grid', style: { marginTop: 22 } },
              [['kitchen', lang === 'cz' ? 'Vybavená kuchyňka' : 'Equipped kitchen'], ['tv', 'Smart TV'], ['wine', lang === 'cz' ? 'Vinotéka' : 'Wine cellar'], ['sauna', lang === 'cz' ? 'Infrasauna' : 'Infrared sauna']].map(function (c, i) {
                return h('span', { key: i, className: 'chip' }, h(Icon, { name: c[0], size: 15 }), c[1]);
              })),
            h('button', { className: 'btn btn-primary', style: { marginTop: 30 }, onClick: function () { go('about'); } },
              lang === 'cz' ? 'Více o penzionu' : 'About the guesthouse', h(Icon, { name: 'arrowR', size: 18 }))
          ),
          h('div', { className: 'reveal', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 } },
            h('div', { className: 'imgcard', style: { gridRow: 'span 2' } }, h('img', { src: 'img/a/01.webp', alt: '' })),
            h('div', { className: 'imgcard' }, h('img', { src: 'img/cellar.webp', alt: '', style: { aspectRatio: '1/.7' } })),
            h('div', { className: 'imgcard' }, h('img', { src: 'img/d/04.webp', alt: '', style: { aspectRatio: '1/.7' } }))
          )
        )
      ),

      // ---------- APARTMENTS ----------
      h('section', { className: 'section bg-cream' },
        h('div', { className: 'wrap' },
          h('div', { className: 'center reveal', style: { maxWidth: 640, margin: '0 auto 52px' } },
            h('p', { className: 'eyebrow center' }, lang === 'cz' ? 'Naše apartmány' : 'Our apartments'),
            h('h2', { className: 'h-lg', style: { marginTop: 16 } }, lang === 'cz' ? 'Vyberte si svůj apartmán' : 'Choose your apartment'),
            h('p', { className: 'lead', style: { marginTop: 14 } },
              lang === 'cz' ? 'Čtyři apartmány pro páry i rodiny — každý s vlastní koupelnou a kuchyňkou.' : 'Four apartments for couples and families — each with its own bathroom and kitchenette.')
          ),
          h('div', { className: 'grid g-4' },
            PKB.apartments.map(function (a) { return h(AptCard, { key: a.id, apt: a, lang: lang, go: go }); }))
        )
      ),

      // ---------- WHY US ----------
      h('section', { className: 'section' },
        h('div', { className: 'wrap' },
          h('div', { className: 'center reveal', style: { marginBottom: 48 } },
            h('p', { className: 'eyebrow center' }, lang === 'cz' ? 'Proč právě my' : 'Why choose us'),
            h('h2', { className: 'h-lg', style: { marginTop: 16 } }, lang === 'cz' ? 'Vše pro pohodlný pobyt' : 'Everything for a comfortable stay')),
          h('div', { className: 'grid g-4' },
            features.map(function (f, i) {
              var txt = f[lang] || f.cz;
              return h('div', { key: i, className: 'feat reveal', style: { flexDirection: 'column', textAlign: 'left' } },
                h('div', { className: 'feat-ic' }, h(Icon, { name: f.ic, size: 23 })),
                h('div', { style: { marginTop: 14 } }, h('h4', null, txt[0]), h('p', null, txt[1])));
            }))
        )
      ),

      // ---------- STATS ----------
      h('section', { className: 'section-sm bg-ink' },
        h('div', { className: 'wrap' },
          h('div', { className: 'grid g-4', style: { gap: 20 } },
            [[ '2020', lang === 'cz' ? 'Založeno' : 'Established'], ['4', lang === 'cz' ? 'Apartmány' : 'Apartments'], ['2–5', lang === 'cz' ? 'Lůžek / apartmán' : 'Beds / apartment'], ['5.0', lang === 'cz' ? 'Hodnocení hostů' : 'Guest rating']].map(function (s, i) {
              return h('div', { key: i, className: 'stat reveal' }, h('div', { className: 'stat-n' }, s[0]), h('div', { className: 'stat-l' }, s[1]));
            }))
        )
      ),

      // ---------- GALLERY ----------
      h('section', { className: 'section' },
        h('div', { className: 'wrap' },
          h('div', { className: 'reveal', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 36 } },
            h('div', null,
              h('p', { className: 'eyebrow' }, lang === 'cz' ? 'Galerie' : 'Gallery'),
              h('h2', { className: 'h-lg', style: { marginTop: 14 } }, lang === 'cz' ? 'Nahlédněte dovnitř' : 'Take a look inside')),
            h('button', { className: 'btn btn-ghost', onClick: function () { go('apartments'); } }, lang === 'cz' ? 'Všechny apartmány' : 'All apartments', h(Icon, { name: 'arrowR', size: 18 }))),
          h('div', { className: 'reveal' }, h(Gallery, { images: galleryImgs }))
        )
      ),

      // ---------- REVIEWS ----------
      h('section', { className: 'section bg-cream' },
        h('div', { className: 'wrap' },
          h('div', { className: 'center reveal', style: { marginBottom: 48 } },
            h('p', { className: 'eyebrow center' }, lang === 'cz' ? 'Recenze hostů' : 'Guest reviews'),
            h('h2', { className: 'h-lg', style: { marginTop: 16 } }, lang === 'cz' ? 'Co o nás říkají hosté' : 'What our guests say')),
          h('div', { className: 'grid g-2' },
            PKB.reviews.slice(0, 2).map(function (r, i) {
              return h('div', { key: i, className: 'review reveal' },
                h('div', { className: 'stars' }, [0, 0, 0, 0, 0].map(function (_, k) { return h(Icon, { key: k, name: 'star', fill: 'currentColor', size: 18 }); })),
                h('blockquote', null, '“' + (r[lang] || r.cz) + '”'),
                h('div', { className: 'review-by' },
                  h('div', { className: 'avatar' }, r.name.charAt(0)),
                  h('div', null, h('b', null, r.name), h('span', null, r.date))));
            }))
        )
      ),

      // ---------- CTA ----------
      h(CtaBand, { lang: lang, go: go })
    );
  }

  function AptCard(props) {
    var a = props.apt, lang = props.lang, go = props.go;
    return h('article', { className: 'aptcard reveal', onClick: function () { go('apartment', a.id); }, style: { cursor: 'pointer' } },
      h('div', { className: 'aptcard-img' },
        h('img', { src: a.img[0], alt: tx(a.name, lang), loading: 'lazy' }),
        h('div', { className: 'aptcard-badge' }, h(Icon, { name: a.type === 'family' ? 'users' : 'heart', size: 14 }), a.beds + ' ' + t('beds', lang))),
      h('div', { className: 'aptcard-body' },
        h('h3', { className: 'h-md' }, tx(a.name, lang)),
        h('div', { className: 'aptcard-meta' },
          h('span', null, h(Icon, { name: 'users', size: 15 }), a.guests),
          h('span', null, h(Icon, { name: 'ruler', size: 15 }), a.size + ' m²'),
          h('span', null, h(Icon, { name: 'building', size: 15 }), a.floor)),
        h('p', { style: { fontSize: '.92rem', flex: 1 } }, tx(a.short, lang)),
        h('div', { className: 'aptcard-foot' },
          h('div', { className: 'price' }, t('from', lang) + ' ' + money(a.price), h('small', null, t('per_night', lang))),
          h('span', { className: 'textlink' }, t('enter', lang), h(Icon, { name: 'arrowR', size: 15 }))))
    );
  }

  function CtaBand(props) {
    var lang = props.lang, go = props.go;
    return h('section', { className: 'section', style: { position: 'relative', overflow: 'hidden', color: '#fff' } },
      h('div', { style: { position: 'absolute', inset: 0, zIndex: 0 } },
        h('img', { src: 'img/d/01.webp', alt: '', style: { width: '100%', height: '100%', objectFit: 'cover' } }),
        h('div', { style: { position: 'absolute', inset: 0, background: 'rgba(20,18,14,.66)' } })),
      h('div', { className: 'wrap center reveal', style: { position: 'relative', zIndex: 2, maxWidth: 720 } },
        h('h2', { className: 'h-xl', style: { color: '#fff' } }, lang === 'cz' ? 'Připraveni na pobyt v Berouně?' : 'Ready for your stay in Beroun?'),
        h('p', { className: 'lead', style: { color: 'rgba(255,255,255,.9)', marginTop: 16 } },
          lang === 'cz' ? 'Zkontrolujte dostupnost a zarezervujte si apartmán online během pár minut.' : 'Check availability and book your apartment online in just a few minutes.'),
        h('div', { style: { display: 'flex', gap: 14, justifyContent: 'center', marginTop: 30, flexWrap: 'wrap' } },
          h('button', { className: 'btn btn-amber btn-lg', onClick: function () { go('reservation'); } }, h(Icon, { name: 'calendar', size: 18 }), t('book_now', lang)),
          h('a', { className: 'btn btn-light btn-lg', href: 'tel:' + PKB.contact.phoneHref }, h(Icon, { name: 'phone', size: 18 }), PKB.contact.phone)))
    );
  }

  window.PAGES = window.PAGES || {};
  window.PAGES.Home = Home;
  window.PAGES.CtaBand = CtaBand;
})();
