var x = Object.defineProperty;
var T = (t, e, n) => e in t ? x(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var h = (t, e, n) => (T(t, typeof e != "symbol" ? e + "" : e, n), n);
var m = (t, e, n) => new Promise((i, r) => {
  var o = (s) => {
    try {
      d(n.next(s));
    } catch (l) {
      r(l);
    }
  }, c = (s) => {
    try {
      d(n.throw(s));
    } catch (l) {
      r(l);
    }
  }, d = (s) => s.done ? i(s.value) : Promise.resolve(s.value).then(o, c);
  d((n = n.apply(t, e)).next());
});
var j = /* @__PURE__ */ ((t) => (t.person = "person", t))(j || {}), a = /* @__PURE__ */ ((t) => (t.de = "de", t.fr = "fr", t.en = "en", t.it = "it", t.nl = "nl", t))(a || {});
class b {
  constructor(e, n, i) {
    h(this, "projectSlug");
    h(this, "entity", "person");
    h(this, "apiUrl", "https://api.metagrid.ch");
    this.projectSlug = e, this.entity = n, typeof i != "undefined" && (this.apiUrl = i);
  }
  fetch(e, n = "de", i = !1) {
    return m(this, null, function* () {
      const r = [];
      r.push(`include=${String(i)}`), r.push(`language=${n}`);
      try {
        const o = yield fetch(`${this.apiUrl}/widget/${this.projectSlug}/${this.entity}/${e}.json?${r.join("&")}`);
        return o.ok ? this.buildResponse(o, this.transform(yield o.json())) : this.buildResponse(o);
      } catch (o) {
        return this.buildResponse({
          statusCode: 0,
          found: !1,
          error: "unknown network error"
        });
      }
    });
  }
  buildResponse(e, n = []) {
    return "ok" in e ? {
      status: {
        statusCode: e.status,
        found: e.status === 200,
        error: e.statusText
      },
      data: n
    } : {
      status: e,
      data: []
    };
  }
  transform(e) {
    return Object.keys(e[0]).map((n) => {
      const i = e[0][n];
      return typeof i == "string" ? {
        provider: n,
        url: i
      } : {
        provider: n,
        url: i.url,
        shortDescription: i.short_description,
        longDescription: i.long_description
      };
    });
  }
  static create(e, n = "person") {
    return new b(e, n);
  }
}
let E = 0;
const A = () => `metagrid-${++E}`, v = {
  de: "(\xF6ffnet in neuem Tab)",
  fr: "(s\u2019ouvre dans un nouvel onglet)",
  it: "(si apre in una nuova scheda)",
  nl: "(opent in nieuw tabblad)",
  en: "(opens in a new tab)"
};
function $(t, e) {
  const n = document.createElement("span");
  return n.id = A(), n.hidden = !0, n.textContent = t, typeof e != "undefined" && (n.lang = e), n;
}
function k(t) {
  const e = typeof t != "undefined" && t in v ? t : "en";
  return $(v[e], e);
}
function S(t, e) {
  t.target = "_blank", t.rel = "noopener", t.setAttribute("aria-describedby", e);
}
function L(t, e, n, i = "de", r = !1) {
  return m(this, null, function* () {
    const c = yield b.create(e).fetch(n, i, r);
    if (c.status.found) {
      const d = document.createElement("ul");
      d.classList.add("metagrid-list"), d.lang = i;
      const s = k(i);
      c.data.forEach((l) => {
        const p = l, f = document.createElement("li");
        f.classList.add("metagrid-item");
        const u = document.createElement("a");
        u.classList.add("metagrid-link"), u.href = p.url, u.innerText = p.provider;
        let w = s.id;
        if (typeof p.longDescription != "undefined") {
          u.title = p.longDescription;
          const y = $(p.longDescription);
          w = `${y.id} ${s.id}`, f.append(y);
        }
        S(u, w), f.append(u), d.append(f);
      }), t.append(d, s), t.append(C(i));
    } else
      console.info(`Metagrid didn't find a concordance. Statuscode: ${c.status.statusCode}, error: ${c.status.error}`);
  });
}
function C(t) {
  const e = document.createElement("div");
  e.classList.add("metagrid-credit"), e.lang = "en";
  let n = "the networking initiative of the SAHS";
  switch (t) {
    case a.de:
      n = "die Vernetzungsinitiative der SAGW";
      break;
    case a.fr:
      n = "l\u2019initiative de mise en r\xE9seau de l\u2019ASSH";
      break;
    case a.it:
      n = "l\u2019iniziativa di messa in rete dell\u2019ASSU";
      break;
  }
  const i = typeof t != "undefined" && [a.de, a.fr, a.it].includes(t) ? t : "en";
  e.innerHTML = `Links powered by <a href="https://www.metagrid.ch">Metagrid</a> \u2013 <span lang="${i}">${n}</span>`;
  const r = k(t);
  return S(e.querySelector("a"), r.id), e.append(r), e;
}
export {
  b as MetagridApi,
  j as MetagridEntities,
  a as MetagridLanguages,
  C as credit,
  L as widget
};
//# sourceMappingURL=index.es.js.map
