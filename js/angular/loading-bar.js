! function() {
    "use strict";
    angular.module("angular-loading-bar", ["cfp.loadingBarInterceptor"]), angular.module("chieffancypants.loadingBar", ["cfp.loadingBarInterceptor"]), angular.module("cfp.loadingBarInterceptor", ["cfp.loadingBar"]).config(["$httpProvider", function(e) {
        var a = ["$q", "$cacheFactory", "$timeout", "$rootScope", "cfpLoadingBar", function(a, c, n, i, t) {
            function r() {
                n.cancel(o), t.complete(), l = 0, d = 0
            }

            function s(a) {
                var n, i = c.get("$http"),
                    t = e.defaults;
                !a.cache && !t.cache || a.cache === !1 || "GET" !== a.method && "JSONP" !== a.method || (n = angular.isObject(a.cache) ? a.cache : angular.isObject(t.cache) ? t.cache : i);
                var r = void 0 !== n ? void 0 !== n.get(a.url) : !1;
                return void 0 !== a.cached && r !== a.cached ? a.cached : (a.cached = r, r)
            }
            var o, d = 0,
                l = 0,
                u = t.latencyThreshold;
            return {
                request: function(e) {
                    return e.ignoreLoadingBar || s(e) || (i.$broadcast("cfpLoadingBar:loading", {
                        url: e.url
                    }), 0 === d && (o = n(function() {
                        t.start()
                    }, u)), d++, t.set(l / d)), e
                },
                response: function(e) {
                    return e.config.ignoreLoadingBar || s(e.config) || (l++, i.$broadcast("cfpLoadingBar:loaded", {
                        url: e.config.url
                    }), l >= d ? r() : t.set(l / d)), e
                },
                responseError: function(e) {
                    return e.config.ignoreLoadingBar || s(e.config) || (l++, i.$broadcast("cfpLoadingBar:loaded", {
                        url: e.config.url
                    }), l >= d ? r() : t.set(l / d)), a.reject(e)
                }
            }
        }];
        e.interceptors.push(a)
    }]), angular.module("cfp.loadingBar", []).provider("cfpLoadingBar", function() {
        this.includeSpinner = !0, this.includeBar = !0, this.latencyThreshold = 100, this.startSize = .02, this.parentSelector = "body", this.spinnerTemplate = '<div class="preloader"><div class="ksprite"></div></div>', this.loadingBarTemplate = '<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>', this.$get = ["$injector", "$document", "$timeout", "$rootScope", function(e, a, c, n) {
            function i() {
                l || (l = e.get("$animate")), $("#viewPage").addClass("blur");
                var i = a.find(g).eq(0);
                c.cancel(h), b || (n.$broadcast("cfpLoadingBar:started"), b = !0, k && l.enter(v, i), B && l.enter(p, i), t(S))
            }

            function t(e) {
                if (b) {
                    var a = 100 * e + "%";
                    f.css("width", a), m = e, c.cancel(u), u = c(function() {
                        r()
                    }, 250)
                }
            }

            function r() {
                if (!(s() >= 1)) {
                    var e = 0,
                        a = s();
                    e = a >= 0 && .25 > a ? (3 * Math.random() + 3) / 100 : a >= .25 && .65 > a ? 3 * Math.random() / 100 : a >= .65 && .9 > a ? 2 * Math.random() / 100 : a >= .9 && .99 > a ? .005 : 0;
                    var c = s() + e;
                    t(c)
                }
            }

            function s() {
                return m
            }

            function o() {
                m = 0, b = !1
            }

            function d() {
                l || (l = e.get("$animate")), n.$broadcast("cfpLoadingBar:completed"), t(1), c.cancel(h), h = c(function() {
                    var e = l.leave(v, o);
                    e && e.then && e.then(o), $("#viewPage").removeClass("blur"), l.leave(p)
                }, 500)
            }
            var l, u, h, g = this.parentSelector,
                v = angular.element(this.loadingBarTemplate),
                f = v.find("div").eq(0),
                p = angular.element(this.spinnerTemplate),
                b = !1,
                m = 0,
                B = this.includeSpinner,
                k = this.includeBar,
                S = this.startSize;
            return {
                start: i,
                set: t,
                status: s,
                inc: r,
                complete: d,
                includeSpinner: this.includeSpinner,
                latencyThreshold: this.latencyThreshold,
                parentSelector: this.parentSelector,
                startSize: this.startSize
            }
        }]
    })
}();