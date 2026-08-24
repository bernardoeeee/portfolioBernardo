/* ============================================================
   CARTA CELESTE SO-22 — chart behaviour
   1. sky: value-noise field -> nebulosity in two blues (canvas),
      a magnitude-sorted star field, marching-squares isophotes
      and a right-ascension grid (SVG)
   2. constellation: one unbroken line through the four systems
   3. edition: the whole chart is re-lettered as one event
   4. transmission: validation, then a ready-made WhatsApp message
   ============================================================ */

(function () {
    'use strict';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------
       1. TERRAIN
       --------------------------------------------------------- */

    var SEED = 20260824;
    var NX = 210;   // height-field columns
    var NY = 140;   // height-field rows

    // nebulosity ramp: two blues, faint to bright, nothing else
    var BANDS = [
        '#050B16', '#070F1E', '#0A1526', '#0D1B30',
        '#10223B', '#142946', '#183051', '#1D385C'
    ];

    // the four systems as catalogued stars, in fractional chart space
    var STARS = [
        [0.70, 0.24], [0.87, 0.45], [0.64, 0.64], [0.83, 0.81]
    ];

    function hash(ix, iy, s) {
        var n = Math.imul(ix | 0, 0x1f1f1f1f) ^ Math.imul(iy | 0, 0x2545f491) ^ Math.imul(s | 0, 0x27d4eb2d);
        n = Math.imul(n ^ (n >>> 15), 0x85ebca6b);
        n = Math.imul(n ^ (n >>> 13), 0xc2b2ae35);
        return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
    }

    function smooth(t) { return t * t * t * (t * (t * 6 - 15) + 10); }

    function noise(x, y, s) {
        var ix = Math.floor(x), iy = Math.floor(y);
        var fx = smooth(x - ix), fy = smooth(y - iy);
        var a = hash(ix, iy, s), b = hash(ix + 1, iy, s);
        var c = hash(ix, iy + 1, s), d = hash(ix + 1, iy + 1, s);
        return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
    }

    function fbm(x, y, s) {
        var v = 0, amp = 0.5, f = 1;
        for (var o = 0; o < 5; o++) {
            v += noise(x * f, y * f, s + o * 977) * amp;
            amp *= 0.5;
            f *= 2.05;
        }
        return v;
    }

    // height field, values roughly 0..1, land rising toward the north-east
    var field = new Float32Array(NX * NY);

    function buildField() {
        var min = Infinity, max = -Infinity, i = 0;
        for (var y = 0; y < NY; y++) {
            for (var x = 0; x < NX; x++, i++) {
                var u = x / (NX - 1), v = y / (NY - 1);
                var h = fbm(u * 3.1, v * 2.4, SEED) * 0.78
                    + u * 0.42
                    + (1 - v) * 0.2
                    + fbm(u * 8.5, v * 7.0, SEED + 13) * 0.1;
                field[i] = h;
                if (h < min) min = h;
                if (h > max) max = h;
            }
        }
        var span = (max - min) || 1;
        for (i = 0; i < field.length; i++) field[i] = (field[i] - min) / span;
    }

    function sample(u, v) {
        var fx = u * (NX - 1), fy = v * (NY - 1);
        var x0 = Math.floor(fx), y0 = Math.floor(fy);
        var x1 = Math.min(x0 + 1, NX - 1), y1 = Math.min(y0 + 1, NY - 1);
        var tx = fx - x0, ty = fy - y0;
        var a = field[y0 * NX + x0], b = field[y0 * NX + x1];
        var c = field[y1 * NX + x0], d = field[y1 * NX + x1];
        return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
    }

    function paintRelief(canvas, w, h) {
        var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        var cw = canvas.width, ch = canvas.height;
        var img = ctx.createImageData(cw, ch);
        var data = img.data;

        var rgb = BANDS.map(function (hex) {
            return [
                parseInt(hex.slice(1, 3), 16),
                parseInt(hex.slice(3, 5), 16),
                parseInt(hex.slice(5, 7), 16)
            ];
        });
        var n = rgb.length;

        var p = 0;
        for (var y = 0; y < ch; y++) {
            var v = y / (ch - 1);
            for (var x = 0; x < cw; x++) {
                var band = Math.min(n - 1, Math.floor(sample(x / (cw - 1), v) * n));
                var c = rgb[band];
                data[p++] = c[0];
                data[p++] = c[1];
                data[p++] = c[2];
                data[p++] = 255;
            }
        }
        ctx.putImageData(img, 0, 0);
        paintStars(ctx, cw, ch);
    }

    /* the star field: magnitude drives radius and light, nothing twinkles */
    function paintStars(ctx, cw, ch) {
        var count = Math.round((cw * ch) / 5200);
        for (var i = 0; i < count; i++) {
            var x = hash(i, 11, SEED) * cw;
            var y = hash(i, 29, SEED + 5) * ch;
            var m = hash(i, 47, SEED + 9);          // 0 bright .. 1 faint
            var mag = Math.pow(m, 2.4);
            var r = 0.35 + (1 - mag) * 1.5;
            var a = 0.2 + (1 - mag) * 0.75;

            // the nebulosity thins toward the sheet edge, so does the field
            ctx.globalAlpha = a;
            ctx.fillStyle = '#F2F7FF';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 6.2832);
            ctx.fill();

            // the brightest few carry diffraction spikes, as on a plate
            if (mag < 0.02) {
                ctx.globalAlpha = a * 0.5;
                ctx.strokeStyle = '#F2F7FF';
                ctx.lineWidth = 0.7;
                ctx.beginPath();
                ctx.moveTo(x - r * 4, y);
                ctx.lineTo(x + r * 4, y);
                ctx.moveTo(x, y - r * 4);
                ctx.lineTo(x, y + r * 4);
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 1;
    }

    /* marching squares: one path per level, segments concatenated */
    function contourPath(level, w, h) {
        var gx = 168, gy = 112;                 // contour sampling grid
        var sx = w / (gx - 1), sy = h / (gy - 1);
        var d = [];

        function ip(a, b) { return (level - a) / (b - a || 1e-6); }

        for (var y = 0; y < gy - 1; y++) {
            for (var x = 0; x < gx - 1; x++) {
                var u0 = x / (gx - 1), u1 = (x + 1) / (gx - 1);
                var v0 = y / (gy - 1), v1 = (y + 1) / (gy - 1);
                var tl = sample(u0, v0), tr = sample(u1, v0);
                var bl = sample(u0, v1), br = sample(u1, v1);

                var idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
                if (idx === 0 || idx === 15) continue;

                var px = x * sx, py = y * sy;
                var top = [px + sx * ip(tl, tr), py];
                var right = [px + sx, py + sy * ip(tr, br)];
                var bottom = [px + sx * ip(bl, br), py + sy];
                var left = [px, py + sy * ip(tl, bl)];

                var pairs;
                switch (idx) {
                    case 1: case 14: pairs = [left, bottom]; break;
                    case 2: case 13: pairs = [bottom, right]; break;
                    case 3: case 12: pairs = [left, right]; break;
                    case 4: case 11: pairs = [top, right]; break;
                    case 6: case 9: pairs = [top, bottom]; break;
                    case 7: case 8: pairs = [left, top]; break;
                    case 5: pairs = [left, top, bottom, right]; break;
                    case 10: pairs = [left, bottom, top, right]; break;
                    default: continue;
                }
                for (var k = 0; k < pairs.length; k += 2) {
                    d.push('M' + pairs[k][0].toFixed(1) + ' ' + pairs[k][1].toFixed(1) +
                        'L' + pairs[k + 1][0].toFixed(1) + ' ' + pairs[k + 1][1].toFixed(1));
                }
            }
        }
        return d.join('');
    }

    /* steepest-descent flow line: the sheet's one watercourse */
    function flowPath(startU, startV, w, h) {
        var u = startU, v = startV, pts = [];
        for (var i = 0; i < 520; i++) {
            pts.push([u * w, v * h]);
            var e = 0.006;
            var du = sample(Math.min(u + e, 1), v) - sample(Math.max(u - e, 0), v);
            var dv = sample(u, Math.min(v + e, 1)) - sample(u, Math.max(v - e, 0));
            var len = Math.sqrt(du * du + dv * dv);
            if (len < 1e-5) break;
            u -= (du / len) * 0.0055;
            v -= (dv / len) * 0.0055;
            // meander, so it reads as water rather than a gradient arrow
            var m = (noise(i * 0.11, 3.7, SEED + 71) - 0.5) * 0.006;
            u += -dv / len * m;
            v += du / len * m;
            if (u < 0.01 || u > 0.99 || v < 0.01 || v > 0.99) break;
        }
        if (pts.length < 40) return '';
        var run = 0;
        for (var j = 1; j < pts.length; j++) {
            run += Math.abs(pts[j][0] - pts[j - 1][0]) + Math.abs(pts[j][1] - pts[j - 1][1]);
        }
        if (run < w * 0.35) return '';   // a stalled trace is an artefact, not a river
        return 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L');
    }

    function svgEl(name, attrs) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', name);
        for (var k in attrs) el.setAttribute(k, attrs[k]);
        return el;
    }

    function drawSheet() {
        var canvas = document.getElementById('relief');
        var svg = document.getElementById('contours');
        var sheet = document.querySelector('.sheet');
        if (!canvas || !svg || !sheet) return;

        var box = sheet.getBoundingClientRect();
        var w = Math.max(320, Math.ceil(box.width));
        var h = Math.max(360, Math.ceil(box.height));

        paintRelief(canvas, w, h);

        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        var levels = [];
        for (var lv = 0.07; lv < 0.97; lv += 0.045) levels.push(Math.round(lv * 1000) / 1000);
        var paths = [];

        levels.forEach(function (lv, i) {
            var d = contourPath(lv, w, h);
            if (!d) return;
            var cls = 'contours-path' + (i % 4 === 0 ? ' contours-path--index' : '');
            var p = svgEl('path', { d: d, class: cls });
            svg.appendChild(p);
            paths.push(p);
        });

        // right-ascension / declination grid: the chart's own graticule
        var grid = [];
        for (var gi = 1; gi < 6; gi++) {
            var gxp = (w * gi / 6).toFixed(1);
            grid.push('M' + gxp + ' 0L' + gxp + ' ' + h.toFixed(1));
        }
        for (var gj = 1; gj < 4; gj++) {
            var gyp = (h * gj / 4).toFixed(1);
            grid.push('M0 ' + gyp + 'L' + w.toFixed(1) + ' ' + gyp);
        }
        svg.insertBefore(svgEl('path', { d: grid.join(''), class: 'graticule' }), svg.firstChild);

        var cp = svgEl('path', { d: '', class: 'contours-path contours-path--water', id: 'constellation' });
        svg.appendChild(cp);
        paths.push(cp);

        drawConstellation();
        if (!reduced) plot(paths);
    }

    /* one unbroken line through the four star glyphs, as measured on screen */
    function drawConstellation() {
        var cp = document.getElementById('constellation');
        var sheet = document.querySelector('.sheet');
        if (!cp || !sheet) return;

        // on phones the systems are an index list, not a plotted sky
        if (window.matchMedia('(max-width: 860px)').matches) {
            cp.setAttribute('d', '');
            return;
        }

        var base = sheet.getBoundingClientRect();
        var pts = [];
        document.querySelectorAll('#spots .spot__mark').forEach(function (m) {
            var r = m.getBoundingClientRect();
            pts.push(((r.left + r.right) / 2 - base.left).toFixed(1) + ' ' +
                ((r.top + r.bottom) / 2 - base.top).toFixed(1));
        });
        cp.setAttribute('d', pts.length > 1 ? 'M' + pts.join('L') : '');
    }

    /* the sheet plots itself: contours drawn in, index lines last */
    function plot(paths) {
        paths.forEach(function (p, i) {
            var len;
            try { len = p.getTotalLength(); } catch (e) { return; }
            if (!len || len > 200000) return;
            p.style.strokeDasharray = len;
            p.style.strokeDashoffset = len;
            p.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.25,.8,.25,1) ' + (i * 55 + 120) + 'ms';
            requestAnimationFrame(function () {
                requestAnimationFrame(function () { p.style.strokeDashoffset = '0'; });
            });
        });
    }

    /* cross-section profile in the perfil band */
    function drawProfile() {
        var path = document.getElementById('profilePath');
        var fill = document.getElementById('profileFill');
        if (!path) return;
        var W = 600, H = 88, pts = [];
        for (var i = 0; i <= 160; i++) {
            var u = i / 160;
            var y = H - 4 - sample(u, 0.46) * (H - 20);
            pts.push(u * W + ' ' + y.toFixed(1));
        }
        var line = 'M' + pts.join('L');
        path.setAttribute('d', line);
        if (fill) fill.setAttribute('d', line + 'L' + W + ' ' + H + 'L0 ' + H + 'Z');
    }

    /* ---------------------------------------------------------
       2. EDITION — one event re-letters the whole sheet
       --------------------------------------------------------- */


    var EN = {
        skip: 'Skip to the catalogued systems',
        collarSheet: 'Chart',
        collarGrid: 'Right ascension',
        collarEdition: 'Edition',
        sheetOverline: 'Chart of work · 2024 — 2026',
        sheetLede: 'I am 18 and I have built four systems, all open source. This is the survey of them.',
        sheetCta: 'See the four systems',
        sheetCta2: 'Talk to me',
        credA: 'Programming diploma · Senac RS',
        credB: 'Intern · BEG Support',
        credC: 'Portão, Rio Grande do Sul',
        perfilTag: 'Light curve',
        perfilTitle: 'The observer',
        portraitCap: 'Observer · Portão, RS',
        perfilP1: 'I am a Systems Developer in training, currently working as an intern at BEG Support, where I work with Oracle APEX, PL/SQL and JavaScript to develop web solutions for clients across different industries.',
        perfilP2: 'I completed a Technical Diploma in Programming at Senac RS, with a focus on front-end development (HTML, CSS and JavaScript) and relational database modelling. Throughout my training I built hands-on projects, including this personal portfolio, which features multi-language support and WhatsApp integration. I have also taken part in hackathons, experiences that strengthened my teamwork, my problem-solving and my ability to deliver under pressure.',
        stackCap: 'Main technologies and tools',
        recA: 'Education',
        recB: 'Internship',
        recC: 'Systems built',
        recD: 'Repositories',
        recDv: 'Public',
        sitiosTag: 'Four catalogued systems',
        sitiosTitle: 'The systems',
        s1Title: 'Hackathon + Health',
        s1Line: 'Tracking surgical instruments lost between the operating room and sterilisation.',
        s1Body: 'A CRUD application built to help hospitals locate the tools used in surgeries and cleaning processes. The platform allows instruments to be registered, searched, updated and removed, giving more control and safety during medical procedures.',
        markCap: 'System mark',
        sectionA: 'Synthetic curve',
        sectionB: 'Schematic amplitude',
        stA: 'WhatsApp',
        stB: 'Base',
        stBv: 'Portão · Rio Grande do Sul',
        stC: 'Languages',
        stCv: 'Portuguese · English',
        s2Title: 'SmartFlow',
        s2Line: 'A whole school — teachers, students, attendance and performance — in one system.',
        s2Body: 'A platform built to streamline class administration in a school, bringing teacher management, student management, attendance records and academic performance together in a single system. Every user has segmented, secure access, seeing only the data and features that match their profile and permission level.',
        s3Title: 'FoodMind',
        s3Line: 'Nutrition tracking on its own server, with real-time communication.',
        s3Body: 'A web application written in JavaScript on a client-server architecture, aimed at nutritional monitoring, dietary habit control and the management of personal reminders and events, plus messaging features and profile customisation.',
        s4Title: 'DevFeira',
        s4Line: 'A trading fair: people asking for and offering help with programming, design and projects.',
        s4Body: 'The project was a platform where users can offer and request help with programming, design and projects. We built a home page, registration and login pages, and three dedicated areas: developers, designers and projects. Inside them, users post questions or tips with images attached.',
        repo: 'Repository',
        contatoTag: 'Transmission',
        contatoTitle: 'Transmit a message',
        contatoLede: 'Write below. The message opens ready to send in my WhatsApp, without passing through any server.',
        fieldName: 'Name',
        fieldMsg: 'Message',
        errName: 'Please fill in your name.',
        errMsg: 'Please write your message.',
        submit: 'Transmit via WhatsApp',
        formNote: 'Or find me on GitHub, LinkedIn and Instagram, in the chart margin.',
        keyTag: 'Key',
        key1: 'Catalogued system',
        key2: 'Constellation line',
        key3: 'System plate',
        linksTag: 'Contact',
        colophonTag: 'Chart credits',
        colophon: 'Chart drawn and written by Bernardo Varisco Fleck. Sky generated in the browser. Schematic, synthetic chart, of no astronomical value.'
    };

    var META = {
        pt: {
            lang: 'pt-BR',
            title: 'Bernardo Varisco Fleck — Carta Celeste',
            desc: 'Carta celeste dos trabalhos de Bernardo Varisco Fleck: quatro sistemas construídos, repositórios públicos, técnico em programação no Senac RS.'
        },
        en: {
            lang: 'en',
            title: 'Bernardo Varisco Fleck — Star Chart',
            desc: 'A star chart of Bernardo Varisco Fleck’s work: four systems built, public repositories, programming technician at Senac RS.'
        }
    };

    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
    var PT = {};
    nodes.forEach(function (el) {
        var k = el.getAttribute('data-i18n');
        if (!(k in PT)) PT[k] = el.innerHTML;
    });

    var lang = 'pt';
    try {
        var saved = localStorage.getItem('folha-edicao');
        if (saved === 'en' || saved === 'pt') lang = saved;
    } catch (e) { /* storage blocked */ }

    function setEdition(next, persist) {
        lang = next;
        var dict = next === 'en' ? EN : PT;
        nodes.forEach(function (el) {
            var k = el.getAttribute('data-i18n');
            if (dict[k] != null) el.innerHTML = dict[k];
        });


        var meta = META[next];
        document.documentElement.lang = meta.lang;
        document.title = meta.title;
        var md = document.querySelector('meta[name="description"]');
        if (md) md.setAttribute('content', meta.desc);

        document.querySelectorAll('.edition__btn').forEach(function (b) {
            b.setAttribute('aria-pressed', String(b.dataset.lang === next));
        });

        if (persist) {
            try { localStorage.setItem('folha-edicao', next); } catch (e) { /* ignore */ }
        }
    }

    document.querySelectorAll('.edition__btn').forEach(function (b) {
        b.addEventListener('click', function () { setEdition(b.dataset.lang, true); });
    });

    /* ---------------------------------------------------------
       3. TRAVERSE — one unbroken line, live position
       --------------------------------------------------------- */

    var HOME_REF = 'AR 04h 12m · DEC −29° 41′';
    var readout = document.getElementById('gridRef');
    var sites = Array.prototype.slice.call(document.querySelectorAll('.site'));
    var sitesWrap = document.querySelector('.sites');
    var mark = document.getElementById('traverseMark');
    var perfil = document.getElementById('perfil');
    var ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            ticking = false;

            if (sitesWrap && mark) {
                var r = sitesWrap.getBoundingClientRect();
                var mid = window.innerHeight * 0.5;
                var t = Math.max(0, Math.min(1, (mid - r.top) / (r.height || 1)));
                mark.style.setProperty('--travel', (t * r.height).toFixed(1) + 'px');
            }

            if (!readout) return;
            var ref = HOME_REF;
            if (perfil) {
                var pr = perfil.getBoundingClientRect();
                if (pr.top < window.innerHeight * 0.5 && pr.bottom > window.innerHeight * 0.4) {
                    ref = 'AR 03h 05m · OBSERVADOR';
                }
            }
            for (var i = 0; i < sites.length; i++) {
                var sr = sites[i].getBoundingClientRect();
                if (sr.top < window.innerHeight * 0.5 && sr.bottom > window.innerHeight * 0.4) {
                    var label = sites[i].querySelector('.site__ref');
                    if (label) ref = label.textContent.trim();
                    break;
                }
            }
            if (readout.textContent !== ref) readout.textContent = ref;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* reveals: sites, plates, and the perfil band */
    if ('IntersectionObserver' in window && !reduced) {
        var targets = document.querySelectorAll('.site__body, .site .plate, .perfil__grid > *, .contato__head, .form');
        targets.forEach(function (el) { el.classList.add('js-reveal'); });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.classList.add('is-in');
                    io.unobserve(en.target);
                }
            });
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
        targets.forEach(function (el) { io.observe(el); });
    }

    /* ---------------------------------------------------------
       4. FIELD BULLETIN
       --------------------------------------------------------- */

    var form = document.getElementById('form');
    if (form) {
        var nome = document.getElementById('nome');
        var msg = document.getElementById('mensagem');

        function mark_(input, errId, bad) {
            var err = document.getElementById(errId);
            input.setAttribute('aria-invalid', bad ? 'true' : 'false');
            if (err) err.hidden = !bad;
            return !bad;
        }

        [nome, msg].forEach(function (input) {
            input.addEventListener('input', function () {
                if (input.getAttribute('aria-invalid') === 'true' && input.value.trim()) {
                    mark_(input, input === nome ? 'nomeErr' : 'msgErr', false);
                }
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var okName = mark_(nome, 'nomeErr', !nome.value.trim());
            var okMsg = mark_(msg, 'msgErr', !msg.value.trim());
            if (!okName) { nome.focus(); return; }
            if (!okMsg) { msg.focus(); return; }

            var greeting = lang === 'en'
                ? 'Hello! My name is ' + nome.value.trim() + '. ' + msg.value.trim()
                : 'Olá! Me chamo ' + nome.value.trim() + '. ' + msg.value.trim();
            window.open('https://wa.me/5551997076102?text=' + encodeURIComponent(greeting), '_blank', 'noopener');
        });
    }

    /* ---------------------------------------------------------
       BOOT
       --------------------------------------------------------- */

    buildField();
    drawSheet();
    drawProfile();
    if (lang === 'en') setEdition('en', false);
    onScroll();

    var lastW = window.innerWidth;
    var rt;
    window.addEventListener('resize', function () {
        if (Math.abs(window.innerWidth - lastW) < 60) return;
        lastW = window.innerWidth;
        clearTimeout(rt);
        rt = setTimeout(function () {
            reduced = true;      // no re-plot animation on resize
            drawSheet();
            onScroll();
        }, 180);
    });
}());
