/* ============================================================
   Penzion Kotva — date helpers (window.DT)
   ============================================================ */
(function () {
  "use strict";

  var MONTHS = {
    cz: ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"],
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"]
  };
  var MONTHS_GEN = { // czech genitive for "9. června"
    cz: ["ledna","února","března","dubna","května","června","července","srpna","září","října","listopadu","prosince"],
    en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  };
  var DOW = { // Monday-first
    cz: ["po","út","st","čt","pá","so","ne"],
    en: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
  };

  function startOfDay(d) { var x = new Date(d); x.setHours(0,0,0,0); return x; }
  function today() { return startOfDay(new Date()); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function sameDay(a, b) { return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
  function nights(a, b) { if (!a || !b) return 0; return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }
  function isWeekend(d) { var g = d.getDay(); return g === 0 || g === 6; }
  // Monday=0 column index
  function colOf(d) { return (d.getDay() + 6) % 7; }

  function monthLabel(d, lang) { return MONTHS[lang][d.getMonth()] + " " + d.getFullYear(); }

  function fmtShort(d, lang) {
    if (!d) return "";
    if (lang === "en") return DOW.en[colOf(d)] + " " + MONTHS_GEN.en[d.getMonth()] + " " + d.getDate();
    return DOW.cz[colOf(d)] + " " + d.getDate() + ". " + MONTHS_GEN.cz[d.getMonth()];
  }
  function fmtLong(d, lang) {
    if (!d) return "";
    if (lang === "en") return MONTHS_GEN.en[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    return d.getDate() + ". " + MONTHS_GEN.cz[d.getMonth()] + " " + d.getFullYear();
  }

  // build a matrix of weeks for a month (each cell Date or null)
  function monthGrid(year, month) {
    var first = new Date(year, month, 1);
    var startCol = colOf(first);
    var days = new Date(year, month + 1, 0).getDate();
    var cells = [];
    for (var i = 0; i < startCol; i++) cells.push(null);
    for (var d = 1; d <= days; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  window.DT = {
    MONTHS: MONTHS, DOW: DOW,
    startOfDay: startOfDay, today: today, addDays: addDays, sameDay: sameDay,
    nights: nights, isWeekend: isWeekend, colOf: colOf,
    monthLabel: monthLabel, fmtShort: fmtShort, fmtLong: fmtLong, monthGrid: monthGrid
  };
})();
