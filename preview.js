/* ============================================================
   Preview page — renders a published wedding website either by
   the UUID in the address (?w=<uuid>, stored in this browser)
   or from a portable website code (?c=<code>, self-contained).

   The go-live flow: clients email us their website code at
   hello.victoryvows@gmail.com; we paste it back here (?c= or the
   paste box below) to load exactly what they customized.
   ============================================================ */

(function () {
    'use strict';

    const store = VV.store;
    store.cleanup();

    const params = new URLSearchParams(window.location.search);
    const id = params.get('w');
    const code = params.get('c');
    const root = document.getElementById('siteRoot');

    let site = null;
    let mode = null; // 'local' (uuid in this browser) | 'code' (self-contained link)

    if (code) {
        site = VV.decodeSite(code);
        mode = 'code';
    } else if (id) {
        site = store.getSite(id);
        mode = 'local';
    }

    function showEmptyState() {
        document.title = 'Preview Not Found · Victory Vows Studio';
        root.innerHTML =
            '<div class="empty-state">' +
            '<span class="es-orn">❦</span>' +
            '<h1>This preview isn\'t available</h1>' +
            '<p>The link may have expired (previews live for 7 days), or it was created in a different ' +
            'browser — previews are stored on the device that generated them.</p>' +
            '<div class="es-actions">' +
            '<a class="ui-btn ui-btn-primary" href="generator.html">Create Your Website</a>' +
            '<a class="ui-btn ui-btn-ghost" href="index.html">Victory Vows Home</a>' +
            '</div>' +
            '<form class="code-loader" id="codeLoader">' +
            '<p class="cl-label">Have a website code? Paste it here to load the design.</p>' +
            '<div class="cl-row">' +
            '<input class="cl-input" id="codeInput" type="text" placeholder="VV2.eyJ2IjoyLCJjb25…" spellcheck="false">' +
            '<button type="submit" class="ui-btn ui-btn-ghost ui-btn-sm">Load</button>' +
            '</div>' +
            '<p class="cl-err" id="codeErr" hidden>That code doesn\'t look right — paste the whole code, from “VV2.” to the end.</p>' +
            '</form>' +
            '</div>';

        document.getElementById('codeLoader').addEventListener('submit', function (e) {
            e.preventDefault();
            const raw = document.getElementById('codeInput').value;
            if (VV.decodeSite(raw)) {
                const clean = raw.replace(/\s+/g, '');
                window.location.href = 'preview.html?c=' + encodeURIComponent(clean);
            } else {
                document.getElementById('codeErr').hidden = false;
            }
        });
    }

    if (!site || !site.config.landing || !site.config.outro) {
        showEmptyState();
        return;
    }

    // Guest personalization from the address (?to=<name>&max=<seats>)
    VV.setGuest(params.get('to'), params.get('max'));

    VV.renderSite(site.config, root, site.details);

    const D = VV.data();
    // D holds escaped strings; the title bar and email want plain text.
    const plain = function (s) {
        return String(s).replace(/&amp;/g, '&').replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    };
    const coupleNames = plain(D.bride.short) + ' & ' + plain(D.groom.short);
    document.title = coupleNames + ' — Wedding Website Preview';

    /* ---------------- Open Invitation gate ---------------- */

    const gate = document.getElementById('inviteGate');
    const bgm = document.getElementById('bgm');
    const musicBtn = document.getElementById('musicBtn');
    const dotNav = document.getElementById('dotNav');
    const pill = document.getElementById('previewPill');
    const guest = VV.getGuest();

    // Soundtrack: the couple's upload wins; otherwise their chosen
    // built-in track (carried inside the website code).
    VV.media.url('song').then(function (u) {
        if (u) {
            bgm.src = u;
        } else if (VV.TRACKS[D.track]) {
            bgm.src = VV.TRACKS[D.track].file;
        }
    });
    VV.media.url('img_cover').then(function (u) {
        if (u) document.querySelector('.gate-bg').style.backgroundImage = 'url("' + u + '")';
    });

    (function showGate() {
        const landingTheme = VV.byId[site.config.landing].theme;
        gate.classList.add('theme-' + landingTheme);
        document.getElementById('gateNames').innerHTML = D.bride.short + ' &amp; ' + D.groom.short;
        document.getElementById('gateDate').innerHTML = D.dateText + ' · ' + D.city;
        if (guest) {
            document.getElementById('gateGuest').hidden = false;
            document.getElementById('gateGuestName').innerHTML = guest.name;
        }
        gate.hidden = false;
        document.body.style.overflow = 'hidden';
    })();

    document.getElementById('gateOpenBtn').addEventListener('click', function () {
        gate.classList.add('gate-out');
        document.body.style.overflow = '';
        setTimeout(function () { gate.hidden = true; }, 1050);
        pill.hidden = false;
        dotNav.hidden = false;
        musicBtn.hidden = false;
        // The tap is our user gesture — start the soundtrack.
        bgm.play().then(function () {
            musicBtn.classList.add('playing');
        }).catch(function () {
            musicBtn.classList.add('muted');
        });
    });

    /* ---------------- Music toggle ---------------- */

    musicBtn.addEventListener('click', function () {
        if (bgm.paused) {
            bgm.play().then(function () {
                musicBtn.classList.add('playing');
                musicBtn.classList.remove('muted');
            }).catch(function () { /* ignored */ });
        } else {
            bgm.pause();
            musicBtn.classList.remove('playing');
            musicBtn.classList.add('muted');
        }
    });

    /* ---------------- Section dot navigation ---------------- */

    (function buildDotNav() {
        const secs = Array.prototype.slice.call(root.querySelectorAll('.tpl'));
        dotNav.innerHTML = secs.map(function (sec, i) {
            const tpl = VV.byId[sec.getAttribute('data-tpl')];
            let label = 'Section';
            if (tpl) {
                if (tpl.category === 'landing') label = 'Welcome';
                else if (tpl.category === 'outro') label = 'Farewell';
                else label = VV.KIND_LABELS[tpl.kind] || tpl.name;
            }
            return '<button class="dot' + (i === 0 ? ' on' : '') + '" data-i="' + i + '" title="' + label +
                '" aria-label="' + label + '"></button>';
        }).join('');

        dotNav.querySelectorAll('.dot').forEach(function (dot) {
            dot.addEventListener('click', function () {
                secs[parseInt(dot.getAttribute('data-i'), 10)]
                    .scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        const spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const at = secs.indexOf(entry.target);
                dotNav.querySelectorAll('.dot').forEach(function (dot, i) {
                    dot.classList.toggle('on', i === at);
                });
            });
        }, { rootMargin: '-45% 0px -45% 0px' });
        secs.forEach(function (sec) { spy.observe(sec); });
    })();

    /* ---------------- Preview pill ---------------- */

    if (mode === 'code') {
        // Code links carry the whole website — they open anywhere.
        document.getElementById('pillText').textContent =
            'Loaded from a website code · this link opens in any browser';
    }

    document.getElementById('copyLinkBtn').addEventListener('click', function () {
        VV.copyText(window.location.href, mode === 'code'
            ? 'Link copied — it contains the full website and opens anywhere.'
            : 'Link copied — note: it only opens in this browser.');
    });

    /* ---- Download QR ----
       A print-ready PNG of this link: the QR with a quiet zone, the
       couple's names and a scan hint beneath — made for physical
       invitations. Code links (?c=) carry the whole website and far
       exceed QR capacity, so the button hides itself for those. */

    const qrBtn = document.getElementById('qrBtn');

    function urlByteLength(s) {
        if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(s).length;
        return s.length;
    }

    if (urlByteLength(window.location.href) > 213) {
        qrBtn.hidden = true;
    }

    qrBtn.addEventListener('click', function () {
        let m;
        try {
            m = VVQR.matrix(window.location.href);
        } catch (e) {
            VV.toast('This link is too long for a QR code — use Copy Link instead.');
            return;
        }
        const module = 24, quiet = 4;
        const qrPx = (m.length + quiet * 2) * module;
        const captionH = 130;
        const canvas = document.createElement('canvas');
        canvas.width = qrPx;
        canvas.height = qrPx + captionH;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#141414';
        for (let r = 0; r < m.length; r++) {
            for (let c = 0; c < m.length; c++) {
                if (m[r][c]) ctx.fillRect((c + quiet) * module, (r + quiet) * module, module, module);
            }
        }
        ctx.textAlign = 'center';
        ctx.fillStyle = '#141414';
        ctx.font = '500 46px "Playfair Display", Georgia, serif';
        ctx.fillText(coupleNames, qrPx / 2, qrPx + 4);
        ctx.fillStyle = '#8c8c8c';
        ctx.font = '24px Montserrat, Helvetica, sans-serif';
        ctx.fillText('Scan to open the invitation', qrPx / 2, qrPx + 56);
        canvas.toBlob(function (blob) {
            if (!blob) {
                VV.toast('Could not create the QR image in this browser.');
                return;
            }
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'wedding-qr-' + coupleNames.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() + '.png';
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(function () { URL.revokeObjectURL(a.href); }, 10000);
            VV.toast('QR code downloaded — scanning it opens this exact link.');
        }, 'image/png');
    });

    // Collapse the pill to a tiny handle so it never hogs the page.
    document.getElementById('pillToggle').addEventListener('click', function () {
        pill.classList.toggle('min');
        this.innerHTML = pill.classList.contains('min') ? '&#9652;' : '&#9662;';
        this.setAttribute('aria-label', pill.classList.contains('min')
            ? 'Expand preview menu' : 'Collapse preview menu');
    });

    // Mint a personalized link: same website, addressed to one guest.
    document.getElementById('inviteGuestBtn').addEventListener('click', function () {
        const name = window.prompt('Guest name — shown on the invitation cover and RSVP:');
        if (!name || !name.trim()) return;
        const seats = parseInt(window.prompt('Seats reserved for this guest (1–20, blank to skip):', '2'), 10);
        const url = new URL(window.location.href);
        url.searchParams.set('to', name.trim());
        if (seats >= 1 && seats <= 20) {
            url.searchParams.set('max', String(seats));
        } else {
            url.searchParams.delete('max');
        }
        VV.copyText(url.toString(), 'Personalized link for ' + name.trim() + ' copied!');
    });

    // "Edit in Studio" loads this exact website — sections and
    // personalized text — back into the builder.
    document.getElementById('editBtn').addEventListener('click', function () {
        store.saveDraft(site.config);
        store.saveDetails(site.details);
    });

    /* ---------------- Make this page live ---------------- */

    const LIVE_EMAIL = 'hello.victoryvows@gmail.com';
    const modal = document.getElementById('liveModal');
    const siteCode = VV.encodeSite(site.config, site.details);

    // Manifest of custom media on this device — the email lists these
    // so the client attaches the original files for us to retrieve.
    const MEDIA_LABELS = {
        img_cover: 'Cover photo', img_bride: 'Bride portrait', img_groom: 'Groom portrait',
        img_gallery1: 'Gallery photo 1', img_gallery2: 'Gallery photo 2', img_gallery3: 'Gallery photo 3',
        img_story1: 'Love story photo 1', img_story2: 'Love story photo 2', img_story3: 'Love story photo 3',
        img_story4: 'Love story photo 4', img_story5: 'Love story photo 5',
        img_strip1: 'Photo strip 1', img_strip2: 'Photo strip 2', img_strip3: 'Photo strip 3',
        img_strip4: 'Photo strip 4', img_strip5: 'Photo strip 5', img_strip6: 'Photo strip 6',
        img_outro: 'Outro photo', img_backdrop: 'Whole-page backdrop', song: 'Background song'
    };

    function mediaLabel(key) {
        if (MEDIA_LABELS[key]) return MEDIA_LABELS[key];
        if (key.indexOf('img_secbg_') === 0) {
            const tid = key.slice('img_secbg_'.length);
            // Only list backdrops for sections actually in this website
            const inSite = tid === site.config.landing || tid === site.config.outro ||
                site.config.sections.indexOf(tid) !== -1;
            if (!inSite) return null;
            return 'Backdrop for “' + (VV.byId[tid] ? VV.byId[tid].name : tid) + '”';
        }
        return null;
    }

    let mediaManifest = [];
    VV.media.list().then(function (items) {
        mediaManifest = items.filter(function (it) { return mediaLabel(it.key); });
    });

    function fmtSize(b) {
        return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
    }

    function mediaSummary() {
        const lines = [];
        const style = (site.details && site.details.style) || {};
        if (style.bg) lines.push('Background colour: ' + style.bg + ' (already inside the website code)');
        if (style.secbg && typeof style.secbg === 'object') {
            Object.keys(style.secbg).forEach(function (tid) {
                lines.push('Backdrop colour for “' + (VV.byId[tid] ? VV.byId[tid].name : tid) + '”: ' +
                    style.secbg[tid] + ' (in the code)');
            });
        }
        const hasCustomSong = mediaManifest.some(function (it) { return it.key === 'song'; });
        if (!hasCustomSong && VV.TRACKS[style.track]) {
            lines.push('Background song: “' + VV.TRACKS[style.track].label + '” (built-in — already in the code)');
        }
        mediaManifest.forEach(function (it) {
            lines.push(mediaLabel(it.key) + ': ' + it.name + ' (' + fmtSize(it.size) + ') — PLEASE ATTACH');
        });
        if (!lines.length) return '';
        return '\nCustom style & media:\n- ' + lines.join('\n- ') +
            (mediaManifest.length
                ? '\n\nIMPORTANT: please attach the file' + (mediaManifest.length > 1 ? 's' : '') +
                  ' listed above to this email — photos and music cannot travel inside the code.\n'
                : '\n');
    }

    function sectionSummary() {
        const names = function (id) { return VV.byId[id] ? VV.byId[id].name : id; };
        return 'Landing: ' + names(site.config.landing) +
            '\nSections: ' + (site.config.sections.map(names).join(', ') || '—') +
            '\nOutro: ' + names(site.config.outro);
    }

    function emailBody() {
        return 'Hi Victory Vows team,\n\n' +
            'We would love to make our wedding website live!\n\n' +
            'Couple: ' + coupleNames + '\n' +
            'Wedding date: ' + plain(D.dateText) + '\n' +
            'City: ' + plain(D.city) + '\n' +
            sectionSummary() + '\n' +
            (mode === 'local' ? 'Preview ID: ' + id + '\n' : '') +
            mediaSummary() +
            '\nBest number to reach us: (please fill in)\n\n' +
            '---- WEBSITE CODE — please keep this block intact ----\n' +
            siteCode + '\n' +
            '---- END WEBSITE CODE ----\n';
    }

    function openModal() {
        document.getElementById('siteCode').value = siteCode;
        const attach = document.getElementById('attachList');
        if (mediaManifest.length) {
            attach.hidden = false;
            document.getElementById('attachItems').innerHTML = mediaManifest.map(function (it) {
                const safe = it.name.replace(/&/g, '&amp;').replace(/</g, '&lt;');
                return '<li><b>' + mediaLabel(it.key) + '</b> — ' + safe + ' · ' + fmtSize(it.size) + '</li>';
            }).join('');
        } else {
            attach.hidden = true;
        }
        document.getElementById('emailUsBtn').href =
            'mailto:' + LIVE_EMAIL +
            '?subject=' + encodeURIComponent('Make our wedding website live — ' + coupleNames) +
            '&body=' + encodeURIComponent(emailBody());
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        releaseTrap = VV.trapFocus(modal.querySelector('.vv-modal-card'));
    }

    let releaseTrap = null;

    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
        if (releaseTrap) {
            releaseTrap();
            releaseTrap = null;
        }
    }

    document.getElementById('goLiveBtn').addEventListener('click', openModal);
    modal.querySelectorAll('[data-close]').forEach(function (el) {
        el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    document.getElementById('copyDetailsBtn').addEventListener('click', function () {
        VV.copyText(
            'To: ' + LIVE_EMAIL + '\nSubject: Make our wedding website live — ' + coupleNames + '\n\n' + emailBody(),
            'Details copied — paste them into an email to ' + LIVE_EMAIL + '.'
        );
    });

    // Selecting the code selects all of it — half a code is useless.
    document.getElementById('siteCode').addEventListener('focus', function () {
        this.select();
    });
})();
