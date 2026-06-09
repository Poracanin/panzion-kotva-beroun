/* ============================================================
   Penzion Kotva — reservation core (window.RES)
   Calendar · date range · availability matrix · booking · payment
   ============================================================ */
(function () {
  "use strict";
  var h = React.createElement;
  var Icon = window.UI.Icon, tx = window.UI.tx, t = window.UI.t;
  var DT = window.DT, PKB = window.PKB;
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;

  function money(n) { return n.toLocaleString('cs-CZ').replace(/\u00A0/g, ' ') + ' Kč'; }
  function nightWord(n, lang) {
    if (lang === 'en') return n === 1 ? 'night' : 'nights';
    return PKB.plural(n, 'noc', 'noci', 'nocí');
  }
  function guestWord(n, lang) {
    if (lang === 'en') return n === 1 ? 'guest' : 'guests';
    return PKB.plural(n, 'host', 'hosté', 'hostů');
  }

  // ---------------- single month ----------------
  function Month(props) {
    var year = props.year, month = props.month, lang = props.lang;
    var range = props.range, hover = props.hover, onPick = props.onPick, onHover = props.onHover;
    var min = props.min || DT.today();
    var cells = DT.monthGrid(year, month);
    var dow = DT.DOW[lang];

    return h('div', { className: 'cal' },
      h('div', { className: 'cal-grid', style:{ marginBottom: 6 } },
        dow.map(function (d, i) { return h('div', { key: i, className: 'cal-dow' }, d); })
      ),
      h('div', { className: 'cal-grid' },
        cells.map(function (d, i) {
          if (!d) return h('div', { key: i, className: 'cal-day empty' });
          var past = d < min;
          var isIn = DT.sameDay(d, range.in);
          var isOut = DT.sameDay(d, range.out);
          var end = range.out || (range.in && !range.out ? hover : null);
          var inRange = range.in && end && d > range.in && d < end;
          var isToday = DT.sameDay(d, DT.today());
          var cls = 'cal-day';
          if (inRange) cls += ' in-range';
          if (isIn) cls += ' range-start';
          if (isOut || (range.in && !range.out && DT.sameDay(d, hover) && hover > range.in)) cls += ' range-end';
          if (isToday) cls += ' today';
          return h('button', {
            key: i, className: cls, disabled: past,
            onClick: function () { onPick(d); },
            onMouseEnter: function () { onHover && onHover(d); }
          }, d.getDate());
        })
      )
    );
  }

  // ---------------- calendar (1 or 2 months) ----------------
  function Calendar(props) {
    var lang = props.lang, range = props.range, onPick = props.onPick, months = props.months || 1;
    var hv = useState(null), hover = hv[0], setHover = hv[1];
    var base = props.month;
    var setBase = props.setMonth;
    var min = DT.today();
    var canPrev = (base.getFullYear() > min.getFullYear()) ||
                  (base.getFullYear() === min.getFullYear() && base.getMonth() > min.getMonth());
    function shift(n) {
      var d = new Date(base); d.setMonth(d.getMonth() + n); setBase(d);
    }
    var m2 = new Date(base); m2.setMonth(m2.getMonth() + 1);
    return h('div', { onMouseLeave: function () { setHover(null); } },
      h('div', { className: 'cal-head' },
        h('button', { className: 'cal-nav', disabled: !canPrev, onClick: function () { shift(-1); } }, h(Icon, { name: 'chevL', size: 18 })),
        h('div', { className: 'cal-title' },
          months === 2 ? (DT.monthLabel(base, lang) + (window.innerWidth > 720 ? '' : '')) : DT.monthLabel(base, lang)
        ),
        h('button', { className: 'cal-nav', onClick: function () { shift(1); } }, h(Icon, { name: 'chevR', size: 18 }))
      ),
      h('div', { style: { display: 'grid', gridTemplateColumns: (months === 2 && window.innerWidth > 720) ? '1fr 1fr' : '1fr', gap: 30 } },
        h(Month, { year: base.getFullYear(), month: base.getMonth(), lang: lang, range: range, hover: hover, onPick: onPick, onHover: setHover, min: min }),
        (months === 2 && window.innerWidth > 720) && h('div', null,
          h('div', { className: 'cal-title', style: { marginBottom: 16, textAlign: 'center' } }, DT.monthLabel(m2, lang)),
          h(Month, { year: m2.getFullYear(), month: m2.getMonth(), lang: lang, range: range, hover: hover, onPick: onPick, onHover: setHover, min: min })
        )
      )
    );
  }

  // range pick logic
  function pickInto(range, d, setRange) {
    if (!range.in || (range.in && range.out)) { setRange({ in: d, out: null }); return false; }
    if (d <= range.in) { setRange({ in: d, out: null }); return false; }
    setRange({ in: range.in, out: d }); return true; // complete
  }

  // ---------------- compact field popover (hero / search bar) ----------------
  function BookBar(props) {
    var lang = props.lang;
    var rg = useState(props.initRange || { in: null, out: null }); var range = rg[0], setRange = rg[1];
    var gs = useState(props.initGuests || 2); var guests = gs[0], setGuests = gs[1];
    var op = useState(null); var open = op[0], setOpen = op[1]; // 'date' | 'guests' | null
    var mo = useState(DT.today()); var month = mo[0], setMonth = mo[1];
    var ref = useRef(null);
    useEffect(function () {
      function out(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(null); }
      document.addEventListener('mousedown', out);
      return function () { document.removeEventListener('mousedown', out); };
    }, []);

    function pick(d) {
      var done = pickInto(range, d, setRange);
      if (done) setOpen(null);
    }
    function submit() {
      if (!range.in || !range.out) { setOpen('date'); return; }
      props.onSearch({ in: range.in, out: range.out, guests: guests });
    }

    return h('div', { className: 'bookbar' + (props.standalone ? ' standalone' : ''), ref: ref, style: { position: 'relative' } },
      h('div', { className: 'bf', onClick: function () { setOpen(open === 'date' ? null : 'date'); } },
        h('span', { className: 'bf-label' }, t('checkin', lang)),
        h('span', { className: 'bf-val' + (range.in ? '' : ' placeholder') },
          h(Icon, { name: 'calendar', size: 17 }),
          range.in ? DT.fmtShort(range.in, lang) : t('pick_date', lang))
      ),
      h('div', { className: 'bf', onClick: function () { setOpen('date'); } },
        h('span', { className: 'bf-label' }, t('checkout', lang)),
        h('span', { className: 'bf-val' + (range.out ? '' : ' placeholder') },
          h(Icon, { name: 'calendar', size: 17 }),
          range.out ? DT.fmtShort(range.out, lang) : t('pick_date', lang))
      ),
      h('div', { className: 'bf bf-guests' },
        h('span', { className: 'bf-label' }, t('guests', lang)),
        h('div', { className: 'bf-guests-row' },
          h('span', { className: 'bf-val' }, h(Icon, { name: 'users', size: 17 }), guests),
          h(Stepper, { value: guests, min: 1, max: 5, onChange: setGuests })
        )
      ),
      h('button', { className: 'btn btn-amber', onClick: submit }, h(Icon, { name: 'check', size: 18 }), t('check_avail', lang)),

      open === 'date' && h('div', { className: 'bookbar-pop' },
        h(Calendar, { lang: lang, range: range, onPick: pick, months: 2, month: month, setMonth: setMonth }))
    );
  }

  function Stepper(props) {
    return h('div', { className: 'stepper' },
      h('button', { disabled: props.value <= props.min, onClick: function () { props.onChange(props.value - 1); } }, h(Icon, { name: 'minus', size: 18 })),
      h('span', { className: 'v' }, props.value),
      h('button', { disabled: props.value >= props.max, onClick: function () { props.onChange(props.value + 1); } }, h(Icon, { name: 'plus', size: 18 }))
    );
  }

  // ---------------- availability matrix ----------------
  function AvailMatrix(props) {
    var lang = props.lang, range = props.range, startDate = props.start, onSelectApt = props.onSelectApt;
    var DAYS = props.days || 14;
    var days = [];
    for (var i = 0; i < DAYS; i++) days.push(DT.addDays(startDate, i));
    return h('div', { className: 'avail' },
      h('table', { className: 'avail-table' },
        h('thead', null, h('tr', null,
          h('th', { className: 'avail-rowhead' }, lang === 'cz' ? 'Apartmán' : 'Apartment'),
          days.map(function (d, i) {
            return h('th', { key: i, className: DT.isWeekend(d) ? 'we' : '' },
              h('div', { style: { fontWeight: 800 } }, d.getDate()),
              h('div', { style: { fontWeight: 600, fontSize: '.66rem', opacity: .7 } }, DT.DOW[lang][DT.colOf(d)]));
          })
        )),
        h('tbody', null,
          PKB.apartments.map(function (a) {
            return h('tr', { key: a.id },
              h('td', { className: 'avail-rowhead' },
                h('b', null, a.letter),
                h('span', null, a.beds + ' ' + t('beds', lang) + ' · ' + money(a.price) + t('per_night', lang))
              ),
              days.map(function (d, i) {
                var booked = PKB.isBooked(a.id, d);
                var sel = range.in && range.out && d >= DT.startOfDay(range.in) && d < DT.startOfDay(range.out) && !booked;
                var cls = 'avail-cell ' + (sel ? 'sel' : (booked ? 'busy' : 'free'));
                return h('td', { key: i }, h('div', { className: cls }, booked ? '×' : (sel ? '✓' : '')));
              })
            );
          })
        )
      ),
      h('div', { className: 'avail-legend' },
        h('span', null, h('i', { className: 'dot free' }), lang === 'cz' ? 'Volné' : 'Available'),
        h('span', null, h('i', { className: 'dot busy' }), lang === 'cz' ? 'Obsazené' : 'Booked'),
        h('span', null, h('i', { className: 'dot sel' }), lang === 'cz' ? 'Váš výběr' : 'Your dates')
      )
    );
  }

  // ---------------- price calc ----------------
  function calcPrice(apt, range, guests) {
    var n = DT.nights(range.in, range.out);
    var stay = apt.price * n;
    var tax = PKB.contact.cityTax * guests * n;
    return { nights: n, stay: stay, tax: tax, total: stay + tax };
  }

  // ---------------- summary sidebar ----------------
  function Summary(props) {
    var lang = props.lang, apt = props.apt, range = props.range, guests = props.guests;
    if (!apt || !range.in || !range.out) {
      return h('aside', { className: 'summary' }, h('div', { className: 'summary-empty' },
        h(Icon, { name: 'calendar', size: 34, sw: 1.4 }),
        h('p', { style: { margin: 0 } }, lang === 'cz' ? 'Vyberte termín a apartmán pro zobrazení shrnutí rezervace.' : 'Select dates and an apartment to see your booking summary.')
      ));
    }
    var p = calcPrice(apt, range, guests);
    return h('aside', { className: 'summary' },
      h('div', { className: 'summary-img' }, h('img', { src: apt.img[0], alt: tx(apt.name, lang) })),
      h('div', { className: 'summary-body' },
        h('h3', { className: 'h-md', style: { marginBottom: 4 } }, tx(apt.name, lang)),
        h('div', { className: 'muted', style: { fontSize: '.86rem', marginBottom: 14 } }, apt.floor + ' · ' + a_size(apt)),
        h('div', { className: 'summary-row' }, h('span', { className: 'lbl' }, h(Icon, { name: 'calendar' }), t('checkin', lang)), h('span', { className: 'val' }, DT.fmtLong(range.in, lang))),
        h('div', { className: 'summary-row' }, h('span', { className: 'lbl' }, h(Icon, { name: 'calendar' }), t('checkout', lang)), h('span', { className: 'val' }, DT.fmtLong(range.out, lang))),
        h('div', { className: 'summary-row' }, h('span', { className: 'lbl' }, h(Icon, { name: 'users' }), t('guests', lang)), h('span', { className: 'val' }, guests + ' ' + guestWord(guests, lang))),
        h('div', { className: 'summary-div' }),
        h('div', { className: 'summary-row' }, h('span', { className: 'lbl' }, money(apt.price) + ' × ' + p.nights + ' ' + nightWord(p.nights, lang)), h('span', { className: 'val' }, money(p.stay))),
        h('div', { className: 'summary-row' }, h('span', { className: 'lbl' }, (lang === 'cz' ? 'Městský poplatek' : 'City tax') + ' (' + guests + '×' + p.nights + ')'), h('span', { className: 'val' }, money(p.tax))),
        h('div', { className: 'summary-total' }, h('span', { className: 'lbl' }, lang === 'cz' ? 'Celkem' : 'Total'), h('span', { className: 'val' }, money(p.total)))
      )
    );
  }
  function a_size(apt) { return apt.size + ' m²'; }

  // ---------------- form helpers ----------------
  function Field(props) {
    return h('div', { className: 'field' },
      h('label', null, props.label, props.required && h('span', { className: 'req' }, ' *')),
      props.children,
      props.error && h('span', { className: 'field-err' }, props.error)
    );
  }
  function digits(s) { return (s || '').replace(/\D/g, ''); }

  // ---------------- the page ----------------
  function ReservationPage(props) {
    var lang = props.lang, go = props.go, prefill = props.prefill || {};
    var stp = useState(1); var step = stp[0], setStep = stp[1];
    var rg = useState({ in: prefill.in || null, out: prefill.out || null }); var range = rg[0], setRange = rg[1];
    var gs = useState(prefill.guests || 2); var guests = gs[0], setGuests = gs[1];
    var ap = useState(prefill.apt ? PKB.apt(prefill.apt) : null); var apt = ap[0], setApt = ap[1];
    var mo = useState(prefill.in ? DT.startOfDay(new Date(prefill.in.getFullYear(), prefill.in.getMonth(), 1)) : DT.today());
    var month = mo[0], setMonth = mo[1];
    var op = useState(false); var calOpen = op[0], setCalOpen = op[1];
    var form = useState({ first: '', last: '', email: '', phone: '', note: '' }); var f = form[0], setF = form[1];
    var card = useState({ num: '', name: '', exp: '', cvc: '' }); var cc = card[0], setCc = card[1];
    var er = useState({}); var errors = er[0], setErrors = er[1];
    var code = useState(''); var resCode = code[0], setResCode = code[1];
    var pay = useState(false); var paying = pay[0], setPaying = pay[1];

    useEffect(function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

    function pickDate(d) { var done = pickInto(range, d, setRange); if (done) setTimeout(function () { setCalOpen(false); }, 150); }

    var nightsN = DT.nights(range.in, range.out);
    var validRange = range.in && range.out && nightsN > 0;

    // offers available for the chosen range + guests
    var offers = PKB.apartments.map(function (a) {
      var free = validRange ? PKB.rangeFree(a.id, range.in, range.out) : true;
      var fits = guests <= (a.guests + a.extra);
      return { apt: a, free: free, fits: fits, ok: free && fits };
    });

    function selectApt(a) {
      setApt(a);
      if (validRange) { setStep(2); }
      else { setCalOpen(true); }
    }

    function validateDetails() {
      var e = {};
      if (!f.first.trim()) e.first = req(lang);
      if (!f.last.trim()) e.last = req(lang);
      if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = lang === 'cz' ? 'Neplatný e-mail' : 'Invalid e-mail';
      if (digits(f.phone).length < 9) e.phone = lang === 'cz' ? 'Neplatné číslo' : 'Invalid number';
      setErrors(e); return Object.keys(e).length === 0;
    }
    function validateCard() {
      var e = {};
      if (digits(cc.num).length < 16) e.num = lang === 'cz' ? 'Zadejte 16 číslic' : 'Enter 16 digits';
      if (!cc.name.trim()) e.cname = req(lang);
      if (!/^\d{2}\/\d{2}$/.test(cc.exp)) e.exp = 'MM/RR';
      if (digits(cc.cvc).length < 3) e.cvc = '3';
      setErrors(e); return Object.keys(e).length === 0;
    }
    function req(l) { return l === 'cz' ? 'Povinné pole' : 'Required'; }

    function doPay() {
      if (!validateCard()) return;
      setPaying(true);
      setTimeout(function () {
        var c = 'KB-' + (Math.floor(Math.random() * 9000) + 1000) + '-' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
        setResCode(c); setPaying(false); setStep(4);
      }, 1700);
    }

    var steps = [
      { n: 1, l: lang === 'cz' ? 'Termín a apartmán' : 'Dates & apartment' },
      { n: 2, l: lang === 'cz' ? 'Vaše údaje' : 'Your details' },
      { n: 3, l: lang === 'cz' ? 'Platba' : 'Payment' },
      { n: 4, l: lang === 'cz' ? 'Potvrzení' : 'Confirmation' }
    ];

    return h('div', null,
      // page header
      h('div', { className: 'pagehead' },
        h('div', { className: 'pagehead-bg' }, h('img', { src: 'img/exterior.webp', alt: '' })),
        h('div', { className: 'wrap pagehead-in' },
          h('div', { className: 'crumbs' },
            h('a', { href: '#', onClick: function (e) { e.preventDefault(); go('home'); } }, t('nav_home', lang)),
            h(Icon, { name: 'chevR', size: 13 }), h('span', { className: 'cur' }, t('nav_res', lang))),
          h('p', { className: 'eyebrow', style: { color: 'var(--amber)' } }, lang === 'cz' ? 'Online rezervace' : 'Online booking'),
          h('h1', { className: 'h-xl', style: { marginTop: 10 } }, lang === 'cz' ? 'Zarezervujte si pobyt' : 'Reserve your stay'),
          h('p', { className: 'lead', style: { color: 'rgba(255,255,255,.9)', maxWidth: '52ch', marginTop: 12 } },
            lang === 'cz' ? 'Vyberte termín, prohlédněte si obsazenost apartmánů a dokončete rezervaci během chvíle.' : 'Pick your dates, check apartment availability and complete your booking in minutes.')
        )
      ),

      h('div', { className: 'wrap section-sm' },
        // steps
        h('div', { className: 'steps' },
          steps.map(function (s, i) {
            var cls = 'step' + (step === s.n ? ' active' : '') + (step > s.n ? ' done' : '');
            return h(React.Fragment, { key: s.n },
              h('div', { className: cls },
                h('div', { className: 'step-n' }, step > s.n ? h(Icon, { name: 'check', size: 17 }) : s.n),
                h('div', { className: 'step-l' }, s.l)),
              i < steps.length - 1 && h('div', { className: 'step-bar' + (step > s.n ? ' done' : '') })
            );
          })
        ),

        // step content
        step === 1 && h(Step1, {
          lang: lang, range: range, guests: guests, setGuests: setGuests, month: month, setMonth: setMonth,
          calOpen: calOpen, setCalOpen: setCalOpen, pickDate: pickDate, offers: offers, validRange: validRange,
          nightsN: nightsN, selectApt: selectApt, apt: apt
        }),

        (step === 2 || step === 3) && h('div', { className: 'res-shell' },
          h('div', null,
            step === 2 && h(DetailsStep, { lang: lang, f: f, setF: setF, errors: errors, onBack: function () { setStep(1); }, onNext: function () { if (validateDetails()) setStep(3); } }),
            step === 3 && h(PaymentStep, { lang: lang, cc: cc, setCc: setCc, errors: errors, paying: paying, onBack: function () { setStep(2); }, onPay: doPay, apt: apt, range: range, guests: guests })
          ),
          h(Summary, { lang: lang, apt: apt, range: range, guests: guests })
        ),

        step === 4 && h(ConfirmStep, { lang: lang, code: resCode, apt: apt, range: range, guests: guests, f: f, go: go })
      )
    );
  }

  // ---- step 1 ----
  function Step1(props) {
    var lang = props.lang, range = props.range, offers = props.offers, validRange = props.validRange;
    var start = range.in ? DT.startOfDay(range.in) : DT.today();
    return h('div', null,
      // search controls
      h('div', { className: 'panel', style: { marginBottom: 28 } },
        h('div', { style: { position: 'relative' } },
          h('div', { className: 'bookbar standalone', style: { margin: 0, maxWidth: 'none' } },
            h('div', { className: 'bf', onClick: function () { props.setCalOpen(!props.calOpen); } },
              h('span', { className: 'bf-label' }, t('checkin', lang)),
              h('span', { className: 'bf-val' + (range.in ? '' : ' placeholder') }, h(Icon, { name: 'calendar', size: 17 }), range.in ? DT.fmtShort(range.in, lang) : t('pick_date', lang))),
            h('div', { className: 'bf', onClick: function () { props.setCalOpen(true); } },
              h('span', { className: 'bf-label' }, t('checkout', lang)),
              h('span', { className: 'bf-val' + (range.out ? '' : ' placeholder') }, h(Icon, { name: 'calendar', size: 17 }), range.out ? DT.fmtShort(range.out, lang) : t('pick_date', lang))),
            h('div', { className: 'bf' },
              h('span', { className: 'bf-label' }, t('guests', lang)),
              h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
                h('span', { className: 'bf-val' }, h(Icon, { name: 'users', size: 17 }), props.guests),
                h(Stepper, { value: props.guests, min: 1, max: 5, onChange: props.setGuests }))),
            h('button', { className: 'btn btn-amber', onClick: function () { props.setCalOpen(!props.calOpen); } }, h(Icon, { name: 'calendar', size: 18 }), props.calOpen ? (lang === 'cz' ? 'Zavřít' : 'Close') : (lang === 'cz' ? 'Kalendář' : 'Calendar'))
          ),
          props.calOpen && h('div', { style: { marginTop: 18, paddingTop: 22, borderTop: '1px solid var(--line)' } },
            h(Calendar, { lang: lang, range: range, onPick: props.pickDate, months: 2, month: props.month, setMonth: props.setMonth }),
            range.in && !range.out && h('p', { className: 'muted', style: { textAlign: 'center', marginTop: 14, marginBottom: 0, fontSize: '.9rem' } }, lang === 'cz' ? 'Vyberte datum odjezdu' : 'Now select your check-out date')
          )
        )
      ),

      // availability matrix
      h('div', { className: 'panel', style: { marginBottom: 28 } },
        h('h3', { className: 'h-md', style: { marginBottom: 4 } }, lang === 'cz' ? 'Přehled obsazenosti' : 'Availability overview'),
        h('p', { className: 'muted', style: { marginTop: 0, marginBottom: 20, fontSize: '.92rem' } },
          lang === 'cz' ? 'Následujících 14 dní' + (range.in ? ' od ' + DT.fmtLong(start, lang) : ' od dnes') : 'Next 14 days' + (range.in ? ' from ' + DT.fmtLong(start, lang) : ' from today')),
        h(AvailMatrix, { lang: lang, range: range, start: start, days: 14 })
      ),

      // offers
      h('h3', { className: 'h-md', style: { marginBottom: 16 } },
        validRange ? (lang === 'cz' ? 'Dostupné apartmány pro váš termín' : 'Available for your dates') : (lang === 'cz' ? 'Naše apartmány' : 'Our apartments')),
      validRange && h('p', { className: 'muted', style: { marginTop: '-8px', marginBottom: 18 } },
        DT.fmtLong(range.in, lang) + ' → ' + DT.fmtLong(range.out, lang) + ' · ' + props.nightsN + ' ' + nightWord(props.nightsN, lang) + ' · ' + props.guests + ' ' + guestWord(props.guests, lang)),
      h('div', { className: 'stack-sm', style: { display: 'flex', flexDirection: 'column', gap: 16 } },
        offers.map(function (o) {
          var p = validRange ? calcPrice(o.apt, range, props.guests) : null;
          return h('div', { key: o.apt.id, className: 'offer' + (validRange && !o.ok ? ' disabled' : '') },
            h('img', { src: o.apt.img[0], alt: '' }),
            h('div', { className: 'offer-info' },
              h('b', null, tx(o.apt.name, lang)),
              h('div', { className: 'aptcard-meta' },
                h('span', null, h(Icon, { name: 'users', size: 15 }), o.apt.guests + ' ' + (lang === 'cz' ? 'osoby' : 'guests')),
                h('span', null, h(Icon, { name: 'bed', size: 15 }), o.apt.beds + ' ' + t('beds', lang)),
                h('span', null, h(Icon, { name: 'ruler', size: 15 }), o.apt.size + ' m²'),
                h('span', null, h(Icon, { name: 'building', size: 15 }), o.apt.floor)
              ),
              validRange && !o.free && h('span', { className: 'chip', style: { background: 'var(--busy-soft)', color: '#b06257', borderColor: 'var(--busy)' } }, lang === 'cz' ? 'Obsazeno v tomto termínu' : 'Booked for these dates'),
              validRange && o.free && !o.fits && h('span', { className: 'chip', style: { background: 'var(--busy-soft)', color: '#b06257', borderColor: 'var(--busy)' } }, lang === 'cz' ? 'Kapacita ' + (o.apt.guests + o.apt.extra) + ' osob' : 'Capacity ' + (o.apt.guests + o.apt.extra)),
              validRange && o.ok && h('span', { className: 'chip chip-amber' }, h(Icon, { name: 'check', size: 14 }), lang === 'cz' ? 'Volné' : 'Available')
            ),
            h('div', { className: 'offer-price' },
              p ? h('div', { className: 'price' }, money(p.total), h('br'), h('small', null, p.nights + ' ' + nightWord(p.nights, lang)))
                : h('div', { className: 'price' }, t('from', lang) + ' ' + money(o.apt.price), h('small', null, t('per_night', lang))),
              h('button', {
                className: 'btn ' + (validRange ? (o.ok ? 'btn-primary' : 'btn-ghost') : 'btn-ghost'),
                style: { marginTop: 12 }, disabled: validRange && !o.ok,
                onClick: function () { props.selectApt(o.apt); }
              }, validRange ? t('select', lang) : t('check_avail', lang))
            )
          );
        })
      )
    );
  }

  // ---- step 2: details ----
  function DetailsStep(props) {
    var lang = props.lang, f = props.f, setF = props.setF, e = props.errors;
    function set(k) { return function (ev) { var v = ev.target.value; setF(function (s) { var n = Object.assign({}, s); n[k] = v; return n; }); }; }
    return h('div', { className: 'panel' },
      h('h3', { className: 'h-md', style: { marginBottom: 6 } }, lang === 'cz' ? 'Kontaktní údaje' : 'Contact details'),
      h('p', { className: 'muted', style: { marginTop: 0, marginBottom: 24 } }, lang === 'cz' ? 'Na tyto údaje zašleme potvrzení rezervace.' : 'We will send the booking confirmation to these details.'),
      h('div', { className: 'form-row' },
        h(Field, { label: lang === 'cz' ? 'Jméno' : 'First name', required: true, error: e.first },
          h('input', { className: 'input' + (e.first ? ' err' : ''), value: f.first, onChange: set('first'), placeholder: lang === 'cz' ? 'Jan' : 'John' })),
        h(Field, { label: lang === 'cz' ? 'Příjmení' : 'Last name', required: true, error: e.last },
          h('input', { className: 'input' + (e.last ? ' err' : ''), value: f.last, onChange: set('last'), placeholder: lang === 'cz' ? 'Novák' : 'Smith' }))
      ),
      h('div', { className: 'form-row' },
        h(Field, { label: 'E-mail', required: true, error: e.email },
          h('input', { className: 'input' + (e.email ? ' err' : ''), value: f.email, onChange: set('email'), type: 'email', placeholder: 'jan@email.cz' })),
        h(Field, { label: lang === 'cz' ? 'Telefon' : 'Phone', required: true, error: e.phone },
          h('input', { className: 'input' + (e.phone ? ' err' : ''), value: f.phone, onChange: set('phone'), placeholder: '+420 …' }))
      ),
      h(Field, { label: lang === 'cz' ? 'Poznámka (nepovinné)' : 'Note (optional)' },
        h('textarea', { className: 'input', rows: 3, value: f.note, onChange: set('note'), placeholder: lang === 'cz' ? 'Čas příjezdu, speciální přání…' : 'Arrival time, special requests…' })),
      h('div', { className: 'notice', style: { marginTop: 6 } }, h(Icon, { name: 'info', size: 18 }),
        h('span', null, lang === 'cz' ? 'Check-in 14:00–17:00 · Check-out do 10:00. Platba kartou online, storno dle obchodních podmínek.' : 'Check-in 14:00–17:00 · Check-out by 10:00. Card payment online, cancellation per terms.')),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 14, marginTop: 24 } },
        h('button', { className: 'btn btn-ghost', onClick: props.onBack }, h(Icon, { name: 'chevL', size: 18 }), t('back', lang)),
        h('button', { className: 'btn btn-primary', onClick: props.onNext }, t('continue', lang), h(Icon, { name: 'arrowR', size: 18 })))
    );
  }

  // ---- step 3: payment ----
  function PaymentStep(props) {
    var lang = props.lang, cc = props.cc, setCc = props.setCc, e = props.errors;
    function fmtNum(v) { return digits(v).slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); }
    function fmtExp(v) { var d = digits(v).slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; }
    function set(k, fn) { return function (ev) { var v = fn ? fn(ev.target.value) : ev.target.value; setCc(function (s) { var n = Object.assign({}, s); n[k] = v; return n; }); }; }
    return h('div', { className: 'panel' },
      h('h3', { className: 'h-md', style: { marginBottom: 6 } }, lang === 'cz' ? 'Platba kartou' : 'Card payment'),
      h('p', { className: 'muted', style: { marginTop: 0, marginBottom: 22 } },
        h(Icon, { name: 'lock', size: 14, style: { verticalAlign: '-2px', marginRight: 6 } }),
        lang === 'cz' ? 'Zabezpečená platba · toto je demo, žádná skutečná platba neproběhne.' : 'Secure payment · this is a demo, no real charge will be made.'),
      h('div', { style: { display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' } },
        h('div', { style: { flex: '1 1 280px' } },
          h(Field, { label: lang === 'cz' ? 'Číslo karty' : 'Card number', required: true, error: e.num },
            h('input', { className: 'input' + (e.num ? ' err' : ''), value: cc.num, onChange: set('num', fmtNum), placeholder: '4242 4242 4242 4242', inputMode: 'numeric' })),
          h(Field, { label: lang === 'cz' ? 'Jméno na kartě' : 'Name on card', required: true, error: e.cname },
            h('input', { className: 'input' + (e.cname ? ' err' : ''), value: cc.name, onChange: set('name'), placeholder: 'JAN NOVAK' })),
          h('div', { className: 'form-row' },
            h(Field, { label: lang === 'cz' ? 'Platnost' : 'Expiry', required: true, error: e.exp },
              h('input', { className: 'input' + (e.exp ? ' err' : ''), value: cc.exp, onChange: set('exp', fmtExp), placeholder: 'MM/RR', inputMode: 'numeric' })),
            h(Field, { label: 'CVC', required: true, error: e.cvc },
              h('input', { className: 'input' + (e.cvc ? ' err' : ''), value: cc.cvc, onChange: set('cvc', function (v) { return digits(v).slice(0, 4); }), placeholder: '123', inputMode: 'numeric' })))
        ),
        h('div', { style: { flex: '0 0 300px' } },
          h('div', { className: 'cardface' },
            h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
              h('div', { className: 'chip-emv' }),
              h('div', { style: { fontFamily: 'var(--serif)', fontSize: '1.1rem' } }, 'KOTVA')),
            h('div', { className: 'cnum' }, cc.num || '•••• •••• •••• ••••'),
            h('div', { className: 'crow' },
              h('div', null, h('small', null, lang === 'cz' ? 'Držitel' : 'Holder'), cc.name || (lang === 'cz' ? 'JMÉNO PŘÍJMENÍ' : 'CARD HOLDER')),
              h('div', null, h('small', null, lang === 'cz' ? 'Platnost' : 'Valid'), cc.exp || 'MM/RR'))
          ),
          h('div', { className: 'paylogos', style: { marginTop: 16, justifyContent: 'center' } },
            h('span', { className: 'pl' }, 'VISA'), h('span', { className: 'pl' }, 'Mastercard'), h('span', { className: 'pl' }, 'Apple Pay'))
        )
      ),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 14, marginTop: 24 } },
        h('button', { className: 'btn btn-ghost', onClick: props.onBack, disabled: props.paying }, h(Icon, { name: 'chevL', size: 18 }), t('back', lang)),
        h('button', { className: 'btn btn-amber btn-lg', onClick: props.onPay, disabled: props.paying },
          props.paying ? (lang === 'cz' ? 'Zpracování…' : 'Processing…') : h(React.Fragment, null, h(Icon, { name: 'lock', size: 18 }), t('pay', lang) + ' · ' + money(calcPrice(props.apt, props.range, props.guests).total))))
    );
  }

  // ---- step 4: confirmation ----
  function ConfirmStep(props) {
    var lang = props.lang, apt = props.apt, range = props.range, p = calcPrice(apt, range, props.guests);
    return h('div', { className: 'panel confirm', style: { padding: '48px 30px' } },
      h('div', { className: 'confirm-check' }, h(Icon, { name: 'check', size: 44, sw: 2.2 })),
      h('h2', { className: 'h-lg' }, lang === 'cz' ? 'Rezervace potvrzena!' : 'Booking confirmed!'),
      h('p', { className: 'lead', style: { marginTop: 10 } },
        lang === 'cz' ? 'Děkujeme, ' + props.f.first + '. Potvrzení jsme odeslali na ' + props.f.email + '.' : 'Thank you, ' + props.f.first + '. A confirmation has been sent to ' + props.f.email + '.'),
      h('div', { className: 'confirm-code' }, props.code),
      h('p', { className: 'muted', style: { fontSize: '.86rem', marginTop: 4 } }, lang === 'cz' ? 'Číslo rezervace' : 'Booking reference'),
      h('div', { style: { textAlign: 'left', maxWidth: 420, margin: '28px auto 0', background: 'var(--cream)', borderRadius: 12, padding: 22, border: '1px solid var(--line)' } },
        h('div', { className: 'summary-row' }, h('span', { className: 'lbl' }, lang === 'cz' ? 'Apartmán' : 'Apartment'), h('span', { className: 'val' }, tx(apt.name, lang))),
        h('div', { className: 'summary-row' }, h('span', { className: 'lbl' }, lang === 'cz' ? 'Příjezd' : 'Check-in'), h('span', { className: 'val' }, DT.fmtLong(range.in, lang) + ' · 14:00')),
        h('div', { className: 'summary-row' }, h('span', { className: 'lbl' }, lang === 'cz' ? 'Odjezd' : 'Check-out'), h('span', { className: 'val' }, DT.fmtLong(range.out, lang) + ' · 10:00')),
        h('div', { className: 'summary-row' }, h('span', { className: 'lbl' }, t('guests', lang)), h('span', { className: 'val' }, props.guests)),
        h('div', { className: 'summary-total' }, h('span', { className: 'lbl' }, lang === 'cz' ? 'Zaplaceno' : 'Paid'), h('span', { className: 'val' }, money(p.total)))
      ),
      h('div', { style: { display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' } },
        h('button', { className: 'btn btn-primary', onClick: function () { props.go('home'); } }, lang === 'cz' ? 'Zpět na úvod' : 'Back to home'),
        h('button', { className: 'btn btn-ghost', onClick: function () { props.go('apartments'); } }, t('nav_apts', lang)))
    );
  }

  window.RES = { Calendar: Calendar, BookBar: BookBar, ReservationPage: ReservationPage, Stepper: Stepper, money: money, calcPrice: calcPrice };
})();
