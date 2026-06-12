/* royharmon.com — shared interactions */
(function () {
    "use strict";

    /* scroll progress bar */
    var bar = document.createElement("div");
    bar.className = "progress-bar";
    document.body.appendChild(bar);

    var nav = document.querySelector(".nav");
    function onScroll() {
        var doc = document.documentElement;
        var max = doc.scrollHeight - doc.clientHeight;
        bar.style.width = max > 0 ? (doc.scrollTop / max) * 100 + "%" : "0";
        if (nav) nav.classList.toggle("scrolled", doc.scrollTop > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* mobile menu */
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".nav-menu");
    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            var open = menu.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        menu.addEventListener("click", function (e) {
            if (e.target.tagName === "A") {
                menu.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* mark current page in nav */
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
        if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
    });

    /* scroll-reveal with stagger */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
        var groups = new Map();
        revealEls.forEach(function (el) {
            var parent = el.parentElement;
            if (!groups.has(parent)) groups.set(parent, 0);
            el.style.setProperty("--d", groups.get(parent) * 0.1 + "s");
            groups.set(parent, groups.get(parent) + 1);
        });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("visible"); });
    }

    /* animated counters: <strong data-count="7" data-prefix="" data-suffix=""> */
    var counters = document.querySelectorAll("[data-count]");
    if ("IntersectionObserver" in window && counters.length) {
        var cio = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                cio.unobserve(entry.target);
                var el = entry.target;
                var target = parseFloat(el.getAttribute("data-count"));
                var prefix = el.getAttribute("data-prefix") || "";
                var suffix = el.getAttribute("data-suffix") || "";
                var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
                var start = null, dur = 1400;
                function tick(ts) {
                    if (!start) start = ts;
                    var p = Math.min((ts - start) / dur, 1);
                    var eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { cio.observe(el); });
    }
})();
