var w = Object.defineProperty;
var k = (r, t, e) => t in r ? w(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var l = (r, t, e) => (k(r, typeof t != "symbol" ? t + "" : t, e), e);
var h = (r, t, e) => new Promise((i, n) => {
  var a = (s) => {
    try {
      d(e.next(s));
    } catch (o) {
      n(o);
    }
  }, c = (s) => {
    try {
      d(e.throw(s));
    } catch (o) {
      n(o);
    }
  }, d = (s) => s.done ? i(s.value) : Promise.resolve(s.value).then(a, c);
  d((e = e.apply(r, t)).next());
});
var p = /* @__PURE__ */ ((r) => (r.de = "de", r.fr = "fr", r.en = "en", r.it = "it", r.nl = "nl", r))(p || {});
class m {
  constructor(t, e, i) {
    l(this, "projectSlug");
    l(this, "entity", "person");
    l(this, "apiUrl", "https://api.metagrid.ch");
    this.projectSlug = t, this.entity = e, typeof i != "undefined" && (this.apiUrl = i);
  }
  fetch(t, e = "de", i = !1) {
    return h(this, null, function* () {
      const n = [];
      n.push(`include=${String(i)}`), n.push(`language=${e}`);
      try {
        const a = yield fetch(`${this.apiUrl}/widget/${this.projectSlug}/${this.entity}/${t}.json?${n.join("&")}`);
        return a.ok ? this.buildResponse(a, this.transform(yield a.json())) : this.buildResponse(a);
      } catch (a) {
        return this.buildResponse({
          statusCode: 0,
          found: !1,
          error: "unknown network error"
        });
      }
    });
  }
  buildResponse(t, e = []) {
    return "ok" in t ? {
      status: {
        statusCode: t.status,
        found: t.status === 200,
        error: t.statusText
      },
      data: e
    } : {
      status: t,
      data: []
    };
  }
  transform(t) {
    return Object.keys(t[0]).map((e) => {
      const i = t[0][e];
      return typeof i == "string" ? {
        provider: e,
        url: i
      } : {
        provider: e,
        url: i.url,
        shortDescription: i.short_description,
        longDescription: i.long_description
      };
    });
  }
  static create(t, e = "person") {
    return new m(t, e);
  }
}
function g(r, t, e, i = "de", n = !1) {
  return h(this, null, function* () {
    const c = yield m.create(t).fetch(e, i, n);
    if (c.status.found) {
      const d = document.createElement("ul");
      d.classList.add("metagrid-list"), c.data.forEach((s) => {
        const o = s, f = document.createElement("li");
        f.classList.add("metagrid-item");
        const u = document.createElement("a");
        u.classList.add("metagrid-link"), u.href = o.url, u.innerText = o.provider, u.target = "_blank", typeof o.longDescription != "undefined" && (u.title = o.longDescription), f.append(u), d.append(f);
      }), r.append(d), r.append(S(i));
    } else
      console.info(`Metagrid didn't find a concordance. Statuscode: ${c.status.statusCode}, error: ${c.status.error}`);
  });
}
function S(r) {
  const t = document.createElement("div");
  t.classList.add("metagrid-credit");
  let e = "the networking initiative of the SAHS";
  switch (r) {
    case p.de:
      e = "die Vernetzungsinitiative der SAGW";
      break;
    case p.fr:
      e = "l\u2019initiative de mise en r\xE9seau de l\u2019ASSH";
      break;
    case p.it:
      e = "l\u2019iniziativa di messa in rete dell\u2019ASSU";
      break;
  }
  return t.innerHTML = `Links powered by <a href="https://www.metagrid.ch" target="_blank">Metagrid</a> \u2013 ${e}`, t;
}
export {
  S as credit,
  g as widget
};
//# sourceMappingURL=metagrid-widget.es.js.map
