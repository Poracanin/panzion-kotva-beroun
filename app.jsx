/* ============================================================
   Penzion Kotva — app shell + router (window.App)
   ============================================================ */
(function () {
  "use strict";
  var h = React.createElement;
  var UI = window.UI, PAGES = window.PAGES, RES = window.RES;
  var useState = React.useState, useEffect = React.useEffect;

  function App() {
    var ls = (function () { try { return localStorage.getItem('pkb_lang'); } catch (e) { return null; } })();
    var lg = useState(ls === 'en' ? 'en' : 'cz'); var lang = lg[0], setLangRaw = lg[1];
    var rt = useState({ name: 'home' }); var route = rt[0], setRoute = rt[1];
    var sc = useState(false); var scrolled = sc[0], setScrolled = sc[1];
    var mn = useState(false); var menuOpen = mn[0], setMenuOpen = mn[1];

    function setLang(l) { setLangRaw(l); try { localStorage.setItem('pkb_lang', l); } catch (e) {} document.documentElement.lang = l; }

    function go(name, arg) {
      var r = { name: name };
      if (name === 'apartment') r.id = arg;
      if (name === 'reservation') r.prefill = (arg && arg.res) ? arg.res : null;
      setRoute(r);
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    useEffect(function () {
      function onScroll() { setScrolled(window.scrollY > 24); }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return function () { window.removeEventListener('scroll', onScroll); };
    }, []);

    useEffect(function () { document.documentElement.lang = lang; }, [lang]);

    UI.useReveal();

    var darkHeader = (route.name === 'home' || route.name === 'apartments' || route.name === 'reservation' || route.name === 'about');
    var solid = scrolled || !darkHeader;
    var ontop = darkHeader && !scrolled;

    var page;
    if (route.name === 'home') page = h(PAGES.Home, { lang: lang, go: go });
    else if (route.name === 'apartments') page = h(PAGES.Apartments, { lang: lang, go: go });
    else if (route.name === 'apartment') page = h(PAGES.ApartmentDetail, { lang: lang, go: go, id: route.id });
    else if (route.name === 'reservation') page = h(RES.ReservationPage, { lang: lang, go: go, prefill: route.prefill });
    else if (route.name === 'about') page = h(PAGES.About, { lang: lang, go: go });
    else page = h(PAGES.Home, { lang: lang, go: go });

    return h(React.Fragment, null,
      h(UI.Nav, { lang: lang, setLang: setLang, go: go, route: route.name, solid: solid, ontop: ontop, onlight: !darkHeader, menuOpen: menuOpen, setMenuOpen: setMenuOpen }),
      h('main', { key: route.name + (route.id || '') }, page),
      h(UI.Footer, { lang: lang, go: go })
    );
  }

  var root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(h(App));
})();
