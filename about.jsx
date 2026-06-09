/* ============================================================
   Penzion Kotva — About page (window.PAGES.About)
   ============================================================ */
(function () {
  "use strict";
  var h = React.createElement;
  var Icon = window.UI.Icon, tx = window.UI.tx, t = window.UI.t, Gallery = window.UI.Gallery;
  var PKB = window.PKB, c = PKB.contact;

  function About(props) {
    var lang = props.lang, go = props.go;

    return h('div', null,
      h('div', { className: 'pagehead' },
        h('div', { className: 'pagehead-bg' }, h('img', { src: 'img/exterior.webp', alt: '' })),
        h('div', { className: 'wrap pagehead-in' },
          h('div', { className: 'crumbs' },
            h('a', { href: '#', onClick: function (e) { e.preventDefault(); go('home'); } }, t('nav_home', lang)),
            h(Icon, { name: 'chevR', size: 13 }), h('span', { className: 'cur' }, t('nav_about', lang))),
          h('p', { className: 'eyebrow', style: { color: 'var(--amber)' } }, lang === 'cz' ? 'Rodinné dědictví' : 'A family legacy'),
          h('h1', { className: 'h-xl', style: { marginTop: 10 } }, lang === 'cz' ? 'O penzionu Kotva' : 'About Penzion Kotva'))
      ),

      // story
      h('section', { className: 'section' },
        h('div', { className: 'wrap split' },
          h('div', { className: 'imgcard reveal' }, h('img', { src: 'img/about.webp', alt: '', style: { aspectRatio: '4/5' } })),
          h('div', { className: 'reveal' },
            h('p', { className: 'eyebrow' }, lang === 'cz' ? 'Kde nás najdete' : 'Where to find us'),
            h('h2', { className: 'h-lg', style: { marginTop: 16 } }, lang === 'cz' ? 'V historickém srdci Berouna' : 'In the historic heart of Beroun'),
            h('p', { className: 'lead', style: { marginTop: 18 } },
              lang === 'cz' ? 'Penzion Kotva naleznete v historickém centru města Beroun ve Středočeském kraji, v těsné blízkosti Plzeňské brány a mnoha turistických míst. Komfortní ubytování je připraveno pro hosty různého věku i zaměření.'
                : 'Penzion Kotva is located in the historic centre of Beroun in Central Bohemia, right next to the Pilsen Gate and many attractions. Comfortable accommodation awaits guests of all ages and interests.'),
            h('p', null, lang === 'cz'
              ? 'Součástí každého apartmánu je moderní, plně vybavená kuchyňka a koupelna se sprchovým koutem. V obývací místnosti najdete posezení a televizi se satelitním příjmem. K dispozici je také vinotéka a infrasauna.'
              : 'Each apartment includes a modern, fully-equipped kitchenette and a bathroom with a shower. The living room offers seating and a satellite TV. A wine cellar and an infrared sauna are also available.'),
            h('div', { className: 'grid g-3', style: { marginTop: 30, gap: 20 } },
              [['2020', lang === 'cz' ? 'Založeno' : 'Established'], ['4', lang === 'cz' ? 'Apartmány' : 'Apartments'], ['150 m', lang === 'cz' ? 'K Plzeňské bráně' : 'To Pilsen Gate']].map(function (s, i) {
                return h('div', { key: i }, h('div', { className: 'stat-n', style: { fontSize: '2.4rem' } }, s[0]), h('div', { className: 'stat-l' }, s[1]));
              }))
          )
        )
      ),

      // what you find
      h('section', { className: 'section bg-cream' },
        h('div', { className: 'wrap' },
          h('div', { className: 'center reveal', style: { maxWidth: 620, margin: '0 auto 44px' } },
            h('p', { className: 'eyebrow center' }, lang === 'cz' ? 'Co u nás najdete' : 'What you will find'),
            h('h2', { className: 'h-lg', style: { marginTop: 16 } }, lang === 'cz' ? 'Více než jen ubytování' : 'More than just a place to sleep')),
          h('div', { className: 'grid g-4' },
            PKB.perks.map(function (p, i) {
              return h('div', { key: i, className: 'feat reveal', style: { flexDirection: 'column' } },
                h('div', { className: 'feat-ic' }, h(Icon, { name: p.ic, size: 23 })),
                h('div', { style: { marginTop: 12 } }, h('h4', null, p[lang] || p.cz), h('p', null, tx(p.d, lang))));
            }))
        )
      ),

      // location / nearby
      h('section', { className: 'section' },
        h('div', { className: 'wrap split' },
          h('div', { className: 'reveal' },
            h('p', { className: 'eyebrow' }, lang === 'cz' ? 'Umístění a okolí' : 'Location & surroundings'),
            h('h2', { className: 'h-lg', style: { marginTop: 16 } }, lang === 'cz' ? 'Vše na dosah' : 'Everything within reach'),
            h('p', { className: 'lead', style: { marginTop: 16 } },
              lang === 'cz' ? 'Město Beroun leží na soutoku řek Berounky a Litavky, 30 km jihozápadně od Prahy na dálnici D5. Užijete si historické památky, aquapark i výlety do Českého krasu.'
                : 'Beroun lies at the confluence of the Berounka and Litavka rivers, 30 km southwest of Prague on the D5 motorway. Enjoy historic landmarks, an aquapark and trips into the Bohemian Karst.'),
            h('div', { style: { marginTop: 24 } },
              PKB.nearby.map(function (n, i) {
                return h('div', { key: i, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid var(--line)' } },
                  h('span', { style: { display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500 } }, h(Icon, { name: 'pin', size: 16, style: { color: 'var(--amber-d)' } }), n[lang] || n.cz),
                  h('b', { className: 'muted' }, n.dist));
              }))
          ),
          h('div', { className: 'reveal', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
            h('div', { className: 'imgcard', style: { gridColumn: 'span 2' } }, h('img', { src: 'img/beroun1.webp', alt: 'Beroun', style: { aspectRatio: '16/9' } })),
            h('div', { className: 'imgcard' }, h('img', { src: 'img/beroun2.webp', alt: '', style: { aspectRatio: '1/1' } })),
            h('div', { className: 'imgcard' }, h('img', { src: 'img/common.webp', alt: '', style: { aspectRatio: '1/1' } }))
          )
        )
      ),

      // reviews
      h('section', { className: 'section-sm bg-cream' },
        h('div', { className: 'wrap' },
          h('div', { className: 'center reveal', style: { marginBottom: 40 } },
            h('p', { className: 'eyebrow center' }, lang === 'cz' ? 'Recenze hostů' : 'Guest reviews'),
            h('h2', { className: 'h-lg', style: { marginTop: 14 } }, lang === 'cz' ? 'Hodnocení na výbornou' : 'Rated excellent')),
          h('div', { className: 'grid g-2' },
            PKB.reviews.map(function (r, i) {
              return h('div', { key: i, className: 'review reveal' },
                h('div', { className: 'stars' }, [0, 0, 0, 0, 0].map(function (_, k) { return h(Icon, { key: k, name: 'star', fill: 'currentColor', size: 17 }); })),
                h('blockquote', { style: { fontSize: '1.15rem' } }, '“' + (r[lang] || r.cz) + '”'),
                h('div', { className: 'review-by' }, h('div', { className: 'avatar' }, r.name.charAt(0)),
                  h('div', null, h('b', null, r.name), h('span', null, r.date))));
            }))
        )
      ),

      // contact
      h('section', { className: 'section' },
        h('div', { className: 'wrap' },
          h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 48, alignItems: 'center' } },
            h('div', { className: 'reveal' },
              h('p', { className: 'eyebrow' }, lang === 'cz' ? 'Jsme tu pro vás' : 'We are here for you'),
              h('h2', { className: 'h-lg', style: { marginTop: 16, marginBottom: 24 } }, lang === 'cz' ? 'Spojte se s námi' : 'Get in touch'),
              h('div', { className: 'foot-contact', style: { color: 'var(--ink-2)', fontSize: '1.05rem' } },
                cRow('pin', c.street + ', ' + c.city),
                cRow('phone', c.phone, 'tel:' + c.phoneHref),
                cRow('mail', c.email, 'mailto:' + c.email),
                cRow('clock', (lang === 'cz' ? 'Check-in ' : 'Check-in ') + c.checkin + ' · check-out ' + c.checkout),
                cRow('info', 'GPS ' + c.gps)),
              h('button', { className: 'btn btn-amber btn-lg', style: { marginTop: 28 }, onClick: function () { go('reservation'); } },
                h(Icon, { name: 'calendar', size: 18 }), t('book_now', lang))),
            h('div', { className: 'map-card reveal', style: { position: 'relative', minHeight: 360, background: 'var(--cream-2)' } },
              h('iframe', {
                className: 'map-embed', title: lang === 'cz' ? 'Mapa — Penzion Kotva Beroun' : 'Map — Penzion Kotva Beroun',
                src: 'https://maps.google.com/maps?q=' + encodeURIComponent(c.street + ', ' + c.city) + '&z=17&output=embed',
                loading: 'lazy', referrerPolicy: 'no-referrer-when-downgrade', allowFullScreen: true
              }),
              h('a', {
                href: 'https://maps.google.com/maps?q=' + encodeURIComponent(c.name + ', ' + c.street + ', ' + c.city),
                target: '_blank', rel: 'noopener',
                style: { position: 'absolute', bottom: 16, left: 16, right: 16, background: 'rgba(255,255,255,.96)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow)', color: 'var(--ink)' }
              },
                h('div', { className: 'feat-ic', style: { width: 40, height: 40 } }, h(Icon, { name: 'pin', size: 19 })),
                h('div', { style: { flex: 1 } }, h('b', null, c.name), h('div', { className: 'muted', style: { fontSize: '.86rem' } }, c.street + ', ' + c.city)),
                h(Icon, { name: 'arrowR', size: 18, style: { color: 'var(--amber-d)' } })))
          )
        )
      ),

      window.PAGES.CtaBand && h(window.PAGES.CtaBand, { lang: lang, go: go })
    );
  }

  function cRow(ic, txt, href) {
    return h('div', null, h(Icon, { name: ic, size: 18 }), href ? h('a', { href: href }, txt) : h('span', null, txt));
  }

  window.PAGES = window.PAGES || {};
  window.PAGES.About = About;
})();
