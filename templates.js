/* ============================================================
   Victory Vows — Wedding Website Studio
   Template registry, sample sites, renderer, personalization
   layer & client-side store
   ============================================================ */

window.VV = (function () {
    'use strict';

    /* ---------------- Demo couple data (defaults) ---------------- */

    const DEMO = {
        bride: {
            name: 'Aurelia Chen',
            short: 'Aurelia',
            initial: 'A',
            role: 'The Bride',
            parents: 'Daughter of Mr. & Mrs. Chen Wei Ming',
            ig: '@aurelia.c'
        },
        groom: {
            name: 'Theodore Wijaya',
            short: 'Theodore',
            initial: 'T',
            role: 'The Groom',
            parents: 'Son of Mr. & Mrs. Wijaya Kusuma',
            ig: '@theo.wijaya'
        },
        dateISO: '2026-12-12T14:00:00',
        dateShort: '12 · 12 · 2026',
        dateText: 'Saturday, 12 December 2026',
        dateFormal: 'Saturday, the Twelfth of December<br>Two Thousand and Twenty-Six',
        city: 'Singapore',
        hashtag: '#AureliaWedsTheo',
        story: [
            { year: '2019', title: 'First Met', text: 'A rainy evening, a shared umbrella outside a bookstore on Bras Basah Road — and a conversation neither of them wanted to end.' },
            { year: '2022', title: 'The Adventure', text: 'From street food in Bangkok to sunrises over Mount Bromo, they discovered that home is not a place, but a person.' },
            { year: '2025', title: 'The Proposal', text: 'Under a canopy of fairy lights by the Singapore River, Theodore asked. Through happy tears, Aurelia said yes.' }
        ],
        events: [
            { title: 'Holy Matrimony', date: 'Saturday, 12 December 2026', time: '2:00 PM — 3:30 PM', venue: "St Andrew's Cathedral", addr: "11 St Andrew's Road, Singapore" },
            { title: 'Wedding Reception', date: 'Saturday, 12 December 2026', time: '6:30 PM until late', venue: 'The Fullerton Hotel', addr: '1 Fullerton Square, Singapore' }
        ],
        quote: {
            text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It always protects, always trusts, always hopes, always perseveres.',
            cite: '1 Corinthians 13:4–7'
        },
        gifts: [
            { bank: 'DBS Bank', acc: '120-482-3391', holder: 'Aurelia Chen' },
            { bank: 'OCBC Bank', acc: '588-104-7726', holder: 'Theodore Wijaya' }
        ],
        attire: {
            code: 'Formal · Black Tie Optional',
            note: 'We would love to see you dressed in classic evening elegance — floor-length gowns or refined cocktail dresses, dark suits or tuxedos. Most of all, come comfortable enough to dance.'
        },
        faqs: [
            { q: 'Can I bring a plus one?', a: 'We have reserved seats for the guests named on your invitation. If your invitation says “and guest”, we would be delighted to welcome your plus one.' },
            { q: 'Are children welcome?', a: 'We adore your little ones! Children are warmly welcome at the ceremony; the evening reception will be an adults-only celebration so everyone can let loose.' },
            { q: 'What time should I arrive?', a: 'Doors open thirty minutes before the ceremony begins. We recommend arriving early to find your seat, sign the guest book and settle in.' },
            { q: 'Will the celebration be indoors or outdoors?', a: 'The ceremony and reception are both held indoors, with a short outdoor photo moment at golden hour — a light shawl or jacket is a lovely idea.' }
        ],
        travel: [
            { icon: '✈', title: 'Flying In', text: 'Changi International Airport is around a twenty-minute drive from both venues. Taxis and ride-hailing are available around the clock.' },
            { icon: '🚗', title: 'Parking & Transport', text: 'Complimentary valet parking is available at the reception venue. A shuttle will run between the ceremony and reception every twenty minutes.' },
            { icon: '🛏', title: 'Where To Stay', text: 'A block of rooms has been reserved for our guests at the reception hotel — mention our wedding when booking to receive the group rate.' }
        ],
        wishes: [
            { text: 'Wishing you both a lifetime of laughter, adventure and quiet Sunday mornings together. So happy for you!', by: 'Natalie & James' },
            { text: 'From classmates to soulmates — we always knew. Congratulations, you two!', by: 'The Tan Family' },
            { text: 'May your love story keep growing more beautiful with every chapter. See you on the dance floor!', by: 'Priya S.' }
        ],
        party: {
            bridesmaids: [
                { name: 'Clarissa Chen', role: 'Maid of Honour' },
                { name: 'Melody Tan', role: 'Bridesmaid' },
                { name: 'Sarah Lim', role: 'Bridesmaid' }
            ],
            groomsmen: [
                { name: 'Nicholas Wijaya', role: 'Best Man' },
                { name: 'Jonathan Ho', role: 'Groomsman' },
                { name: 'Marcus Lee', role: 'Groomsman' }
            ]
        },
        stream: {
            url: 'https://www.youtube.com/@victoryvows',
            note: 'Celebrate with us from anywhere in the world — the holy matrimony will be streamed live for family and friends who cannot join us in person.'
        }
    };

    /* ---- Flexible list sizes ----
       Couples can grow or shrink these lists (details.counts, which
       travels inside website codes & backups like all other text).
       Items beyond the demo set fall back to the extras below, so a
       freshly added row always previews with sensible sample text. */

    const LIST_LIMITS = {
        story: { min: 2, max: 5, def: 3 },
        events: { min: 1, max: 4, def: 2 },
        gifts: { min: 1, max: 4, def: 2 },
        bridesmaids: { min: 1, max: 6, def: 3 },
        groomsmen: { min: 1, max: 6, def: 3 }
    };

    const DEMO_EXTRA = {
        story: [
            { year: '2026', title: 'The Next Chapter', text: 'A brand-new adventure — one we cannot wait to begin writing together.' },
            { year: 'Forever', title: 'Happily Ever After', text: 'Every day after this one: the chapter we are most excited to write.' }
        ],
        events: [
            { title: 'Tea Ceremony', date: 'Saturday, 12 December 2026', time: '10:00 AM — 11:30 AM', venue: 'Family Residence', addr: 'Singapore' },
            { title: 'After Party', date: 'Saturday, 12 December 2026', time: '10:00 PM until late', venue: 'The Rooftop Lounge', addr: '1 Fullerton Square, Singapore' }
        ],
        gifts: [
            { bank: 'PayNow', acc: '+65 9123 4567', holder: 'Aurelia Chen' },
            { bank: 'GoPay / OVO', acc: '+62 812 3456 789', holder: 'Theodore Wijaya' }
        ],
        bridesmaids: [
            { name: 'Vanessa Ong', role: 'Bridesmaid' },
            { name: 'Grace Ho', role: 'Bridesmaid' },
            { name: 'Elaine Foo', role: 'Bridesmaid' }
        ],
        groomsmen: [
            { name: 'Daniel Tan', role: 'Groomsman' },
            { name: 'Kevin Lim', role: 'Groomsman' },
            { name: 'Aaron Chua', role: 'Groomsman' }
        ]
    };

    function listBase(key) {
        if (key === 'bridesmaids') return DEMO.party.bridesmaids;
        if (key === 'groomsmen') return DEMO.party.groomsmen;
        return DEMO[key];
    }

    // Demo/sample content for position i of a flexible list.
    function demoItem(key, i) {
        const base = listBase(key);
        const src = i < base.length
            ? base[i]
            : DEMO_EXTRA[key][(i - base.length) % DEMO_EXTRA[key].length];
        return JSON.parse(JSON.stringify(src));
    }

    function normCount(key, v) {
        const lim = LIST_LIMITS[key];
        const n = parseInt(v, 10);
        if (isNaN(n)) return lim.def;
        return Math.max(lim.min, Math.min(lim.max, n));
    }

    // Resolved, clamped counts for a details object.
    function getCounts(det) {
        const src = (det && typeof det === 'object' && det.counts && typeof det.counts === 'object')
            ? det.counts : {};
        const out = {};
        Object.keys(LIST_LIMITS).forEach(function (k) { out[k] = normCount(k, src[k]); });
        return out;
    }

    function resizeList(list, key, n) {
        while (list.length > n) list.pop();
        while (list.length < n) list.push(demoItem(key, list.length));
    }

    /* ---------------- Personalization layer ----------------
       Users may replace nearly every piece of text (never images).
       Custom values are stored raw in localStorage under vv_details,
       merged over DEMO (and HTML-escaped) each time a site renders. */

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function unesc(s) {
        return String(s).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    }

    function hasText(v) {
        return typeof v === 'string' && v.trim().length > 0;
    }

    // Overlay: keep the demo value unless the user typed something.
    function ov(base, val) {
        return hasText(val) ? esc(val.trim()) : base;
    }

    function firstWord(s) {
        return s.trim().split(/\s+/)[0];
    }

    function alnum(s) {
        return s.replace(/[^a-zA-Z0-9]/g, '');
    }

    function ordinal(n) {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    // Built-in soundtracks (selectable without uploading anything)
    const TRACKS = {
        photograph: { file: 'assets/audio/photograph.mp3', label: 'Photograph' },
        faithfulness: { file: 'assets/audio/thy_faithfulness.mp3', label: 'Thy Faithfulness' }
    };

    const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    function pad2(n) {
        return String(n).padStart(2, '0');
    }

    function deriveDates(d, dateStr, timeStr) {
        // Normalise to HH:MM — single-digit hours ('9:30', natural in
        // hand-written codes) would otherwise build a non-ISO string
        // that new Date() rejects, silently keeping the demo date.
        const tm = hasText(timeStr) ? timeStr.trim().match(/^(\d{1,2}):(\d{2})/) : null;
        const t = tm ? pad2(parseInt(tm[1], 10)) + ':' + tm[2] : '14:00';
        const dt = new Date(dateStr + 'T' + t + ':00');
        if (isNaN(dt.getTime())) return;
        const wd = WEEKDAYS[dt.getDay()], day = dt.getDate(), mo = MONTHS[dt.getMonth()], yr = dt.getFullYear();
        d.dateISO = dateStr + 'T' + t + ':00';
        d.dateText = wd + ', ' + day + ' ' + mo + ' ' + yr;
        d.dateShort = pad2(day) + ' · ' + pad2(dt.getMonth() + 1) + ' · ' + yr;
        d.dateFormal = wd + ', the ' + ordinal(day) + ' of ' + mo + '<br>' + yr;
    }

    function overlayList(baseList, srcList, fields) {
        if (!Array.isArray(srcList)) return;
        baseList.forEach(function (item, i) {
            const src = srcList[i];
            if (!src || typeof src !== 'object') return;
            fields.forEach(function (f) { item[f] = ov(item[f], src[f]); });
        });
    }

    // Build the render-ready data object: DEMO + user details, escaped.
    function buildData(det) {
        det = (det && typeof det === 'object') ? det : {};
        const d = JSON.parse(JSON.stringify(DEMO));
        // Grow/shrink the flexible lists to the couple's chosen sizes
        // before overlaying their text (overlays are index-based).
        const counts = getCounts(det);
        resizeList(d.story, 'story', counts.story);
        resizeList(d.events, 'events', counts.events);
        resizeList(d.gifts, 'gifts', counts.gifts);
        resizeList(d.party.bridesmaids, 'bridesmaids', counts.bridesmaids);
        resizeList(d.party.groomsmen, 'groomsmen', counts.groomsmen);
        let customNames = false;
        const rawShort = { bride: DEMO.bride.short, groom: DEMO.groom.short };

        ['bride', 'groom'].forEach(function (k) {
            const src = (det[k] && typeof det[k] === 'object') ? det[k] : {};
            if (hasText(src.name)) {
                customNames = true;
                const raw = firstWord(src.name);
                rawShort[k] = raw;
                d[k].name = esc(src.name.trim());
                d[k].short = esc(raw);
                d[k].initial = esc(raw.charAt(0).toUpperCase());
            }
            d[k].parents = ov(d[k].parents, src.parents);
            if (hasText(src.ig)) {
                let ig = src.ig.trim();
                if (ig.charAt(0) !== '@') ig = '@' + ig;
                d[k].ig = esc(ig);
            }
        });

        d.city = ov(d.city, det.city);
        let customDate = false;
        if (hasText(det.date) && /^\d{4}-\d{2}-\d{2}$/.test(det.date.trim())) {
            deriveDates(d, det.date.trim(), det.time);
            customDate = true;
        }

        if (hasText(det.hashtag)) {
            let h = det.hashtag.trim();
            if (h.charAt(0) !== '#') h = '#' + h;
            d.hashtag = esc(h);
        } else if (customNames) {
            d.hashtag = '#' + (alnum(rawShort.bride) || 'Us') + 'Weds' + (alnum(rawShort.groom) || 'Us');
        }

        overlayList(d.story, det.story, ['year', 'title', 'text']);
        overlayList(d.events, det.events, ['title', 'date', 'time', 'venue', 'addr']);
        // A new wedding date should carry into event cards the user
        // hasn't given their own date line to.
        if (customDate) {
            d.events.forEach(function (ev, i) {
                const src = Array.isArray(det.events) ? det.events[i] : null;
                if (!src || !hasText(src.date)) ev.date = d.dateText;
            });
        }
        overlayList(d.gifts, det.gifts, ['bank', 'acc', 'holder']);
        overlayList(d.faqs, det.faqs, ['q', 'a']);
        overlayList(d.travel, det.travel, ['title', 'text']);

        if (det.quote && typeof det.quote === 'object') {
            d.quote.text = ov(d.quote.text, det.quote.text);
            d.quote.cite = ov(d.quote.cite, det.quote.cite);
        }
        if (det.attire && typeof det.attire === 'object') {
            d.attire.code = ov(d.attire.code, det.attire.code);
            d.attire.note = ov(d.attire.note, det.attire.note);
        }
        if (det.party && typeof det.party === 'object') {
            overlayList(d.party.bridesmaids, det.party.bridesmaids, ['name', 'role']);
            overlayList(d.party.groomsmen, det.party.groomsmen, ['name', 'role']);
        }
        if (det.stream && typeof det.stream === 'object') {
            if (hasText(det.stream.url) && /^https?:\/\//i.test(det.stream.url.trim())) {
                d.stream.url = esc(det.stream.url.trim());
            }
            d.stream.note = ov(d.stream.note, det.stream.note);
        }
        // Custom page background colour (travels inside website codes)
        // Per-section backdrop colours (templateId → hex), also code-portable
        d.secBg = {};
        if (det.style && typeof det.style === 'object' &&
            det.style.secbg && typeof det.style.secbg === 'object') {
            Object.keys(det.style.secbg).forEach(function (id) {
                const v = det.style.secbg[id];
                if (typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v)) d.secBg[id] = v;
            });
        }
        // Built-in soundtrack choice (photograph | faithfulness)
        d.track = (det.style && typeof det.style === 'object' &&
            typeof det.style.track === 'string' && TRACKS[det.style.track])
            ? det.style.track : 'photograph';
        d.styleBg = (det.style && typeof det.style === 'object' &&
            typeof det.style.bg === 'string' && /^#[0-9a-fA-F]{6}$/.test(det.style.bg))
            ? det.style.bg : null;
        return d;
    }

    // D is the live data object every renderer reads from.
    let D = buildData(null);

    function refreshData() {
        D = buildData(getDetails());
        return D;
    }

    /* ---- Guest personalization (?to=<name>&max=<seats>) ----
       Set from the URL by the page scripts; woven into the landing,
       the invitation gate and the RSVP form at render time. */

    let GUEST = null;
    let GUEST_SEATS = null;

    function setGuest(name, seats) {
        GUEST = hasText(name) ? esc(name.trim().slice(0, 60)) : null;
        const n = parseInt(seats, 10);
        GUEST_SEATS = (GUEST && n >= 1 && n <= 20) ? n : null;
    }

    function getGuest() {
        return GUEST ? { name: GUEST, seats: GUEST_SEATS } : null;
    }

    function mapUrl(ev) {
        return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ev.venue + ', ' + ev.addr);
    }

    // Google Calendar template link for the wedding day (4h block).
    function calendarUrl() {
        const start = new Date(D.dateISO);
        if (isNaN(start.getTime())) return null;
        const end = new Date(start.getTime() + 4 * 36e5);
        const fmt = function (dt) {
            return dt.getFullYear() + pad2(dt.getMonth() + 1) + pad2(dt.getDate()) +
                'T' + pad2(dt.getHours()) + pad2(dt.getMinutes()) + '00';
        };
        return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
            '&text=' + encodeURIComponent('Wedding of ' + unesc(D.bride.short) + ' & ' + unesc(D.groom.short)) +
            '&dates=' + fmt(start) + '/' + fmt(end) +
            '&location=' + encodeURIComponent(unesc(D.city)) +
            '&details=' + encodeURIComponent('We would be honoured to celebrate with you. ' + unesc(D.hashtag));
    }

    function cityMapUrl() {
        return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(D.city);
    }

    /* ---------------- Media store (IndexedDB) ----------------
       Custom photos, backdrop picture and song live as blobs in
       this browser only — they appear in every sample & preview
       here, and the originals are attached to the go-live email.
       Keys: img_cover, img_bride, img_groom, img_gallery1..3,
             img_outro, img_backdrop, song                       */

    const MEDIA_DB = 'vv_media';
    const MEDIA_STORE = 'files';
    const IMAGE_SLOTS = ['cover', 'bride', 'groom', 'gallery1', 'gallery2', 'gallery3', 'outro',
        'story1', 'story2', 'story3', 'story4', 'story5',
        'strip1', 'strip2', 'strip3', 'strip4', 'strip5', 'strip6'];

    let mediaDbPromise = null;

    function mediaDb() {
        if (typeof indexedDB === 'undefined') return Promise.reject(new Error('no idb'));
        if (!mediaDbPromise) {
            mediaDbPromise = new Promise(function (resolve, reject) {
                const req = indexedDB.open(MEDIA_DB, 1);
                req.onupgradeneeded = function () { req.result.createObjectStore(MEDIA_STORE); };
                req.onsuccess = function () { resolve(req.result); };
                req.onerror = function () { reject(req.error); };
            });
        }
        return mediaDbPromise;
    }

    function mediaGet(key) {
        return mediaDb().then(function (db) {
            return new Promise(function (resolve) {
                const req = db.transaction(MEDIA_STORE).objectStore(MEDIA_STORE).get(key);
                req.onsuccess = function () { resolve(req.result || null); };
                req.onerror = function () { resolve(null); };
            });
        }).catch(function () { return null; });
    }

    function mediaSet(key, record) {
        return mediaDb().then(function (db) {
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(MEDIA_STORE, 'readwrite');
                tx.objectStore(MEDIA_STORE).put(record, key);
                tx.oncomplete = function () { resolve(true); };
                tx.onerror = function () { reject(tx.error); };
            });
        });
    }

    function mediaRemove(key) {
        return mediaDb().then(function (db) {
            return new Promise(function (resolve) {
                const tx = db.transaction(MEDIA_STORE, 'readwrite');
                tx.objectStore(MEDIA_STORE).delete(key);
                tx.oncomplete = function () { resolve(true); };
                tx.onerror = function () { resolve(false); };
            });
        }).catch(function () { return false; });
    }

    function mediaList() {
        return mediaDb().then(function (db) {
            return new Promise(function (resolve) {
                const store = db.transaction(MEDIA_STORE).objectStore(MEDIA_STORE);
                const keysReq = store.getAllKeys();
                const valsReq = store.getAll();
                let keys = null, vals = null;
                const done = function () {
                    if (keys && vals) {
                        resolve(keys.map(function (k, i) {
                            const v = vals[i] || {};
                            return { key: k, name: v.name || '', type: v.type || '', size: v.size || 0 };
                        }));
                    }
                };
                keysReq.onsuccess = function () { keys = keysReq.result; done(); };
                valsReq.onsuccess = function () { vals = valsReq.result; done(); };
                keysReq.onerror = valsReq.onerror = function () { resolve([]); };
            });
        }).catch(function () { return []; });
    }

    // Object-URL cache so re-renders reuse (and revoke stale) URLs.
    const mediaUrls = {};

    function mediaUrl(key) {
        return mediaGet(key).then(function (rec) {
            if (!rec || !rec.blob) return null;
            const stamp = rec.updatedAt || 0;
            const cached = mediaUrls[key];
            if (cached && cached.stamp === stamp) return cached.url;
            if (cached) URL.revokeObjectURL(cached.url);
            const url = URL.createObjectURL(rec.blob);
            mediaUrls[key] = { url: url, stamp: stamp };
            return url;
        });
    }

    // Ask the browser to keep our storage durable across restarts
    // (IndexedDB media + localStorage drafts survive either way; this
    // additionally protects them from storage-pressure eviction).
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
        try { navigator.storage.persist().catch(function () {}); } catch (e) { /* best effort */ }
    }

    // Swap custom media into a rendered site.
    function applyMedia(root) {
        if (typeof indexedDB === 'undefined') return;
        IMAGE_SLOTS.forEach(function (slot) {
            mediaUrl('img_' + slot).then(function (url) {
                if (!url) return;
                root.querySelectorAll('[data-slot="' + slot + '"]').forEach(function (el) {
                    el.src = url;
                });
                root.querySelectorAll('[data-slot-bg="' + slot + '"]').forEach(function (el) {
                    el.style.backgroundImage = 'url("' + url + '")';
                });
                root.querySelectorAll('[data-slot-avatar="' + slot + '"]').forEach(function (el) {
                    el.classList.add('avatar-photo');
                    el.innerHTML = '<img src="' + url + '" alt="">';
                });
            });
        });
        mediaUrl('img_backdrop').then(function (url) {
            let bd = document.getElementById('vvBackdrop');
            if (url) {
                if (!bd) {
                    bd = document.createElement('div');
                    bd.id = 'vvBackdrop';
                    bd.className = 'site-backdrop';
                    document.body.insertBefore(bd, document.body.firstChild);
                }
                bd.style.backgroundImage = 'url("' + url + '")';
                root.classList.add('has-bgimg');
            } else {
                if (bd) bd.remove();
                root.classList.remove('has-bgimg');
            }
        });

        // Per-section backdrops: each section in the website can carry
        // its own picture, keyed by template id (img_secbg_<id>).
        root.querySelectorAll('.tpl').forEach(function (sec) {
            const id = sec.getAttribute('data-tpl');
            if (!id) return;
            mediaUrl('img_secbg_' + id).then(function (url) {
                let bg = sec.querySelector(':scope > .sec-backdrop');
                if (url) {
                    if (!bg) {
                        bg = document.createElement('div');
                        bg.className = 'sec-backdrop';
                        const veil = document.createElement('div');
                        veil.className = 'sec-backdrop-veil';
                        sec.insertBefore(veil, sec.firstChild);
                        sec.insertBefore(bg, veil);
                    }
                    bg.style.backgroundImage = 'url("' + url + '")';
                    sec.classList.add('has-secbg');
                } else {
                    if (bg) bg.remove();
                    const veil = sec.querySelector(':scope > .sec-backdrop-veil');
                    if (veil) veil.remove();
                    sec.classList.remove('has-secbg');
                }
            });
        });
    }

    /* ---------------- Themes ---------------- */

    const THEMES = {
        noir: {
            label: 'Midnight Noir',
            thumb: { bg: '#101014', ink: '#f2ead8', accent: '#c9a86a' },
            // Dark charcoal grey — noir, but light enough to read against
            // the dark studio chip background.
            dot: '#71717a',
            dress: ['#0d0d10', '#3a3a42', '#7a6647', '#c9a86a', '#f4efe4']
        },
        blush: {
            label: 'Blush Garden',
            thumb: { bg: '#faf3ec', ink: '#5a4a44', accent: '#cf8f9c' },
            dress: ['#f7e6e0', '#e9c3c9', '#c98b96', '#9d6b74', '#54443e']
        },
        azure: {
            label: 'Azure Coast',
            thumb: { bg: '#eef4fa', ink: '#1e3244', accent: '#3e6d9c' },
            dot: '#5aa9e6',
            dress: ['#dfe9f4', '#a8c2dc', '#6e93b8', '#3e6d9c', '#1c2b3a']
        },
        royal: {
            label: 'Royal Emerald',
            thumb: { bg: '#0f2823', ink: '#f0e8cf', accent: '#d2b155' },
            // Chip-dot colour: the theme's namesake shade (kept bright
            // enough to read on the dark studio background); designs
            // themselves keep using the thumb accent.
            dot: '#1f8a5a',
            dress: ['#0e2620', '#1d4a3d', '#77a08a', '#d2b155', '#f1e9d2']
        },
        ivory: {
            label: 'Porcelain Ivory',
            thumb: { bg: '#f7f5f0', ink: '#2b2926', accent: '#b5a284' },
            dress: ['#f7f5f0', '#dcd6c9', '#b5a284', '#6b6459', '#2b2926']
        },
        terra: {
            label: 'Terracotta Dusk',
            thumb: { bg: '#f9efe3', ink: '#4a3226', accent: '#c4693b' },
            dress: ['#f9efe3', '#eec9a3', '#d99762', '#c4693b', '#7a4326']
        },
        sage: {
            label: 'Sage Meadow',
            thumb: { bg: '#f3f6f1', ink: '#35443b', accent: '#5d7d61' },
            dot: '#9cbf90',
            dress: ['#f3f6f1', '#cfdcc9', '#a3b89a', '#5d7d61', '#35443b']
        },
        dusk: {
            label: 'Twilight Hour',
            thumb: { bg: '#131c2c', ink: '#eef1f6', accent: '#e8a75d' },
            dot: '#5d7bb0',
            dress: ['#131c2c', '#2c3b55', '#7787a3', '#e8a75d', '#f2e5d0']
        },
        villa: {
            label: 'Villa Amara',
            thumb: { bg: '#f8f1e7', ink: '#3d2b22', accent: '#a94f2e' },
            dress: ['#f8f1e7', '#e5cdb0', '#c98d68', '#a94f2e', '#5a3a2c']
        }
    };

    /* ---------------- Template registry ----------------
       category: 'landing' | 'content' | 'outro'
       Only 'content' templates may be mixed & matched (max 7);
       'landing' and 'outro' each fill exactly one fixed slot. */

    const TEMPLATES = [
        /* ---- Landing pages ---- */
        { id: 'landing-noir', category: 'landing', kind: 'landing', theme: 'noir', name: 'Midnight Overture', desc: 'Cinematic full-screen opening with champagne serif names.' },
        { id: 'landing-blush', category: 'landing', kind: 'landing', theme: 'blush', name: 'Garden Arch', desc: 'Soft romantic cover with an arched photo and script names.' },
        { id: 'landing-azure', category: 'landing', kind: 'landing', theme: 'azure', name: 'Coastline Split', desc: 'Modern editorial split-screen opening.' },
        { id: 'landing-royal', category: 'landing', kind: 'landing', theme: 'royal', name: 'Emerald Crest', desc: 'Formal monogram medallion on deep emerald.' },
        { id: 'landing-ivory', category: 'landing', kind: 'landing', theme: 'ivory', name: 'The Editorial', desc: 'Pure typography on warm ivory — quiet luxury.' },
        { id: 'landing-terra', category: 'landing', kind: 'landing', theme: 'terra', name: 'Sunset Arch', desc: 'A desert-dusk arch glowing softly behind your names.' },
        { id: 'landing-court-terra', category: 'landing', kind: 'landing', theme: 'terra', name: 'Courtyard Waltz', desc: 'A full-photograph opening — the two of you, mid-dance.' },
        { id: 'landing-sage', category: 'landing', kind: 'landing', theme: 'sage', name: 'Botanical Frame', desc: 'A hand-drawn double frame wreathed in eucalyptus.' },
        { id: 'landing-dusk', category: 'landing', kind: 'landing', theme: 'dusk', name: 'Blue Hour', desc: 'A twilight photograph, amber light and drifting fireflies.' },
        { id: 'landing-villa', category: 'landing', kind: 'landing', theme: 'villa', name: 'La Escalera', desc: 'An editorial split cover — staircase portrait and a ghost year.' },
        { id: 'landing-marquee-noir', category: 'landing', kind: 'landing', theme: 'noir', layout: 'marquee', name: 'Midnight Marquee', desc: 'Towering serif names above a photo triptych.' },
        { id: 'landing-marquee-azure', category: 'landing', kind: 'landing', theme: 'azure', layout: 'marquee', name: 'Headline Coast', desc: 'A bold typographic opening over three seaside stills.' },
        { id: 'landing-marquee-royal', category: 'landing', kind: 'landing', theme: 'royal', layout: 'marquee', name: 'Royal Proclamation', desc: 'Names announced in gold above an emerald triptych.', exclusive: true },
        { id: 'landing-marquee-dusk', category: 'landing', kind: 'landing', theme: 'dusk', layout: 'marquee', name: 'Evening Marquee', desc: 'Amber-lit names above a strip of twilight photographs.' },
        { id: 'landing-frame-blush', category: 'landing', kind: 'landing', theme: 'blush', layout: 'frame', name: 'Rose Stationery', desc: 'A double-framed invitation card in rosewater.' },
        { id: 'landing-frame-ivory', category: 'landing', kind: 'landing', theme: 'ivory', layout: 'frame', name: 'The Invitation Card', desc: 'A fine double frame, a monogram and formal lettering.' },
        { id: 'landing-frame-sage', category: 'landing', kind: 'landing', theme: 'sage', layout: 'frame', name: 'Pressed Card', desc: 'A botanical stationery frame in eucalyptus green.' },
        { id: 'landing-frame-villa', category: 'landing', kind: 'landing', theme: 'villa', layout: 'frame', name: 'Plaster Invitation', desc: 'A sun-washed stationery frame sealed in brick red.' },

        /* ---- Mix & match: couple ---- */
        { id: 'couple-noir', category: 'content', kind: 'couple', theme: 'noir', name: 'Gilded Duet', desc: 'Bride & groom introduction with gold-ringed monograms.' },
        { id: 'couple-blush', category: 'content', kind: 'couple', theme: 'blush', name: 'Soft Portraits', desc: 'Arched rosewater portraits of the couple.' },
        { id: 'couple-azure', category: 'content', kind: 'couple', theme: 'azure', name: 'Modern Introductions', desc: 'Clean, airy bride & groom profiles.' },
        { id: 'couple-ivory', category: 'content', kind: 'couple', theme: 'ivory', name: 'Ink Portraits', desc: 'Minimal monochrome introductions with fine rules.' },
        { id: 'couple-terra', category: 'content', kind: 'couple', theme: 'terra', name: 'Golden Hour Duo', desc: 'Sun-warmed introductions in clay and sand.' },
        { id: 'couple-sage', category: 'content', kind: 'couple', theme: 'sage', name: 'Meadow Portraits', desc: 'Fresh botanical profiles in eucalyptus green.' },
        { id: 'couple-royal', category: 'content', kind: 'couple', theme: 'royal', name: 'Court Introductions', desc: 'Stately presentations in emerald and gold.' },
        { id: 'couple-panels-noir', category: 'content', kind: 'couple', theme: 'noir', layout: 'panels', name: 'Velvet Panels', desc: 'Full-height portraits, names set into the dark.' },
        { id: 'couple-panels-blush', category: 'content', kind: 'couple', theme: 'blush', layout: 'panels', name: 'Rosewater Panels', desc: 'Editorial portrait panels washed in rose.' },
        { id: 'couple-panels-azure', category: 'content', kind: 'couple', theme: 'azure', layout: 'panels', name: 'Coastline Panels', desc: 'Clean full-height portraits with overlaid names.' },
        { id: 'couple-panels-royal', category: 'content', kind: 'couple', theme: 'royal', layout: 'panels', name: 'Regal Panels', desc: 'Grand portrait panels edged in gold.', exclusive: true },
        { id: 'couple-panels-ivory', category: 'content', kind: 'couple', theme: 'ivory', layout: 'panels', name: 'Ink Panels', desc: 'Monochrome portrait panels, quietly editorial.' },
        { id: 'couple-panels-terra', category: 'content', kind: 'couple', theme: 'terra', layout: 'panels', name: 'Golden Hour Panels', desc: 'Sunlit portrait panels in clay and sand.' },
        { id: 'couple-panels-sage', category: 'content', kind: 'couple', theme: 'sage', layout: 'panels', name: 'Meadow Panels', desc: 'Fresh portrait panels wrapped in green.' },
        { id: 'couple-panels-dusk', category: 'content', kind: 'couple', theme: 'dusk', layout: 'panels', name: 'Lantern Panels', desc: 'Portrait panels glowing against the blue hour.' },
        { id: 'couple-panels-villa', category: 'content', kind: 'couple', theme: 'villa', layout: 'panels', name: 'Courtyard Panels', desc: 'Portraits against warm brick, names in plaster.' },

        /* ---- Mix & match: story ---- */
        { id: 'story-noir', category: 'content', kind: 'story', theme: 'noir', name: 'Nocturne Timeline', desc: 'A candlelit timeline of the love story.' },
        { id: 'story-blush', category: 'content', kind: 'story', theme: 'blush', name: 'Petal Timeline', desc: 'A gentle garden timeline of milestones.' },
        { id: 'story-azure', category: 'content', kind: 'story', theme: 'azure', name: 'Tidal Timeline', desc: 'A crisp coastal timeline of your chapters.' },
        { id: 'story-ivory', category: 'content', kind: 'story', theme: 'ivory', name: 'Chapters', desc: 'Your story told like pages of a fine book.' },
        { id: 'story-arch-blush', category: 'content', kind: 'story', theme: 'blush', layout: 'arch', photos: true, name: 'Arched Chapters', desc: 'Milestone photographs in arched frames with script titles.' },
        { id: 'story-editorial-ivory', category: 'content', kind: 'story', theme: 'ivory', layout: 'editorial', photos: true, name: 'The Editorial Story', desc: 'Alternating monochrome photographs and prose.' },
        { id: 'story-chapters-dusk', category: 'content', kind: 'story', theme: 'dusk', layout: 'chapters', photos: true, name: 'Night Chapters', desc: 'Oversized numerals and photographs by lantern light.' },
        { id: 'story-terra', category: 'content', kind: 'story', theme: 'terra', name: 'Dust & Gold Trail', desc: 'Milestones along a sunset desert trail.' },
        { id: 'story-sage', category: 'content', kind: 'story', theme: 'sage', name: 'Growing Seasons', desc: 'A love story that blooms milestone by milestone.' },
        { id: 'story-royal', category: 'content', kind: 'story', theme: 'royal', name: 'Crown Timeline', desc: 'A stately timeline in emerald and gold.' },
        { id: 'story-chapters-royal', category: 'content', kind: 'story', theme: 'royal', layout: 'chapters', photos: true, name: 'Royal Chapters', desc: 'Gilded numerals and photographs, chapter by chapter.', exclusive: true },
        { id: 'story-chapters-noir', category: 'content', kind: 'story', theme: 'noir', layout: 'chapters', photos: true, name: 'Candlelit Chapters', desc: 'Oversized numerals and photographs after dark.' },
        { id: 'story-editorial-azure', category: 'content', kind: 'story', theme: 'azure', layout: 'editorial', photos: true, name: 'The Coastal Editorial', desc: 'Alternating photographs and prose, crisp as sea air.' },
        { id: 'story-arch-terra', category: 'content', kind: 'story', theme: 'terra', layout: 'arch', photos: true, name: 'Desert Arches', desc: 'Milestone photographs framed in sunset arches.' },
        { id: 'story-arch-sage', category: 'content', kind: 'story', theme: 'sage', layout: 'arch', photos: true, name: 'Garden Arches', desc: 'Arched milestone photographs wreathed in green.' },
        { id: 'story-arch-villa', category: 'content', kind: 'story', theme: 'villa', layout: 'arch', photos: true, name: 'Courtyard Arches', desc: 'Milestones framed in warm villa archways.' },

        /* ---- Mix & match: events ---- */
        { id: 'events-noir', category: 'content', kind: 'events', theme: 'noir', name: 'Evening Itinerary', desc: 'Black-tie ceremony & reception cards with maps.' },
        { id: 'events-blush', category: 'content', kind: 'events', theme: 'blush', name: 'Garden Itinerary', desc: 'Romantic event cards with venue details.' },
        { id: 'events-azure', category: 'content', kind: 'events', theme: 'azure', layout: 'rows', name: 'Coastal Schedule', desc: 'Minimal schedule rows for the wedding day.' },
        { id: 'events-terra', category: 'content', kind: 'events', theme: 'terra', name: 'Sunset Itinerary', desc: 'Warm, golden-hour ceremony & reception cards.' },
        { id: 'events-sage', category: 'content', kind: 'events', theme: 'sage', name: 'Garden Schedule', desc: 'Fresh green event cards with maps.' },
        { id: 'events-royal', category: 'content', kind: 'events', theme: 'royal', name: 'Royal Itinerary', desc: 'Formal gold-framed event cards.' },
        { id: 'events-cards-azure', category: 'content', kind: 'events', theme: 'azure', name: 'Harbour Itinerary', desc: 'Crisp coastal ceremony & reception cards.' },
        { id: 'events-ivory', category: 'content', kind: 'events', theme: 'ivory', name: 'The Programme', desc: 'Understated event cards in ivory and ink.' },
        { id: 'events-rows-ivory', category: 'content', kind: 'events', theme: 'ivory', layout: 'rows', name: 'The Order Of The Day', desc: 'A quiet ruled schedule, set like a fine menu.' },
        { id: 'events-rows-noir', category: 'content', kind: 'events', theme: 'noir', layout: 'rows', name: 'After-Dark Schedule', desc: 'A ruled evening schedule in champagne gold.' },
        { id: 'events-rows-blush', category: 'content', kind: 'events', theme: 'blush', layout: 'rows', name: 'Petal Schedule', desc: 'A soft ruled schedule of the wedding day.' },
        { id: 'events-rows-royal', category: 'content', kind: 'events', theme: 'royal', layout: 'rows', name: 'Court Programme', desc: 'The order of the day, ruled in gold.', exclusive: true },
        { id: 'events-rows-terra', category: 'content', kind: 'events', theme: 'terra', layout: 'rows', name: 'Sundown Schedule', desc: 'A warm ruled schedule for a golden day.' },
        { id: 'events-rows-sage', category: 'content', kind: 'events', theme: 'sage', layout: 'rows', name: 'Meadow Programme', desc: 'A fresh ruled schedule in eucalyptus green.' },
        { id: 'events-rows-dusk', category: 'content', kind: 'events', theme: 'dusk', layout: 'rows', name: 'Blue Hour Programme', desc: 'An evening schedule ruled in amber.' },
        { id: 'events-rows-villa', category: 'content', kind: 'events', theme: 'villa', layout: 'rows', name: 'Villa Programme', desc: 'The day’s order, ruled on warm plaster.' },

        /* ---- Mix & match: gallery ---- */
        { id: 'gallery-noir', category: 'content', kind: 'gallery', theme: 'noir', name: 'Dark Room Gallery', desc: 'Moody seamless photo grid.' },
        { id: 'gallery-blush', category: 'content', kind: 'gallery', theme: 'blush', name: 'Polaroid Wall', desc: 'Playful tilted polaroid collage.' },
        { id: 'gallery-azure', category: 'content', kind: 'gallery', theme: 'azure', name: 'Editorial Grid', desc: 'A clean magazine-style photo grid.' },
        { id: 'gallery-ivory', category: 'content', kind: 'gallery', theme: 'ivory', name: 'Monochrome Wall', desc: 'Black & white photographs, gallery-hung.' },
        { id: 'gallery-terra', category: 'content', kind: 'gallery', theme: 'terra', name: 'Adobe Collage', desc: 'Sun-baked tones in a warm collage.' },
        { id: 'gallery-royal', category: 'content', kind: 'gallery', theme: 'royal', name: 'Emerald Gallery', desc: 'A stately photo grid framed in gold.', exclusive: true },
        { id: 'gallery-sage', category: 'content', kind: 'gallery', theme: 'sage', name: 'Meadow Grid', desc: 'A fresh botanical photo grid.' },
        { id: 'gallery-dusk', category: 'content', kind: 'gallery', theme: 'dusk', name: 'Moonlit Grid', desc: 'Photographs glowing against the blue hour.' },
        { id: 'gallery-villa', category: 'content', kind: 'gallery', theme: 'villa', name: 'Courtyard Collage', desc: 'Warm photographs on sunlit plaster.' },
        { id: 'gallery-salon-noir', category: 'content', kind: 'gallery', theme: 'noir', layout: 'salon', name: 'Salon Noir', desc: 'A salon-hung wall of moody photographs.' },
        { id: 'gallery-salon-blush', category: 'content', kind: 'gallery', theme: 'blush', layout: 'salon', name: 'Rose Salon Wall', desc: 'An asymmetric keepsake wall in rosewater.' },
        { id: 'gallery-salon-azure', category: 'content', kind: 'gallery', theme: 'azure', layout: 'salon', name: 'Harbour Salon', desc: 'A clean salon wall — one grand portrait, one wide sea.' },
        { id: 'gallery-salon-royal', category: 'content', kind: 'gallery', theme: 'royal', layout: 'salon', name: 'The Royal Salon', desc: 'A gallery wall hung in emerald and gold.', exclusive: true },
        { id: 'gallery-salon-ivory', category: 'content', kind: 'gallery', theme: 'ivory', layout: 'salon', name: 'The Salon Wall', desc: 'An asymmetric monochrome gallery hang.' },
        { id: 'gallery-salon-terra', category: 'content', kind: 'gallery', theme: 'terra', layout: 'salon', name: 'Adobe Salon', desc: 'A sun-warmed salon wall with a caption tile.' },
        { id: 'gallery-salon-sage', category: 'content', kind: 'gallery', theme: 'sage', layout: 'salon', name: 'Garden Salon', desc: 'A botanical salon wall in morning light.' },
        { id: 'gallery-salon-dusk', category: 'content', kind: 'gallery', theme: 'dusk', layout: 'salon', name: 'Twilight Salon', desc: 'A salon wall lit by amber lanterns.' },
        { id: 'gallery-salon-villa', category: 'content', kind: 'gallery', theme: 'villa', layout: 'salon', name: 'Villa Salon', desc: 'A courtyard salon wall on warm plaster.' },

        /* ---- Mix & match: countdown ---- */
        { id: 'countdown-noir', category: 'content', kind: 'countdown', theme: 'noir', name: 'Midnight Countdown', desc: 'Live countdown in gilded frames.' },
        { id: 'countdown-azure', category: 'content', kind: 'countdown', theme: 'azure', name: 'Tide Countdown', desc: 'Live countdown on a breezy blue gradient.' },
        { id: 'countdown-blush', category: 'content', kind: 'countdown', theme: 'blush', name: 'Petal Countdown', desc: 'A soft rosy countdown to the big day.' },
        { id: 'countdown-sage', category: 'content', kind: 'countdown', theme: 'sage', name: 'Bloom Countdown', desc: 'Counting down amid morning greens.' },
        { id: 'countdown-royal', category: 'content', kind: 'countdown', theme: 'royal', name: 'Crown Countdown', desc: 'A live countdown framed in emerald and gold.' },
        { id: 'countdown-ivory', category: 'content', kind: 'countdown', theme: 'ivory', name: 'Quiet Countdown', desc: 'A minimal countdown in ivory and ink.' },
        { id: 'countdown-terra', category: 'content', kind: 'countdown', theme: 'terra', name: 'Sundown Countdown', desc: 'Counting down through golden light.' },
        { id: 'countdown-inline-noir', category: 'content', kind: 'countdown', theme: 'noir', layout: 'inline', name: 'The Midnight Date', desc: 'The date writ large, counting itself down.' },
        { id: 'countdown-inline-blush', category: 'content', kind: 'countdown', theme: 'blush', layout: 'inline', name: 'The Rose Date', desc: 'Oversized date numerals with a soft live count.' },
        { id: 'countdown-inline-azure', category: 'content', kind: 'countdown', theme: 'azure', layout: 'inline', name: 'The Seaside Date', desc: 'A crisp oversized date, counting down beneath.' },
        { id: 'countdown-inline-royal', category: 'content', kind: 'countdown', theme: 'royal', layout: 'inline', name: 'The Sovereign Date', desc: 'The date in towering gold, counted live.', exclusive: true },
        { id: 'countdown-inline-ivory', category: 'content', kind: 'countdown', theme: 'ivory', layout: 'inline', name: 'The Engraved Date', desc: 'The date set like an engraving, counting down.' },
        { id: 'countdown-inline-terra', category: 'content', kind: 'countdown', theme: 'terra', layout: 'inline', name: 'The Golden Date', desc: 'Sun-warmed numerals counting to the day.' },
        { id: 'countdown-inline-sage', category: 'content', kind: 'countdown', theme: 'sage', layout: 'inline', name: 'The Garden Date', desc: 'The date blooming large, counted gently down.' },
        { id: 'countdown-inline-dusk', category: 'content', kind: 'countdown', theme: 'dusk', layout: 'inline', name: 'The Twilight Date', desc: 'Amber numerals counting to the blue hour.' },
        { id: 'countdown-inline-villa', category: 'content', kind: 'countdown', theme: 'villa', layout: 'inline', name: 'The Villa Date', desc: 'The date in brick red, counting the afternoons.' },

        /* ---- Mix & match: rsvp ---- */
        { id: 'rsvp-noir', category: 'content', kind: 'rsvp', theme: 'noir', name: 'Velvet RSVP', desc: 'RSVP form and guest wishes, after dark.' },
        { id: 'rsvp-blush', category: 'content', kind: 'rsvp', theme: 'blush', name: 'Rosewater RSVP', desc: 'Sweet RSVP form with a wall of wishes.' },
        { id: 'rsvp-azure', category: 'content', kind: 'rsvp', theme: 'azure', name: 'Seaside RSVP', desc: 'A crisp, modern RSVP and wish wall.' },
        { id: 'rsvp-terra', category: 'content', kind: 'rsvp', theme: 'terra', name: 'Fireside RSVP', desc: 'A warm, welcoming RSVP corner.' },
        { id: 'rsvp-sage', category: 'content', kind: 'rsvp', theme: 'sage', name: 'Greenhouse RSVP', desc: 'RSVP among the leaves, with guest wishes.' },
        { id: 'rsvp-royal', category: 'content', kind: 'rsvp', theme: 'royal', name: 'Royal RSVP', desc: 'A formal RSVP and wish wall in emerald.' },
        { id: 'rsvp-ivory', category: 'content', kind: 'rsvp', theme: 'ivory', name: 'Porcelain RSVP', desc: 'A quiet, minimal RSVP with guest wishes.' },
        { id: 'rsvp-card-noir', category: 'content', kind: 'rsvp', theme: 'noir', layout: 'card', name: 'Velvet Reply Card', desc: 'A stationery reply card, after dark.' },
        { id: 'rsvp-card-blush', category: 'content', kind: 'rsvp', theme: 'blush', layout: 'card', name: 'Rosewater Reply Card', desc: 'A monogrammed reply card in rose.' },
        { id: 'rsvp-card-azure', category: 'content', kind: 'rsvp', theme: 'azure', layout: 'card', name: 'Seaside Reply Card', desc: 'A crisp ruled reply card with wishes below.' },
        { id: 'rsvp-card-royal', category: 'content', kind: 'rsvp', theme: 'royal', layout: 'card', name: 'Sovereign Reply Card', desc: 'A gold-ruled reply card fit for court.', exclusive: true },
        { id: 'rsvp-card-ivory', category: 'content', kind: 'rsvp', theme: 'ivory', layout: 'card', name: 'The Reply Card', desc: 'Fine stationery: monogram, rules, reply-by line.' },
        { id: 'rsvp-card-terra', category: 'content', kind: 'rsvp', theme: 'terra', layout: 'card', name: 'Clay Reply Card', desc: 'A warm reply card in clay and sand.' },
        { id: 'rsvp-card-sage', category: 'content', kind: 'rsvp', theme: 'sage', layout: 'card', name: 'Garden Reply Card', desc: 'A botanical reply card with a wish wall.' },
        { id: 'rsvp-card-dusk', category: 'content', kind: 'rsvp', theme: 'dusk', layout: 'card', name: 'Lantern Reply Card', desc: 'An evening reply card ruled in amber.' },
        { id: 'rsvp-card-villa', category: 'content', kind: 'rsvp', theme: 'villa', layout: 'card', name: 'Courtyard Reply Card', desc: 'A plaster-white reply card sealed in brick.' },

        /* ---- Mix & match: quote ---- */
        { id: 'quote-royal', category: 'content', kind: 'quote', theme: 'royal', name: 'Sovereign Verse', desc: 'A formal verse set in gold on emerald.' },
        { id: 'quote-noir', category: 'content', kind: 'quote', theme: 'noir', name: 'Midnight Verse', desc: 'A verse glowing softly in the dark.' },
        { id: 'quote-ivory', category: 'content', kind: 'quote', theme: 'ivory', name: 'Engraved Verse', desc: 'Words set like an engraving on porcelain.' },
        { id: 'quote-sage', category: 'content', kind: 'quote', theme: 'sage', name: 'Pressed Verse', desc: 'A quiet verse pressed between leaves.' },
        { id: 'quote-blush', category: 'content', kind: 'quote', theme: 'blush', name: 'Petal Verse', desc: 'A tender verse set among rosewater tones.' },
        { id: 'quote-azure', category: 'content', kind: 'quote', theme: 'azure', name: 'Tide Verse', desc: 'A crisp verse, clean as morning sea air.' },
        { id: 'quote-terra', category: 'content', kind: 'quote', theme: 'terra', name: 'Sunset Verse', desc: 'A verse glowing in clay and golden light.' },
        { id: 'quote-dusk', category: 'content', kind: 'quote', theme: 'dusk', name: 'Twilight Verse', desc: 'A verse in amber on midnight blue.' },
        { id: 'quote-photo-noir', category: 'content', kind: 'quote', theme: 'noir', layout: 'photo', name: 'Verse After Dark', desc: 'Your verse floating over a dimmed photograph.' },
        { id: 'quote-photo-blush', category: 'content', kind: 'quote', theme: 'blush', layout: 'photo', name: 'Verse Among Roses', desc: 'A verse over a photograph, veiled in rose.' },
        { id: 'quote-photo-azure', category: 'content', kind: 'quote', theme: 'azure', layout: 'photo', name: 'Verse On The Water', desc: 'A verse drifting over a sea-toned photograph.' },
        { id: 'quote-photo-royal', category: 'content', kind: 'quote', theme: 'royal', layout: 'photo', name: 'Verse In Gold', desc: 'Gold lettering over an emerald-veiled photograph.', exclusive: true },
        { id: 'quote-photo-ivory', category: 'content', kind: 'quote', theme: 'ivory', layout: 'photo', name: 'Verse On Silver', desc: 'A verse over a monochrome photograph.' },
        { id: 'quote-photo-terra', category: 'content', kind: 'quote', theme: 'terra', layout: 'photo', name: 'Verse At Sundown', desc: 'A verse over a photograph washed in gold.' },
        { id: 'quote-photo-sage', category: 'content', kind: 'quote', theme: 'sage', layout: 'photo', name: 'Verse In The Meadow', desc: 'A verse over a photograph veiled in green.' },
        { id: 'quote-photo-dusk', category: 'content', kind: 'quote', theme: 'dusk', layout: 'photo', name: 'Verse In The Blue Hour', desc: 'A verse over a twilight photograph.' },
        { id: 'quote-photo-villa', category: 'content', kind: 'quote', theme: 'villa', layout: 'photo', name: 'Verse On Plaster', desc: 'A verse over a photograph, warm as the courtyard.' },

        /* ---- Mix & match: gift ---- */
        { id: 'gift-royal', category: 'content', kind: 'gift', theme: 'royal', name: 'Royal Registry', desc: 'Digital gift envelopes with copyable accounts.' },
        { id: 'gift-noir', category: 'content', kind: 'gift', theme: 'noir', name: 'Gilded Envelopes', desc: 'Elegant after-dark digital envelopes.' },
        { id: 'gift-blush', category: 'content', kind: 'gift', theme: 'blush', name: 'Rosewater Registry', desc: 'Soft-toned digital gift envelopes.' },
        { id: 'gift-terra', category: 'content', kind: 'gift', theme: 'terra', name: 'Clay Envelopes', desc: 'Warm terracotta digital envelopes.' },
        { id: 'gift-azure', category: 'content', kind: 'gift', theme: 'azure', name: 'Seaside Envelopes', desc: 'Crisp digital envelopes in coastal blue.' },
        { id: 'gift-ivory', category: 'content', kind: 'gift', theme: 'ivory', name: 'Quiet Envelopes', desc: 'Minimal digital envelopes in ivory and ink.' },
        { id: 'gift-sage', category: 'content', kind: 'gift', theme: 'sage', name: 'Garden Envelopes', desc: 'Digital envelopes tucked among the leaves.' },
        { id: 'gift-dusk', category: 'content', kind: 'gift', theme: 'dusk', name: 'Lantern Envelopes', desc: 'Evening digital envelopes glowing amber.' },
        { id: 'gift-villa', category: 'content', kind: 'gift', theme: 'villa', name: 'Courtyard Envelopes', desc: 'Digital envelopes in plaster and brick.' },
        { id: 'gift-ledger-noir', category: 'content', kind: 'gift', theme: 'noir', layout: 'ledger', name: 'Gilded Ledger', desc: 'One elegant registry card, ruled in gold.' },
        { id: 'gift-ledger-blush', category: 'content', kind: 'gift', theme: 'blush', layout: 'ledger', name: 'Rosewater Ledger', desc: 'A single soft registry card with fine rules.' },
        { id: 'gift-ledger-azure', category: 'content', kind: 'gift', theme: 'azure', layout: 'ledger', name: 'Harbour Ledger', desc: 'A clean single-card registry with copy buttons.' },
        { id: 'gift-ledger-royal', category: 'content', kind: 'gift', theme: 'royal', layout: 'ledger', name: 'The Royal Ledger', desc: 'A stately registry ledger ruled in gold.', exclusive: true },
        { id: 'gift-ledger-ivory', category: 'content', kind: 'gift', theme: 'ivory', layout: 'ledger', name: 'The Ivory Ledger', desc: 'A quiet single-card registry, finely ruled.' },
        { id: 'gift-ledger-terra', category: 'content', kind: 'gift', theme: 'terra', layout: 'ledger', name: 'Clay Ledger', desc: 'A warm registry ledger in clay and sand.' },
        { id: 'gift-ledger-sage', category: 'content', kind: 'gift', theme: 'sage', layout: 'ledger', name: 'Meadow Ledger', desc: 'A botanical registry ledger with fine rules.' },
        { id: 'gift-ledger-dusk', category: 'content', kind: 'gift', theme: 'dusk', layout: 'ledger', name: 'Twilight Ledger', desc: 'An evening registry ledger ruled in amber.' },
        { id: 'gift-ledger-villa', category: 'content', kind: 'gift', theme: 'villa', layout: 'ledger', name: 'Villa Ledger', desc: 'A courtyard registry ledger on warm plaster.' },

        /* ---- Mix & match: attire (dress code) ---- */
        { id: 'attire-noir', category: 'content', kind: 'attire', theme: 'noir', name: 'Black Tie Board', desc: 'Dress code card with a suggested colour palette.' },
        { id: 'attire-blush', category: 'content', kind: 'attire', theme: 'blush', name: 'Garden Dress Code', desc: 'Soft attire guidance with rosy palette dots.' },
        { id: 'attire-ivory', category: 'content', kind: 'attire', theme: 'ivory', name: 'The Dress Code', desc: 'Understated attire card in ivory and ink.' },
        { id: 'attire-sage', category: 'content', kind: 'attire', theme: 'sage', name: 'Garden Party Code', desc: 'Botanical attire card with leafy palette.' },
        { id: 'attire-azure', category: 'content', kind: 'attire', theme: 'azure', name: 'Coastal Dress Code', desc: 'A breezy attire card with sea-glass palette dots.' },
        { id: 'attire-royal', category: 'content', kind: 'attire', theme: 'royal', name: 'Court Dress Code', desc: 'Formal attire guidance in emerald and gold.', exclusive: true },
        { id: 'attire-terra', category: 'content', kind: 'attire', theme: 'terra', name: 'Desert Dress Code', desc: 'Warm attire guidance with sunset palette dots.' },
        { id: 'attire-dusk', category: 'content', kind: 'attire', theme: 'dusk', name: 'Evening Dress Code', desc: 'Attire guidance for the blue hour, dotted in amber.' },
        { id: 'attire-villa', category: 'content', kind: 'attire', theme: 'villa', name: 'Villa Dress Code', desc: 'Attire guidance in plaster, clay and brick.' },
        { id: 'attire-runway-noir', category: 'content', kind: 'attire', theme: 'noir', layout: 'runway', name: 'Midnight Runway', desc: 'Tall fabric-swatch bars under a black-tie headline.' },
        { id: 'attire-runway-blush', category: 'content', kind: 'attire', theme: 'blush', layout: 'runway', name: 'Rose Runway', desc: 'Rosewater swatch bars beneath the dress code.' },
        { id: 'attire-runway-azure', category: 'content', kind: 'attire', theme: 'azure', layout: 'runway', name: 'Seaside Runway', desc: 'Sea-toned swatch bars under a crisp headline.' },
        { id: 'attire-runway-royal', category: 'content', kind: 'attire', theme: 'royal', layout: 'runway', name: 'Royal Runway', desc: 'Emerald and gold swatch bars, set formally.', exclusive: true },
        { id: 'attire-runway-ivory', category: 'content', kind: 'attire', theme: 'ivory', layout: 'runway', name: 'Ivory Runway', desc: 'Quiet neutral swatch bars beneath fine type.' },
        { id: 'attire-runway-terra', category: 'content', kind: 'attire', theme: 'terra', layout: 'runway', name: 'Terracotta Runway', desc: 'Sunset swatch bars under a golden headline.' },
        { id: 'attire-runway-sage', category: 'content', kind: 'attire', theme: 'sage', layout: 'runway', name: 'Sage Runway', desc: 'Leafy swatch bars beneath the garden dress code.' },
        { id: 'attire-runway-dusk', category: 'content', kind: 'attire', theme: 'dusk', layout: 'runway', name: 'Dusk Runway', desc: 'Twilight swatch bars glowing under amber type.' },
        { id: 'attire-runway-villa', category: 'content', kind: 'attire', theme: 'villa', layout: 'runway', name: 'Courtyard Runway', desc: 'Plaster-and-brick swatch bars, sunlit.' },

        /* ---- Mix & match: faq ---- */
        { id: 'faq-azure', category: 'content', kind: 'faq', theme: 'azure', name: 'Guest Handbook', desc: 'Answers to the questions guests always ask.' },
        { id: 'faq-ivory', category: 'content', kind: 'faq', theme: 'ivory', name: 'The Fine Print', desc: 'A minimal, elegant Q&A for your guests.' },
        { id: 'faq-noir', category: 'content', kind: 'faq', theme: 'noir', name: 'Midnight Q & A', desc: 'Guest questions answered, after dark.' },
        { id: 'faq-blush', category: 'content', kind: 'faq', theme: 'blush', name: 'Garden Q & A', desc: 'Soft, folding answers for your guests.' },
        { id: 'faq-royal', category: 'content', kind: 'faq', theme: 'royal', name: 'Court Q & A', desc: 'A formal folding Q&A in emerald and gold.', exclusive: true },
        { id: 'faq-terra', category: 'content', kind: 'faq', theme: 'terra', name: 'Desert Q & A', desc: 'Warm folding answers in clay and sand.' },
        { id: 'faq-sage', category: 'content', kind: 'faq', theme: 'sage', name: 'Meadow Q & A', desc: 'Folding answers among the greens.' },
        { id: 'faq-dusk', category: 'content', kind: 'faq', theme: 'dusk', name: 'Evening Q & A', desc: 'Folding answers lit by amber lanterns.' },
        { id: 'faq-villa', category: 'content', kind: 'faq', theme: 'villa', name: 'Villa Q & A', desc: 'Folding answers on sunlit plaster.' },
        { id: 'faq-grid-noir', category: 'content', kind: 'faq', theme: 'noir', layout: 'grid', name: 'Answers After Dark', desc: 'Numbered answer cards, every one open.' },
        { id: 'faq-grid-blush', category: 'content', kind: 'faq', theme: 'blush', layout: 'grid', name: 'Petal Answers', desc: 'Numbered open answer cards in rose.' },
        { id: 'faq-grid-azure', category: 'content', kind: 'faq', theme: 'azure', layout: 'grid', name: 'The Open Handbook', desc: 'Every answer laid out in a crisp spread.' },
        { id: 'faq-grid-royal', category: 'content', kind: 'faq', theme: 'royal', layout: 'grid', name: 'The Royal Compendium', desc: 'Gilded numbered answers, all in view.', exclusive: true },
        { id: 'faq-grid-ivory', category: 'content', kind: 'faq', theme: 'ivory', layout: 'grid', name: 'The Open Fine Print', desc: 'A numbered editorial spread of answers.' },
        { id: 'faq-grid-terra', category: 'content', kind: 'faq', theme: 'terra', layout: 'grid', name: 'Sunset Answers', desc: 'Numbered open answers in golden tones.' },
        { id: 'faq-grid-sage', category: 'content', kind: 'faq', theme: 'sage', layout: 'grid', name: 'Garden Answers', desc: 'Numbered open answer cards in green.' },
        { id: 'faq-grid-dusk', category: 'content', kind: 'faq', theme: 'dusk', layout: 'grid', name: 'Twilight Answers', desc: 'Numbered answers glowing at dusk.' },
        { id: 'faq-grid-villa', category: 'content', kind: 'faq', theme: 'villa', layout: 'grid', name: 'Courtyard Answers', desc: 'Numbered open answers on warm plaster.' },

        /* ---- Mix & match: travel ---- */
        { id: 'travel-azure', category: 'content', kind: 'travel', theme: 'azure', name: 'Getting There', desc: 'Flights, transport and stay tips for guests.' },
        { id: 'travel-terra', category: 'content', kind: 'travel', theme: 'terra', name: 'Desert Directions', desc: 'Warm-toned travel and accommodation cards.' },
        { id: 'travel-noir', category: 'content', kind: 'travel', theme: 'noir', name: 'Night Arrivals', desc: 'Travel and stay cards for the evening guest.' },
        { id: 'travel-blush', category: 'content', kind: 'travel', theme: 'blush', name: 'Garden Directions', desc: 'Soft travel and accommodation cards.' },
        { id: 'travel-royal', category: 'content', kind: 'travel', theme: 'royal', name: 'Royal Passage', desc: 'Stately travel cards in emerald and gold.', exclusive: true },
        { id: 'travel-ivory', category: 'content', kind: 'travel', theme: 'ivory', name: 'Quiet Directions', desc: 'Minimal travel and stay cards in ivory.' },
        { id: 'travel-sage', category: 'content', kind: 'travel', theme: 'sage', name: 'Meadow Directions', desc: 'Fresh green travel and stay cards.' },
        { id: 'travel-dusk', category: 'content', kind: 'travel', theme: 'dusk', name: 'Evening Arrivals', desc: 'Travel and stay cards for the blue hour.' },
        { id: 'travel-villa', category: 'content', kind: 'travel', theme: 'villa', name: 'Roads To The Villa', desc: 'Warm travel cards on sunlit plaster.' },
        { id: 'travel-route-noir', category: 'content', kind: 'travel', theme: 'noir', layout: 'route', name: 'The Midnight Route', desc: 'A journey line with stops, drawn after dark.' },
        { id: 'travel-route-blush', category: 'content', kind: 'travel', theme: 'blush', layout: 'route', name: 'The Rose Route', desc: 'A gentle journey line from door to dance floor.' },
        { id: 'travel-route-azure', category: 'content', kind: 'travel', theme: 'azure', layout: 'route', name: 'The Coastal Route', desc: 'A crisp itinerary line with travel stops.' },
        { id: 'travel-route-royal', category: 'content', kind: 'travel', theme: 'royal', layout: 'route', name: 'The Royal Route', desc: 'A gilded journey line with formal stops.', exclusive: true },
        { id: 'travel-route-ivory', category: 'content', kind: 'travel', theme: 'ivory', layout: 'route', name: 'The Quiet Route', desc: 'A minimal journey line in ivory and ink.' },
        { id: 'travel-route-terra', category: 'content', kind: 'travel', theme: 'terra', layout: 'route', name: 'The Desert Route', desc: 'A sunset trail with stops along the way.' },
        { id: 'travel-route-sage', category: 'content', kind: 'travel', theme: 'sage', layout: 'route', name: 'The Meadow Route', desc: 'A leafy journey line, stop by stop.' },
        { id: 'travel-route-dusk', category: 'content', kind: 'travel', theme: 'dusk', layout: 'route', name: 'The Twilight Route', desc: 'An amber journey line through the evening.' },
        { id: 'travel-route-villa', category: 'content', kind: 'travel', theme: 'villa', layout: 'route', name: 'The Villa Route', desc: 'A warm journey line winding to the courtyard.' },

        /* ---- Mix & match: dusk theme set ---- */
        { id: 'couple-dusk', category: 'content', kind: 'couple', theme: 'dusk', name: 'Evening Introductions', desc: 'Bride & groom in amber on midnight blue.' },
        { id: 'story-dusk', category: 'content', kind: 'story', theme: 'dusk', name: 'Twilight Timeline', desc: 'A love story told by lantern light.' },
        { id: 'events-dusk', category: 'content', kind: 'events', theme: 'dusk', name: 'Evening Programme', desc: 'Ceremony & reception cards for a night celebration.' },
        { id: 'countdown-dusk', category: 'content', kind: 'countdown', theme: 'dusk', name: 'Til Dark Countdown', desc: 'Amber numerals counting to the blue hour.' },
        { id: 'rsvp-dusk', category: 'content', kind: 'rsvp', theme: 'dusk', name: 'Lantern RSVP', desc: 'A warm evening RSVP with guest wishes.' },

        /* ---- Mix & match: Villa Amara set ---- */
        { id: 'couple-villa', category: 'content', kind: 'couple', theme: 'villa', name: 'Courtyard Portraits', desc: 'Bride & groom portraits against warm brick.' },
        { id: 'story-villa', category: 'content', kind: 'story', theme: 'villa', layout: 'editorial', photos: true, storyImgs: ['bride-and-groom-2-2', 'bride-2', 'groom-2'], name: 'Courtyard Letters', desc: 'Their chapters told in sun-washed editorial rows.' },
        { id: 'quote-villa', category: 'content', kind: 'quote', theme: 'villa', name: 'Terracotta Verse', desc: 'A verse set in brick red on warm plaster.' },
        { id: 'events-villa', category: 'content', kind: 'events', theme: 'villa', name: 'Villa Itinerary', desc: 'Ceremony & reception cards in plaster and brick.' },
        { id: 'countdown-villa', category: 'content', kind: 'countdown', theme: 'villa', name: 'Siesta Countdown', desc: 'Counting down through golden afternoons.' },
        { id: 'rsvp-villa', category: 'content', kind: 'rsvp', theme: 'villa', name: 'Courtyard RSVP', desc: 'A warm RSVP corner with guest wishes.' },

        /* ---- Mix & match: wedding party ---- */
        { id: 'party-blush', category: 'content', kind: 'party', theme: 'blush', name: 'Garden Entourage', desc: 'Bridesmaids & groomsmen in soft rosewater.' },
        { id: 'party-noir', category: 'content', kind: 'party', theme: 'noir', name: 'The Black-Tie Party', desc: 'Your wedding party, after dark.' },
        { id: 'party-sage', category: 'content', kind: 'party', theme: 'sage', name: 'Meadow Entourage', desc: 'The people standing with you, in green.' },
        { id: 'party-azure', category: 'content', kind: 'party', theme: 'azure', name: 'Seaside Entourage', desc: 'Your wedding party, crisp and coastal.' },
        { id: 'party-royal', category: 'content', kind: 'party', theme: 'royal', name: 'The Royal Court', desc: 'Your party presented in emerald and gold.', exclusive: true },
        { id: 'party-ivory', category: 'content', kind: 'party', theme: 'ivory', name: 'Quiet Entourage', desc: 'A minimal roll of your closest people.' },
        { id: 'party-terra', category: 'content', kind: 'party', theme: 'terra', name: 'Sunset Entourage', desc: 'Your party, warm in clay and gold.' },
        { id: 'party-dusk', category: 'content', kind: 'party', theme: 'dusk', name: 'Evening Entourage', desc: 'The party beside you at the blue hour.' },
        { id: 'party-villa', category: 'content', kind: 'party', theme: 'villa', name: 'Courtyard Entourage', desc: 'Your party gathered on warm plaster.' },
        { id: 'party-roll-noir', category: 'content', kind: 'party', theme: 'noir', layout: 'roll', name: 'Midnight Roll Call', desc: 'A centred roll call of your favourite people.' },
        { id: 'party-roll-blush', category: 'content', kind: 'party', theme: 'blush', layout: 'roll', name: 'Rose Roll Call', desc: 'Names flowing gently down the page.' },
        { id: 'party-roll-azure', category: 'content', kind: 'party', theme: 'azure', layout: 'roll', name: 'Seaside Roll Call', desc: 'A clean centred roll of the wedding party.' },
        { id: 'party-roll-royal', category: 'content', kind: 'party', theme: 'royal', layout: 'roll', name: 'The Court Roll', desc: 'A formal roll call announced in gold.', exclusive: true },
        { id: 'party-roll-ivory', category: 'content', kind: 'party', theme: 'ivory', layout: 'roll', name: 'The Roll Call', desc: 'An editorial roll of names in fine serif.' },
        { id: 'party-roll-terra', category: 'content', kind: 'party', theme: 'terra', layout: 'roll', name: 'Golden Roll Call', desc: 'Names glowing warm, side by side.' },
        { id: 'party-roll-sage', category: 'content', kind: 'party', theme: 'sage', layout: 'roll', name: 'Meadow Roll Call', desc: 'A leafy centred roll of your people.' },
        { id: 'party-roll-dusk', category: 'content', kind: 'party', theme: 'dusk', layout: 'roll', name: 'Lantern Roll Call', desc: 'Names lit softly against the evening.' },
        { id: 'party-roll-villa', category: 'content', kind: 'party', theme: 'villa', layout: 'roll', name: 'Villa Roll Call', desc: 'A courtyard roll call in brick and plaster.' },

        /* ---- Mix & match: live stream ---- */
        { id: 'stream-azure', category: 'content', kind: 'stream', theme: 'azure', name: 'Watch From Afar', desc: 'A live-stream card for faraway guests.' },
        { id: 'stream-noir', category: 'content', kind: 'stream', theme: 'noir', name: 'Midnight Broadcast', desc: 'An elegant livestream invitation card.' },
        { id: 'stream-blush', category: 'content', kind: 'stream', theme: 'blush', name: 'Garden Broadcast', desc: 'A soft livestream card for faraway loved ones.' },
        { id: 'stream-royal', category: 'content', kind: 'stream', theme: 'royal', name: 'Royal Broadcast', desc: 'A stately livestream invitation in gold.', exclusive: true },
        { id: 'stream-ivory', category: 'content', kind: 'stream', theme: 'ivory', name: 'Quiet Broadcast', desc: 'A minimal livestream card in ivory.' },
        { id: 'stream-terra', category: 'content', kind: 'stream', theme: 'terra', name: 'Sunset Broadcast', desc: 'A warm livestream card in clay tones.' },
        { id: 'stream-sage', category: 'content', kind: 'stream', theme: 'sage', name: 'Meadow Broadcast', desc: 'A fresh green livestream invitation.' },
        { id: 'stream-dusk', category: 'content', kind: 'stream', theme: 'dusk', name: 'Twilight Broadcast', desc: 'An amber livestream card for the blue hour.' },
        { id: 'stream-villa', category: 'content', kind: 'stream', theme: 'villa', name: 'Villa Broadcast', desc: 'A courtyard livestream card in brick red.' },
        { id: 'stream-theatre-noir', category: 'content', kind: 'stream', theme: 'noir', layout: 'theatre', name: 'Midnight Theatre', desc: 'A cinema screen with a glowing play button.' },
        { id: 'stream-theatre-blush', category: 'content', kind: 'stream', theme: 'blush', layout: 'theatre', name: 'Rose Theatre', desc: 'A soft picture-house screen for the stream.' },
        { id: 'stream-theatre-azure', category: 'content', kind: 'stream', theme: 'azure', layout: 'theatre', name: 'Harbour Theatre', desc: 'A crisp cinema screen for faraway guests.' },
        { id: 'stream-theatre-royal', category: 'content', kind: 'stream', theme: 'royal', layout: 'theatre', name: 'The Royal Theatre', desc: 'A gilded screen for the live broadcast.', exclusive: true },
        { id: 'stream-theatre-ivory', category: 'content', kind: 'stream', theme: 'ivory', layout: 'theatre', name: 'The Picture House', desc: 'A monochrome screen with a quiet play button.' },
        { id: 'stream-theatre-terra', category: 'content', kind: 'stream', theme: 'terra', layout: 'theatre', name: 'Sunset Theatre', desc: 'A golden-hour screen for the stream.' },
        { id: 'stream-theatre-sage', category: 'content', kind: 'stream', theme: 'sage', layout: 'theatre', name: 'Garden Theatre', desc: 'An open-air screen among the greens.' },
        { id: 'stream-theatre-dusk', category: 'content', kind: 'stream', theme: 'dusk', layout: 'theatre', name: 'Blue Hour Theatre', desc: 'A twilight screen with an amber play button.' },
        { id: 'stream-theatre-villa', category: 'content', kind: 'stream', theme: 'villa', layout: 'theatre', name: 'Courtyard Cinema', desc: 'A warm plaster screen for the broadcast.' },

        /* ---- Mix & match: photo strip ---- */
        { id: 'filmstrip-ivory', category: 'content', kind: 'filmstrip', theme: 'ivory', name: 'The Contact Sheet', desc: 'A slow-drifting monochrome film strip.' },
        { id: 'filmstrip-terra', category: 'content', kind: 'filmstrip', theme: 'terra', name: 'Golden Reel', desc: 'A warm, endless ribbon of photographs.' },
        { id: 'filmstrip-dusk', category: 'content', kind: 'filmstrip', theme: 'dusk', name: 'Night Reel', desc: 'Photographs drifting through the blue hour.' },
        { id: 'filmstrip-noir', category: 'content', kind: 'filmstrip', theme: 'noir', name: 'Darkroom Reel', desc: 'A moody ribbon of photographs, after dark.' },
        { id: 'filmstrip-blush', category: 'content', kind: 'filmstrip', theme: 'blush', name: 'Petal Reel', desc: 'A soft drifting ribbon of photographs.' },
        { id: 'filmstrip-azure', category: 'content', kind: 'filmstrip', theme: 'azure', name: 'Seaside Reel', desc: 'A breezy drifting strip of photographs.' },
        { id: 'filmstrip-royal', category: 'content', kind: 'filmstrip', theme: 'royal', name: 'Royal Reel', desc: 'A stately ribbon of photographs in emerald.', exclusive: true },
        { id: 'filmstrip-sage', category: 'content', kind: 'filmstrip', theme: 'sage', name: 'Meadow Reel', desc: 'Photographs drifting through morning green.' },
        { id: 'filmstrip-villa', category: 'content', kind: 'filmstrip', theme: 'villa', name: 'Courtyard Reel', desc: 'A warm ribbon of photographs on plaster.' },
        { id: 'filmstrip-double-noir', category: 'content', kind: 'filmstrip', theme: 'noir', layout: 'double', name: 'Midnight Double Reel', desc: 'Two reels winding past each other in the dark.' },
        { id: 'filmstrip-double-blush', category: 'content', kind: 'filmstrip', theme: 'blush', layout: 'double', name: 'Rose Double Reel', desc: 'Twin photo reels drifting in opposite directions.' },
        { id: 'filmstrip-double-azure', category: 'content', kind: 'filmstrip', theme: 'azure', layout: 'double', name: 'Tide & Counter-Tide', desc: 'Two photo currents flowing past each other.' },
        { id: 'filmstrip-double-royal', category: 'content', kind: 'filmstrip', theme: 'royal', layout: 'double', name: 'The Royal Double Reel', desc: 'Twin gilded reels in counter-motion.', exclusive: true },
        { id: 'filmstrip-double-ivory', category: 'content', kind: 'filmstrip', theme: 'ivory', layout: 'double', name: 'The Double Contact Sheet', desc: 'Two monochrome strips winding opposite ways.' },
        { id: 'filmstrip-double-terra', category: 'content', kind: 'filmstrip', theme: 'terra', layout: 'double', name: 'Golden Double Reel', desc: 'Twin sun-warmed reels drifting apart.' },
        { id: 'filmstrip-double-sage', category: 'content', kind: 'filmstrip', theme: 'sage', layout: 'double', name: 'Meadow Double Reel', desc: 'Two green-tinted reels in counter-flow.' },
        { id: 'filmstrip-double-dusk', category: 'content', kind: 'filmstrip', theme: 'dusk', layout: 'double', name: 'Twilight Double Reel', desc: 'Twin reels drifting through the blue hour.' },
        { id: 'filmstrip-double-villa', category: 'content', kind: 'filmstrip', theme: 'villa', layout: 'double', name: 'Villa Double Reel', desc: 'Two warm reels winding past the courtyard.' },

        /* ---- Mix & match: monogram divider ---- */
        { id: 'divider-ivory', category: 'content', kind: 'divider', theme: 'ivory', name: 'Porcelain Seal', desc: 'A quiet monogram breath between chapters.' },
        { id: 'divider-sage', category: 'content', kind: 'divider', theme: 'sage', name: 'Leaf & Letter', desc: 'A botanical monogram divider.' },
        { id: 'divider-royal', category: 'content', kind: 'divider', theme: 'royal', name: 'Royal Seal', desc: 'A gold crest divider on emerald.', exclusive: true },
        { id: 'divider-noir', category: 'content', kind: 'divider', theme: 'noir', name: 'Midnight Seal', desc: 'A gilded monogram breath in the dark.' },
        { id: 'divider-blush', category: 'content', kind: 'divider', theme: 'blush', name: 'Petal Seal', desc: 'A rosewater monogram divider.' },
        { id: 'divider-azure', category: 'content', kind: 'divider', theme: 'azure', name: 'Seaside Seal', desc: 'A crisp monogram pause between chapters.' },
        { id: 'divider-terra', category: 'content', kind: 'divider', theme: 'terra', name: 'Clay Seal', desc: 'A warm monogram divider in sunset tones.' },
        { id: 'divider-dusk', category: 'content', kind: 'divider', theme: 'dusk', name: 'Twilight Seal', desc: 'An amber monogram breath at dusk.' },
        { id: 'divider-villa', category: 'content', kind: 'divider', theme: 'villa', name: 'Villa Seal', desc: 'A brick-red monogram divider on plaster.' },
        { id: 'divider-crest-noir', category: 'content', kind: 'divider', theme: 'noir', layout: 'crest', name: 'Midnight Crest', desc: 'Initials sealed in a gilded diamond.' },
        { id: 'divider-crest-blush', category: 'content', kind: 'divider', theme: 'blush', layout: 'crest', name: 'Rose Crest', desc: 'A diamond crest in rosewater, dated beneath.' },
        { id: 'divider-crest-azure', category: 'content', kind: 'divider', theme: 'azure', layout: 'crest', name: 'Harbour Crest', desc: 'A crisp diamond crest with the wedding date.' },
        { id: 'divider-crest-royal', category: 'content', kind: 'divider', theme: 'royal', layout: 'crest', name: 'Sovereign Crest', desc: 'A gold diamond crest on deep emerald.', exclusive: true },
        { id: 'divider-crest-ivory', category: 'content', kind: 'divider', theme: 'ivory', layout: 'crest', name: 'Porcelain Crest', desc: 'A fine diamond crest in ivory and ink.' },
        { id: 'divider-crest-terra', category: 'content', kind: 'divider', theme: 'terra', layout: 'crest', name: 'Terracotta Crest', desc: 'A sun-warmed diamond crest, dated beneath.' },
        { id: 'divider-crest-sage', category: 'content', kind: 'divider', theme: 'sage', layout: 'crest', name: 'Meadow Crest', desc: 'A leafy diamond crest with the date.' },
        { id: 'divider-crest-dusk', category: 'content', kind: 'divider', theme: 'dusk', layout: 'crest', name: 'Amber Crest', desc: 'A glowing diamond crest at the blue hour.' },
        { id: 'divider-crest-villa', category: 'content', kind: 'divider', theme: 'villa', layout: 'crest', name: 'Courtyard Crest', desc: 'A brick-red diamond crest on plaster.' },

        /* ---- Outro pages ---- */
        { id: 'outro-noir', category: 'outro', kind: 'outro', theme: 'noir', name: 'Final Bow', desc: 'A cinematic thank-you over a dimmed photograph.' },
        { id: 'outro-blush', category: 'outro', kind: 'outro', theme: 'blush', name: 'Petal Farewell', desc: 'A soft script thank-you strewn with petals.' },
        { id: 'outro-azure', category: 'outro', kind: 'outro', theme: 'azure', name: 'Horizon Farewell', desc: 'A minimal goodbye with the wedding hashtag.' },
        { id: 'outro-royal', category: 'outro', kind: 'outro', theme: 'royal', name: 'Crest Farewell', desc: 'A stately farewell beneath the monogram crest.' },
        { id: 'outro-ivory', category: 'outro', kind: 'outro', theme: 'ivory', name: 'The Last Page', desc: 'A closing line, set like the end of a novel.' },
        { id: 'outro-terra', category: 'outro', kind: 'outro', theme: 'terra', name: 'After Sundown', desc: 'A glowing goodbye as the sun slips away.' },
        { id: 'outro-sage', category: 'outro', kind: 'outro', theme: 'sage', name: 'Evergreen Farewell', desc: 'A framed botanical thank-you.' },
        { id: 'outro-dusk', category: 'outro', kind: 'outro', theme: 'dusk', name: 'Into The Gold', desc: 'A farewell over a golden-field photograph.' },
        { id: 'outro-villa', category: 'outro', kind: 'outro', theme: 'villa', name: 'Hasta Siempre', desc: 'A framed plaster farewell sealed in brick red.' },
        { id: 'outro-signoff-noir', category: 'outro', kind: 'outro', theme: 'noir', layout: 'signoff', name: 'The Signature', desc: 'Your names, signed large in script, as the farewell.' },
        { id: 'outro-signoff-royal', category: 'outro', kind: 'outro', theme: 'royal', layout: 'signoff', name: 'The Royal Signature', desc: 'A signed farewell in gold on emerald.', exclusive: true },
        { id: 'outro-signoff-dusk', category: 'outro', kind: 'outro', theme: 'dusk', layout: 'signoff', name: 'Signed At Dusk', desc: 'An amber signature closing the evening.' },
        { id: 'outro-polaroid-blush', category: 'outro', kind: 'outro', theme: 'blush', layout: 'polaroid', name: 'Petal Polaroid', desc: 'A tilted keepsake photo with a handwritten thank-you.' },
        { id: 'outro-polaroid-azure', category: 'outro', kind: 'outro', theme: 'azure', layout: 'polaroid', name: 'Seaside Keepsake', desc: 'A pinned photograph and a handwritten goodbye.' },
        { id: 'outro-polaroid-ivory', category: 'outro', kind: 'outro', theme: 'ivory', layout: 'polaroid', name: 'The Keepsake', desc: 'A monochrome polaroid closing the album.' },
        { id: 'outro-polaroid-terra', category: 'outro', kind: 'outro', theme: 'terra', layout: 'polaroid', name: 'Golden Keepsake', desc: 'A sun-warmed polaroid farewell.' },
        { id: 'outro-polaroid-sage', category: 'outro', kind: 'outro', theme: 'sage', layout: 'polaroid', name: 'Meadow Keepsake', desc: 'A pressed-flower polaroid thank-you.' },
        { id: 'outro-polaroid-villa', category: 'outro', kind: 'outro', theme: 'villa', layout: 'polaroid', name: 'Courtyard Keepsake', desc: 'A keepsake photograph pinned to warm plaster.' }
    ];

    const BY_ID = {};
    TEMPLATES.forEach(function (t) { BY_ID[t.id] = t; });

    const CATEGORY_LABELS = {
        landing: 'Landing Page',
        content: 'Mix & Match',
        outro: 'Outro Page'
    };

    const KIND_LABELS = {
        couple: 'The Couple',
        party: 'Wedding Party',
        story: 'Love Story',
        events: 'Events & Schedule',
        gallery: 'Gallery',
        filmstrip: 'Photo Strip',
        countdown: 'Countdown',
        rsvp: 'RSVP & Wishes',
        quote: 'Quote & Verse',
        divider: 'Monogram Divider',
        gift: 'Digital Gifts',
        attire: 'Dress Code',
        faq: 'Q & A',
        travel: 'Travel & Stay',
        stream: 'Live Stream'
    };

    const MAX_CONTENT = 7;

    // Per-section-type caps inside the mix & match. A website can hold at
    // most this many content sections of a given kind (kinds not listed
    // here are unlimited, up to MAX_CONTENT overall). Couple, gallery,
    // story and filmstrip sections share their photo slots, so duplicates
    // of those would only repeat the same people and pictures.
    const KIND_LIMITS = { couple: 1, gallery: 1, story: 1, filmstrip: 1 };

    // How many of `kind` are already in a section-id list.
    function countKind(sections, kind) {
        return sections.filter(function (id) {
            return BY_ID[id] && BY_ID[id].kind === kind;
        }).length;
    }

    /* ---------------- Sample websites ---------------- */

    const SAMPLES = [
        {
            id: 'midnight-noir',
            theme: 'noir',
            name: 'Midnight Noir',
            tagline: 'A cinematic black-tie affair in charcoal and champagne gold.',
            landing: 'landing-noir',
            sections: ['couple-noir', 'story-noir', 'quote-noir', 'events-noir', 'gallery-noir', 'countdown-noir', 'rsvp-noir'],
            outro: 'outro-noir'
        },
        {
            id: 'blush-garden',
            theme: 'blush',
            name: 'Blush Garden',
            tagline: 'Soft romance in rosewater tones, arches and petals.',
            landing: 'landing-blush',
            sections: ['couple-blush', 'party-blush', 'story-arch-blush', 'events-blush', 'gallery-blush', 'countdown-blush', 'rsvp-blush'],
            outro: 'outro-blush'
        },
        {
            id: 'azure-coast',
            theme: 'azure',
            name: 'Azure Coast',
            tagline: 'Breezy, modern and editorial — for the minimalist couple.',
            landing: 'landing-azure',
            sections: ['couple-azure', 'story-azure', 'events-azure', 'travel-azure', 'countdown-azure', 'faq-azure', 'rsvp-azure'],
            outro: 'outro-azure'
        },
        {
            id: 'royal-emerald',
            theme: 'royal',
            name: 'Royal Emerald',
            tagline: 'Stately grandeur in deep emerald, ivory and gold.',
            landing: 'landing-royal',
            sections: ['couple-royal', 'story-royal', 'quote-royal', 'events-royal', 'countdown-royal', 'gift-royal', 'rsvp-royal'],
            outro: 'outro-royal'
        },
        {
            id: 'porcelain-ivory',
            theme: 'ivory',
            name: 'Porcelain Ivory',
            tagline: 'Quiet luxury in ivory and ink — pure typography, black & white.',
            landing: 'landing-ivory',
            sections: ['couple-ivory', 'story-editorial-ivory', 'quote-ivory', 'gallery-ivory', 'filmstrip-ivory', 'attire-ivory', 'faq-ivory'],
            outro: 'outro-ivory'
        },
        {
            id: 'terracotta-dusk',
            theme: 'terra',
            name: 'Terracotta Dusk',
            tagline: 'A warm desert-sunset celebration in clay, sand and golden light.',
            landing: 'landing-court-terra',
            sections: ['couple-terra', 'story-terra', 'events-terra', 'gallery-terra', 'travel-terra', 'countdown-inline-terra', 'rsvp-terra'],
            outro: 'outro-terra'
        },
        {
            id: 'sage-meadow',
            theme: 'sage',
            name: 'Sage Meadow',
            tagline: 'Fresh botanical elegance in eucalyptus, cream and morning light.',
            landing: 'landing-sage',
            sections: ['couple-sage', 'story-sage', 'quote-sage', 'events-sage', 'countdown-sage', 'attire-sage', 'rsvp-sage'],
            outro: 'outro-sage'
        },
        {
            id: 'twilight-hour',
            theme: 'dusk',
            name: 'Twilight Hour',
            tagline: 'A blue-hour celebration lit by amber lanterns and fireflies.',
            landing: 'landing-dusk',
            sections: ['couple-dusk', 'story-chapters-dusk', 'events-dusk', 'filmstrip-dusk', 'countdown-dusk', 'gift-dusk', 'rsvp-dusk'],
            outro: 'outro-dusk'
        },
        {
            id: 'villa-amara',
            theme: 'villa',
            name: 'Villa Amara',
            tagline: 'An epic courtyard romance — brick, ivory and golden afternoons.',
            landing: 'landing-villa',
            sections: ['couple-villa', 'story-villa', 'quote-villa', 'events-villa', 'gallery-salon-villa', 'countdown-villa', 'rsvp-villa'],
            outro: 'outro-villa'
        }
    ];

    const SAMPLES_BY_ID = {};
    SAMPLES.forEach(function (s) { SAMPLES_BY_ID[s.id] = s; });

    /* ---------------- Section renderers ---------------- */

    function sectionOpen(tpl, extra) {
        return '<section class="tpl tpl-' + tpl.kind + ' theme-' + tpl.theme + (extra ? ' ' + extra : '') +
            '" data-tpl="' + tpl.id + '" data-category="' + tpl.category + '">';
    }

    function secHead(eyebrow, title) {
        return '<header class="sec-head">' +
            '<p class="sec-eyebrow">' + eyebrow + '</p>' +
            '<h2 class="sec-title serif">' + title + '</h2>' +
            '<span class="sec-rule"></span>' +
            '</header>';
    }

    function renderLanding(tpl) {
        const b = D.bride.short, g = D.groom.short;
        // 'marquee' — oversized stacked typography over a photo
        // triptych: the names carry the whole opening.
        if (tpl.layout === 'marquee') {
            return sectionOpen(tpl, 'tpl-full land-marquee') +
                '<div class="lm-inner">' +
                '<p class="land-eyebrow">The Wedding Of</p>' +
                '<h1 class="lm-names serif"><span>' + b + '</span>' +
                '<span class="lm-amp script">&amp;</span>' +
                '<span>' + g + '</span></h1>' +
                '<p class="land-date">' + D.dateText + ' · ' + D.city + '</p>' +
                '</div>' +
                '<div class="lm-strip">' +
                '<img src="assets/images/landing-bg-pic-1.jpg" data-slot="cover" alt="The couple">' +
                '<img src="assets/images/pic-gallery-1.jpg" alt="Wedding moment">' +
                '<img src="assets/images/pic-landscape-1.jpg" alt="Wedding moment">' +
                '</div>' +
                '<span class="land-scroll">Scroll to explore<i class="chev"></i></span>' +
                '</section>';
        }
        // 'frame' — a stationery-style double frame: monogram above,
        // formal date below, everything set in fine type.
        if (tpl.layout === 'frame') {
            return sectionOpen(tpl, 'tpl-full land-frame') +
                '<div class="lf-frame">' +
                '<p class="lf-mono serif">' + D.bride.initial + '&nbsp;·&nbsp;' + D.groom.initial + '</p>' +
                '<p class="land-eyebrow">Together With Their Families</p>' +
                '<h1 class="land-names serif lf-names">' + b + ' <span class="land-amp script">&amp;</span> ' + g + '</h1>' +
                '<span class="sec-rule"></span>' +
                '<p class="land-date">' + D.dateFormal + '</p>' +
                '<p class="lf-city">' + D.city + '</p>' +
                '<span class="land-scroll">Scroll<i class="chev"></i></span>' +
                '</div></section>';
        }
        if (tpl.theme === 'noir') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="land-bg" data-slot-bg="cover" style="background-image:url(\'assets/images/landing-bg-pic-2.jpg\')"></div>' +
                '<div class="land-veil"></div>' +
                '<div class="land-inner">' +
                '<p class="land-eyebrow">The Wedding Of</p>' +
                '<h1 class="land-names serif">' + b + ' <span class="land-amp script">&amp;</span> ' + g + '</h1>' +
                '<span class="sec-rule"></span>' +
                '<p class="land-date">' + D.dateText + ' · ' + D.city + '</p>' +
                '<span class="land-scroll">Scroll to explore<i class="chev"></i></span>' +
                '</div></section>';
        }
        if (tpl.theme === 'blush') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="land-inner">' +
                '<p class="land-eyebrow">Together With Their Families</p>' +
                '<div class="arch-frame"><img src="assets/images/landing-bg-pic-5.jpg" data-slot="cover" alt="The couple"></div>' +
                '<h1 class="land-names script">' + b + ' &amp; ' + g + '</h1>' +
                '<p class="land-date">Joyfully invite you to celebrate their wedding<br>' + D.dateText + '</p>' +
                '<span class="petal p1">✿</span><span class="petal p2">❀</span><span class="petal p3">✿</span>' +
                '</div></section>';
        }
        if (tpl.theme === 'azure') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="land-split">' +
                '<div class="land-copy">' +
                '<p class="land-eyebrow">' + D.dateShort + ' — ' + D.city + '</p>' +
                '<h1 class="land-names caps">' + b + '<span class="land-amp">&amp;</span>' + g + '</h1>' +
                '<p class="land-sub">We are getting married — and you are warmly invited.</p>' +
                '</div>' +
                '<div class="land-photo"><img src="assets/images/landing-bg-pic-3.jpg" data-slot="cover" alt="The couple"></div>' +
                '</div></section>';
        }
        if (tpl.theme === 'ivory') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="land-inner land-min">' +
                '<p class="land-eyebrow">' + D.dateShort + '</p>' +
                '<h1 class="land-names serif land-stack">' +
                '<span>' + b + '</span>' +
                '<span class="land-amp-line"><i></i><em class="script">&amp;</em><i></i></span>' +
                '<span>' + g + '</span>' +
                '</h1>' +
                '<p class="land-date">' + D.dateText + ' · ' + D.city + '</p>' +
                '<span class="land-scroll">Scroll<i class="chev"></i></span>' +
                '</div></section>';
        }
        if (tpl.id === 'landing-villa') {
            return sectionOpen(tpl, 'tpl-full villa-hero') +
                '<div class="villa-split">' +
                '<div class="villa-photo"><img src="assets/images/bride-and-groom-2-1.jpg" data-slot="cover" alt="The couple"></div>' +
                '<div class="villa-copy">' +
                '<span class="villa-year serif">' + D.dateISO.slice(0, 4) + '</span>' +
                '<p class="land-eyebrow">Together With Their Families</p>' +
                '<h1 class="villa-names serif">' +
                '<span>' + b + '</span>' +
                '<em class="script">&amp;</em>' +
                '<span>' + g + '</span>' +
                '</h1>' +
                '<p class="villa-date">' + D.dateFormal + '</p>' +
                '<p class="villa-city">' + D.city + '</p>' +
                '<span class="land-scroll">Scroll to explore<i class="chev"></i></span>' +
                '</div></div></section>';
        }
        if (tpl.id === 'landing-court-terra') {
            return sectionOpen(tpl, 'tpl-full land-court') +
                '<div class="land-bg" data-slot-bg="cover" style="background-image:url(\'assets/images/bride-and-groom-2-2.jpg\')"></div>' +
                '<div class="land-veil court-veil"></div>' +
                '<div class="land-inner">' +
                '<p class="land-eyebrow">Save Every Dance For Us</p>' +
                '<h1 class="land-names serif">' + b + ' <span class="land-amp script">&amp;</span> ' + g + '</h1>' +
                '<span class="sec-rule"></span>' +
                '<p class="land-date">' + D.dateText + ' · ' + D.city + '</p>' +
                '<span class="land-scroll">Scroll to explore<i class="chev"></i></span>' +
                '</div></section>';
        }
        if (tpl.theme === 'terra') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="terra-arch"><span class="terra-sun"></span></div>' +
                '<div class="land-inner">' +
                '<p class="land-eyebrow">Under The Setting Sun</p>' +
                '<h1 class="land-names serif">' + b + ' <span class="land-amp script">&amp;</span> ' + g + '</h1>' +
                '<p class="land-date">Are getting married<br>' + D.dateText + ' · ' + D.city + '</p>' +
                '<span class="land-scroll">Scroll<i class="chev"></i></span>' +
                '</div></section>';
        }
        if (tpl.theme === 'sage') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="land-inner sage-frame">' +
                '<span class="leaf lf-t">❧</span>' +
                '<p class="land-eyebrow">Together With Their Families</p>' +
                '<h1 class="land-names serif">' + b + '<br><span class="land-amp script">&amp;</span><br>' + g + '</h1>' +
                '<p class="land-date">Invite you to share in their joy<br>' + D.dateText + ' · ' + D.city + '</p>' +
                '<span class="leaf lf-b">❧</span>' +
                '</div></section>';
        }
        if (tpl.theme === 'dusk') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="land-bg" data-slot-bg="cover" style="background-image:url(\'assets/images/landing-bg-pic-4.jpg\')"></div>' +
                '<div class="land-veil dusk-veil"></div>' +
                '<span class="fly f1"></span><span class="fly f2"></span><span class="fly f3"></span>' +
                '<span class="fly f4"></span><span class="fly f5"></span><span class="fly f6"></span>' +
                '<div class="land-inner">' +
                '<p class="land-eyebrow">When The Blue Hour Falls</p>' +
                '<h1 class="land-names serif">' + b + ' <span class="land-amp script">&amp;</span> ' + g + '</h1>' +
                '<span class="sec-rule"></span>' +
                '<p class="land-date">' + D.dateText + ' · ' + D.city + '</p>' +
                '<span class="land-scroll">Scroll to explore<i class="chev"></i></span>' +
                '</div></section>';
        }
        // royal
        return sectionOpen(tpl, 'tpl-full') +
            '<div class="land-inner">' +
            '<div class="medallion"><span class="serif">' + D.bride.initial + '·' + D.groom.initial + '</span></div>' +
            '<p class="land-eyebrow">Request The Honour Of Your Presence</p>' +
            '<h1 class="land-names serif">' + b + ' &amp; ' + g + '</h1>' +
            '<span class="sec-rule"></span>' +
            '<p class="land-date">' + D.dateFormal + '</p>' +
            '</div></section>';
    }

    // Themes whose couple sections open with real portrait photographs
    // (still replaceable through the Bride/Groom media slots).
    const AVATAR_DEFAULTS = {
        terra: { bride: 'assets/images/bride-2.jpg', groom: 'assets/images/groom-2.jpg' },
        sage: { bride: 'assets/images/bride-1.jpg', groom: 'assets/images/groom-1.jpg' },
        villa: { bride: 'assets/images/bride-2.jpg', groom: 'assets/images/groom-2.jpg' }
    };

    function personCard(p, slot, defaultImg) {
        const avatar = defaultImg
            ? '<div class="avatar avatar-photo" data-slot-avatar="' + slot + '"><img src="' + defaultImg + '" alt="' + p.role + '"></div>'
            : '<div class="avatar" data-slot-avatar="' + slot + '"><span class="serif">' + p.initial + '</span></div>';
        return '<article class="person">' +
            avatar +
            '<h3 class="person-name serif">' + p.name + '</h3>' +
            '<p class="person-role">' + p.role + '</p>' +
            '<p class="person-parents">' + p.parents + '</p>' +
            '<span class="person-ig">' + p.ig + '</span>' +
            '</article>';
    }

    function renderCouple(tpl) {
        const av = AVATAR_DEFAULTS[tpl.theme] || {};
        // 'panels' — two full-height editorial photo panels, names set
        // into a scrim at the base, a floating ampersand between them.
        if (tpl.layout === 'panels') {
            const panel = function (p, slot, img) {
                return '<figure class="cpanel">' +
                    '<img src="' + img + '" data-slot="' + slot + '" alt="' + p.role + '" loading="lazy">' +
                    '<figcaption class="cpanel-cap">' +
                    '<p class="cpanel-role">' + p.role + '</p>' +
                    '<h3 class="cpanel-name serif">' + p.name + '</h3>' +
                    '<p class="cpanel-parents">' + p.parents + '</p>' +
                    '<span class="cpanel-ig">' + p.ig + '</span>' +
                    '</figcaption></figure>';
            };
            return sectionOpen(tpl) +
                secHead('Bride &amp; Groom', 'The Two Of Us') +
                '<div class="cpanels">' +
                panel(D.bride, 'bride', av.bride || 'assets/images/bride-1.jpg') +
                '<span class="cpanels-amp script">&amp;</span>' +
                panel(D.groom, 'groom', av.groom || 'assets/images/groom-1.jpg') +
                '</div></section>';
        }
        return sectionOpen(tpl) +
            secHead('Bride &amp; Groom', 'Two Hearts, One Story') +
            '<div class="couple-grid">' +
            personCard(D.bride, 'bride', av.bride) +
            '<div class="couple-amp script">&amp;</div>' +
            personCard(D.groom, 'groom', av.groom) +
            '</div></section>';
    }

    function storyPhoto(i, tpl) {
        // Templates may carry their own default photo set (storyImgs);
        // the story1–3 media slots still override either way.
        const src = (tpl && tpl.storyImgs && tpl.storyImgs[i])
            ? 'assets/images/' + tpl.storyImgs[i] + '.jpg'
            : 'assets/images/story-' + (i + 1) + '.jpg';
        return '<img src="' + src + '" data-slot="story' + (i + 1) + '" alt="Our story" loading="lazy">';
    }

    function renderStory(tpl) {
        // Photo layouts: arched frames, editorial rows, numbered chapters
        if (tpl.layout === 'arch') {
            return sectionOpen(tpl) +
                secHead('Our Journey', 'A Love Story') +
                '<div class="sarch-grid">' +
                D.story.map(function (s, i) {
                    return '<figure class="sarch-item">' +
                        '<div class="sarch-frame">' + storyPhoto(i, tpl) + '</div>' +
                        '<p class="sarch-year">' + s.year + '</p>' +
                        '<h3 class="sarch-title script">' + s.title + '</h3>' +
                        '<p class="sarch-text">' + s.text + '</p>' +
                        '</figure>';
                }).join('') +
                '</div></section>';
        }
        if (tpl.layout === 'editorial') {
            return sectionOpen(tpl) +
                secHead('Our Journey', 'A Love Story') +
                '<div class="sed-list">' +
                D.story.map(function (s, i) {
                    return '<div class="sed-row' + (i % 2 ? ' rev' : '') + '">' +
                        '<div class="sed-photo">' + storyPhoto(i, tpl) + '</div>' +
                        '<div class="sed-copy">' +
                        '<p class="sed-year">' + s.year + '</p>' +
                        '<h3 class="sed-title serif">' + s.title + '</h3>' +
                        '<p class="sed-text">' + s.text + '</p>' +
                        '</div></div>';
                }).join('') +
                '</div></section>';
        }
        if (tpl.layout === 'chapters') {
            return sectionOpen(tpl) +
                secHead('Our Journey', 'A Love Story') +
                '<div class="chap-list">' +
                D.story.map(function (s, i) {
                    return '<div class="chap-item">' +
                        '<span class="chap-num serif">0' + (i + 1) + '</span>' +
                        '<div class="chap-photo">' + storyPhoto(i, tpl) + '</div>' +
                        '<div class="chap-copy">' +
                        '<p class="chap-year">' + s.year + '</p>' +
                        '<h3 class="chap-title serif">' + s.title + '</h3>' +
                        '<p class="chap-text">' + s.text + '</p>' +
                        '</div></div>';
                }).join('') +
                '</div></section>';
        }
        return sectionOpen(tpl) +
            secHead('Our Journey', 'A Love Story') +
            '<ol class="timeline">' +
            D.story.map(function (s) {
                return '<li class="tl-item"><span class="tl-dot"></span>' +
                    '<div class="tl-card"><p class="tl-year">' + s.year + '</p>' +
                    '<h3 class="tl-title serif">' + s.title + '</h3>' +
                    '<p class="tl-text">' + s.text + '</p></div></li>';
            }).join('') +
            '</ol></section>';
    }

    function renderEvents(tpl) {
        // 'rows' — a quiet ruled schedule instead of cards.
        if (tpl.layout === 'rows') {
            return sectionOpen(tpl) +
                secHead('Save The Date', 'The Wedding Day') +
                '<div class="sched">' +
                D.events.map(function (ev) {
                    return '<div class="sched-row">' +
                        '<div class="sched-time">' + ev.time + '</div>' +
                        '<div class="sched-body"><h3 class="serif">' + ev.title + '</h3>' +
                        '<p>' + ev.venue + ' · ' + ev.addr + '</p></div>' +
                        '<a class="btn-ghost" href="' + mapUrl(ev) + '" target="_blank" rel="noopener">Map</a>' +
                        '</div>';
                }).join('') +
                '<p class="sched-date">' + D.dateText + '</p>' +
                '</div></section>';
        }
        return sectionOpen(tpl) +
            secHead('Save The Date', 'Wedding Events') +
            '<div class="events-grid">' +
            D.events.map(function (ev) {
                return '<article class="event-card">' +
                    '<h3 class="ev-title serif">' + ev.title + '</h3>' +
                    '<span class="sec-rule"></span>' +
                    '<p class="ev-date">' + ev.date + '</p>' +
                    '<p class="ev-time">' + ev.time + '</p>' +
                    '<p class="ev-venue">' + ev.venue + '</p>' +
                    '<p class="ev-addr">' + ev.addr + '</p>' +
                    '<a class="btn-ghost" href="' + mapUrl(ev) + '" target="_blank" rel="noopener">View Map</a>' +
                    '</article>';
            }).join('') +
            '</div></section>';
    }

    function renderGallery(tpl) {
        const mono = D.bride.initial + ' & ' + D.groom.initial;
        // 'salon' — an asymmetric salon-hung wall: one grand portrait,
        // a wide landscape, a caption tile and a square, gallery-style.
        if (tpl.layout === 'salon') {
            return sectionOpen(tpl) +
                secHead('Moments', 'The Salon Wall') +
                '<div class="salon">' +
                '<figure class="sal-item sal-tall"><img src="assets/images/pic-potrait-couple-1.jpg" data-slot="gallery1" alt="Gallery photo" loading="lazy"></figure>' +
                '<figure class="sal-item sal-wide"><img src="assets/images/pic-landscape-1.jpg" data-slot="gallery2" alt="Gallery photo" loading="lazy"></figure>' +
                '<div class="sal-item sal-note">' +
                '<span class="sal-mono script">' + mono + '</span>' +
                '<i class="sal-rule"></i>' +
                '<span class="sal-date">' + D.dateShort + '</span>' +
                '<span class="sal-tag">' + D.hashtag + '</span>' +
                '</div>' +
                '<figure class="sal-item sal-sq"><img src="assets/images/pic-gallery-2.jpg" data-slot="gallery3" alt="Gallery photo" loading="lazy"></figure>' +
                '</div></section>';
        }
        const items = [
            '<figure class="gal-item gi-photo"><img src="assets/images/pic-gallery-1.jpg" data-slot="gallery1" alt="Gallery photo"></figure>',
            '<figure class="gal-item gi-tile"><span class="script">' + mono + '</span></figure>',
            '<figure class="gal-item gi-photo gi-alt"><img src="assets/images/pic-landscape-1.jpg" data-slot="gallery2" alt="Gallery photo"></figure>',
            '<figure class="gal-item gi-tile"><span class="gi-heart">♥</span></figure>',
            '<figure class="gal-item gi-photo gi-low"><img src="assets/images/pic-landscape-2.jpg" data-slot="gallery3" alt="Gallery photo"></figure>',
            '<figure class="gal-item gi-tile"><span class="gi-date">' + D.dateShort + '</span></figure>'
        ];
        return sectionOpen(tpl) +
            secHead('Moments', 'Our Gallery') +
            '<div class="gal-grid">' + items.join('') + '</div></section>';
    }

    function renderCountdown(tpl) {
        const units = [['d', 'Days'], ['h', 'Hours'], ['m', 'Minutes'], ['s', 'Seconds']];
        const calBtn = (function () {
            const cal = calendarUrl();
            return cal ? '<div class="cd-cta"><a class="btn-ghost" href="' + cal +
                '" target="_blank" rel="noopener">Save The Date &middot; Add To Calendar</a></div>' : '';
        })();
        // 'inline' — the date itself is the hero: oversized numerals
        // with the live count reading like a sentence beneath.
        if (tpl.layout === 'inline') {
            return sectionOpen(tpl) +
                '<div class="cdi" data-countdown="' + D.dateISO + '">' +
                '<p class="sec-eyebrow">Counting Down To</p>' +
                '<p class="cdi-date serif">' + D.dateShort + '</p>' +
                '<p class="cdi-line">' +
                units.map(function (u) {
                    return '<span class="cdi-u"><b class="serif" data-cd="' + u[0] + '">—</b> ' + u[1].toLowerCase() + '</span>';
                }).join('<i class="cdi-dot">·</i>') +
                '</p>' +
                '<p class="cdi-city">' + D.dateText + ' · ' + D.city + '</p>' +
                calBtn +
                '</div></section>';
        }
        return sectionOpen(tpl) +
            secHead('Counting Down', 'Until We Say I Do') +
            '<div class="cd" data-countdown="' + D.dateISO + '">' +
            units.map(function (u) {
                return '<div class="cd-unit"><span class="cd-num serif" data-cd="' + u[0] + '">—</span>' +
                    '<span class="cd-lab">' + u[1] + '</span></div>';
            }).join('') +
            '</div>' +
            '<p class="cd-date">' + D.dateText + ' · ' + D.city + '</p>' +
            calBtn +
            '</section>';
    }

    function renderRsvp(tpl) {
        const wishesList = '<ul class="wishes">' +
            D.wishes.map(function (w) {
                return '<li class="wish"><p class="wish-text">“' + w.text + '”</p><p class="wish-by">— ' + w.by + '</p></li>';
            }).join('') +
            '</ul>';
        // 'card' — a stationery reply card: monogram, ruled fields and
        // a respond-by line, with the wish wall flowing beneath it.
        if (tpl.layout === 'card') {
            return sectionOpen(tpl) +
                secHead('RSVP &amp; Wishes', 'Kindly Reply') +
                '<div class="rsvpc">' +
                '<form class="rsvpc-card" data-rsvp>' +
                '<p class="rsvpc-mono serif">' + D.bride.initial + '&nbsp;·&nbsp;' + D.groom.initial + '</p>' +
                '<p class="rsvpc-line">The favour of a reply is requested before ' + D.dateText + '</p>' +
                '<label class="rsvpc-field"><span>Name</span>' +
                '<input class="rsvpc-input" name="guest" type="text" placeholder="Written by…" required></label>' +
                '<label class="rsvpc-field"><span>Attending</span>' +
                '<span class="rsvp-select"><select class="rsvpc-input" name="attend">' +
                '<option>Joyfully accepts</option><option>Regretfully declines</option>' +
                '</select><i class="rsvp-caret"></i></span></label>' +
                '<label class="rsvpc-field"><span>Wishes</span>' +
                '<textarea class="rsvpc-input" name="wish" rows="3" placeholder="A few words for the couple…"></textarea></label>' +
                '<button type="submit" class="btn-solid">Send Reply</button>' +
                '<p class="rsvp-note">Preview only — responses are not stored.</p>' +
                '</form>' +
                '<div class="rsvpc-wishes">' + wishesList + '</div>' +
                '</div></section>';
        }
        return sectionOpen(tpl) +
            secHead('RSVP &amp; Wishes', 'Will You Be There?') +
            '<div class="rsvp-wrap">' +
            '<form class="rsvp-form" data-rsvp>' +
            '<input class="rsvp-input" name="guest" type="text" placeholder="Your name" required>' +
            '<div class="rsvp-select"><select class="rsvp-input" name="attend">' +
            '<option>Joyfully accepts</option><option>Regretfully declines</option>' +
            '</select><i class="rsvp-caret"></i></div>' +
            '<textarea class="rsvp-input" name="wish" rows="4" placeholder="Send your love &amp; wishes…"></textarea>' +
            '<button type="submit" class="btn-solid">Send RSVP</button>' +
            '<p class="rsvp-note">Preview only — responses are not stored.</p>' +
            '</form>' +
            wishesList +
            '</div></section>';
    }

    function renderQuote(tpl) {
        // 'photo' — the verse floats over a photograph, tinted through
        // a theme-coloured veil so it reads in any palette.
        if (tpl.layout === 'photo') {
            return sectionOpen(tpl, 'quote-photo') +
                '<div class="qp-bg"><img src="assets/images/pic-landscape-1.jpg" alt="" loading="lazy"></div>' +
                '<div class="qp-veil"></div>' +
                '<div class="quote-inner">' +
                '<span class="quote-orn">❦</span>' +
                '<blockquote class="quote-text serif">“' + D.quote.text + '”</blockquote>' +
                '<cite class="quote-cite">' + D.quote.cite + '</cite>' +
                '</div></section>';
        }
        return sectionOpen(tpl) +
            '<div class="quote-inner">' +
            '<span class="quote-orn">❦</span>' +
            '<blockquote class="quote-text serif">“' + D.quote.text + '”</blockquote>' +
            '<cite class="quote-cite">' + D.quote.cite + '</cite>' +
            '</div></section>';
    }

    function renderGift(tpl) {
        // 'ledger' — one elegant registry card: accounts as fine ruled
        // rows rather than separate envelopes.
        if (tpl.layout === 'ledger') {
            return sectionOpen(tpl) +
                secHead('Wedding Gift', 'With Love, If You Wish') +
                '<div class="ledger">' +
                '<p class="gift-note">Your presence is the greatest gift of all. Should you wish to honour us with more, a digital envelope is gratefully received.</p>' +
                D.gifts.map(function (gf) {
                    return '<div class="ledger-row">' +
                        '<div class="ledger-info">' +
                        '<p class="ledger-bank">' + gf.bank + '</p>' +
                        '<p class="ledger-acc serif">' + gf.acc + '</p>' +
                        '<p class="ledger-holder">' + gf.holder + '</p>' +
                        '</div>' +
                        '<button type="button" class="btn-ghost" data-copy="' + gf.acc.replace(/[^0-9a-zA-Z]/g, '') + '">Copy</button>' +
                        '</div>';
                }).join('') +
                '</div></section>';
        }
        return sectionOpen(tpl) +
            secHead('Wedding Gift', 'A Token Of Love') +
            '<p class="gift-note">Your presence is the greatest gift of all. Should you wish to honour us with more, a digital envelope is gratefully received.</p>' +
            '<div class="gift-grid">' +
            D.gifts.map(function (gf) {
                return '<article class="gift-card">' +
                    '<p class="gift-bank">' + gf.bank + '</p>' +
                    '<p class="gift-acc serif">' + gf.acc + '</p>' +
                    '<p class="gift-holder">' + gf.holder + '</p>' +
                    '<button type="button" class="btn-ghost" data-copy="' + gf.acc.replace(/[^0-9a-zA-Z]/g, '') + '">Copy Number</button>' +
                    '</article>';
            }).join('') +
            '</div></section>';
    }

    function renderAttire(tpl) {
        const pal = THEMES[tpl.theme].dress;
        // 'runway' — the palette becomes the design: tall fabric-swatch
        // bars beneath an oversized dress-code line.
        if (tpl.layout === 'runway') {
            return sectionOpen(tpl) +
                secHead('What To Wear', 'The Palette') +
                '<div class="runway">' +
                '<p class="runway-code serif">' + D.attire.code + '</p>' +
                '<div class="runway-bars">' +
                pal.map(function (c) { return '<span class="runway-bar" style="background:' + c + '"></span>'; }).join('') +
                '</div>' +
                '<p class="attire-note">' + D.attire.note + '</p>' +
                '<p class="attire-pal-lab">Suggested Palette</p>' +
                '</div></section>';
        }
        return sectionOpen(tpl) +
            secHead('What To Wear', 'Dress Code') +
            '<div class="attire-card">' +
            '<p class="attire-code serif">' + D.attire.code + '</p>' +
            '<p class="attire-note">' + D.attire.note + '</p>' +
            '<div class="attire-pal">' +
            pal.map(function (c) { return '<span class="pal-dot" style="background:' + c + '"></span>'; }).join('') +
            '</div>' +
            '<p class="attire-pal-lab">Suggested Palette</p>' +
            '</div></section>';
    }

    function renderFaq(tpl) {
        // 'grid' — every answer open at once: numbered editorial cards
        // in a two-column spread instead of an accordion.
        if (tpl.layout === 'grid') {
            return sectionOpen(tpl) +
                secHead('Good To Know', 'Questions &amp; Answers') +
                '<div class="faqg">' +
                D.faqs.map(function (f, i) {
                    return '<article class="faqg-item">' +
                        '<span class="faqg-num serif">0' + (i + 1) + '</span>' +
                        '<h3 class="faqg-q serif">' + f.q + '</h3>' +
                        '<p class="faqg-a">' + f.a + '</p>' +
                        '</article>';
                }).join('') +
                '</div></section>';
        }
        return sectionOpen(tpl) +
            secHead('Good To Know', 'Questions &amp; Answers') +
            '<div class="faq-list">' +
            D.faqs.map(function (f) {
                return '<details class="faq-item"><summary>' + f.q + '<span class="faq-x"></span></summary>' +
                    '<p>' + f.a + '</p></details>';
            }).join('') +
            '</div></section>';
    }

    function renderParty(tpl) {
        // 'roll' — a centred roll call: each side announced with an
        // eyebrow, names flowing in one graceful line.
        if (tpl.layout === 'roll') {
            const roll = function (title, list) {
                return '<div class="roll-group">' +
                    '<p class="roll-side">' + title + '</p>' +
                    '<div class="roll-names">' +
                    list.map(function (p) {
                        return '<span class="roll-name">' +
                            '<b class="serif">' + p.name + '</b>' +
                            '<i>' + p.role + '</i>' +
                            '</span>';
                    }).join('') +
                    '</div></div>';
            };
            return sectionOpen(tpl) +
                secHead('With Us On The Day', 'Our Favourite People') +
                '<div class="roll">' +
                roll('By Her Side', D.party.bridesmaids) +
                '<span class="roll-amp script">&amp;</span>' +
                roll('By His Side', D.party.groomsmen) +
                '</div></section>';
        }
        const side = function (title, list) {
            return '<div class="party-side">' +
                '<h3 class="party-side-title serif">' + title + '</h3>' +
                list.map(function (p) {
                    return '<div class="party-person">' +
                        '<p class="pp-name serif">' + p.name + '</p>' +
                        '<p class="pp-role">' + p.role + '</p>' +
                        '</div>';
                }).join('') +
                '</div>';
        };
        return sectionOpen(tpl) +
            secHead('With Us On The Day', 'The Wedding Party') +
            '<div class="party-grid">' +
            side('By Her Side', D.party.bridesmaids) +
            side('By His Side', D.party.groomsmen) +
            '</div></section>';
    }

    function renderStream(tpl) {
        // 'theatre' — a cinema screen: a still of the couple behind a
        // play button, so the card feels like the broadcast itself.
        if (tpl.layout === 'theatre') {
            return sectionOpen(tpl) +
                secHead('From Anywhere In The World', 'The Live Broadcast') +
                '<div class="theatre">' +
                '<a class="theatre-screen" href="' + D.stream.url + '" target="_blank" rel="noopener" aria-label="Watch the livestream">' +
                '<img src="assets/images/bride-and-groom-1.jpg" alt="" loading="lazy">' +
                '<span class="theatre-veil"></span>' +
                '<span class="live-badge"><i class="live-dot"></i>Live</span>' +
                '<span class="theatre-play">▶</span>' +
                '</a>' +
                '<p class="stream-note">' + D.stream.note + '</p>' +
                '<p class="stream-hint">The link goes live thirty minutes before the ceremony begins.</p>' +
                '</div></section>';
        }
        return sectionOpen(tpl) +
            secHead('From Anywhere In The World', 'Join Us Live') +
            '<div class="stream-card">' +
            '<span class="live-badge"><i class="live-dot"></i>Live</span>' +
            '<p class="stream-note">' + D.stream.note + '</p>' +
            '<a class="btn-solid" href="' + D.stream.url + '" target="_blank" rel="noopener">▶&nbsp;&nbsp;Watch The Livestream</a>' +
            '<p class="stream-hint">The link goes live thirty minutes before the ceremony begins.</p>' +
            '</div></section>';
    }

    const STRIP_IMGS = [
        'landing-bg-pic-2', 'bride-and-groom-1', 'pic-gallery-1', 'pic-landscape-2',
        'bride-and-groom-2-1', 'pic-potrait-1', 'pic-gallery-2', 'pic-potrait-couple-2',
        'pic-landscape-1', 'pic-potrait-couple-1'
    ].map(function (n) { return 'assets/images/' + n + '.jpg'; });

    // Six of the ten strip frames are user-replaceable (strip1–6 media
    // slots), interleaved so uploads spread across the whole ribbon —
    // and across both reels of the 'double' layout.
    const STRIP_SLOTS = { 0: 'strip1', 2: 'strip2', 4: 'strip3', 5: 'strip4', 7: 'strip5', 9: 'strip6' };

    function renderFilmstrip(tpl) {
        // Image rows are doubled so the marquees loop seamlessly.
        const frames = function (list, offset) {
            return list.concat(list).map(function (src, i) {
                const slot = STRIP_SLOTS[offset + (i % list.length)];
                return '<img src="' + src + '"' + (slot ? ' data-slot="' + slot + '"' : '') +
                    ' loading="lazy" alt="Wedding moment">';
            }).join('');
        };
        // 'double' — two half-height reels drifting in opposite
        // directions, like film winding past each other.
        if (tpl.layout === 'double') {
            return sectionOpen(tpl, 'tpl-slim strip-duo') +
                '<div class="strip"><div class="strip-track">' + frames(STRIP_IMGS.slice(0, 5), 0) + '</div></div>' +
                '<div class="strip"><div class="strip-track strip-rev">' + frames(STRIP_IMGS.slice(5), 5) + '</div></div>' +
                '</section>';
        }
        return sectionOpen(tpl, 'tpl-slim') +
            '<div class="strip"><div class="strip-track">' + frames(STRIP_IMGS, 0) + '</div></div>' +
            '</section>';
    }

    function renderDivider(tpl) {
        // 'crest' — the initials sealed inside a rotated diamond, with
        // the wedding date set quietly beneath.
        if (tpl.layout === 'crest') {
            return sectionOpen(tpl, 'tpl-slim') +
                '<div class="divider-inner crest-stack">' +
                '<div class="crest-row">' +
                '<i class="div-line"></i>' +
                '<span class="crest"><b class="serif">' + D.bride.initial + D.groom.initial + '</b></span>' +
                '<i class="div-line"></i>' +
                '</div>' +
                '<p class="crest-date">' + D.dateShort + '</p>' +
                '</div></section>';
        }
        return sectionOpen(tpl, 'tpl-slim') +
            '<div class="divider-inner">' +
            '<i class="div-line"></i>' +
            '<span class="div-mono serif">' + D.bride.initial + '&nbsp;·&nbsp;' + D.groom.initial + '</span>' +
            '<i class="div-line"></i>' +
            '</div></section>';
    }

    function renderTravel(tpl) {
        const cta = '<div class="travel-cta">' +
            '<a class="btn-ghost" href="' + cityMapUrl() + '" target="_blank" rel="noopener">Explore ' + D.city + '</a>' +
            '</div>';
        // 'route' — an itinerary drawn as a single journey line with
        // stops, the way a travel journal maps a trip.
        if (tpl.layout === 'route') {
            return sectionOpen(tpl) +
                secHead('Getting There', 'The Journey In') +
                '<div class="route">' +
                D.travel.map(function (t) {
                    return '<div class="route-stop">' +
                        '<span class="route-ico">' + t.icon + '</span>' +
                        '<div class="route-copy">' +
                        '<h3 class="serif">' + t.title + '</h3>' +
                        '<p>' + t.text + '</p>' +
                        '</div></div>';
                }).join('') +
                '</div>' + cta + '</section>';
        }
        return sectionOpen(tpl) +
            secHead('Getting There', 'Travel &amp; Stay') +
            '<div class="travel-grid">' +
            D.travel.map(function (t) {
                return '<article class="travel-card">' +
                    '<span class="travel-ico">' + t.icon + '</span>' +
                    '<h3 class="serif">' + t.title + '</h3>' +
                    '<p>' + t.text + '</p>' +
                    '</article>';
            }).join('') +
            '</div>' + cta + '</section>';
    }

    function renderOutro(tpl) {
        const names = D.bride.short + ' &amp; ' + D.groom.short;
        // 'signoff' — the couple's names, written large in script, ARE
        // the farewell: a signature at the end of the letter.
        if (tpl.layout === 'signoff') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="outro-inner">' +
                '<p class="sec-eyebrow">Until The Big Day</p>' +
                '<h2 class="oso-names script">' + names + '</h2>' +
                '<p class="outro-text">We cannot wait to write the next chapter with you there.</p>' +
                '<span class="sec-rule"></span>' +
                '<p class="oso-date">' + D.dateText + ' · ' + D.city + '</p>' +
                '<p class="outro-tag">' + D.hashtag + '</p>' +
                '</div></section>';
        }
        // 'polaroid' — a tilted keepsake photograph with a handwritten
        // caption, pinned like the last page of an album.
        if (tpl.layout === 'polaroid') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="outro-inner">' +
                '<figure class="opol">' +
                '<img src="assets/images/pic-potrait-couple-1.jpg" data-slot="outro" alt="The couple">' +
                '<figcaption class="script">Thank you</figcaption>' +
                '</figure>' +
                '<p class="outro-text">For every mile travelled and every blessing sent — we love you.</p>' +
                '<p class="outro-names serif">' + names + '</p>' +
                '<p class="outro-tag">' + D.hashtag + '</p>' +
                '</div></section>';
        }
        if (tpl.theme === 'noir') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="land-bg" data-slot-bg="outro" style="background-image:url(\'assets/images/landing-bg-pic-4.jpg\')"></div>' +
                '<div class="land-veil"></div>' +
                '<div class="outro-inner">' +
                '<p class="sec-eyebrow">With Love &amp; Gratitude</p>' +
                '<h2 class="outro-title serif">Thank You</h2>' +
                '<p class="outro-text">It would be an honour to celebrate the first day of our forever with you.</p>' +
                '<p class="outro-names script">' + names + '</p>' +
                '<p class="outro-tag">' + D.hashtag + '</p>' +
                '</div></section>';
        }
        if (tpl.theme === 'blush') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="outro-inner">' +
                '<span class="petal p1">✿</span><span class="petal p2">❀</span>' +
                '<h2 class="outro-title script">Thank You</h2>' +
                '<p class="outro-text">Your love, laughter and blessings mean the world to us.<br>We cannot wait to celebrate with you.</p>' +
                '<p class="outro-names serif">' + names + '</p>' +
                '<p class="outro-tag">' + D.hashtag + '</p>' +
                '</div></section>';
        }
        if (tpl.theme === 'azure') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="outro-inner">' +
                '<h2 class="outro-title caps">See You There</h2>' +
                '<p class="outro-text">' + D.dateText + ' · ' + D.city + '</p>' +
                '<p class="outro-tag big">' + D.hashtag + '</p>' +
                '<p class="outro-names">' + names + '</p>' +
                '</div></section>';
        }
        if (tpl.theme === 'ivory') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="outro-inner">' +
                '<p class="sec-eyebrow">And So The Adventure Begins</p>' +
                '<h2 class="outro-title serif">Until We<br>Meet Again</h2>' +
                '<span class="sec-rule"></span>' +
                '<p class="outro-names serif">' + names + '</p>' +
                '<p class="outro-tag">' + D.hashtag + '</p>' +
                '</div></section>';
        }
        if (tpl.theme === 'terra') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="terra-arch low"><span class="terra-sun"></span></div>' +
                '<div class="outro-inner">' +
                '<h2 class="outro-title script">With all our love</h2>' +
                '<p class="outro-text">Thank you for walking this road with us — see you at sundown.</p>' +
                '<p class="outro-names serif">' + names + '</p>' +
                '<p class="outro-tag">' + D.hashtag + '</p>' +
                '</div></section>';
        }
        if (tpl.theme === 'sage') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="outro-inner sage-frame">' +
                '<span class="leaf lf-t">❧</span>' +
                '<h2 class="outro-title serif">Thank You</h2>' +
                '<p class="outro-text">For your love, your blessings, and every mile travelled to be with us.</p>' +
                '<p class="outro-names script">' + names + '</p>' +
                '<p class="outro-tag">' + D.hashtag + '</p>' +
                '<span class="leaf lf-b">❧</span>' +
                '</div></section>';
        }
        if (tpl.theme === 'villa') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="outro-inner villa-outro">' +
                '<div class="villa-seal serif">' + D.bride.initial + '&nbsp;·&nbsp;' + D.groom.initial + '</div>' +
                '<h2 class="outro-title serif">Hasta Siempre</h2>' +
                '<p class="outro-text">From our courtyard to wherever life may lead — thank you for being part of the story.</p>' +
                '<span class="sec-rule"></span>' +
                '<p class="outro-names script">' + names + '</p>' +
                '<p class="outro-tag">' + D.hashtag + '</p>' +
                '</div></section>';
        }
        if (tpl.theme === 'dusk') {
            return sectionOpen(tpl, 'tpl-full') +
                '<div class="land-bg" data-slot-bg="outro" style="background-image:url(\'assets/images/pic-potrait-couple-2.jpg\')"></div>' +
                '<div class="land-veil dusk-veil"></div>' +
                '<div class="outro-inner">' +
                '<h2 class="outro-title script">And so, into the gold…</h2>' +
                '<p class="outro-text">Thank you for lighting our way here. The best is yet to come.</p>' +
                '<p class="outro-names serif">' + names + '</p>' +
                '<p class="outro-tag">' + D.hashtag + '</p>' +
                '</div></section>';
        }
        // royal
        return sectionOpen(tpl, 'tpl-full') +
            '<div class="outro-inner">' +
            '<div class="medallion small"><span class="serif">' + D.bride.initial + '·' + D.groom.initial + '</span></div>' +
            '<h2 class="outro-title serif">With Gratitude</h2>' +
            '<p class="outro-text">We are deeply grateful for your presence, prayers and warmest wishes.</p>' +
            '<span class="sec-rule"></span>' +
            '<p class="outro-names serif">' + names + '</p>' +
            '</div></section>';
    }

    const RENDERERS = {
        landing: renderLanding,
        couple: renderCouple,
        story: renderStory,
        events: renderEvents,
        gallery: renderGallery,
        countdown: renderCountdown,
        rsvp: renderRsvp,
        quote: renderQuote,
        gift: renderGift,
        attire: renderAttire,
        faq: renderFaq,
        travel: renderTravel,
        party: renderParty,
        stream: renderStream,
        filmstrip: renderFilmstrip,
        divider: renderDivider,
        outro: renderOutro
    };

    function renderSection(id) {
        const tpl = BY_ID[id];
        if (!tpl) return '';
        return RENDERERS[tpl.kind](tpl);
    }

    /* ---------------- Site renderer ----------------
       Pass a details snapshot as the third argument to render a
       frozen copy (published previews); omit it to use the live
       personalization saved in this browser. */

    function hexLum(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function renderSite(config, mount, detailsSnapshot) {
        if (detailsSnapshot !== undefined) {
            D = buildData(detailsSnapshot);
        } else {
            refreshData();
        }
        const clean = sanitizeConfig(config);
        const ids = [];
        if (clean.landing) ids.push(clean.landing);
        ids.push.apply(ids, clean.sections);
        if (clean.outro) ids.push(clean.outro);

        // Alternate background tones so back-to-back sections of the
        // same theme never share one flat colour (the "PPTX" effect).
        let prevTheme = null, prevAlt = false;
        mount.innerHTML = ids.map(function (id) {
            let html = renderSection(id);
            const tpl = BY_ID[id];
            let alt = false;
            if (tpl && tpl.category === 'content') {
                alt = tpl.theme === prevTheme && !prevAlt;
            }
            if (tpl) { prevTheme = tpl.theme; prevAlt = alt; }
            if (alt) html = html.replace('class="tpl ', 'class="tpl alt ');
            return html;
        }).join('');

        // Custom page background: colour override or backdrop picture.
        // Ink adapts to the colour's luminance so text stays readable
        // whether the couple picks midnight navy or pale cream.
        if (D.styleBg) {
            mount.classList.add('has-bgcolor');
            mount.style.setProperty('--user-bg', D.styleBg);
            const lum = hexLum(D.styleBg);
            mount.classList.toggle('bg-dark', lum < 0.45);
            mount.classList.toggle('bg-light', lum >= 0.45);
        } else {
            mount.classList.remove('has-bgcolor', 'bg-dark', 'bg-light');
            mount.style.removeProperty('--user-bg');
        }

        // Per-section backdrop colours, with the same luminance-aware
        // ink flip applied section by section.
        mount.querySelectorAll('.tpl').forEach(function (sec) {
            const c = D.secBg[sec.getAttribute('data-tpl')];
            if (!c) return;
            sec.classList.add('has-seccolor', hexLum(c) < 0.45 ? 'sec-ink-light' : 'sec-ink-dark');
            sec.style.setProperty('--sec-bg', c);
        });

        applyMedia(mount);

        initInteractions(mount);
        return clean;
    }

    /* ---------------- Section interactivity ---------------- */

    let cdTimer = null;

    // Elements that cascade in as their section scrolls into view.
    // The section itself stays painted at all times — only its
    // content animates, so the next page is never a dark void.
    const RV_SELECTOR = [
        '.sec-head', '.land-inner > *:not(.petal)', '.land-copy > *', '.land-photo',
        '.couple-grid > *', '.tl-item', '.events-grid > *', '.sched-row', '.sched-date',
        '.gal-item', '.cd-unit', '.cd-date', '.cd-cta', '.rsvp-wrap > *',
        '.quote-inner > *', '.gift-note', '.gift-grid > *', '.attire-card',
        '.faq-item', '.travel-card', '.travel-cta', '.outro-inner > *:not(.petal)',
        '.party-side', '.stream-card', '.strip', '.divider-inner',
        '.sarch-item', '.sed-row', '.chap-item',
        '.cpanels > *', '.sal-item', '.cdi > *', '.rsvpc-card', '.rsvpc-wishes',
        '.ledger > *', '.runway > *', '.faqg-item', '.route-stop', '.roll > *',
        '.theatre > *', '.lm-inner > *', '.lm-strip', '.lf-frame > *'
    ].join(', ');

    function initInteractions(root) {
        // Guest personalization: greet the invitee on the landing and
        // pre-fill the RSVP with their name and reserved seats.
        if (GUEST) {
            // Every landing layout family has its own inner container —
            // cover them all so no design silently drops the greeting.
            const host = root.querySelector(
                '.tpl-landing .land-inner, .tpl-landing .land-copy, ' +
                '.tpl-landing .lm-inner, .tpl-landing .lf-frame, .tpl-landing .villa-copy');
            if (host && !host.querySelector('.guest-line')) {
                const div = document.createElement('div');
                div.className = 'guest-line';
                div.innerHTML = '<span>Specially Inviting</span><b>' + GUEST + '</b>' +
                    (GUEST_SEATS ? '<i>' + GUEST_SEATS + ' seat' + (GUEST_SEATS > 1 ? 's' : '') + ' reserved</i>' : '') +
                    '<em>We apologise for any misspelling of name or title</em>';
                host.insertBefore(div, host.querySelector('.land-scroll'));
            }
            root.querySelectorAll('[data-rsvp]').forEach(function (form) {
                if (form.querySelector('.rsvp-seats')) return;
                const p = document.createElement('p');
                p.className = 'rsvp-seats';
                p.innerHTML = 'Dear <b>' + GUEST + '</b>' +
                    (GUEST_SEATS
                        ? ', we have joyfully reserved <b>' + GUEST_SEATS + '</b> seat' + (GUEST_SEATS > 1 ? 's' : '') + ' in your honour.'
                        : ', we would be honoured by your presence.');
                form.insertBefore(p, form.firstChild);
                const nameInput = form.querySelector('[name="guest"]');
                if (nameInput && !nameInput.value) nameInput.value = unesc(GUEST);
            });
        }

        // Mark content for the staggered reveal cascade.
        root.querySelectorAll('.tpl').forEach(function (sec) {
            sec.querySelectorAll(RV_SELECTOR).forEach(function (el, i) {
                el.classList.add('rv');
                el.style.transitionDelay = Math.min(i * 90, 720) + 'ms';
            });
        });

        // Live countdowns
        if (cdTimer) { clearInterval(cdTimer); cdTimer = null; }
        const cds = root.querySelectorAll('[data-countdown]');
        if (cds.length) {
            const tick = function () {
                cds.forEach(function (el) {
                    let diff = new Date(el.getAttribute('data-countdown')).getTime() - Date.now();
                    if (diff < 0) diff = 0;
                    const d = Math.floor(diff / 864e5);
                    const h = Math.floor(diff % 864e5 / 36e5);
                    const m = Math.floor(diff % 36e5 / 6e4);
                    const s = Math.floor(diff % 6e4 / 1e3);
                    const vals = { d: d, h: h, m: m, s: s };
                    el.querySelectorAll('[data-cd]').forEach(function (n) {
                        const v = String(vals[n.getAttribute('data-cd')]).padStart(2, '0');
                        // Pulse a digit gently whenever it changes
                        if (n.textContent !== v && n.textContent !== '—') {
                            n.classList.remove('tick');
                            void n.offsetWidth;
                            n.classList.add('tick');
                        }
                        n.textContent = v;
                    });
                });
            };
            tick();
            cdTimer = setInterval(tick, 1000);
        }

        // Demo RSVP forms: add the wish to the local wall only
        root.querySelectorAll('[data-rsvp]').forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const guest = form.querySelector('[name="guest"]').value.trim() || 'A Guest';
                const wishText = form.querySelector('[name="wish"]').value.trim();
                const wall = form.parentElement.querySelector('.wishes');
                if (wishText && wall) {
                    const li = document.createElement('li');
                    li.className = 'wish wish-new';
                    const t = document.createElement('p');
                    t.className = 'wish-text';
                    t.textContent = '“' + wishText + '”';
                    const by = document.createElement('p');
                    by.className = 'wish-by';
                    by.textContent = '— ' + guest;
                    li.appendChild(t); li.appendChild(by);
                    wall.insertBefore(li, wall.firstChild);
                }
                form.reset();
                toast('Thank you, ' + guest + '! This is a preview — RSVPs are not stored.');
            });
        });

        // Copy buttons (gift accounts)
        root.querySelectorAll('[data-copy]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                copyText(btn.getAttribute('data-copy'), 'Account number copied.');
            });
        });

        // Reveal-on-scroll: cascade the section's content in, then
        // drop the inline stagger delays so hover effects stay snappy.
        const reveal = function (sec) {
            sec.classList.add('tpl-in');
            setTimeout(function () {
                sec.querySelectorAll('.rv').forEach(function (el) {
                    el.style.transitionDelay = '';
                });
            }, 1800);
        };

        const obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -8% 0px' });

        root.querySelectorAll('.tpl').forEach(function (sec) {
            const r = sec.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) {
                reveal(sec);
            } else {
                obs.observe(sec);
            }
        });
    }

    function copyText(text, okMsg) {
        const done = function () { toast(okMsg || 'Copied to clipboard.'); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
        } else {
            fallbackCopy(text); done();
        }
    }

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* best effort */ }
        document.body.removeChild(ta);
    }

    /* ---------------- Modal focus trap ----------------
       Keeps keyboard focus cycling inside an open dialog and returns
       it to the previously focused element on release. */

    function trapFocus(container) {
        const prev = document.activeElement;
        const SEL = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const focusables = function () {
            return Array.prototype.filter.call(container.querySelectorAll(SEL), function (el) {
                return el.offsetParent !== null;
            });
        };
        const first = focusables()[0];
        if (first) first.focus();
        const onKey = function (e) {
            if (e.key !== 'Tab') return;
            const list = focusables();
            if (!list.length) return;
            const firstEl = list[0], lastEl = list[list.length - 1];
            if (e.shiftKey && document.activeElement === firstEl) {
                e.preventDefault();
                lastEl.focus();
            } else if (!e.shiftKey && document.activeElement === lastEl) {
                e.preventDefault();
                firstEl.focus();
            }
        };
        container.addEventListener('keydown', onKey);
        return function release() {
            container.removeEventListener('keydown', onKey);
            if (prev && typeof prev.focus === 'function') {
                try { prev.focus(); } catch (e) { /* gone from the DOM */ }
            }
        };
    }

    /* ---------------- Toasts ---------------- */

    function toast(msg) {
        let holder = document.getElementById('vvToasts');
        if (!holder) {
            holder = document.createElement('div');
            holder.id = 'vvToasts';
            document.body.appendChild(holder);
        }
        const t = document.createElement('div');
        t.className = 'vv-toast';
        t.textContent = msg;
        holder.appendChild(t);
        requestAnimationFrame(function () { t.classList.add('show'); });
        setTimeout(function () {
            t.classList.remove('show');
            setTimeout(function () { t.remove(); }, 400);
        }, 3200);
    }

    /* ---------------- Client-side store ----------------
       Draft:      vv_draft                (the builder selection)
       Details:    vv_details              (personalized text)
       Published:  vv_site_<uuid>          (temporary preview payloads) */

    const DRAFT_KEY = 'vv_draft';
    const DETAILS_KEY = 'vv_details';
    const SITE_PREFIX = 'vv_site_';
    const SITE_TTL = 7 * 24 * 60 * 60 * 1000; // previews live for 7 days

    function emptyDraft() {
        return { landing: null, sections: [], outro: null };
    }

    // Enforce the category rules no matter where a config came from:
    // exactly one landing, up to 7 content sections, exactly one outro,
    // and at most KIND_LIMITS[kind] sections of any capped type.
    function sanitizeConfig(cfg) {
        const out = emptyDraft();
        if (!cfg || typeof cfg !== 'object') return out;
        if (cfg.landing && BY_ID[cfg.landing] && BY_ID[cfg.landing].category === 'landing') {
            out.landing = cfg.landing;
        }
        if (Array.isArray(cfg.sections)) {
            const kindCount = {};
            out.sections = cfg.sections.filter(function (id, i, arr) {
                if (!BY_ID[id] || BY_ID[id].category !== 'content' || arr.indexOf(id) !== i) return false;
                const kind = BY_ID[id].kind;
                if (KIND_LIMITS[kind]) {
                    kindCount[kind] = (kindCount[kind] || 0) + 1;
                    if (kindCount[kind] > KIND_LIMITS[kind]) return false;
                }
                return true;
            }).slice(0, MAX_CONTENT);
        }
        if (cfg.outro && BY_ID[cfg.outro] && BY_ID[cfg.outro].category === 'outro') {
            out.outro = cfg.outro;
        }
        return out;
    }

    function getDraft() {
        try {
            return sanitizeConfig(JSON.parse(localStorage.getItem(DRAFT_KEY)));
        } catch (e) {
            return emptyDraft();
        }
    }

    function saveDraft(draft) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(sanitizeConfig(draft)));
        backupSync();
    }

    function clearDraft() {
        localStorage.removeItem(DRAFT_KEY);
        backupSync();
    }

    function getDetails() {
        try {
            const det = JSON.parse(localStorage.getItem(DETAILS_KEY));
            return (det && typeof det === 'object') ? det : {};
        } catch (e) {
            return {};
        }
    }

    function saveDetails(details) {
        localStorage.setItem(DETAILS_KEY, JSON.stringify(details || {}));
        refreshData();
        backupSync();
    }

    function clearDetails() {
        localStorage.removeItem(DETAILS_KEY);
        refreshData();
        backupSync();
    }

    /* ---- Text backup (IndexedDB) ----
       A write-through mirror of the draft & personalization text,
       kept in the same IndexedDB that already holds the photos. If
       localStorage is ever lost while IndexedDB survives, the studio
       offers to restore from here. localStorage always stays the
       source of truth — the backup is only read when it is empty.
       Images and audio are NOT part of this backup (they already
       live in IndexedDB themselves). */

    const BACKUP_KEY = 'backup_state';

    function hasLocalData() {
        const d = getDraft();
        const det = getDetails();
        return !!(d.landing || d.outro || d.sections.length || Object.keys(det).length);
    }

    // Mirror the current localStorage state into IndexedDB. Fire and
    // forget: a failed backup must never break a save.
    function backupSync() {
        try {
            mediaSet(BACKUP_KEY, {
                draft: getDraft(),
                details: getDetails(),
                savedAt: Date.now()
            }).catch(function () { /* best effort */ });
        } catch (e) { /* best effort */ }
    }

    // The stored backup, or null when absent / effectively empty.
    function getBackup() {
        return mediaGet(BACKUP_KEY).then(function (rec) {
            if (!rec || typeof rec !== 'object') return null;
            const draft = sanitizeConfig(rec.draft);
            const details = (rec.details && typeof rec.details === 'object') ? rec.details : {};
            const empty = !draft.landing && !draft.outro && !draft.sections.length &&
                !Object.keys(details).length;
            if (empty) return null;
            return { draft: draft, details: details, savedAt: rec.savedAt || 0 };
        });
    }

    // Write a backup back into localStorage (recovery accepted).
    function restoreBackup(backup) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(sanitizeConfig(backup.draft)));
        localStorage.setItem(DETAILS_KEY, JSON.stringify(backup.details || {}));
        refreshData();
    }

    function discardBackup() {
        return mediaRemove(BACKUP_KEY);
    }

    function uuid() {
        if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
        // RFC-4122-ish fallback
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    // Publish the draft (plus a snapshot of the personalized text)
    // under a fresh UUID and return the id.
    function publish(config) {
        const id = uuid();
        localStorage.setItem(SITE_PREFIX + id, JSON.stringify({
            v: 2,
            createdAt: Date.now(),
            config: sanitizeConfig(config),
            details: getDetails()
        }));
        return id;
    }

    function getSite(id) {
        try {
            const raw = localStorage.getItem(SITE_PREFIX + id);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || Date.now() - data.createdAt > SITE_TTL) {
                localStorage.removeItem(SITE_PREFIX + id);
                return null;
            }
            return {
                config: sanitizeConfig(data.config),
                details: (data.details && typeof data.details === 'object') ? data.details : {}
            };
        } catch (e) {
            return null;
        }
    }

    /* ---- Website codes ----
       A website code is the whole page in one portable string:
       section layout + personalized text, base64-encoded. Clients
       email it to us; we rebuild their exact page from it via
       preview.html?c=<code> (or the paste box on the preview page). */

    const CODE_PREFIX = 'VV2.';

    function encodeSite(config, details) {
        const json = JSON.stringify({
            v: 2,
            config: sanitizeConfig(config),
            details: (details && typeof details === 'object') ? details : {}
        });
        return CODE_PREFIX + btoa(unescape(encodeURIComponent(json)));
    }

    function decodeSite(str) {
        try {
            // Email clients wrap long lines — strip all whitespace first.
            let s = String(str).replace(/\s+/g, '');
            const at = s.indexOf(CODE_PREFIX);
            if (at !== -1) s = s.slice(at + CODE_PREFIX.length);
            s = s.replace(/[^A-Za-z0-9+/=]/g, '');
            if (!s) return null;
            const data = JSON.parse(decodeURIComponent(escape(atob(s))));
            if (!data || typeof data !== 'object' || !data.config) return null;
            return {
                config: sanitizeConfig(data.config),
                details: (data.details && typeof data.details === 'object') ? data.details : {}
            };
        } catch (e) {
            return null;
        }
    }

    // Drop expired previews so localStorage stays tidy.
    function cleanup() {
        const dead = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.indexOf(SITE_PREFIX) === 0) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (!data || Date.now() - data.createdAt > SITE_TTL) dead.push(key);
                } catch (e) {
                    dead.push(key);
                }
            }
        }
        dead.forEach(function (key) { localStorage.removeItem(key); });
    }

    /* ---------------- Thumbnails (builder cards) ---------------- */

    function thumbGlyph(tpl) {
        const ini = D.bride.initial + '·' + D.groom.initial;
        // Second-variant glyphs, so the two designs of one section
        // type read differently in the library at a glance.
        switch (tpl.layout) {
            case 'panels':
                return '<span class="th-row"><i class="th-panel"></i><b class="th-amp">&amp;</b><i class="th-panel"></i></span>';
            case 'rows':
                return '<span class="th-col"><span class="th-tl"><i class="th-line w30 acc"></i><i class="th-line w50"></i></span><span class="th-tl"><i class="th-line w30 acc"></i><i class="th-line w40"></i></span><span class="th-tl"><i class="th-line w30 acc"></i><i class="th-line w50"></i></span></span>';
            case 'salon':
                return '<span class="th-salon"><i class="s-tall"></i><i></i><i></i></span>';
            case 'inline':
                return '<b class="th-title">12·12</b><span class="th-row th-dots"><i></i><i></i><i></i><i></i></span>';
            case 'card':
                return '<span class="th-cardbig"><i class="th-line w60"></i><i class="th-line w50"></i><i class="th-btn"></i></span>';
            case 'photo':
                return '<span class="th-shade"><b class="th-quote serif">“ ”</b></span>';
            case 'ledger':
                return '<span class="th-ledger"><span><i class="th-line w40"></i><i class="th-dotbtn"></i></span><span><i class="th-line w40"></i><i class="th-dotbtn"></i></span></span>';
            case 'runway':
                return '<span class="th-bars"><i></i><i></i><i></i><i></i></span>';
            case 'grid':
                return '<span class="th-grid2"><i></i><i></i><i></i><i></i></span>';
            case 'route':
                return '<span class="th-route"><i class="th-rstop"></i><i class="th-rline"></i><i class="th-rstop"></i><i class="th-rline"></i><i class="th-rstop"></i></span><i class="th-line w40"></i>';
            case 'roll':
                return '<span class="th-col"><i class="th-line w30 acc"></i><b class="th-title sm">' + ini + '</b><i class="th-line w40"></i></span>';
            case 'theatre':
                return '<span class="th-screen"><i class="th-play"></i></span>';
            case 'double':
                return '<span class="th-col"><span class="th-row th-strip"><i></i><i></i><i></i></span><span class="th-row th-strip"><i></i><i></i><i></i></span></span>';
            case 'crest':
                return '<span class="th-diamond"></span><i class="th-line w30"></i>';
            case 'marquee':
                return '<b class="th-title">' + D.bride.initial + ' &amp; ' + D.groom.initial + '</b><span class="th-row th-strip"><i></i><i></i><i></i></span>';
            case 'frame':
                return '<span class="th-frame"><b class="th-title sm">' + ini + '</b></span>';
            case 'signoff':
                return '<b class="th-script big">' + D.bride.initial + ' &amp; ' + D.groom.initial + '</b><i class="th-line w30"></i>';
            case 'polaroid':
                return '<span class="th-pola"></span>';
            case 'arch':
                return '<span class="th-row"><i class="th-archs"></i><i class="th-archs"></i><i class="th-archs"></i></span>';
            case 'editorial':
                return '<span class="th-col"><span class="th-tl"><i class="th-photo"></i><i class="th-line w40"></i></span><span class="th-tl"><i class="th-line w40"></i><i class="th-photo"></i></span></span>';
            case 'chapters':
                return '<span class="th-row"><b class="th-num serif">01</b><i class="th-photo"></i><i class="th-line w30"></i></span>';
        }
        // Full-photograph landing (terra) — show it as a photo cover
        // so it reads differently from the arch landing beside it.
        if (tpl.id === 'landing-court-terra') {
            return '<span class="th-shade"><b class="th-title">' + D.bride.initial + ' &amp; ' + D.groom.initial + '</b></span>';
        }
        switch (tpl.kind) {
            case 'landing':
                return '<i class="th-line w30"></i><b class="th-title">' + D.bride.initial + ' &amp; ' + D.groom.initial + '</b><i class="th-line w50"></i>';
            case 'couple':
                return '<span class="th-row"><i class="th-circle"></i><b class="th-amp">&amp;</b><i class="th-circle"></i></span><i class="th-line w40"></i>';
            case 'story':
                return '<span class="th-col"><span class="th-tl"><i class="th-dot"></i><i class="th-line w50"></i></span><span class="th-tl"><i class="th-dot"></i><i class="th-line w40"></i></span><span class="th-tl"><i class="th-dot"></i><i class="th-line w60"></i></span></span>';
            case 'events':
                return '<span class="th-row"><i class="th-card"></i><i class="th-card"></i></span>';
            case 'gallery':
                return '<span class="th-grid"><i></i><i></i><i></i><i></i><i></i><i></i></span>';
            case 'countdown':
                return '<span class="th-row"><i class="th-box"></i><i class="th-box"></i><i class="th-box"></i><i class="th-box"></i></span><i class="th-line w30"></i>';
            case 'rsvp':
                return '<span class="th-col"><i class="th-line w70"></i><i class="th-line w70"></i><i class="th-btn"></i></span>';
            case 'quote':
                return '<b class="th-quote serif">“ ”</b><i class="th-line w50"></i>';
            case 'gift':
                return '<span class="th-row"><i class="th-card tall"></i><i class="th-card tall"></i></span>';
            case 'attire':
                return '<span class="th-row th-dots"><i></i><i></i><i></i><i></i><i></i></span><i class="th-line w40"></i>';
            case 'faq':
                return '<span class="th-col"><span class="th-faq"><i class="th-line w60"></i><b>+</b></span><span class="th-faq"><i class="th-line w50"></i><b>+</b></span><span class="th-faq"><i class="th-line w60"></i><b>+</b></span></span>';
            case 'travel':
                return '<span class="th-row"><i class="th-card sm"></i><i class="th-card sm"></i><i class="th-card sm"></i></span><i class="th-line w30"></i>';
            case 'party':
                return '<span class="th-row"><span class="th-col"><i class="th-head"></i><i class="th-line w70"></i><i class="th-line w50"></i></span><b class="th-amp">&amp;</b><span class="th-col"><i class="th-head"></i><i class="th-line w70"></i><i class="th-line w50"></i></span></span>';
            case 'stream':
                return '<i class="th-play"></i><i class="th-line w40"></i>';
            case 'filmstrip':
                return '<span class="th-row th-strip"><i></i><i></i><i></i><i></i></span>';
            case 'divider':
                return '<span class="th-row"><i class="th-line w30"></i><b class="th-amp">' + D.bride.initial + '·' + D.groom.initial + '</b><i class="th-line w30"></i></span>';
            case 'outro':
                return '<b class="th-script">Thank you</b><i class="th-line w30"></i>';
            default:
                return '<i class="th-line w50"></i>';
        }
    }

    function thumb(tpl) {
        const pal = THEMES[tpl.theme].thumb;
        return '<div class="thumb" style="--th-bg:' + pal.bg + ';--th-ink:' + pal.ink + ';--th-accent:' + pal.accent + '">' +
            thumbGlyph(tpl) + '</div>';
    }

    /* ---------------- Public API ---------------- */

    return {
        DEMO: DEMO,
        data: function () { return D; },
        refreshData: refreshData,
        TRACKS: TRACKS,
        THEMES: THEMES,
        TEMPLATES: TEMPLATES,
        byId: BY_ID,
        SAMPLES: SAMPLES,
        samplesById: SAMPLES_BY_ID,
        CATEGORY_LABELS: CATEGORY_LABELS,
        KIND_LABELS: KIND_LABELS,
        MAX_CONTENT: MAX_CONTENT,
        KIND_LIMITS: KIND_LIMITS,
        countKind: countKind,
        LIST_LIMITS: LIST_LIMITS,
        getCounts: getCounts,
        demoItem: demoItem,
        renderSection: renderSection,
        renderSite: renderSite,
        initInteractions: initInteractions,
        thumb: thumb,
        toast: toast,
        copyText: copyText,
        trapFocus: trapFocus,
        encodeSite: encodeSite,
        decodeSite: decodeSite,
        setGuest: setGuest,
        getGuest: getGuest,
        IMAGE_SLOTS: IMAGE_SLOTS,
        media: {
            get: mediaGet,
            set: mediaSet,
            remove: mediaRemove,
            list: mediaList,
            url: mediaUrl,
            apply: applyMedia
        },
        store: {
            emptyDraft: emptyDraft,
            sanitize: sanitizeConfig,
            getDraft: getDraft,
            saveDraft: saveDraft,
            clearDraft: clearDraft,
            getDetails: getDetails,
            saveDetails: saveDetails,
            clearDetails: clearDetails,
            publish: publish,
            getSite: getSite,
            cleanup: cleanup,
            uuid: uuid,
            backup: {
                sync: backupSync,
                get: getBackup,
                restore: restoreBackup,
                discard: discardBackup,
                hasLocalData: hasLocalData
            }
        }
    };
})();
