/* ============================================================
   Penzion Kotva Beroun — data + i18n
   exposes window.PKB
   ============================================================ */
(function () {
  "use strict";

  // ---- apartments ----
  var apartments = [
    {
      id: "a", letter: "A", year: 2020, floor: "1. patro",
      beds: 4, guests: 4, extra: 1, size: 34, price: 2200,
      type: "family",
      img: ["img/a/01.webp","img/a/02.webp","img/a/03.webp","img/a/04.webp","img/a/05.webp","img/a/06.webp"],
      name: { cz: "Apartmán A", en: "Apartment A" },
      tagline: {
        cz: "Ideální pro rodiny s dětmi · velký, vzdušný obytný prostor",
        en: "Perfect for families · spacious, airy living area"
      },
      short: {
        cz: "Komfortní čtyřlůžkový apartmán v prvním patře s odděleným pokojem se dvěma lůžky — ideální pro rodiny s dětmi.",
        en: "Comfortable four-bed apartment on the first floor with a separate two-bed room — ideal for families with children."
      },
      desc: {
        cz: "Rodinný čtyřlůžkový apartmán s možností přistýlky pro pátého hosta a dětské postýlky se nachází v prvním patře domu v srdci Berouna. V obývací místnosti jsou dvě lůžka, další dvě v odděleném pokoji. Součástí je moderní, plně vybavená kuchyňka a koupelna se sprchovým koutem.",
        en: "A family four-bed apartment with an option of a fifth bed and a baby cot, located on the first floor in the heart of Beroun. Two beds in the living room, two more in a separate bedroom. Includes a modern fully-equipped kitchenette and a bathroom with a shower."
      }
    },
    {
      id: "b", letter: "B", year: 2020, floor: "1. patro",
      beds: 2, guests: 2, extra: 0, size: 22, price: 1400,
      type: "couple",
      img: ["img/b/01.webp","img/b/02.webp","img/b/03.webp","img/b/04.webp","img/b/05.webp","img/b/06.webp"],
      name: { cz: "Apartmán B", en: "Apartment B" },
      tagline: {
        cz: "Pro zamilované dvojice · absolutní soukromí",
        en: "For couples · complete privacy"
      },
      short: {
        cz: "Útulný dvoulůžkový apartmán v prvním patře s plně vybavenou kuchyňkou — jako stvořený pro páry.",
        en: "Cosy two-bed apartment on the first floor with a fully-equipped kitchenette — made for couples."
      },
      desc: {
        cz: "Ryze dvoulůžkový apartmán s absolutním soukromím v prvním patře domu v srdci Berouna. Standardně plně vybaven — Smart TV, plně vybavená kuchyň, pohovka a posezení. Součástí je koupelna se sprchovým koutem a sociálním zařízením.",
        en: "A genuine two-bed apartment with complete privacy on the first floor in the heart of Beroun. Fully equipped as standard — Smart TV, full kitchen, sofa and seating. Includes a bathroom with shower and toilet."
      }
    },
    {
      id: "d", letter: "D", year: 2023, floor: "Podkroví",
      beds: 4, guests: 4, extra: 1, size: 38, price: 2200,
      type: "family",
      img: ["img/d/01.webp","img/d/02.webp","img/d/03.webp","img/d/04.webp","img/d/05.webp","img/d/06.webp"],
      name: { cz: "Apartmán D", en: "Apartment D" },
      tagline: {
        cz: "Ideální pro rodiny · podkrovní apartmán s charakterem",
        en: "Ideal for families · characterful attic apartment"
      },
      short: {
        cz: "Prostorný čtyřlůžkový podkrovní apartmán z roku 2023 s odděleným pokojem a cihlovým komínem — plný atmosféry.",
        en: "Spacious four-bed attic apartment from 2023 with a separate bedroom and exposed brick — full of character."
      },
      desc: {
        cz: "Nový rodinný čtyřlůžkový apartmán s možností přistýlky pro pátého hosta a dětské postýlky. Rozprostírá se v podkrovních prostorách v srdci Berouna, čtyři lůžka jsou odděleně v samostatném pokoji. Moderní, plně vybavená kuchyňka, koupelna se sprchovým koutem a Smart televize.",
        en: "A new family four-bed apartment with an option of a fifth bed and a baby cot. Set in the attic in the heart of Beroun, four beds are split into a separate room. Modern fully-equipped kitchenette, bathroom with shower and a Smart TV."
      }
    },
    {
      id: "e", letter: "E", year: 2023, floor: "Podkroví",
      beds: 2, guests: 2, extra: 0, size: 24, price: 1400,
      type: "couple",
      img: ["img/e/01.webp","img/e/02.webp","img/e/03.webp","img/e/04.webp","img/e/05.webp","img/e/06.webp"],
      name: { cz: "Apartmán E", en: "Apartment E" },
      tagline: {
        cz: "Pro zamilované dvojice · vzdušné podkroví",
        en: "For couples · airy attic retreat"
      },
      short: {
        cz: "Nový dvoulůžkový podkrovní apartmán z roku 2023 s absolutním soukromím a vzdušným obytným prostorem.",
        en: "New two-bed attic apartment from 2023 with complete privacy and an airy living space."
      },
      desc: {
        cz: "Nový, ryze dvoulůžkový apartmán s absolutním soukromím v podkrovní části domu v srdci Berouna. Standardně plně vybaven — Smart TV, plně vybavená kuchyň, pohovka. Koupelna se sprchovým koutem a sociálním zařízením.",
        en: "A new, genuine two-bed apartment with complete privacy in the attic in the heart of Beroun. Fully equipped as standard — Smart TV, full kitchen, sofa. Bathroom with shower and toilet."
      }
    }
  ];

  // ---- amenities (per apartment) ----
  var amenities = [
    { ic: "wifi",    cz: "WiFi zdarma",            en: "Free WiFi" },
    { ic: "tv",      cz: "Smart TV",               en: "Smart TV" },
    { ic: "kitchen", cz: "Vybavená kuchyňka",      en: "Equipped kitchenette" },
    { ic: "bath",    cz: "Vlastní koupelna",       en: "Private bathroom" },
    { ic: "coffee",  cz: "Rychlovarná konvice",    en: "Kettle & coffee" },
    { ic: "snow",    cz: "Lednice",                en: "Fridge" },
    { ic: "nosmoke", cz: "Nekuřácký",              en: "Non-smoking" },
    { ic: "parking", cz: "Parkování v okolí",      en: "Parking nearby" }
  ];

  // ---- shared house perks ----
  var perks = [
    { ic: "wine",  cz: "Vinotéka",   en: "Wine cellar",  d: { cz:"Naplněná vinotéka kvalitními víny v obývacím pokoji.", en:"A wine cellar stocked with quality wines in the lounge." } },
    { ic: "sauna", cz: "Infrasauna", en: "Infrared sauna", d: { cz:"Příjemné odreagování v moderně zařízené infrasauně.", en:"Unwind in a modern infrared sauna." } },
    { ic: "brick", cz: "Historické posezení", en: "Historic lounge", d: { cz:"Posezení s přáteli v původních klenutých sklepních prostorách.", en:"Gather with friends in the original vaulted cellar." } },
    { ic: "pin",   cz: "Centrum Berouna", en: "Beroun centre", d: { cz:"Historické centrum, Plzeňská brána i obchody pár kroků od dveří.", en:"Historic centre, the Pilsen Gate and shops a few steps away." } }
  ];

  // ---- reviews ----
  var reviews = [
    { name: "Petra Bělohradská", date: "05.09.2021", rating: 5,
      cz: "Hodnotím penzion na výbornou. Majitelé mi ve všem vyšli vstříc, komunikace na úrovni. Krásné a čisté vybavení apartmánu. Cítila jsem se moc příjemně. Určitě doporučuji.",
      en: "I rate the guesthouse as excellent. The owners accommodated everything, communication was first-rate. Beautiful, clean apartment. I felt very comfortable. Highly recommend." },
    { name: "Martina", date: "12.09.2021", rating: 5,
      cz: "Chtěla bych pochválit skvělý servis o klienta. Nic nám nechybělo.",
      en: "I'd like to praise the great service. We didn't lack anything." },
    { name: "Naďa", date: "03.10.2023", rating: 5,
      cz: "Byli jsme již podruhé a vše úplně v pořádku. Pán je strašně milý a ochotný.",
      en: "It was our second stay and everything was perfect. The host is incredibly kind and helpful." },
    { name: "Kamila", date: "31.07.2022", rating: 5,
      cz: "Útulný penzion v centru Berouna, ochotný a milý majitel.",
      en: "A cosy guesthouse in the centre of Beroun, helpful and friendly owner." }
  ];

  // ---- nearby / location highlights ----
  var nearby = [
    { cz: "Plzeňská brána", en: "Pilsen Gate", dist: "150 m" },
    { cz: "Husovo náměstí", en: "Hus Square", dist: "300 m" },
    { cz: "Směnárna", en: "Currency exchange", dist: "300 m" },
    { cz: "Restaurace", en: "Restaurant", dist: "50 m" },
    { cz: "Aquapark", en: "Aquapark", dist: "1.2 km" },
    { cz: "Obchodní centrum", en: "Shopping centre", dist: "1.8 km" }
  ];

  // ---- contact ----
  var contact = {
    name: "Penzion Kotva Beroun",
    street: "Palackého 27",
    city: "266 01 Beroun",
    phone: "+420 730 546 500",
    phoneHref: "+420730546500",
    email: "kotvaberoun@seznam.cz",
    gps: "49°57′42.8″N 14°4′20.2″E",
    checkin: "14:00 – 17:00",
    checkout: "do 10:00",
    cityTax: 30 // Kč / osoba / noc
  };

  // ---- deterministic availability ----
  // returns true if apartment `aptId` is BOOKED on a given Date
  function isBooked(aptId, date) {
    var letters = { a: 7, b: 13, d: 23, e: 31 };
    var seed = letters[aptId] || 5;
    var t = Math.floor(date.getTime() / 86400000); // day index
    var v = (t * seed + seed * 17 + date.getDate() * 3) % 100;
    var dow = date.getDay();
    // weekends a bit busier
    var threshold = (dow === 5 || dow === 6) ? 18 : 10;
    // create occasional multi-day blocks (3-day windows)
    var block = (Math.floor(t / 3) * (seed + 3)) % 100;
    return v < threshold || block < 6;
  }

  // is a whole range [in, out) free for apt?
  function rangeFree(aptId, inD, outD) {
    if (!inD || !outD) return true;
    var d = new Date(inD);
    while (d < outD) {
      if (isBooked(aptId, d)) return false;
      d.setDate(d.getDate() + 1);
    }
    return true;
  }

  // ---- i18n strings ----
  var T = {
    nav_home:    { cz: "Domů",       en: "Home" },
    nav_apts:    { cz: "Apartmány",  en: "Apartments" },
    nav_res:     { cz: "Rezervace",  en: "Booking" },
    nav_about:   { cz: "O nás",      en: "About" },
    book_now:    { cz: "Rezervovat", en: "Book now" },
    checkin:     { cz: "Příjezd",    en: "Check-in" },
    checkout:    { cz: "Odjezd",     en: "Check-out" },
    guests:      { cz: "Hosté",      en: "Guests" },
    guest_one:   { cz: "host",       en: "guest" },
    guest_few:   { cz: "hosté",      en: "guests" },
    guest_many:  { cz: "hostů",      en: "guests" },
    pick_date:   { cz: "Vyberte datum", en: "Select date" },
    check_avail: { cz: "Zkontrolovat dostupnost", en: "Check availability" },
    night:       { cz: "noc",        en: "night" },
    nights_few:  { cz: "noci",       en: "nights" },
    nights_many: { cz: "nocí",       en: "nights" },
    per_night:   { cz: "/ noc",      en: "/ night" },
    from:        { cz: "od",         en: "from" },
    enter:       { cz: "Zobrazit apartmán", en: "View apartment" },
    select:      { cz: "Vybrat",     en: "Select" },
    selected:    { cz: "Vybráno",    en: "Selected" },
    persons:     { cz: "osoby",      en: "people" },
    beds:        { cz: "lůžka",      en: "beds" },
    continue:    { cz: "Pokračovat", en: "Continue" },
    back:        { cz: "Zpět",       en: "Back" },
    pay:         { cz: "Zaplatit a rezervovat", en: "Pay & reserve" }
  };

  function plural(n, one, few, many) {
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return few;
    return many;
  }

  window.PKB = {
    apartments: apartments,
    apt: function (id) { return apartments.filter(function (a) { return a.id === id; })[0]; },
    amenities: amenities,
    perks: perks,
    reviews: reviews,
    nearby: nearby,
    contact: contact,
    isBooked: isBooked,
    rangeFree: rangeFree,
    T: T,
    plural: plural
  };
})();
