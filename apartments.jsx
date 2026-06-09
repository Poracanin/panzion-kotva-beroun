/* ============================================================
   Penzion Kotva — Apartments listing + detail (window.PAGES)
   ============================================================ */
(function () {
  "use strict";
  var h = React.createElement;
  var Icon = window.UI.Icon, tx = window.UI.tx, t = window.UI.t, Gallery = window.UI.Gallery;
  var PKB = window.PKB, money = window.RES.money;

  // ---------------- listing ----------------
  function Apartments(props) {
    var lang = props.lang, go = props.go;
    return h('div', null,
      h('div', { className: 'pagehead' },
        h('div', { className: 'pagehead-bg' }, h('img', { src: 'img/d/01.webp', alt: '' })),
        h('div', { className: 'wrap pagehead-in' },
          h('div', { className: 'crumbs' },
            h('a', { href: '#', onClick: function (e) { e.preventDefault(); go('home'); } }, t('nav_home', lang)),
            h(Icon, { name: 'chevR', size: 13 }), h('span', { className: 'cur' }, t('nav_apts', lang))),
          h('p', { className: 'eyebrow', style: { color: 'var(--amber)' } }, lang === 'cz' ? 'Tradiční i moderní nábytek' : 'Traditional & modern'),
          h('h1', { className: 'h-xl', style: { marginTop: 10 } }, lang === 'cz' ? 'Naše apartmány' : 'Our apartments'),
          h('p', { className: 'lead', style: { color: 'rgba(255,255,255,.9)', maxWidth: '54ch', marginTop: 12 } },
            lang === 'cz' ? 'Čtyři kompletně vybavené apartmány s vlastní kuchyňkou a koupelnou — pro páry i rodiny s dětmi.'
              : 'Four fully-equipped apartments with their own kitchen and bathroom — for couples and families alike.'))
      ),
      h('section', { className: 'section' },
        h('div', { className: 'wrap' },
          h('div', { className: 'grid g-2' },
            PKB.apartments.map(function (a) { return h(BigAptCard, { key: a.id, apt: a, lang: lang, go: go }); }))
        )
      ),
      h(window.PAGES.CtaBand, { lang: lang, go: go })
    );
  }

  function BigAptCard(props) {
    var a = props.apt, lang = props.lang, go = props.go;
    return h('article', { className: 'aptcard reveal' },
      h('div', { className: 'aptcard-img', style: { aspectRatio: '16/10', cursor: 'pointer' }, onClick: function () { go('apartment', a.id); } },
        h('img', { src: a.img[0], alt: tx(a.name, lang), loading: 'lazy' }),
        h('div', { className: 'aptcard-badge' }, h(Icon, { name: 'calendar', size: 14 }), a.year),
        h('div', { className: 'aptcard-badge', style: { left: 'auto', right: 14 } }, a.type === 'family' ? (lang === 'cz' ? 'Rodinný' : 'Family') : (lang === 'cz' ? 'Pro páry' : 'Couples'))),
      h('div', { className: 'aptcard-body' },
        h('h3', { className: 'h-md' }, tx(a.name, lang)),
        h('p', { className: 'muted', style: { fontSize: '.88rem', margin: '4px 0 0', fontWeight: 600, color: 'var(--amber-d)' } }, tx(a.tagline, lang)),
        h('div', { className: 'aptcard-meta', style: { margin: '14px 0' } },
          h('span', null, h(Icon, { name: 'users', size: 15 }), a.guests + ' ' + (lang === 'cz' ? 'osoby' : 'guests')),
          h('span', null, h(Icon, { name: 'bed', size: 15 }), a.beds + ' ' + t('beds', lang)),
          h('span', null, h(Icon, { name: 'ruler', size: 15 }), a.size + ' m²'),
          h('span', null, h(Icon, { name: 'building', size: 15 }), a.floor)),
        h('p', { style: { fontSize: '.95rem', flex: 1 } }, tx(a.short, lang)),
        h('div', { className: 'aptcard-foot' },
          h('div', { className: 'price' }, t('from', lang) + ' ' + money(a.price), h('small', null, t('per_night', lang))),
          h('div', { style: { display: 'flex', gap: 10 } },
            h('button', { className: 'btn btn-ghost', onClick: function () { go('apartment', a.id); } }, t('enter', lang)),
            h('button', { className: 'btn btn-primary', onClick: function () { go('reservation', { res: { apt: a.id, guests: Math.min(2, a.guests) } }); } }, t('book_now', lang)))))
    );
  }

  // ---------------- detail ----------------
  function ApartmentDetail(props) {
    var lang = props.lang, go = props.go;
    var a = PKB.apt(props.id) || PKB.apartments[0];
    var idx = PKB.apartments.indexOf(a);
    var next = PKB.apartments[(idx + 1) % PKB.apartments.length];

    var faqs = [
      { q: { cz: 'Nabízíte snídaně?', en: 'Do you offer breakfast?' }, a: { cz: 'Snídaně nejsou součástí, ale po vzájemné dohodě je možné zajistit snídaně ve vybraných provozovnách v okolí.', en: 'Breakfast is not included, but by arrangement we can secure breakfast at selected venues nearby.' } },
      { q: { cz: 'V kolik je check-in a check-out?', en: 'What are the check-in / check-out times?' }, a: { cz: 'Příjezd 14:00–17:00 nebo po individuální dohodě, odjezd do 10:00.', en: 'Arrival 14:00–17:00 or by arrangement, departure by 10:00.' } },
      { q: { cz: 'Jaké jsou možnosti aktivit v okolí?', en: 'What activities are nearby?' }, a: { cz: 'Bowling 130 m, kulečník 300 m, squash 500 m, sportovní hala 500 m, beachvolejbal 500 m, aquapark 1,2 km.', en: 'Bowling 130 m, billiards 300 m, squash 500 m, sports hall 500 m, beach volleyball 500 m, aquapark 1.2 km.' } },
      { q: { cz: 'Je k dispozici parkování?', en: 'Is parking available?' }, a: { cz: 'Penzion je v pěší zóně; v docházkové vzdálenosti je několik veřejných parkovišť a parkovací dům.', en: 'The guesthouse is in a pedestrian zone; several public car parks and a parking house are within walking distance.' } }
    ];

    return h('div', null,
      // header strip
      h('section', { className: 'bg-cream', style: { paddingTop: 100 } },
        h('div', { className: 'wrap', style: { paddingTop: 24, paddingBottom: 28 } },
          h('div', { className: 'crumbs', style: { color: 'var(--ink-3)' } },
            h('a', { href: '#', onClick: function (e) { e.preventDefault(); go('home'); } }, t('nav_home', lang)),
            h(Icon, { name: 'chevR', size: 13 }),
            h('a', { href: '#', onClick: function (e) { e.preventDefault(); go('apartments'); } }, t('nav_apts', lang)),
            h(Icon, { name: 'chevR', size: 13 }), h('span', { className: 'cur', style: { color: 'var(--amber-d)' } }, tx(a.name, lang))),
          h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginTop: 12 } },
            h('div', null,
              h('div', { className: 'tag-grid', style: { marginBottom: 14 } },
                h('span', { className: 'chip chip-amber' }, a.beds + ' ' + t('beds', lang)),
                h('span', { className: 'chip' }, h(Icon, { name: 'users', size: 15 }), a.guests + (a.extra ? ' +' + a.extra : '') + ' ' + (lang === 'cz' ? 'osob' : 'guests')),
                h('span', { className: 'chip' }, h(Icon, { name: 'building', size: 15 }), a.floor),
                h('span', { className: 'chip' }, h(Icon, { name: 'ruler', size: 15 }), a.size + ' m²')),
              h('h1', { className: 'h-xl' }, tx(a.name, lang)),
              h('p', { className: 'lead', style: { marginTop: 10, color: 'var(--amber-d)', fontWeight: 600 } }, tx(a.tagline, lang))),
            h('div', { style: { textAlign: 'right' } },
              h('div', { className: 'price', style: { fontSize: '2.4rem' } }, t('from', lang) + ' ' + money(a.price), h('small', null, t('per_night', lang))),
              h('button', { className: 'btn btn-amber btn-lg', style: { marginTop: 14 }, onClick: function () { go('reservation', { res: { apt: a.id, guests: Math.min(2, a.guests) } }); } },
                h(Icon, { name: 'calendar', size: 18 }), lang === 'cz' ? 'Rezervovat termín' : 'Book dates')))
        )
      ),

      // gallery
      h('section', { className: 'section-sm' },
        h('div', { className: 'wrap' }, h(Gallery, { images: a.img }))
      ),

      // description + amenities
      h('section', { className: 'section', style: { paddingTop: 0 } },
        h('div', { className: 'wrap', style: { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 56, alignItems: 'start' } },
          h('div', null,
            h('p', { className: 'eyebrow' }, lang === 'cz' ? 'Seznámení s apartmánem' : 'About this apartment'),
            h('h2', { className: 'h-md', style: { marginTop: 14, marginBottom: 14 } }, lang === 'cz' ? 'Snadné bydlení s vlastní kuchyní a koupelnou' : 'Easy living with private kitchen and bathroom'),
            h('p', { className: 'lead' }, tx(a.desc, lang)),
            h('p', null, lang === 'cz'
              ? 'Apartmány Penzionu Kotva mají kompletně zařízené kuchyňky, ve kterých si hosté pohodlně připraví celodenní stravování. Pro gurmánské zážitky se vydejte do centra města, kde najdete řadu restaurací a kaváren.'
              : 'The apartments at Penzion Kotva have fully-equipped kitchenettes for preparing meals throughout the day. For dining out, head to the town centre with its many restaurants and cafés.'),
            h('div', { className: 'tag-grid', style: { marginTop: 24 } },
              PKB.perks.map(function (p, i) { return h('span', { key: i, className: 'chip' }, h(Icon, { name: p.ic, size: 15 }), p[lang] || p.cz); }))
          ),
          h('div', { className: 'panel', style: { position: 'sticky', top: 96 } },
            h('h3', { style: { fontFamily: 'var(--sans)', fontSize: '1rem', fontWeight: 700, letterSpacing: '.04em', marginBottom: 18 } }, lang === 'cz' ? 'Vybavení apartmánu' : 'Apartment amenities'),
            h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 } },
              PKB.amenities.map(function (am, i) {
                return h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 10, fontSize: '.92rem', fontWeight: 500 } },
                  h('span', { style: { color: 'var(--amber-d)', flex: 'none' } }, h(Icon, { name: am.ic, size: 19 })), am[lang] || am.cz);
              })),
            h('div', { style: { borderTop: '1px solid var(--line)', marginTop: 20, paddingTop: 18, fontSize: '.9rem', color: 'var(--ink-2)' } },
              h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 } }, h('span', null, lang === 'cz' ? 'Check-in' : 'Check-in'), h('b', null, PKB.contact.checkin)),
              h('div', { style: { display: 'flex', justifyContent: 'space-between' } }, h('span', null, lang === 'cz' ? 'Check-out' : 'Check-out'), h('b', null, PKB.contact.checkout)))
          )
        )
      ),

      // perks band
      h('section', { className: 'section-sm bg-cream' },
        h('div', { className: 'wrap' },
          h('div', { className: 'grid g-4' },
            PKB.perks.map(function (p, i) {
              return h('div', { key: i, className: 'feat reveal', style: { flexDirection: 'column' } },
                h('div', { className: 'feat-ic' }, h(Icon, { name: p.ic, size: 23 })),
                h('div', { style: { marginTop: 12 } }, h('h4', null, p[lang] || p.cz), h('p', null, tx(p.d, lang))));
            }))
        )
      ),

      // FAQ
      h('section', { className: 'section' },
        h('div', { className: 'wrap-tight' },
          h('div', { className: 'center', style: { marginBottom: 36 } },
            h('p', { className: 'eyebrow center' }, 'FAQ'),
            h('h2', { className: 'h-lg', style: { marginTop: 14 } }, lang === 'cz' ? 'Máte otázky? Máme odpovědi.' : 'Questions? We have answers.')),
          h('div', null, faqs.map(function (q, i) { return h(Faq, { key: i, q: tx(q.q, lang), a: tx(q.a, lang) }); }))
        )
      ),

      // next apartment
      h('section', { className: 'section-sm bg-ink' },
        h('div', { className: 'wrap', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 } },
          h('div', null,
            h('p', { style: { color: 'var(--amber)', fontWeight: 600, letterSpacing: '.04em', margin: 0 } }, lang === 'cz' ? 'Další apartmán' : 'Next apartment'),
            h('h3', { className: 'h-lg', style: { color: '#fff', marginTop: 6 } }, tx(next.name, lang))),
          h('button', { className: 'btn btn-light btn-lg', onClick: function () { go('apartment', next.id); } }, tx(next.name, lang), h(Icon, { name: 'arrowR', size: 18 })))
      )
    );
  }

  function Faq(props) {
    var st = React.useState(false), open = st[0], setOpen = st[1];
    return h('div', { style: { borderBottom: '1px solid var(--line)' } },
      h('button', { onClick: function () { setOpen(!open); },
        style: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: 'none', border: 'none', padding: '22px 0', textAlign: 'left', cursor: 'pointer' } },
        h('span', { style: { fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--ink)' } }, props.q),
        h('span', { style: { flex: 'none', color: 'var(--amber-d)', transition: 'transform .3s', transform: open ? 'rotate(45deg)' : 'none' } }, h(Icon, { name: 'plus', size: 22 }))),
      h('div', { style: { maxHeight: open ? 300 : 0, overflow: 'hidden', transition: 'max-height .35s ease, opacity .3s', opacity: open ? 1 : 0 } },
        h('p', { style: { paddingBottom: 22, margin: 0, maxWidth: '62ch' } }, props.a))
    );
  }

  window.PAGES = window.PAGES || {};
  window.PAGES.Apartments = Apartments;
  window.PAGES.ApartmentDetail = ApartmentDetail;
})();
