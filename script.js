(function () {
    'use strict';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------
       1. TERRAIN
       --------------------------------------------------------- */

    var SEED = 20260824;
    var NX = 210;   // height-field columns
    var NY = 140;   // height-field rows

    // nebulosity: one continuous ramp between two blues, never banded.
    // the ceiling sits close to the void on purpose — the sky is the ground
    // the catalogued work is plotted on, so it must never compete with it.
    var NEB_LOW = [6, 12, 24];      // #060C18, the sheet itself
    var NEB_HIGH = [16, 30, 54];    // #101E36, the brightest the sky ever gets

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
                // lower frequencies read as large calm forms rather than blotches,
                // and the sky leans away from the north-east, where the work is plotted
                var h = fbm(u * 2.35, v * 1.85, SEED) * 0.70
                    + (1 - v) * 0.24
                    + (1 - u) * 0.16
                    + fbm(u * 6.2, v * 5.2, SEED + 13) * 0.07;
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

        var dr = NEB_HIGH[0] - NEB_LOW[0];
        var dg = NEB_HIGH[1] - NEB_LOW[1];
        var db = NEB_HIGH[2] - NEB_LOW[2];

        var p = 0;
        for (var y = 0; y < ch; y++) {
            var v = y / (ch - 1);
            for (var x = 0; x < cw; x++) {
                // the gamma holds most of the sky at the void; only the top of
                // the range lifts off the sheet, so the ramp reads as depth
                var t = Math.pow(sample(x / (cw - 1), v), 1.75);
                data[p++] = NEB_LOW[0] + dr * t;
                data[p++] = NEB_LOW[1] + dg * t;
                data[p++] = NEB_LOW[2] + db * t;
                data[p++] = 255;
            }
        }
        ctx.putImageData(img, 0, 0);
        paintStars(ctx, cw, ch);
    }

    /* the star field: magnitude drives radius and light, nothing twinkles */
    function paintStars(ctx, cw, ch) {
        var count = Math.round((cw * ch) / 7400);
        for (var i = 0; i < count; i++) {
            var x = hash(i, 11, SEED) * cw;
            var y = hash(i, 29, SEED + 5) * ch;
            var m = hash(i, 47, SEED + 9);          // 0 bright .. 1 faint
            var mag = Math.pow(m, 2.4);
            var r = 0.3 + (1 - mag) * 1.15;
            var a = 0.14 + (1 - mag) * 0.52;

            // the nebulosity thins toward the sheet edge, so does the field
            ctx.globalAlpha = a;
            ctx.fillStyle = '#F2F7FF';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 6.2832);
            ctx.fill();

            // the brightest few carry diffraction spikes, as on a plate
            if (mag < 0.012) {
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

    function svgEl(name, attrs) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', name);
        for (var k in attrs) el.setAttribute(k, attrs[k]);
        return el;
    }

    function drawSheet() {
        var canvas = document.getElementById('relief');
        var svg = document.getElementById('plane');
        var sheet = document.querySelector('.sheet');
        if (!canvas || !svg || !sheet) return;

        var box = sheet.getBoundingClientRect();
        var w = Math.max(320, Math.ceil(box.width));
        var h = Math.max(360, Math.ceil(box.height));

        paintRelief(canvas, w, h);

        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        var ec = svgEl('path', { d: '', class: 'ecliptic', id: 'ecliptic' });
        svg.appendChild(ec);

        drawEcliptic();
        if (!reduced) plot(ec);
    }

    /* the ecliptic, fitted through the four bodies and run out to both edges.
       a Catmull-Rom spline, so the plane curves the way an orbit plane does
       rather than kinking from planet to planet. */
    function drawEcliptic() {
        var ec = document.getElementById('ecliptic');
        var sheet = document.querySelector('.sheet');
        if (!ec || !sheet) return;

        // on phones the bodies are an index list, so there is no plane to draw
        if (window.matchMedia('(max-width: 860px)').matches) {
            ec.setAttribute('d', '');
            return;
        }

        var base = sheet.getBoundingClientRect();
        var pts = [];
        document.querySelectorAll('#spots .spot__mark').forEach(function (m) {
            var r = m.getBoundingClientRect();
            pts.push([(r.left + r.right) / 2 - base.left, (r.top + r.bottom) / 2 - base.top]);
        });
        if (pts.length < 2) { ec.setAttribute('d', ''); return; }

        // run the plane past the outermost bodies to the edges of the sheet
        var first = pts[0], second = pts[1];
        var last = pts[pts.length - 1], penult = pts[pts.length - 2];
        var lead = extend(second, first, base.width, base.height);
        var tail = extend(penult, last, base.width, base.height);
        var all = [lead].concat(pts, [tail]);

        // Catmull-Rom through every point, emitted as cubic beziers
        var d = 'M' + all[0][0].toFixed(1) + ' ' + all[0][1].toFixed(1);
        for (var i = 0; i < all.length - 1; i++) {
            var p0 = all[i === 0 ? 0 : i - 1];
            var p1 = all[i], p2 = all[i + 1];
            var p3 = all[i + 2 < all.length ? i + 2 : all.length - 1];
            d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
                ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
                ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
        }
        ec.setAttribute('d', d);
    }

    /* carry the direction from -> to onward until it leaves the sheet */
    function extend(from, to, w, h) {
        var dx = to[0] - from[0], dy = to[1] - from[1];
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var reach = Math.max(w, h);
        return [to[0] + (dx / len) * reach, to[1] + (dy / len) * reach];
    }

    /* the one authored moment: the plane draws itself across the sky */
    function plot(path) {
        var len;
        try { len = path.getTotalLength(); } catch (e) { return; }
        if (!len || len > 200000) return;
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        path.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(.16,.84,.28,1) 220ms';
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { path.style.strokeDashoffset = '0'; });
        });
    }

    /* ---------------------------------------------------------
       2. EDITION — one event re-letters the whole sheet
       --------------------------------------------------------- */


    var EN = {
        skip: 'Skip to the catalogued systems',
        collarEdition: 'Edition',
        sheetLede: 'I am <span id="age"></span> and I have built a handful of systems, all open source.',
        pl1: 'Venus',
        pl2: 'Uranus',
        pl3: 'Jupiter',
        pl4: 'Saturn',
        sheetCta: 'See the systems',
        sheetCta2: 'Talk to me',
        credA: 'Programming diploma · Senac RS',
        credB: 'Intern · BEG Support',
        credC: 'Portão, Rio Grande do Sul',
        perfilTitle: 'About me',
        portraitCap: 'Systems Developer',
        perfilP1: 'I am a Systems Developer in training, currently working as an intern at BEG Support, where I work with Oracle APEX, PL/SQL and JavaScript to develop web solutions for clients across different industries.',
        perfilP2: 'I completed a Technical Diploma in Programming at Senac RS, with a focus on Full-Stack development (HTML, CSS and JavaScript) and relational database modelling. Throughout my training I built hands-on projects and took part in hackathons — experiences that strengthened my teamwork, my problem-solving and my ability to deliver.',
        stackCap: 'Main technologies and tools',
        recA: 'Secondary school',
        recA2: 'University',
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
        contatoTitle: 'Transmit a message',
        contatoLede: 'Write below. The message opens ready to send in my WhatsApp, without passing through any server.',
        fieldName: 'Name',
        fieldMsg: 'Message',
        errName: 'Please fill in your name.',
        errMsg: 'Please write your message.',
        submit: 'Transmit via WhatsApp',
        formNote: 'Or find me on GitHub, LinkedIn and Instagram, in the chart margin.',
        linksTag: 'Contacts',
        colophonTag: 'Credits',
        colophon: 'Chart drawn and written by Bernardo Varisco Fleck.'
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

        // both editions carry the age span, and re-lettering replaces it,
        // so your stamp has to be reapplied after every switch
        setDateYear();

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

    var sitesWrap = document.querySelector('.sites');
    var mark = document.getElementById('traverseMark');
    var ticking = false;

    function onScroll() {
        if (!sitesWrap || !mark) return;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            ticking = false;
            var r = sitesWrap.getBoundingClientRect();
            var mid = window.innerHeight * 0.5;
            var t = Math.max(0, Math.min(1, (mid - r.top) / (r.height || 1)));
            mark.style.setProperty('--travel', (t * r.height).toFixed(1) + 'px');
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
    setDateYear();
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

/* Sua função, hoisted, então o IIFE também a chama no boot e a cada troca de
   idioma — trocar de edição reescreve o lede e destrói o <span id="age">.
   As guardas existem porque, sem elas, um elemento ausente derruba o script
   inteiro: foi exatamente isso que apagou o ano e a idade. */
function setDateYear() {
    let age = document.getElementById("age");
    let year = document.getElementById("year");

    const date = new Date();

    if (year) year.innerHTML = date.getFullYear();
    if (age) age.innerHTML = date.getFullYear() - 2007;
}
setDateYear();