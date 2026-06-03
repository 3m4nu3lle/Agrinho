/**
 * TERRA VIVA — JAVASCRIPT EXTERNO AGRINHO 2026
 * Tecnicas: localStorage, preloader, header auto-hide, slider, 3D tilt,
 *           contadores animados, scroll reveal, traducao, caule, sementes,
 *           quiz, compromisso, ordenacao de referencias, smooth scroll.
 */

(function () {
    "use strict";

    // ---------- UTILIDADES ----------
    function safeGet(key, fallback) {
        try { var v = localStorage.getItem(key); return v == null ? fallback : v; }
        catch (e) { return fallback; }
    }
    function safeSet(key, value) {
        try { localStorage.setItem(key, value); } catch (e) {}
    }
    function debounce(fn, delay) {
        var timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        };
    }

    var body = document.body;
    var header = document.getElementById("header");
    var themeToggle = document.getElementById("themeToggle");
    var themeIcon = document.getElementById("themeIcon");
    var contrastToggle = document.getElementById("contrastToggle");
    var fontToggle = document.getElementById("fontToggle");
    var backToTop = document.getElementById("backToTop");
    var seedMenu = document.getElementById("seedMenu");
    var seedTrigger = document.getElementById("seedTrigger");
    var topographyCanvas = document.getElementById("topographyCanvas");
    var refSort = document.getElementById("refSort");
    var referencesList = document.getElementById("referencesList");

    var currentFontSize = 100;
    var isDark = false;
    var isHighContrast = false;
    var animFrameId = null;

    // ---------- PRELOADER ----------
    function initPreloader() {
        var preloader = document.getElementById("preloader");
        if (!preloader) return;
        function hide() {
            preloader.classList.add("fade-out");
            setTimeout(function () { preloader.style.display = "none"; }, 700);
        }
        if (document.readyState === "complete") {
            setTimeout(hide, 500);
        } else {
            window.addEventListener("load", function () { setTimeout(hide, 500); });
        }
    }

    // ---------- HEADER AUTO-HIDE ----------
    function initHeader() {
        if (!header) return;
        var lastScroll = 0;
        header.classList.add("visible");
        window.addEventListener("scroll", function () {
            var current = window.scrollY;
            if (current > 80) {
                if (current > lastScroll && header.classList.contains("visible")) {
                    header.classList.remove("visible");
                } else if (current < lastScroll && !header.classList.contains("visible")) {
                    header.classList.add("visible");
                }
            } else {
                header.classList.add("visible");
            }
            lastScroll = current;
        });

        // Link ativo conforme scroll
        var navLinks = document.querySelectorAll(".nav-link");
        window.addEventListener("scroll", debounce(function () {
            var pos = window.scrollY + 120;
            var current = "inicio";
            document.querySelectorAll("section[id]").forEach(function (sec) {
                if (sec.offsetTop <= pos) current = sec.id;
            });
            navLinks.forEach(function (link) {
                var active = link.getAttribute("href") === "#" + current;
                link.classList.toggle("active", active);
            });
        }, 60));
    }

    // ---------- SMOOTH SCROLL ----------
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener("click", function (e) {
                var href = this.getAttribute("href");
                if (href === "#") return;
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });
        var scrollCue = document.querySelector(".hero-scroll");
        if (scrollCue) {
            scrollCue.addEventListener("click", function () {
                var next = document.getElementById("introducao");
                if (next) next.scrollIntoView({ behavior: "smooth" });
            });
        }
    }

    // ---------- TEMA ----------
    function setTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark");
            if (themeToggle) { themeToggle.textContent = "☀️"; themeToggle.setAttribute("aria-pressed", "true"); }
        } else {
            body.classList.remove("dark");
            if (themeToggle) { themeToggle.textContent = "🌙"; themeToggle.setAttribute("aria-pressed", "false"); }
        }
        safeSet("terraTheme", theme);
    }
    function initTheme() {
        var saved = safeGet("terraTheme", "light");
        setTheme(saved === "dark" ? "dark" : "light");
        if (themeToggle) {
            themeToggle.addEventListener("click", function () {
                setTheme(body.classList.contains("dark") ? "light" : "dark");
            });
        }
    }

    // ---------- ALTO CONTRASTE ----------
    function setContrast(active) {
        if (active) {
            body.classList.add("high-contrast");
            if (contrastToggle) { contrastToggle.textContent = "◑"; contrastToggle.setAttribute("aria-pressed", "true"); }
        } else {
            body.classList.remove("high-contrast");
            if (contrastToggle) { contrastToggle.textContent = "◐"; contrastToggle.setAttribute("aria-pressed", "false"); }
        }
        safeSet("terraContrast", active ? "true" : "false");
    }
    function initContrast() {
        var saved = safeGet("terraContrast", "false");
        setContrast(saved === "true");
        if (contrastToggle) {
            contrastToggle.addEventListener("click", function () {
                setContrast(!body.classList.contains("high-contrast"));
            });
        }
    }

    // ---------- FONTE ----------
    function setFontSize(size) {
        document.documentElement.style.fontSize = size + "%";
        safeSet("terraFont", size);
    }
    function initFont() {
        if (!fontToggle) return;
        var fontSize = parseInt(safeGet("terraFont", "100"), 10);
        if (isNaN(fontSize)) fontSize = 100;
        setFontSize(fontSize);
        function updateLabel() {
            if (fontSize >= 130) fontToggle.textContent = "A+";
            else if (fontSize <= 80) fontToggle.textContent = "A-";
            else fontToggle.textContent = "A↺";
            fontToggle.setAttribute("aria-pressed", fontSize !== 100);
        }
        updateLabel();
        fontToggle.addEventListener("click", function () {
            if (fontSize >= 130) fontSize = 100;
            else if (fontSize === 100) fontSize = 115;
            else if (fontSize === 115) fontSize = 130;
            else fontSize = 100;
            setFontSize(fontSize);
            updateLabel();
        });
    }

    // ---------- CAULE DE NAVEGACAO ----------
    // ---------- MENU SEMENTE ----------
    function initSeedMenu() {
        if (!seedTrigger || !seedMenu) return;
        var seeds = seedMenu.querySelectorAll(".seed-item");
        var radius = 120;
        var total = seeds.length;
        seeds.forEach(function (seed, index) {
            var angle = Math.PI + (Math.PI / (total - 1)) * index;
            var tx = Math.round(Math.cos(angle) * radius);
            var ty = Math.round(Math.sin(angle) * radius);
            seed.style.setProperty("--tx", tx + "px");
            seed.style.setProperty("--ty", ty + "px");
        });
        seedTrigger.addEventListener("click", function () {
            var isOpen = seedMenu.classList.toggle("open");
            seedTrigger.setAttribute("aria-expanded", isOpen);
        });
        document.addEventListener("click", function (e) {
            if (!seedMenu.contains(e.target) && seedMenu.classList.contains("open")) {
                seedMenu.classList.remove("open");
                seedTrigger.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ---------- TOPOGRAFIA CANVAS ----------
    function initTopography() {
        if (!topographyCanvas) return;
        var ctx = topographyCanvas.getContext("2d");
        var w, h;
        function resize() {
            var parent = topographyCanvas.parentElement;
            w = parent.clientWidth; h = parent.clientHeight;
            topographyCanvas.width = w; topographyCanvas.height = h;
        }
        function draw() {
            ctx.clearRect(0, 0, w, h);
            var isDarkMode = body.classList.contains("dark") || body.classList.contains("high-contrast");
            var color = isDarkMode ? "212,168,116" : "196,92,38";
            var lines = window.innerWidth < 768 ? 4 : 8;
            var time = Date.now() * 0.00025;
            for (var i = 0; i < lines; i++) {
                var yBase = h * 0.2 + (h * 0.6 * (i / (lines - 1)));
                ctx.beginPath();
                ctx.strokeStyle = "rgba(" + color + ", " + (0.07 + i * 0.025) + ")";
                ctx.lineWidth = 1.2;
                for (var x = 0; x <= w; x += 5) {
                    var y = yBase + Math.sin(x * 0.007 + time + i) * 16 + Math.sin(x * 0.016 - time * 0.6 + i * 2) * 7;
                    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            animFrameId = requestAnimationFrame(draw);
        }
        resize(); draw();
        window.addEventListener("resize", debounce(resize, 200));
    }

    // ---------- SLIDER DE PILARES ----------
    function initSlider() {
        var track = document.getElementById("pilaresTrack");
        var slides = document.querySelectorAll(".slider-slide");
        var prevBtn = document.getElementById("prevPilar");
        var nextBtn = document.getElementById("nextPilar");
        var dotsContainer = document.getElementById("pilarDots");
        if (!track || slides.length === 0) return;
        var current = 0;
        var total = slides.length;

        function update() {
            track.style.transform = "translateX(-" + (current * 100) + "%)";
            dotsContainer.querySelectorAll(".dot").forEach(function (dot, i) {
                dot.classList.toggle("active", i === current);
            });
        }
        function buildDots() {
            dotsContainer.innerHTML = "";
            for (var i = 0; i < total; i++) {
                var dot = document.createElement("button");
                dot.className = "dot" + (i === 0 ? " active" : "");
                dot.setAttribute("aria-label", "Slide " + (i + 1));
                dot.addEventListener("click", function (idx) {
                    return function () { current = idx; update(); };
                }(i));
                dotsContainer.appendChild(dot);
            }
        }
        buildDots();
        if (prevBtn) prevBtn.addEventListener("click", function () { current = (current - 1 + total) % total; update(); });
        if (nextBtn) nextBtn.addEventListener("click", function () { current = (current + 1) % total; update(); });
        update();

        var auto = setInterval(function () { current = (current + 1) % total; update(); }, 6000);
        var sliderEl = document.getElementById("pilaresSlider");
        if (sliderEl) {
            sliderEl.addEventListener("mouseenter", function () { clearInterval(auto); });
            sliderEl.addEventListener("mouseleave", function () {
                auto = setInterval(function () { current = (current + 1) % total; update(); }, 6000);
            });
        }
    }

    // ---------- 3D TILT ----------
    function init3DTilt() {
        if (window.innerWidth < 768) return;
        var cards = document.querySelectorAll(".tilt-card");
        cards.forEach(function (card) {
            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var cx = rect.width / 2;
                var cy = rect.height / 2;
                var rx = (y - cy) / 18;
                var ry = (cx - x) / 18;
                card.style.transform = "perspective(1000px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-5px)";
            });
            card.addEventListener("mouseleave", function () { card.style.transform = ""; });
        });
    }

    // ---------- SCROLL REVEAL ----------
    function initReveal() {
        var els = document.querySelectorAll(".desert-card, .germ-card, .mycelium-card, .ref-item");
        if (!els.length || !("IntersectionObserver" in window)) return;
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        els.forEach(function (el) { obs.observe(el); });
    }

    // ---------- CONTADORES ANIMADOS ----------
    function initCounters() {
        var counters = document.querySelectorAll(".reservoir-number");
        if (!counters.length || !("IntersectionObserver" in window)) return;
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var container = el.closest(".reservoir");
                var target = parseInt(container.getAttribute("data-target"), 10);
                if (isNaN(target)) { obs.unobserve(el); return; }
                var fill = container.querySelector(".reservoir-fill");
                var maxH = 96;
                var finalH = Math.max(maxH * (target / 1000), 10);
                var finalY = 110 - finalH;
                if (fill) {
                    fill.style.transition = "y 2.2s cubic-bezier(0.25,0.46,0.45,0.94), height 2.2s cubic-bezier(0.25,0.46,0.45,0.94)";
                    fill.setAttribute("y", finalY);
                    fill.setAttribute("height", finalH);
                }
                var current = 0;
                var increment = target / 70;
                function tick() {
                    current += increment;
                    if (current < target) {
                        el.textContent = Math.floor(current);
                        requestAnimationFrame(tick);
                    } else {
                        el.textContent = target;
                    }
                }
                tick();
                obs.unobserve(el);
            });
        }, { threshold: 0.4 });
        counters.forEach(function (c) { obs.observe(c); });
    }

    // ---------- ABAS ACAO (ARIA) ----------
    function initAriaTabs(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;
        var tabButtons = container.querySelectorAll("[role='tab']");
        var tabPanels = container.querySelectorAll("[role='tabpanel']");
        tabButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var targetId = btn.getAttribute("aria-controls");
                tabButtons.forEach(function (b) {
                    b.classList.remove("active");
                    b.setAttribute("aria-selected", "false");
                    b.setAttribute("tabindex", "-1");
                });
                tabPanels.forEach(function (p) { p.classList.remove("active"); p.hidden = true; });
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");
                btn.setAttribute("tabindex", "0");
                var targetPanel = document.getElementById(targetId);
                if (targetPanel) { targetPanel.classList.add("active"); targetPanel.hidden = false; }
            });
            btn.addEventListener("keydown", function (e) {
                var idx = Array.prototype.indexOf.call(tabButtons, btn);
                var next = idx;
                var len = tabButtons.length;
                if (e.key === "ArrowRight") next = (idx + 1) % len;
                else if (e.key === "ArrowLeft") next = (idx - 1 + len) % len;
                else if (e.key === "Home") next = 0;
                else if (e.key === "End") next = len - 1;
                else return;
                e.preventDefault();
                tabButtons[next].focus();
                tabButtons[next].click();
            });
        });
    }

    // ---------- QUIZ ----------
    function initQuiz() {
        var form = document.getElementById("quizForm");
        var btn = document.getElementById("btnQuiz");
        var resultBox = document.getElementById("quizResult");
        if (form) form.addEventListener("submit", function (e) { e.preventDefault(); });
        if (!btn || !resultBox) return;
        btn.addEventListener("click", function () {
            var a1 = document.querySelector('input[name="q1"]:checked');
            var a2 = document.querySelector('input[name="q2"]:checked');
            var a3 = document.querySelector('input[name="q3"]:checked');
            var score = 0;
            var answers = [a1, a2, a3];
            var correct = ["c", "b", "b"];
            answers.forEach(function (ans, index) { if (ans && ans.value === correct[index]) score += 1; });
            var message = "";
            if (score === 3) message = "Parabens! Voce acertou todas as perguntas!";
            else if (score === 2) message = "Muito bom! Voce acertou 2 de 3.";
            else if (score === 1) message = "Voce acertou 1 de 3. Releia as secoes para aprender mais!";
            else message = "Nenhuma resposta correta. Que tal explorar o conteudo novamente?";
            resultBox.textContent = message;
            resultBox.classList.add("show");
        });
    }

    // ---------- ORDENACAO DE REFERENCIAS ----------
    function initRefSort() {
        if (!refSort || !referencesList) return;
        var items = Array.from(referencesList.querySelectorAll(".ref-item"));
        items.forEach(function (item, index) { item.setAttribute("data-index", index); });
        refSort.addEventListener("change", function () {
            var value = refSort.value;
            var all = Array.from(referencesList.querySelectorAll(".ref-item"));
            if (value === "year-asc") {
                all.sort(function (a, b) { return parseInt(a.getAttribute("data-year"), 10) - parseInt(b.getAttribute("data-year"), 10); });
            } else if (value === "year-desc") {
                all.sort(function (a, b) { return parseInt(b.getAttribute("data-year"), 10) - parseInt(a.getAttribute("data-year"), 10); });
            } else {
                all.sort(function (a, b) { return parseInt(a.getAttribute("data-index"), 10) - parseInt(b.getAttribute("data-index"), 10); });
            }
            all.forEach(function (item) { referencesList.appendChild(item); });
        });
    }

    // ---------- VOLTAR AO TOPO + HEADER SHADOW ----------
    function initBackToTop() {
        if (backToTop) {
            backToTop.addEventListener("click", function () {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
        function toggle() {
            if (window.scrollY > 500) { if (backToTop) backToTop.classList.add("visible"); }
            else { if (backToTop) backToTop.classList.remove("visible"); }
            if (header) {
                header.style.boxShadow = window.scrollY > 10 ? "0 4px 12px rgba(0,0,0,0.06)" : "none";
            }
        }
        window.addEventListener("scroll", debounce(toggle, 50));
        toggle();
    }

    // ---------- INICIALIZACAO ----------
    function init() {
        initPreloader();
        initHeader();
        initSmoothScroll();
        initTheme();
        initContrast();
        initFont();

        initSeedMenu();
        initTopography();
        initSlider();
        init3DTilt();
        initReveal();
        initCounters();
        initAriaTabs("acaoTabs");
        initQuiz();
        initRefSort();
        initBackToTop();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    console.log("Terra Viva — Agrinho 2026 inicializado com sucesso.");
})();
