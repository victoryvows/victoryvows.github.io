/* ============================================================
   Victory Vows — regression test suite
   Run before pushing:  node test.js   (or: npm test)

   Dependency-free except the QR decode suite, which uses jsqr
   when installed (npm install) and is skipped otherwise.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

/* ---------------- Browser stubs so templates.js loads ---------------- */

let LS = {};
global.window = {};
// Node ≥21 ships a read-only global navigator; templates.js guards its
// use, so only stub it on older runtimes where it's absent.
if (typeof navigator === 'undefined') {
    global.navigator = {};
}
global.localStorage = {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(LS, k) ? LS[k] : null; },
    setItem: function (k, v) { LS[k] = String(v); },
    removeItem: function (k) { delete LS[k]; },
    key: function (i) { return Object.keys(LS)[i] || null; },
    get length() { return Object.keys(LS).length; }
};

/* eslint-disable no-eval */
eval(fs.readFileSync(path.join(__dirname, 'templates.js'), 'utf8'));
require(path.join(__dirname, 'qr.js'));
const VV = window.VV;
// qr.js attaches to `window` when one exists — ours is the stub above.
const VVQR = window.VVQR || globalThis.VVQR;

/* ---------------- Tiny harness ---------------- */

let passed = 0, failed = 0;
let suite = '';

function describe(name) {
    suite = name;
    process.stdout.write('\n' + name + '\n');
}

function check(name, cond, detail) {
    if (cond) {
        passed++;
        process.stdout.write('  ✓ ' + name + '\n');
    } else {
        failed++;
        process.stdout.write('  ✗ ' + name + (detail ? ' — ' + detail : '') + '\n');
    }
}

function resetState() {
    LS = {};
    VV.refreshData();
}

const THEMES = Object.keys(VV.THEMES);
const TYPES = ['landing', 'outro'].concat(Object.keys(VV.KIND_LABELS));

/* ---------------- 1. Template registry ---------------- */

describe('Template registry');
resetState();
{
    const ids = new Set();
    const dupes = [];
    VV.TEMPLATES.forEach(function (t) {
        if (ids.has(t.id)) dupes.push(t.id);
        ids.add(t.id);
    });
    check('no duplicate template ids', dupes.length === 0, dupes.join(', '));

    const byCombo = {};
    VV.TEMPLATES.forEach(function (t) {
        byCombo[t.kind + '|' + t.theme] = (byCombo[t.kind + '|' + t.theme] || 0) + 1;
    });
    const under = [];
    TYPES.forEach(function (k) {
        THEMES.forEach(function (th) {
            if ((byCombo[k + '|' + th] || 0) < 2) under.push(k + '×' + th);
        });
    });
    check('every section type × theme has ≥ 2 designs (' + TYPES.length * THEMES.length + ' combos)',
        under.length === 0, under.slice(0, 5).join(', '));

    const badTheme = VV.TEMPLATES.filter(function (t) { return !VV.THEMES[t.theme]; });
    check('every template references a real theme', badTheme.length === 0,
        badTheme.map(function (t) { return t.id; }).join(', '));

    check('some Studio Only exclusives remain', VV.TEMPLATES.some(function (t) { return t.exclusive; }));
}

/* ---------------- 2. Rendering ---------------- */

describe('Section rendering (' + VV.TEMPLATES.length + ' templates)');
resetState();
{
    let renderFails = [], undef = [], missingTpl = [];
    VV.TEMPLATES.forEach(function (t) {
        let html;
        try {
            html = VV.renderSection(t.id);
        } catch (e) {
            renderFails.push(t.id + ' (' + e.message + ')');
            return;
        }
        if (!html || html.length < 100) renderFails.push(t.id + ' (empty)');
        if (html.indexOf('undefined') !== -1) undef.push(t.id);
        if (html.indexOf('data-tpl="' + t.id + '"') === -1) missingTpl.push(t.id);
    });
    check('all templates render', renderFails.length === 0, renderFails.slice(0, 5).join(', '));
    check('no "undefined" leaks into HTML', undef.length === 0, undef.slice(0, 5).join(', '));
    check('every section carries its data-tpl id', missingTpl.length === 0, missingTpl.slice(0, 5).join(', '));

    // Every image a rendered section references must exist on disk
    const imgs = new Set();
    VV.TEMPLATES.forEach(function (t) {
        (VV.renderSection(t.id).match(/assets\/[a-z]+\/[a-zA-Z0-9_-]+\.(?:jpg|png|svg|mp3)/g) || [])
            .forEach(function (m) { imgs.add(m); });
    });
    Object.keys(VV.TRACKS).forEach(function (k) { imgs.add(VV.TRACKS[k].file); });
    const missing = Array.from(imgs).filter(function (p) { return !fs.existsSync(path.join(__dirname, p)); });
    check('all ' + imgs.size + ' referenced asset files exist', missing.length === 0, missing.join(', '));
}

/* ---------------- 3. Thumbnails ---------------- */

describe('Builder thumbnails');
resetState();
{
    let thumbFails = [];
    VV.TEMPLATES.forEach(function (t) {
        const th = VV.thumb(t);
        if (!th || th.indexOf('undefined') !== -1) thumbFails.push(t.id);
    });
    check('all thumbnails render cleanly', thumbFails.length === 0, thumbFails.slice(0, 5).join(', '));

    const groups = {};
    VV.TEMPLATES.forEach(function (t) {
        (groups[t.kind + '|' + t.theme] = groups[t.kind + '|' + t.theme] || []).push(t);
    });
    const same = Object.keys(groups).filter(function (k) {
        const thumbs = groups[k].map(function (t) { return VV.thumb(t); });
        return groups[k].length >= 2 && new Set(thumbs).size < 2;
    });
    check('the designs of each type×theme have distinct thumbnails', same.length === 0, same.join(', '));
}

/* ---------------- 4. Sample websites ---------------- */

describe('Sample websites');
resetState();
{
    const noSample = THEMES.filter(function (th) {
        return !VV.SAMPLES.some(function (s) { return s.theme === th; });
    });
    check('every theme has a sample website', noSample.length === 0, noSample.join(', '));

    const misnamed = VV.SAMPLES.filter(function (s) { return s.name !== VV.THEMES[s.theme].label; });
    check('sample names match their theme labels', misnamed.length === 0,
        misnamed.map(function (s) { return s.name; }).join(', '));

    let broken = [];
    VV.SAMPLES.forEach(function (s) {
        const ids = [s.landing, s.outro].concat(s.sections);
        ids.forEach(function (id) { if (!VV.byId[id]) broken.push(s.id + '→' + id); });
        const clean = VV.store.sanitize({ landing: s.landing, sections: s.sections, outro: s.outro });
        if (clean.sections.length !== s.sections.length || !clean.landing || !clean.outro) {
            broken.push(s.id + ' (mutated by sanitize)');
        }
        if (s.sections.length > VV.MAX_CONTENT) broken.push(s.id + ' (over cap)');
    });
    check('all samples valid and survive sanitize untouched', broken.length === 0, broken.slice(0, 5).join(', '));
}

/* ---------------- 5. Config sanitizing & caps ---------------- */

describe('Config sanitizing');
resetState();
{
    check('MAX_CONTENT is 7', VV.MAX_CONTENT === 7);
    check('KIND_LIMITS caps couple/gallery/story/filmstrip at 1',
        VV.KIND_LIMITS.couple === 1 && VV.KIND_LIMITS.gallery === 1 &&
        VV.KIND_LIMITS.story === 1 && VV.KIND_LIMITS.filmstrip === 1);

    const over = VV.store.sanitize({
        landing: 'landing-noir', outro: 'outro-noir',
        sections: ['couple-noir', 'quote-noir', 'events-noir', 'gift-noir', 'attire-noir',
            'faq-noir', 'travel-noir', 'party-noir', 'stream-noir']
    });
    check('sections capped at ' + VV.MAX_CONTENT, over.sections.length === VV.MAX_CONTENT);

    const dupKind = VV.store.sanitize({
        landing: 'landing-noir', outro: 'outro-noir',
        sections: ['gallery-noir', 'gallery-blush', 'story-noir', 'story-azure',
            'couple-noir', 'couple-panels-noir', 'filmstrip-noir', 'filmstrip-double-noir']
    });
    const kinds = {};
    dupKind.sections.forEach(function (id) {
        const k = VV.byId[id].kind;
        kinds[k] = (kinds[k] || 0) + 1;
    });
    check('capped kinds keep only their first design',
        kinds.gallery === 1 && kinds.story === 1 && kinds.couple === 1 && kinds.filmstrip === 1 &&
        dupKind.sections[0] === 'gallery-noir');

    const junk = VV.store.sanitize({
        landing: 'couple-noir',            // wrong category
        outro: 'nope',                     // unknown id
        sections: ['landing-noir', 'ghost-id', 'events-noir', 'events-noir']
    });
    check('wrong categories, unknown ids and duplicates are dropped',
        junk.landing === null && junk.outro === null &&
        junk.sections.length === 1 && junk.sections[0] === 'events-noir');
}

/* ---------------- 6. Flexible list counts ---------------- */

describe('Flexible list counts');
resetState();
{
    let D = VV.data();
    check('defaults: 3 milestones, 2 events, 2 gifts, 3+3 party',
        D.story.length === 3 && D.events.length === 2 && D.gifts.length === 2 &&
        D.party.bridesmaids.length === 3 && D.party.groomsmen.length === 3);

    VV.store.saveDetails({
        counts: { story: 5, events: 4, gifts: 3, bridesmaids: 6, groomsmen: 1 },
        story: [null, null, null, { title: 'Custom 4th' }]
    });
    D = VV.data();
    check('lists grow to requested sizes',
        D.story.length === 5 && D.events.length === 4 && D.gifts.length === 3 &&
        D.party.bridesmaids.length === 6 && D.party.groomsmen.length === 1);
    check('user text overlays an added item', D.story[3].title === 'Custom 4th');
    check('untouched added items carry curated sample text',
        D.story[4].title.length > 0 && D.events[2].title.length > 0);

    VV.store.saveDetails({ counts: { story: 99, events: 0, gifts: -3, bridesmaids: 'x' } });
    D = VV.data();
    check('counts clamp to limits (99→5, 0→1, -3→1, junk→default)',
        D.story.length === VV.LIST_LIMITS.story.max && D.events.length === VV.LIST_LIMITS.events.min &&
        D.gifts.length === VV.LIST_LIMITS.gifts.min && D.party.bridesmaids.length === VV.LIST_LIMITS.bridesmaids.def);

    VV.store.saveDetails({ counts: { events: 3 }, date: '2027-03-20' });
    D = VV.data();
    check('custom wedding date flows into added event cards',
        D.events[2].date === 'Saturday, 20 March 2027');

    VV.store.saveDetails({ counts: { story: 5 } });
    VV.refreshData();
    const arch = VV.renderSection('story-arch-blush');
    check('grown story renders 5 photo milestones with story4/story5 slots',
        (arch.match(/sarch-item/g) || []).length === 5 &&
        arch.indexOf('data-slot="story4"') !== -1 && arch.indexOf('data-slot="story5"') !== -1);
}

/* ---------------- 7. Website codes ---------------- */

describe('Website codes');
resetState();
{
    const details = {
        bride: { name: 'Test Bride' }, city: 'Jakarta',
        counts: { story: 4 }, story: [null, null, null, { title: 'Round Trip' }]
    };
    const config = { landing: 'landing-royal', sections: ['couple-royal', 'story-royal'], outro: 'outro-royal' };
    const code = VV.encodeSite(config, details);
    check('code carries the VV2. prefix', code.indexOf('VV2.') === 0);

    const dec = VV.decodeSite(code);
    check('round-trip preserves config',
        dec && dec.config.landing === config.landing && dec.config.outro === config.outro &&
        dec.config.sections.join() === config.sections.join());
    check('round-trip preserves details incl. counts',
        dec.details.city === 'Jakarta' && dec.details.counts.story === 4 &&
        dec.details.story[3].title === 'Round Trip');

    const wrapped = 'Please see below:\n  ' + code.slice(0, 40) + '\n' + code.slice(40) + '  \n';
    const dec2 = VV.decodeSite(wrapped);
    check('decode survives email line-wrapping and surrounding text',
        dec2 && dec2.config.landing === config.landing);

    check('garbage codes return null',
        VV.decodeSite('VV2.!!!not-base64!!!') === null && VV.decodeSite('hello') === null);
}

/* ---------------- 8. Cross-file consistency ---------------- */

describe('Cross-file consistency');
resetState();
{
    const genHtml = fs.readFileSync(path.join(__dirname, 'generator.html'), 'utf8');
    check('generator.html copy matches MAX_CONTENT',
        genHtml.indexOf('up to ' + VV.MAX_CONTENT + ' mix') !== -1 &&
        genHtml.indexOf('0 / ' + VV.MAX_CONTENT) !== -1);

    const previewSrc = fs.readFileSync(path.join(__dirname, 'preview.js'), 'utf8');
    const unlisted = VV.IMAGE_SLOTS.filter(function (s) {
        return previewSrc.indexOf('img_' + s + ':') === -1;
    });
    check('every image slot is listed in the go-live email manifest',
        unlisted.length === 0, unlisted.join(', '));

    // Every local asset referenced from HTML/CSS/JS must exist on disk
    const refFiles = ['index.html', 'generator.html', 'sample.html', 'preview.html',
        'styles.css', 'generator.css', 'templates.js', 'script.js', 'mascot.js'];
    const refs = new Set();
    refFiles.forEach(function (f) {
        const src = fs.readFileSync(path.join(__dirname, f), 'utf8');
        (src.match(/(?:src|href)="([^"#{}<>]+)"|url\('([^'#{}]+)'\)|'(assets\/[^']+)'/g) || []).forEach(function (m) {
            let p = m.replace(/^(?:src|href)="|^url\('|^'/, '').replace(/["')\\]+$/, '');
            if (/^(https?:|\/\/|mailto:|tel:|data:|#)/.test(p)) return;
            if (/\.(html|css|js)$/.test(p)) return; // page links checked by loading
            if (p.indexOf('.') === -1) return;
            if (/['"+\\ ]/.test(p)) return;        // JS string concatenation, not a path
            refs.add(p.split('?')[0]);
        });
    });
    const dead = Array.from(refs).filter(function (p) { return !fs.existsSync(path.join(__dirname, p)); });
    check('all ' + refs.size + ' referenced local assets exist', dead.length === 0, dead.join(', '));
}

/* ---------------- 9. QR encoder (decode-verified) ---------------- */

describe('QR encoder');
{
    let jsQR = null;
    try { jsQR = require('jsqr'); } catch (e) { /* optional */ }
    if (!jsQR) {
        process.stdout.write('  – skipped (run `npm install` to enable decode verification)\n');
    } else {
        const decode = function (m) {
            const scale = 8, quiet = 4;
            const size = (m.length + quiet * 2) * scale;
            const data = new Uint8ClampedArray(size * size * 4).fill(255);
            for (let r = 0; r < m.length; r++) {
                for (let c = 0; c < m.length; c++) {
                    if (!m[r][c]) continue;
                    for (let dy = 0; dy < scale; dy++) {
                        for (let dx = 0; dx < scale; dx++) {
                            const i = (((r + quiet) * scale + dy) * size + (c + quiet) * scale + dx) * 4;
                            data[i] = data[i + 1] = data[i + 2] = 0;
                        }
                    }
                }
            }
            const res = jsQR(data, size, size);
            return res ? res.data : null;
        };

        let sweepFails = [];
        for (let len = 1; len <= 213; len += 4) {
            const s = 'https://u.io/'.slice(0, Math.min(13, len)).padEnd(len, 'z');
            if (decode(VVQR.matrix(s)) !== s) sweepFails.push(len);
        }
        [1, 14, 15, 26, 27, 42, 43, 62, 63, 84, 85, 106, 107, 122, 123, 152, 153, 180, 181, 213]
            .forEach(function (len) {
                const s = 'q'.repeat(len);
                if (decode(VVQR.matrix(s)) !== s) sweepFails.push('b' + len);
            });
        check('length sweep + version boundaries decode correctly', sweepFails.length === 0,
            'lengths: ' + sweepFails.join(', '));

        const guest = 'https://victoryvows.github.io/preview.html?w=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d&to=Jonathan%20%26%20Priya&max=4';
        check('realistic guest link decodes', decode(VVQR.matrix(guest)) === guest);
        check('UTF-8 text decodes', decode(VVQR.matrix('Ünïcödé ♥ 婚礼')) === 'Ünïcödé ♥ 婚礼');

        let threw = false;
        try { VVQR.matrix('x'.repeat(500)); } catch (e) { threw = true; }
        check('oversized payloads throw instead of corrupting', threw);
    }
}

/* ---------------- 10. Store & backup API ---------------- */

describe('Store & backup API');
resetState();
{
    check('backup API is exported',
        typeof VV.store.backup.sync === 'function' && typeof VV.store.backup.get === 'function' &&
        typeof VV.store.backup.restore === 'function' && typeof VV.store.backup.discard === 'function' &&
        typeof VV.store.backup.hasLocalData === 'function');

    check('hasLocalData false on a clean slate', VV.store.backup.hasLocalData() === false);
    VV.store.saveDraft({ landing: 'landing-noir', sections: [], outro: null });
    check('hasLocalData true once a draft exists', VV.store.backup.hasLocalData() === true);
    check('saveDraft works without IndexedDB (backup is best-effort)',
        VV.store.getDraft().landing === 'landing-noir');

    const id = VV.store.publish({ landing: 'landing-noir', sections: ['couple-noir'], outro: 'outro-noir' });
    const site = VV.store.getSite(id);
    check('publish + getSite round-trips', !!site && site.config.landing === 'landing-noir');

    check('focus-trap helper is exported', typeof VV.trapFocus === 'function');
}

/* ---------------- Result ---------------- */

process.stdout.write('\n' + '─'.repeat(46) + '\n');
process.stdout.write(passed + ' passed · ' + failed + ' failed\n');
process.exit(failed ? 1 : 0);
