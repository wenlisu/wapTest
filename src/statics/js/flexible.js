! function(e, t) {
    function n() {
        var n = l.getBoundingClientRect().width;
        t || (t = 540), n > t && (n = t);
        var o = 100 * n / e;
        if (d = "html{font-size:" + o + "px !important}", i = document.getElementById("rootsize") || document.createElement("style"), document.getElementById("rootsize") || (document.getElementsByTagName("head")[0].appendChild(i), i.id = "rootsize"), i.styleSheet) i.styleSheet.disabled || (i.styleSheet.cssText = d);
        else try { i.innerHTML = d } catch (s) { i.innerText = d }
        l.style.fontSize = o + "px"
    }
    var o, i, d, s = document,
        a = window,
        l = s.documentElement;
    n(), a.addEventListener("resize", function() { clearTimeout(o), o = setTimeout(n, 300) }, !1), a.addEventListener("pageshow", function(e) { e.persisted && (clearTimeout(o), o = setTimeout(n, 300)) }, !1), "complete" === s.readyState ? s.body.style.fontSize = "16px" : s.addEventListener("DOMContentLoaded", function(e) { s.body.style.fontSize = "16px" }, !1)
}(780, 780);
