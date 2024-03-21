(function () {
  debugger
  /*! js-cookie v3.0.5 | MIT */
  !function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self, function () {
      var n = e.Cookies, o = e.Cookies = t();
      o.noConflict = function () {
        return e.Cookies = n, o
      }
    }())
  }(this, (function () {
    "use strict";

    function e(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var o in n) e[o] = n[o]
      }
      return e
    }

    var t = function t(n, o) {
      function r(t, r, i) {
        if ("undefined" != typeof document) {
          "number" == typeof (i = e({}, o, i)).expires && (i.expires = new Date(Date.now() + 864e5 * i.expires)), i.expires && (i.expires = i.expires.toUTCString()), t = encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
          var c = "";
          for (var u in i) i[u] && (c += "; " + u, !0 !== i[u] && (c += "=" + i[u].split(";")[0]));
          return document.cookie = t + "=" + n.write(r, t) + c
        }
      }

      return Object.create({
        set: r, get: function (e) {
          if ("undefined" != typeof document && (!arguments.length || e)) {
            for (var t = document.cookie ? document.cookie.split("; ") : [], o = {}, r = 0; r < t.length; r++) {
              var i = t[r].split("="), c = i.slice(1).join("=");
              try {
                var u = decodeURIComponent(i[0]);
                if (o[u] = n.read(c, u), e === u) break
              } catch (e) {
              }
            }
            return e ? o[e] : o
          }
        }, remove: function (t, n) {
          r(t, "", e({}, n, {expires: -1}))
        }, withAttributes: function (n) {
          return t(this.converter, e({}, this.attributes, n))
        }, withConverter: function (n) {
          return t(e({}, this.converter, n), this.attributes)
        }
      }, {attributes: {value: Object.freeze(o)}, converter: {value: Object.freeze(n)}})
    }({
      read: function (e) {
        return '"' === e[0] && (e = e.slice(1, -1)), e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
      }, write: function (e) {
        return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent)
      }
    }, {path: "/"});
    return t
  }));

  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (a) {
      return (a ^ Math.random() * 16 >> a / 4).toString(16)
    })
  }

  function normalizeDomain(domain) {
    return '.' + domain.replace(/^http(s)?:\/\//gi, '').replace(/\/$/, '').split('.').slice(-2).join('.')
  }

  browserId = localStorage.getItem('browserId') || Cookies.get('browserId') || uuidv4();
  sessionId = sessionStorage.getItem('browserId') || uuidv4();
  window.browserId = browserId;
  window.browserSessionId = sessionId;
  localStorage.setItem('browserId', browserId);
  sessionStorage.setItem('browserId', sessionId);
  Cookies.set('browserId', browserId, {
    expires: 365,
    debug: false,
    secure: true,
    sameSite: 'strict',
    domain: normalizeDomain(window.location.hostname)
  });
})();
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({'browser_id': browserId, 'session_id': sessionId});
