/* ============================================================
   Wedding Website Studio — hub page logic
   (samples gallery, section library with filters, builder with
   drag & drop, and the personalization form)
   ============================================================ */

(function () {
    'use strict';

    const store = VV.store;
    store.cleanup();
    VV.refreshData();

    let draft = store.getDraft();

    /* ---------------- Helpers ---------------- */

    function saveAndRefresh() {
        store.saveDraft(draft);
        draft = store.getDraft();
        renderBuilder();
        refreshLibraryButtons();
        refreshFab();
        // Section-backdrop cards mirror the draft, so rebuild the studio
        renderMediaStudio();
    }

    function isSelected(id) {
        return draft.landing === id || draft.outro === id || draft.sections.indexOf(id) !== -1;
    }

    // Toggle a template in/out of the draft, enforcing category rules.
    function toggleTemplate(id) {
        const tpl = VV.byId[id];
        if (!tpl) return;

        if (tpl.category === 'landing') {
            draft.landing = draft.landing === id ? null : id;
            VV.toast(draft.landing ? '“' + tpl.name + '” set as your landing page.' : 'Landing page removed.');
        } else if (tpl.category === 'outro') {
            draft.outro = draft.outro === id ? null : id;
            VV.toast(draft.outro ? '“' + tpl.name + '” set as your outro page.' : 'Outro page removed.');
        } else {
            const at = draft.sections.indexOf(id);
            const limit = VV.KIND_LIMITS[tpl.kind];
            if (at !== -1) {
                draft.sections.splice(at, 1);
                VV.toast('“' + tpl.name + '” removed from your website.');
            } else if (draft.sections.length >= VV.MAX_CONTENT) {
                VV.toast('Mix & match is full (' + VV.MAX_CONTENT + '/' + VV.MAX_CONTENT + '). Remove a section first.');
                flashCount();
                return;
            } else if (limit && VV.countKind(draft.sections, tpl.kind) >= limit) {
                VV.toast('You can add only one ' + VV.KIND_LABELS[tpl.kind].replace(/^The\s+/, '') + ' section. Remove your current one to swap designs.');
                return;
            } else {
                draft.sections.push(id);
                VV.toast('“' + tpl.name + '” added to your website.');
            }
        }
        saveAndRefresh();
    }

    // Styled confirm dialog for destructive actions. Resolves true
    // only when the user explicitly confirms.
    function vvConfirm(title, message, confirmLabel) {
        return new Promise(function (resolve) {
            const wrap = document.createElement('div');
            wrap.className = 'vv-modal';
            wrap.innerHTML =
                '<div class="vv-modal-backdrop"></div>' +
                '<div class="vv-modal-card vv-confirm-card" role="dialog" aria-modal="true" aria-label="' + title + '">' +
                '<p class="vv-modal-eyebrow">Just Checking</p>' +
                '<h2 class="vv-modal-title">' + title + '</h2>' +
                '<p class="vv-modal-text">' + message + '</p>' +
                '<div class="vv-modal-actions">' +
                '<button class="ui-btn ui-btn-primary" data-yes>' + confirmLabel + '</button>' +
                '<button class="ui-btn ui-btn-ghost" data-no>Keep My Changes</button>' +
                '</div></div>';
            document.body.appendChild(wrap);
            const releaseTrap = VV.trapFocus(wrap.querySelector('.vv-modal-card'));
            const onKey = function (e) { if (e.key === 'Escape') done(false); };
            const done = function (val) {
                releaseTrap();
                wrap.remove();
                document.removeEventListener('keydown', onKey);
                resolve(val);
            };
            wrap.querySelector('[data-yes]').addEventListener('click', function () { done(true); });
            wrap.querySelector('[data-no]').addEventListener('click', function () { done(false); });
            wrap.querySelector('.vv-modal-backdrop').addEventListener('click', function () { done(false); });
            document.addEventListener('keydown', onKey);
        });
    }

    function flashCount() {
        const count = document.getElementById('secCount');
        count.classList.add('full');
        count.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
            { duration: 350 }
        );
    }

    /* ---------------- Tabs ---------------- */

    const PANELS = { samples: 'panelSamples', library: 'panelLibrary', personalize: 'panelPersonalize' };

    function switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
        });
        Object.keys(PANELS).forEach(function (key) {
            document.getElementById(PANELS[key]).classList.toggle('active', key === tab);
        });
    }

    document.querySelectorAll('.tab-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { switchTab(btn.getAttribute('data-tab')); });
    });

    /* ---------------- Library filters ---------------- */

    let activeCat = 'all';
    let activeTheme = 'all';
    let activeKind = 'all';

    function setFilter(cat) {
        activeCat = cat;
        document.querySelectorAll('#filterRow .filter-chip').forEach(function (chip) {
            chip.classList.toggle('active', chip.getAttribute('data-cat') === cat);
        });
        // The section-type filter only applies to mix & match designs.
        const kindSelect = document.getElementById('kindSelect');
        const kindApplies = cat === 'all' || cat === 'content';
        kindSelect.disabled = !kindApplies;
        if (!kindApplies) {
            activeKind = 'all';
            kindSelect.value = 'all';
        }
        renderLibrary();
    }

    document.querySelectorAll('#filterRow .filter-chip').forEach(function (chip) {
        chip.addEventListener('click', function () { setFilter(chip.getAttribute('data-cat')); });
    });

    // Theme chips (built from the theme registry)
    function buildThemeChips() {
        const row = document.getElementById('themeRow');
        const chips = ['<button class="filter-chip active" data-theme="all">All Themes</button>'] // eslint-disable-line
            .concat(Object.keys(VV.THEMES).map(function (key) {
                const t = VV.THEMES[key];
                return '<button class="filter-chip" data-theme="' + key + '">' +
                    '<span class="chip-dot" style="background:' + (t.dot || t.thumb.accent) + '"></span>' + t.label + '</button>';
            }));
        row.insertAdjacentHTML('beforeend', chips.join(''));
        row.querySelectorAll('.filter-chip').forEach(function (chip) {
            chip.addEventListener('click', function () {
                activeTheme = chip.getAttribute('data-theme');
                row.querySelectorAll('.filter-chip').forEach(function (c) {
                    c.classList.toggle('active', c === chip);
                });
                renderLibrary();
            });
        });
    }

    // Section-type dropdown (built from the kind registry)
    function buildKindSelect() {
        const sel = document.getElementById('kindSelect');
        sel.innerHTML = '<option value="all">All section types</option>' +
            Object.keys(VV.KIND_LABELS).map(function (k) {
                return '<option value="' + k + '">' + VV.KIND_LABELS[k] + '</option>';
            }).join('');
        sel.addEventListener('change', function () {
            activeKind = sel.value;
            renderLibrary();
        });
    }

    /* ---------------- Samples gallery ---------------- */

    function renderSamples() {
        const D = VV.data();
        const grid = document.getElementById('samplesGrid');
        grid.innerHTML = VV.SAMPLES.map(function (s, i) {
            const pal = VV.THEMES[s.theme].thumb;
            const total = 2 + s.sections.length;
            return '<article class="sample-card" style="animation-delay:' + Math.min(i * 60, 420) + 'ms">' +
                '<a class="sample-cover" href="sample.html?id=' + s.id + '" ' +
                'style="--sc-bg:' + pal.bg + ';--sc-ink:' + pal.ink + ';--sc-accent:' + pal.accent + '">' +
                '<span class="sc-label">' + VV.THEMES[s.theme].label + '</span>' +
                '<span class="sc-names">' + D.bride.short + ' &amp; ' + D.groom.short + '</span>' +
                '<span class="sc-rule"></span>' +
                '</a>' +
                '<div class="sample-body">' +
                '<h3 class="sample-name">' + s.name + '</h3>' +
                '<p class="sample-tagline">' + s.tagline + '</p>' +
                '<p class="sample-meta">' + total + ' sections &middot; full website</p>' +
                '<div class="sample-actions">' +
                '<a class="ui-btn ui-btn-primary ui-btn-sm" href="sample.html?id=' + s.id + '">View Sample</a>' +
                '<button class="ui-btn ui-btn-ghost ui-btn-sm use-all" data-sample="' + s.id + '">Use Entire Design</button>' +
                '</div></div></article>';
        }).join('');

        grid.querySelectorAll('.use-all').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const s = VV.samplesById[btn.getAttribute('data-sample')];
                draft = store.sanitize({ landing: s.landing, sections: s.sections.slice(), outro: s.outro });
                saveAndRefresh();
                VV.toast('“' + s.name + '” loaded into your website. Customize it or preview right away.');
            });
        });
    }

    /* ---------------- Section library ---------------- */

    function libButtonLabel(tpl) {
        const selected = isSelected(tpl.id);
        if (tpl.category === 'landing') return selected ? '✓ Your Landing — Remove' : 'Use as Landing';
        if (tpl.category === 'outro') return selected ? '✓ Your Outro — Remove' : 'Use as Outro';
        return selected ? '✓ Added — Remove' : '+ Add Section';
    }

    function renderLibrary() {
        const grid = document.getElementById('libGrid');
        const list = VV.TEMPLATES.filter(function (t) {
            if (activeCat !== 'all' && t.category !== activeCat) return false;
            if (activeTheme !== 'all' && t.theme !== activeTheme) return false;
            if (activeKind !== 'all' && t.category === 'content' && t.kind !== activeKind) return false;
            if (activeKind !== 'all' && t.category !== 'content') return false;
            return true;
        });

        if (!list.length) {
            grid.innerHTML = '<div class="lib-empty">No sections match these filters yet.<br>' +
                'Try another theme or section type.</div>';
            return;
        }

        grid.innerHTML = list.map(function (tpl, i) {
            return '<article class="lib-card' + (isSelected(tpl.id) ? ' in-draft' : '') + '" data-id="' + tpl.id +
                '" style="animation-delay:' + Math.min(i * 35, 420) + 'ms">' +
                VV.thumb(tpl) +
                '<div class="lib-meta">' +
                '<p class="lib-name">' + tpl.name + '</p>' +
                '<p class="lib-sub">' + VV.THEMES[tpl.theme].label + ' &middot; ' + tpl.desc + '</p>' +
                '<div class="lib-tags">' +
                '<span class="cat-tag cat-' + tpl.category + '">' +
                (tpl.category === 'content' ? VV.KIND_LABELS[tpl.kind] : VV.CATEGORY_LABELS[tpl.category]) + '</span>' +
                (tpl.exclusive ? '<span class="badge-exclusive">Studio Only</span>' : '') +
                '</div></div>' +
                '<div class="lib-actions">' +
                '<a class="ui-btn ui-btn-ghost ui-btn-sm lib-prev" href="sample.html?tpl=' + tpl.id +
                '" title="Preview this design with sample photos & text">Preview</a>' +
                '<button class="ui-btn ui-btn-primary ui-btn-sm add-btn' + (isSelected(tpl.id) ? ' added' : '') + '">' +
                libButtonLabel(tpl) + '</button>' +
                '</div></article>';
        }).join('');

        grid.querySelectorAll('.lib-card').forEach(function (card) {
            card.querySelector('.add-btn').addEventListener('click', function () {
                toggleTemplate(card.getAttribute('data-id'));
            });
        });
    }

    // Update button states without rebuilding the whole grid.
    function refreshLibraryButtons() {
        document.querySelectorAll('#libGrid .lib-card').forEach(function (card) {
            const tpl = VV.byId[card.getAttribute('data-id')];
            if (!tpl) return;
            const selected = isSelected(tpl.id);
            card.classList.toggle('in-draft', selected);
            const btn = card.querySelector('.add-btn');
            btn.classList.toggle('added', selected);
            btn.textContent = libButtonLabel(tpl);
        });
    }

    /* ---------------- Personalize form ----------------
       Schema-driven: each field maps to a path inside the details
       object stored under vv_details. Blank fields fall back to the
       demo text at render time. */

    const DEMO = VV.DEMO;

    // The couple's chosen sizes for the flexible lists (milestones,
    // events, envelopes, party members). Lives in details.counts so it
    // travels with website codes & backups.
    let pzCounts = VV.getCounts(store.getDetails());

    // '+ Add another' descriptor for a flexible list inside a group.
    function pzAdd(list, noun) {
        return { list: list, noun: noun };
    }

    // Sub-header for item i of a flexible list, removable above the
    // list's minimum size.
    function pzSub(label, list, i) {
        const f = { sub: label };
        if (pzCounts[list] > VV.LIST_LIMITS[list].min) {
            f.rm = { list: list, index: i };
        }
        return f;
    }

    function seq(n) {
        const out = [];
        for (let i = 0; i < n; i++) out.push(i);
        return out;
    }

    // The form schema. Rebuilt whenever list sizes change — flexible
    // groups draw one block of fields per item, with sample text from
    // the demo couple (VV.demoItem) as placeholders.
    function buildPzGroups() {
        return [
            {
                title: 'The Couple', open: true, hint: 'Names, parents, socials',
                fields: [
                    { path: 'bride.name', label: 'Bride — full name', ph: DEMO.bride.name },
                    { path: 'groom.name', label: 'Groom — full name', ph: DEMO.groom.name },
                    { path: 'bride.parents', label: 'Bride — family line', ph: DEMO.bride.parents },
                    { path: 'groom.parents', label: 'Groom — family line', ph: DEMO.groom.parents },
                    { path: 'bride.ig', label: 'Bride — instagram', ph: DEMO.bride.ig },
                    { path: 'groom.ig', label: 'Groom — instagram', ph: DEMO.groom.ig }
                ]
            },
            {
                title: 'The Big Day', hint: 'Date, city, hashtag',
                fields: [
                    { path: 'date', label: 'Wedding date', type: 'date' },
                    { path: 'time', label: 'Ceremony time', type: 'time' },
                    { path: 'city', label: 'City', ph: DEMO.city },
                    { path: 'hashtag', label: 'Hashtag (blank = auto)', ph: DEMO.hashtag }
                ]
            },
            {
                title: 'Love Story', hint: pzCounts.story + ' milestones · up to ' + VV.LIST_LIMITS.story.max,
                adds: [pzAdd('story', 'milestone')],
                fields: [].concat.apply([], seq(pzCounts.story).map(function (i) {
                    const s = VV.demoItem('story', i);
                    return [
                        pzSub('Milestone ' + (i + 1), 'story', i),
                        { path: 'story.' + i + '.year', label: 'Year', ph: s.year },
                        { path: 'story.' + i + '.title', label: 'Title', ph: s.title },
                        { path: 'story.' + i + '.text', label: 'The moment', ph: s.text, type: 'textarea', wide: true }
                    ];
                }))
            },
            {
                title: 'Events', hint: pzCounts.events + (pzCounts.events === 1 ? ' event' : ' events') + ' · up to ' + VV.LIST_LIMITS.events.max,
                adds: [pzAdd('events', 'event')],
                fields: [].concat.apply([], seq(pzCounts.events).map(function (i) {
                    const ev = VV.demoItem('events', i);
                    const eg = ['e.g. ceremony', 'e.g. reception', 'e.g. tea ceremony', 'e.g. after party'][i] || '';
                    return [
                        pzSub('Event ' + (i + 1) + (eg ? ' · ' + eg : ''), 'events', i),
                        { path: 'events.' + i + '.title', label: 'Event name', ph: ev.title },
                        { path: 'events.' + i + '.date', label: 'Date line', ph: ev.date },
                        { path: 'events.' + i + '.time', label: 'Time', ph: ev.time },
                        { path: 'events.' + i + '.venue', label: 'Venue', ph: ev.venue },
                        { path: 'events.' + i + '.addr', label: 'Address', ph: ev.addr, wide: true }
                    ];
                }))
            },
            {
                title: 'Quote & Verse', hint: 'For quote sections',
                fields: [
                    { path: 'quote.text', label: 'Quote or verse', ph: DEMO.quote.text, type: 'textarea', wide: true },
                    { path: 'quote.cite', label: 'Attribution', ph: DEMO.quote.cite, wide: true }
                ]
            },
            {
                title: 'Digital Gifts', hint: pzCounts.gifts + (pzCounts.gifts === 1 ? ' envelope' : ' envelopes') + ' · up to ' + VV.LIST_LIMITS.gifts.max,
                adds: [pzAdd('gifts', 'envelope')],
                fields: [].concat.apply([], seq(pzCounts.gifts).map(function (i) {
                    const gf = VV.demoItem('gifts', i);
                    return [
                        pzSub('Envelope ' + (i + 1), 'gifts', i),
                        { path: 'gifts.' + i + '.bank', label: 'Bank / e-wallet', ph: gf.bank },
                        { path: 'gifts.' + i + '.acc', label: 'Account number', ph: gf.acc },
                        { path: 'gifts.' + i + '.holder', label: 'Account holder', ph: gf.holder, wide: true }
                    ];
                }))
            },
            {
                title: 'Dress Code', hint: 'For attire sections',
                fields: [
                    { path: 'attire.code', label: 'Dress code', ph: DEMO.attire.code, wide: true },
                    { path: 'attire.note', label: 'Note to guests', ph: DEMO.attire.note, type: 'textarea', wide: true }
                ]
            },
            {
                title: 'Questions & Answers', hint: 'For Q&A sections',
                fields: [].concat.apply([], DEMO.faqs.map(function (f, i) {
                    return [
                        { sub: 'Question ' + (i + 1) },
                        { path: 'faqs.' + i + '.q', label: 'Question', ph: f.q, wide: true },
                        { path: 'faqs.' + i + '.a', label: 'Answer', ph: f.a, type: 'textarea', wide: true }
                    ];
                }))
            },
            {
                title: 'Travel & Stay', hint: 'For travel sections',
                fields: [].concat.apply([], DEMO.travel.map(function (t, i) {
                    return [
                        { sub: t.icon + '  Card ' + (i + 1) },
                        { path: 'travel.' + i + '.title', label: 'Card title', ph: t.title },
                        { path: 'travel.' + i + '.text', label: 'Card text', ph: t.text, type: 'textarea', wide: true }
                    ];
                }))
            },
            {
                title: 'Wedding Party',
                hint: pzCounts.bridesmaids + ' + ' + pzCounts.groomsmen + ' people · up to ' +
                    VV.LIST_LIMITS.bridesmaids.max + ' each side',
                adds: [pzAdd('bridesmaids', 'person on her side'), pzAdd('groomsmen', 'person on his side')],
                fields: [].concat.apply([], seq(pzCounts.bridesmaids).map(function (i) {
                    const p = VV.demoItem('bridesmaids', i);
                    return [
                        pzSub('Her Side · Person ' + (i + 1), 'bridesmaids', i),
                        { path: 'party.bridesmaids.' + i + '.name', label: 'Name', ph: p.name },
                        { path: 'party.bridesmaids.' + i + '.role', label: 'Role', ph: p.role }
                    ];
                })).concat([].concat.apply([], seq(pzCounts.groomsmen).map(function (i) {
                    const p = VV.demoItem('groomsmen', i);
                    return [
                        pzSub('His Side · Person ' + (i + 1), 'groomsmen', i),
                        { path: 'party.groomsmen.' + i + '.name', label: 'Name', ph: p.name },
                        { path: 'party.groomsmen.' + i + '.role', label: 'Role', ph: p.role }
                    ];
                })))
            },
            {
                title: 'Live Stream', hint: 'For live-stream sections',
                fields: [
                    { path: 'stream.url', label: 'Livestream link (YouTube, Zoom…)', ph: DEMO.stream.url, wide: true },
                    { path: 'stream.note', label: 'Note to faraway guests', ph: DEMO.stream.note, type: 'textarea', wide: true }
                ]
            }
        ];
    }

    function pathGet(obj, path) {
        return path.split('.').reduce(function (o, k) {
            return (o && typeof o === 'object') ? o[k] : undefined;
        }, obj);
    }

    function pathSet(obj, path, value) {
        const keys = path.split('.');
        let o = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!o[k] || typeof o[k] !== 'object') {
                o[k] = /^\d+$/.test(keys[i + 1]) ? [] : {};
            }
            o = o[k];
        }
        o[keys[keys.length - 1]] = value;
    }

    function escAttr(s) {
        return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    }

    function fieldHTML(f) {
        if (f.sub) {
            return '<p class="pz-sub">' + f.sub +
                (f.rm
                    ? '<button type="button" class="pz-rm" data-list="' + f.rm.list +
                    '" data-index="' + f.rm.index + '">✕ Remove</button>'
                    : '') +
                '</p>';
        }
        const wide = f.wide ? ' wide' : '';
        const ph = f.ph ? ' placeholder="' + escAttr(f.ph) + '"' : '';
        let control;
        if (f.type === 'textarea') {
            control = '<textarea data-path="' + f.path + '" rows="3"' + ph + '></textarea>';
        } else {
            control = '<input type="' + (f.type || 'text') + '" data-path="' + f.path + '"' + ph + '>';
        }
        return '<label class="pz-field' + wide + '"><span>' + f.label + '</span>' + control + '</label>';
    }

    function addButtonHTML(a) {
        const lim = VV.LIST_LIMITS[a.list];
        const n = pzCounts[a.list];
        if (n >= lim.max) {
            return '<button type="button" class="pz-add" disabled>Maximum reached · ' + lim.max + ' ' + a.noun + 's</button>';
        }
        return '<button type="button" class="pz-add" data-add="' + a.list + '">+ Add another ' + a.noun +
            ' <span>' + n + ' of ' + lim.max + '</span></button>';
    }

    // (Re)draw the whole form from the current schema, keeping which
    // groups the user had open. Safe to call repeatedly — the input /
    // click listeners live on the <form> itself and survive innerHTML.
    function renderPersonalizeForm() {
        const form = document.getElementById('pzForm');
        const openState = {};
        form.querySelectorAll('.pz-group').forEach(function (g) {
            openState[g.getAttribute('data-group')] = g.open;
        });
        form.innerHTML = buildPzGroups().map(function (g) {
            const open = openState.hasOwnProperty(g.title) ? openState[g.title] : !!g.open;
            return '<details class="pz-group"' + (open ? ' open' : '') + ' data-group="' + escAttr(g.title) + '">' +
                '<summary>' + g.title +
                '<span class="pz-hint">' + (g.hint || '') + '</span>' +
                '<span class="pz-chev"></span></summary>' +
                '<div class="pz-fields">' + g.fields.map(fieldHTML).join('') +
                (g.adds ? '<div class="pz-adds wide">' + g.adds.map(addButtonHTML).join('') + '</div>' : '') +
                '</div></details>';
        }).join('');
        fillPersonalizeForm();
    }

    function buildPersonalizeForm() {
        const form = document.getElementById('pzForm');
        renderPersonalizeForm();
        form.addEventListener('input', onPersonalizeInput);
        form.addEventListener('submit', function (e) { e.preventDefault(); });
        // Delegated add/remove for the flexible lists
        form.addEventListener('click', function (e) {
            const add = e.target.closest('.pz-add[data-add]');
            if (add) { addListItem(add.getAttribute('data-add')); return; }
            const rm = e.target.closest('.pz-rm');
            if (rm) removeListItem(rm.getAttribute('data-list'), parseInt(rm.getAttribute('data-index'), 10));
        });
    }

    // Where a flexible list's user text lives inside the details object.
    function listPath(list) {
        return (list === 'bridesmaids' || list === 'groomsmen') ? 'party.' + list : list;
    }

    const LIST_NOUNS = {
        story: 'milestone', events: 'event', gifts: 'envelope',
        bridesmaids: 'person on her side', groomsmen: 'person on his side'
    };

    function afterListChange() {
        renderPersonalizeForm();
        renderMediaStudio();   // story photo cards follow the milestone count
        renderSamples();
        renderLibrary();
    }

    function addListItem(list) {
        if (pzCounts[list] >= VV.LIST_LIMITS[list].max) return;
        savePersonalize();                 // capture what's typed so far
        pzCounts[list] += 1;
        savePersonalize();                 // persist the new count
        afterListChange();
        // Walk the user to the fresh block: open, scroll, focus.
        const first = document.querySelector(
            '#pzForm [data-path^="' + listPath(list) + '.' + (pzCounts[list] - 1) + '."]');
        if (first) {
            first.closest('.pz-group').open = true;
            first.scrollIntoView({ behavior: 'smooth', block: 'center' });
            first.focus({ preventScroll: true });
        }
        VV.toast('Added ' + LIST_NOUNS[list] + ' ' + pzCounts[list] + ' — it previews with sample text until you fill it in.');
    }

    function removeListItem(list, index) {
        if (pzCounts[list] <= VV.LIST_LIMITS[list].min) return;
        savePersonalize();                 // capture current typing first
        const det = store.getDetails();
        // Splice this item out of the saved text so later items shift up.
        const arr = pathGet(det, listPath(list));
        if (Array.isArray(arr)) arr.splice(index, 1);
        pzCounts[list] -= 1;
        det.counts = Object.assign({}, pzCounts);
        store.saveDetails(det);
        afterListChange();
        VV.toast('Removed — everything after it moved up one spot.');
    }

    function fillPersonalizeForm() {
        const det = store.getDetails();
        document.querySelectorAll('#pzForm [data-path]').forEach(function (el) {
            const v = pathGet(det, el.getAttribute('data-path'));
            el.value = (typeof v === 'string') ? v : '';
        });
    }

    let pzTimer = null;

    function onPersonalizeInput() {
        const status = document.getElementById('pzStatus');
        status.textContent = 'Saving…';
        status.classList.remove('saved');
        if (pzTimer) clearTimeout(pzTimer);
        pzTimer = setTimeout(savePersonalize, 450);
    }

    // Custom page background colour lives in details.style.bg so it
    // travels inside website codes; kept here so form saves keep it.
    let styleBg = (store.getDetails().style || {}).bg || null;
    // Per-section backdrop colours (templateId → hex) — code-portable
    let secBgMap = (store.getDetails().style || {}).secbg || {};
    // Built-in soundtrack choice — code-portable too
    let trackChoice = VV.TRACKS[(store.getDetails().style || {}).track]
        ? (store.getDetails().style || {}).track : 'photograph';

    function savePersonalize() {
        const det = {};
        document.querySelectorAll('#pzForm [data-path]').forEach(function (el) {
            const v = el.value;
            if (typeof v === 'string' && v.trim()) {
                pathSet(det, el.getAttribute('data-path'), v);
            }
        });
        if (styleBg) pathSet(det, 'style.bg', styleBg);
        if (Object.keys(secBgMap).length) pathSet(det, 'style.secbg', secBgMap);
        if (trackChoice !== 'photograph') pathSet(det, 'style.track', trackChoice);
        // List sizes ride along whenever any differs from the default,
        // so they survive inside website codes and backups.
        const defCounts = VV.getCounts({});
        if (Object.keys(pzCounts).some(function (k) { return pzCounts[k] !== defCounts[k]; })) {
            det.counts = Object.assign({}, pzCounts);
        }
        store.saveDetails(det);
        const status = document.getElementById('pzStatus');
        status.textContent = 'All changes saved ✓';
        status.classList.add('saved');
        // Names & initials flow into sample covers and thumbnails.
        renderSamples();
        renderLibrary();
    }

    document.getElementById('pzReset').addEventListener('click', function () {
        if (Object.keys(store.getDetails()).length === 0) {
            VV.toast('Nothing to reset — you are already on the sample text.');
            return;
        }
        vvConfirm(
            'Reset All Personalization?',
            'This erases your names, dates, story, events, colours and every other text change, ' +
            'returning everything to the sample couple. Your uploaded photos and song are kept. ' +
            'This cannot be undone.',
            'Yes, Reset The Text'
        ).then(function (ok) {
            if (!ok) return;
            styleBg = null;
            secBgMap = {};
            trackChoice = 'photograph';
            pzCounts = VV.getCounts({});
            store.clearDetails();
            renderPersonalizeForm();
            renderMediaStudio();
            renderSamples();
            renderLibrary();
            const status = document.getElementById('pzStatus');
            status.textContent = 'All changes saved';
            status.classList.remove('saved');
            VV.toast('Personalization reset — sample text restored.');
        });
    });

    /* ---------------- Media Studio ----------------
       Photos, background song and page backdrop. Files live in
       IndexedDB on this device; images are downscaled to ≤1600px
       and recompressed so the whole set stays lightweight. */

    // Photo slots, organised the way the website reads: the couple,
    // their story, the gallery, the drifting strip, then the two
    // full-screen pages that bookend everything. A function because
    // the Love Story group grows and shrinks with the milestone count.
    function msPhotoGroups() {
        const ORDINALS = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
        const storySlots = [];
        for (let i = 0; i < pzCounts.story; i++) {
            storySlots.push({
                key: 'story' + (i + 1),
                label: 'Love Story Photo ' + (i + 1),
                hint: ORDINALS[i] + ' milestone in photo love-story sections'
            });
        }
        return [
        {
            title: 'The Couple',
            blurb: 'portraits that replace the monograms in Couple sections',
            slots: [
                { key: 'bride', label: 'Bride Portrait', hint: 'Replaces her monogram in Couple sections' },
                { key: 'groom', label: 'Groom Portrait', hint: 'Replaces his monogram in Couple sections' }
            ]
        },
        {
            title: 'Love Story',
            blurb: 'one photo per milestone in photo story & chapter sections',
            slots: storySlots
        },
        {
            title: 'Gallery',
            blurb: 'the photo cells of Gallery & Salon Wall sections',
            slots: [
                { key: 'gallery1', label: 'Gallery Photo 1', hint: 'First photo cell in Gallery sections' },
                { key: 'gallery2', label: 'Gallery Photo 2', hint: 'Second photo cell in Gallery sections' },
                { key: 'gallery3', label: 'Gallery Photo 3', hint: 'Third photo cell in Gallery sections' }
            ]
        },
        {
            title: 'Photo Strip',
            blurb: 'your moments woven through the drifting film-strip reels',
            slots: [
                { key: 'strip1', label: 'Strip Photo 1', hint: 'Woven into the drifting Photo Strip sections' },
                { key: 'strip2', label: 'Strip Photo 2', hint: 'Woven into the drifting Photo Strip sections' },
                { key: 'strip3', label: 'Strip Photo 3', hint: 'Woven into the drifting Photo Strip sections' },
                { key: 'strip4', label: 'Strip Photo 4', hint: 'Woven into the drifting Photo Strip sections' },
                { key: 'strip5', label: 'Strip Photo 5', hint: 'Woven into the drifting Photo Strip sections' },
                { key: 'strip6', label: 'Strip Photo 6', hint: 'Woven into the drifting Photo Strip sections' }
            ]
        },
        {
            title: 'Cover & Outro Pages',
            blurb: 'the full-screen photographs that open and close the website',
            slots: [
                { key: 'cover', label: 'Cover Photo', hint: 'Photo landings & the opening gate' },
                { key: 'outro', label: 'Outro Photo', hint: 'Photo-backed farewell pages' }
            ]
        }
        ];
    }

    const IMG_MAX_SOURCE = 10 * 1024 * 1024; // 10 MB upload cap
    const IMG_MAX_STORED = 900 * 1024;       // target after optimisation
    const SONG_MAX = 8 * 1024 * 1024;        // 8 MB song cap

    function fmtSize(b) {
        return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
    }

    function slotInUse(key) {
        const chosen = [draft.landing].concat(draft.sections, [draft.outro])
            .filter(Boolean).map(function (id) { return VV.byId[id]; }).filter(Boolean);
        if (key === 'cover') {
            const PHOTO_LANDINGS = ['landing-noir', 'landing-blush', 'landing-azure', 'landing-dusk', 'landing-court-terra', 'landing-villa'];
            return chosen.some(function (t) {
                return PHOTO_LANDINGS.indexOf(t.id) !== -1 || t.layout === 'marquee';
            });
        }
        if (key === 'bride' || key === 'groom') {
            return chosen.some(function (t) { return t.kind === 'couple'; });
        }
        if (key.indexOf('gallery') === 0) {
            return chosen.some(function (t) { return t.kind === 'gallery'; });
        }
        if (key.indexOf('story') === 0) {
            return chosen.some(function (t) { return t.kind === 'story' && t.photos; });
        }
        if (key.indexOf('strip') === 0) {
            return chosen.some(function (t) { return t.kind === 'filmstrip'; });
        }
        if (key === 'outro') {
            const t = VV.byId[draft.outro];
            return !!t && (t.id === 'outro-noir' || t.id === 'outro-dusk' || t.layout === 'polaroid');
        }
        return false;
    }

    // Downscale + recompress an uploaded image to a lightweight JPEG.
    function processImage(file, maxEdge) {
        return new Promise(function (resolve, reject) {
            if (!file.type || file.type.indexOf('image/') !== 0) {
                return reject(new Error('Please choose an image file (JPG, PNG or WebP).'));
            }
            if (file.size > IMG_MAX_SOURCE) {
                return reject(new Error('That image is over 10 MB — please choose a smaller file.'));
            }
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = function () {
                URL.revokeObjectURL(url);
                const long = Math.max(img.naturalWidth, img.naturalHeight);
                const scale = Math.min(1, maxEdge / long);
                const w = Math.max(1, Math.round(img.naturalWidth * scale));
                const h = Math.max(1, Math.round(img.naturalHeight * scale));
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff'; // flatten PNG transparency
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);
                const attempt = function (qualities) {
                    canvas.toBlob(function (blob) {
                        if (!blob) return reject(new Error('Could not process this image.'));
                        if (blob.size <= IMG_MAX_STORED || qualities.length === 1) return resolve(blob);
                        attempt(qualities.slice(1));
                    }, 'image/jpeg', qualities[0]);
                };
                attempt([0.82, 0.7, 0.58]);
            };
            img.onerror = function () {
                URL.revokeObjectURL(url);
                reject(new Error('Could not read this image — is it a valid JPG, PNG or WebP?'));
            };
            img.src = url;
        });
    }

    function storeImage(slot, file, maxEdge) {
        return processImage(file, maxEdge).then(function (blob) {
            return VV.media.set('img_' + slot, {
                blob: blob,
                name: file.name,
                type: 'image/jpeg',
                size: blob.size,
                updatedAt: Date.now()
            });
        });
    }

    function renderMediaStudio() {
        const mount = document.getElementById('mediaStudio');
        VV.media.list().then(function (items) {
            const byKey = {};
            items.forEach(function (it) { byKey[it.key] = it; });

            // Foldable groups keep whatever the user had open across the
            // frequent re-renders (uploads, draft changes, colour picks).
            const openState = {};
            mount.querySelectorAll('details[data-msgroup]').forEach(function (d) {
                openState[d.getAttribute('data-msgroup')] = d.open;
            });
            const fold = function (id, title, blurb, badge, inner) {
                return '<details class="ms-fold" data-msgroup="' + id + '"' +
                    (openState[id] ? ' open' : '') + '>' +
                    '<summary><span class="msf-title">' + title + '</span>' +
                    '<span class="msf-blurb">' + blurb + '</span>' +
                    (badge ? '<span class="msf-badge">' + badge + '</span>' : '') +
                    '<span class="pz-chev"></span></summary>' +
                    '<div class="msf-body">' + inner + '</div>' +
                    '</details>';
            };

            const slotCard = function (slot) {
                const rec = byKey['img_' + slot.key];
                const used = slotInUse(slot.key);
                return '<div class="ms-card' + (rec ? ' has-file' : '') + '" data-slot-card="' + slot.key + '">' +
                    '<div class="ms-thumb">' + (rec ? '<img alt="">' : '＋') + '</div>' +
                    '<p class="ms-label">' + slot.label + '</p>' +
                    '<p class="ms-hint">' + slot.hint + '</p>' +
                    '<span class="ms-usage ' + (used ? 'on' : 'off') + '" data-usage="' + slot.key + '">' +
                    (used ? 'In your website' : 'Not in current sections') + '</span>' +
                    (rec ? '<p class="ms-file">' + rec.name.replace(/</g, '&lt;') + ' · ' + fmtSize(rec.size) + '</p>' : '') +
                    '<div class="ms-actions">' +
                    '<button type="button" class="ms-btn up">' + (rec ? 'Replace' : 'Upload') + '</button>' +
                    (rec ? '<a class="ms-btn dl" download="' + slot.key + '.jpg">Save</a>' : '') +
                    (rec ? '<button type="button" class="ms-btn danger rm">Remove</button>' : '') +
                    '</div>' +
                    '<input type="file" accept="image/jpeg,image/png,image/webp,image/*" hidden>' +
                    '</div>';
            };

            // One collapsible block per photo category, in website order.
            const photoBlocks = msPhotoGroups().map(function (group) {
                const uploaded = group.slots.filter(function (s) { return byKey['img_' + s.key]; }).length;
                return fold('ph-' + group.title, group.title, group.blurb,
                    uploaded ? uploaded + ' of ' + group.slots.length + ' uploaded' : '',
                    '<div class="ms-grid">' + group.slots.map(slotCard).join('') + '</div>');
            }).join('');

            // Per-section backdrops — one card per section in the draft
            const FULLBLEED = {
                'landing-noir': 'Cover Photo', 'outro-noir': 'Outro Photo',
                'landing-dusk': 'Cover Photo', 'outro-dusk': 'Outro Photo',
                'landing-court-terra': 'Cover Photo'
            };
            const chosenIds = [draft.landing].concat(draft.sections, [draft.outro]).filter(Boolean);
            const secCards = chosenIds.map(function (id) {
                const tpl = VV.byId[id];
                if (!tpl) return '';
                const catLabel = tpl.category === 'content'
                    ? (VV.KIND_LABELS[tpl.kind] || 'Section') : VV.CATEGORY_LABELS[tpl.category];
                if (FULLBLEED[id]) {
                    return '<div class="ms-card ms-dim">' +
                        '<p class="ms-label">' + tpl.name + '</p>' +
                        '<p class="ms-hint">' + catLabel + ' — this design is already a full-screen photo. ' +
                        'Use the <b>' + FULLBLEED[id] + '</b> slot above to change it.</p>' +
                        '</div>';
                }
                const rec = byKey['img_secbg_' + id];
                const secColor = secBgMap[id] || null;
                const thumb = rec
                    ? '<img alt="">'
                    : (secColor ? '<span class="ms-swatch" style="background:' + secColor + '"></span>' : '＋');
                return '<div class="ms-card' + (rec || secColor ? ' has-file' : '') + '" data-secbg-card="' + id + '">' +
                    '<div class="ms-thumb">' + thumb + '</div>' +
                    '<p class="ms-label">' + tpl.name + '</p>' +
                    '<p class="ms-hint">' + catLabel + ' · ' + VV.THEMES[tpl.theme].label + '</p>' +
                    (rec ? '<p class="ms-file">' + rec.name.replace(/</g, '&lt;') + ' · ' + fmtSize(rec.size) + '</p>' : '') +
                    (secColor ? '<p class="ms-file">Custom colour · ' + secColor + '</p>' : '') +
                    '<div class="ms-actions">' +
                    '<button type="button" class="ms-btn up">' + (rec ? 'Replace' : 'Photo') + '</button>' +
                    (secColor
                        ? '<input type="color" class="ms-color sec-color" value="' + secColor + '">'
                        : '<button type="button" class="ms-btn col">Colour</button>') +
                    (rec || secColor ? '<button type="button" class="ms-btn danger rm">Remove</button>' : '') +
                    '</div>' +
                    '<input type="file" accept="image/jpeg,image/png,image/webp,image/*" hidden>' +
                    '</div>';
            }).join('');
            const secSet = chosenIds.filter(function (id) {
                return byKey['img_secbg_' + id] || secBgMap[id];
            }).length;
            const secBlock = fold('secbg', 'Section Backdrops',
                'give any page its own picture or colour — text adapts automatically',
                secSet ? secSet + ' set' : '',
                chosenIds.length
                    ? '<div class="ms-grid">' + secCards + '</div>'
                    : '<p class="ms-note">Build your website first — every section you choose can then carry its own backdrop picture or colour.</p>');

            const song = byKey.song;
            const trackChips = song ? '' :
                '<div class="ms-modes">' +
                Object.keys(VV.TRACKS).map(function (key) {
                    return '<button type="button" class="ms-mode' + (trackChoice === key ? ' active' : '') +
                        '" data-track="' + key + '">♪&nbsp; ' + VV.TRACKS[key].label + '</button>';
                }).join('') +
                '</div>';
            const songCard =
                '<div class="ms-card ms-wide' + (song ? ' has-file' : '') + '" id="msSong">' +
                '<p class="ms-label">Background Song</p>' +
                '<p class="ms-hint">Plays on the invitation after guests tap “Open Invitation”. Pick a built-in track, ' +
                'or upload your own — MP3, M4A or OGG, up to 8 MB.</p>' +
                '<p class="ms-file">' + (song
                    ? song.name.replace(/</g, '&lt;') + ' · ' + fmtSize(song.size)
                    : VV.TRACKS[trackChoice].label + ' — built-in track') + '</p>' +
                trackChips +
                '<div class="ms-actions">' +
                '<button type="button" class="ms-btn play" data-state="stopped">▶&nbsp; Preview Song</button>' +
                '<button type="button" class="ms-btn up">' + (song ? 'Replace Song' : 'Upload Your Song') + '</button>' +
                (song ? '<button type="button" class="ms-btn danger rm">Back To Built-In Tracks</button>' : '') +
                '</div>' +
                '<input type="file" accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/ogg,.mp3,.m4a,.ogg" hidden>' +
                '</div>';

            const hasBackdropImg = !!byKey.img_backdrop;
            const mode = hasBackdropImg ? 'picture' : (styleBg ? 'color' : 'default');
            const backdropCard =
                '<div class="ms-card ms-wide' + (mode !== 'default' ? ' has-file' : '') + '" id="msBackdrop">' +
                '<p class="ms-label">Whole-Page Backdrop</p>' +
                '<p class="ms-hint">Give every section your own background — a single colour, or a full-page picture ' +
                'that shows through softly behind the content. Text automatically adapts to light or dark colours.</p>' +
                '<div class="ms-modes">' +
                '<button type="button" class="ms-mode' + (mode === 'default' ? ' active' : '') + '" data-mode="default">Theme Default</button>' +
                '<button type="button" class="ms-mode' + (mode === 'color' ? ' active' : '') + '" data-mode="color">Custom Colour</button>' +
                '<button type="button" class="ms-mode' + (mode === 'picture' ? ' active' : '') + '" data-mode="picture">Custom Picture</button>' +
                (mode === 'color' ? '<input type="color" class="ms-color" value="' + (styleBg || '#f4ead9') + '">' : '') +
                '</div>' +
                (hasBackdropImg
                    ? '<p class="ms-file">' + byKey.img_backdrop.name.replace(/</g, '&lt;') + ' · ' + fmtSize(byKey.img_backdrop.size) + '</p>'
                    : '') +
                '<input type="file" accept="image/jpeg,image/png,image/webp,image/*" hidden>' +
                '</div>';

            const musicBadges = [];
            if (song) musicBadges.push('own song');
            else if (trackChoice !== 'photograph') musicBadges.push(VV.TRACKS[trackChoice].label);
            if (mode !== 'default') musicBadges.push('custom backdrop');
            const musicBlock = fold('music', 'Music & Page Backdrop',
                'the background song and a whole-page colour or picture',
                musicBadges.join(' · '),
                '<div class="ms-grid">' + songCard + backdropCard + '</div>');

            mount.innerHTML =
                '<div class="ms-head"><h3 class="ms-title">Photos, Music &amp; Backdrop</h3>' +
                '<span class="ms-sub">JPG / PNG / WebP · up to 10 MB each (we optimise them)</span></div>' +
                photoBlocks +
                secBlock +
                musicBlock +
                '<p class="ms-note">Everything here is saved in this browser — close the tab, restart, come back: ' +
                'it is all still yours. When you make the page live, the email lists each file so you can attach the originals for us.</p>';

            wireMediaStudio(byKey);
        });
    }

    function wireMediaStudio(byKey) {
        const mount = document.getElementById('mediaStudio');

        // Photo slots
        mount.querySelectorAll('[data-slot-card]').forEach(function (card) {
            const slot = card.getAttribute('data-slot-card');
            const input = card.querySelector('input[type="file"]');
            card.querySelector('.up').addEventListener('click', function () { input.click(); });
            input.addEventListener('change', function () {
                const file = input.files[0];
                if (!file) return;
                storeImage(slot, file, 1600).then(function () {
                    VV.toast('Photo saved — it now appears in your samples and previews.');
                    renderMediaStudio();
                }).catch(function (err) { VV.toast(err.message); });
            });
            const rm = card.querySelector('.rm');
            if (rm) {
                rm.addEventListener('click', function () {
                    VV.media.remove('img_' + slot).then(function () {
                        VV.toast('Photo removed — back to the sample image.');
                        renderMediaStudio();
                    });
                });
            }
            const thumbImg = card.querySelector('.ms-thumb img');
            if (thumbImg) {
                VV.media.url('img_' + slot).then(function (u) { if (u) thumbImg.src = u; });
            }
            const dl = card.querySelector('.dl');
            if (dl) {
                VV.media.url('img_' + slot).then(function (u) { if (u) dl.href = u; });
            }
        });

        // Section backdrops — photo upload OR flat colour per section
        mount.querySelectorAll('[data-secbg-card]').forEach(function (card) {
            const id = card.getAttribute('data-secbg-card');
            const input = card.querySelector('input[type="file"]');
            card.querySelector('.up').addEventListener('click', function () { input.click(); });
            input.addEventListener('change', function () {
                const file = input.files[0];
                if (!file) return;
                storeImage('secbg_' + id, file, 1920).then(function () {
                    // A photo replaces any colour choice for this section
                    delete secBgMap[id];
                    savePersonalize();
                    VV.toast('Backdrop saved for “' + (VV.byId[id] ? VV.byId[id].name : id) + '”.');
                    renderMediaStudio();
                }).catch(function (err) { VV.toast(err.message); });
            });
            const colBtn = card.querySelector('.col');
            if (colBtn) {
                colBtn.addEventListener('click', function () {
                    // Start from the theme's own tone so it never looks broken
                    const tpl = VV.byId[id];
                    secBgMap[id] = (tpl && VV.THEMES[tpl.theme].thumb.bg) || '#f4ead9';
                    VV.media.remove('img_secbg_' + id).then(function () {
                        savePersonalize();
                        renderMediaStudio();
                    });
                });
            }
            const colInput = card.querySelector('.sec-color');
            if (colInput) {
                colInput.addEventListener('input', function () {
                    secBgMap[id] = colInput.value;
                    const sw = card.querySelector('.ms-swatch');
                    if (sw) sw.style.background = colInput.value;
                    if (pzTimer) clearTimeout(pzTimer);
                    pzTimer = setTimeout(savePersonalize, 350);
                });
            }
            const rm = card.querySelector('.rm');
            if (rm) {
                rm.addEventListener('click', function () {
                    delete secBgMap[id];
                    savePersonalize();
                    VV.media.remove('img_secbg_' + id).then(function () {
                        VV.toast('Section backdrop removed.');
                        renderMediaStudio();
                    });
                });
            }
            const thumbImg = card.querySelector('.ms-thumb img');
            if (thumbImg) {
                VV.media.url('img_secbg_' + id).then(function (u) { if (u) thumbImg.src = u; });
            }
        });

        // Song
        const songCard = document.getElementById('msSong');
        const songInput = songCard.querySelector('input[type="file"]');
        songCard.querySelector('.up').addEventListener('click', function () { songInput.click(); });

        // Song preview: our own play/stop toggle instead of the bulky
        // native audio bar.
        stopSongPreview();
        const playBtn = songCard.querySelector('.play');
        playBtn.addEventListener('click', function () {
            if (playBtn.getAttribute('data-state') === 'playing') {
                stopSongPreview();
                return;
            }
            const start = function (src) {
                stopSongPreview();
                msAudio = new Audio(src);
                msAudio.play().then(function () {
                    msPlayBtn = playBtn;
                    playBtn.setAttribute('data-state', 'playing');
                    playBtn.innerHTML = '◼&nbsp; Stop Preview';
                }).catch(function () { VV.toast('Could not play this audio file.'); });
                msAudio.addEventListener('ended', stopSongPreview);
            };
            if (byKey.song) {
                VV.media.url('song').then(function (u) { start(u || VV.TRACKS[trackChoice].file); });
            } else {
                start(VV.TRACKS[trackChoice].file);
            }
        });

        // Built-in track picker (shown when no custom song is uploaded)
        songCard.querySelectorAll('[data-track]').forEach(function (chip) {
            chip.addEventListener('click', function () {
                const pick = chip.getAttribute('data-track');
                if (pick === trackChoice) return;
                trackChoice = pick;
                stopSongPreview();
                savePersonalize();
                renderMediaStudio();
                VV.toast('“' + VV.TRACKS[pick].label + '” will play on your invitation.');
            });
        });
        songInput.addEventListener('change', function () {
            const file = songInput.files[0];
            if (!file) return;
            const okType = (file.type && file.type.indexOf('audio/') === 0) || /\.(mp3|m4a|ogg)$/i.test(file.name);
            if (!okType) return VV.toast('Please choose an MP3, M4A or OGG audio file.');
            if (file.size > SONG_MAX) return VV.toast('That song is over 8 MB — please choose a smaller file.');
            VV.media.set('song', {
                blob: file, name: file.name, type: file.type || 'audio/mpeg',
                size: file.size, updatedAt: Date.now()
            }).then(function () {
                VV.toast('Song saved — it will play on your invitation previews.');
                renderMediaStudio();
            }).catch(function () { VV.toast('Could not store the song in this browser.'); });
        });
        const songRm = songCard.querySelector('.rm');
        if (songRm) {
            songRm.addEventListener('click', function () {
                VV.media.remove('song').then(function () {
                    VV.toast('Back to the default track.');
                    renderMediaStudio();
                });
            });
        }
        // Backdrop
        const bdCard = document.getElementById('msBackdrop');
        const bdInput = bdCard.querySelector('input[type="file"]');
        bdCard.querySelectorAll('.ms-mode').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const pick = btn.getAttribute('data-mode');
                if (pick === 'default') {
                    styleBg = null;
                    savePersonalize();
                    VV.media.remove('img_backdrop').then(renderMediaStudio);
                    VV.toast('Backdrop reset to the theme colours.');
                } else if (pick === 'color') {
                    styleBg = styleBg || '#f4ead9';
                    savePersonalize();
                    VV.media.remove('img_backdrop').then(renderMediaStudio);
                } else {
                    bdInput.click();
                }
            });
        });
        const colorInput = bdCard.querySelector('.ms-color');
        if (colorInput) {
            colorInput.addEventListener('input', function () {
                styleBg = colorInput.value;
                if (pzTimer) clearTimeout(pzTimer);
                pzTimer = setTimeout(savePersonalize, 350);
            });
        }
        bdInput.addEventListener('change', function () {
            const file = bdInput.files[0];
            if (!file) return;
            storeImage('backdrop', file, 1920).then(function () {
                styleBg = null;
                savePersonalize();
                VV.toast('Backdrop picture saved — see it on any sample or preview.');
                renderMediaStudio();
            }).catch(function (err) { VV.toast(err.message); });
        });
    }

    // Shared song-preview player state
    let msAudio = null;
    let msPlayBtn = null;

    function stopSongPreview() {
        if (msAudio) {
            msAudio.pause();
            msAudio = null;
        }
        if (msPlayBtn) {
            msPlayBtn.setAttribute('data-state', 'stopped');
            msPlayBtn.innerHTML = '▶&nbsp; Preview Song';
            msPlayBtn = null;
        }
    }

    /* ---------------- Builder panel ---------------- */

    function slotItemHTML(tpl, opts) {
        const pal = VV.THEMES[tpl.theme].thumb;
        return '<span class="drag-handle"' + (opts.draggable ? '' : ' style="visibility:hidden"') + '>&#8942;&#8942;</span>' +
            '<span class="slot-dot" style="background:' + pal.accent + '"></span>' +
            '<span class="slot-name">' + tpl.name + '<em>' + VV.THEMES[tpl.theme].label + '</em></span>' +
            '<span class="slot-actions">' + (opts.actions || '') +
            '<button class="icon-btn rm" title="Remove" aria-label="Remove ' + tpl.name + '">&times;</button>' +
            '</span>';
    }

    function renderFixedSlot(mountId, id, category) {
        const mount = document.getElementById(mountId);
        if (id && VV.byId[id]) {
            const tpl = VV.byId[id];
            mount.innerHTML = '<div class="slot-item">' + slotItemHTML(tpl, { draggable: false }) + '</div>';
            mount.querySelector('.rm').addEventListener('click', function () { toggleTemplate(id); });
        } else {
            const label = category === 'landing' ? '+ Choose a landing page' : '+ Choose an outro page';
            mount.innerHTML = '<button class="slot-empty" data-goto="' + category + '">' + label + '</button>';
            mount.querySelector('.slot-empty').addEventListener('click', function () {
                switchTab('library');
                setFilter(category);
                document.querySelector('.studio-panels').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    function renderBuilder() {
        renderFixedSlot('slotLanding', draft.landing, 'landing');
        renderFixedSlot('slotOutro', draft.outro, 'outro');

        const list = document.getElementById('slotSections');
        const emptyMount = document.getElementById('slotSectionsEmpty');
        const count = document.getElementById('secCount');
        count.textContent = draft.sections.length + ' / ' + VV.MAX_CONTENT;
        count.classList.toggle('full', draft.sections.length >= VV.MAX_CONTENT);

        list.innerHTML = draft.sections.map(function (id, i) {
            const tpl = VV.byId[id];
            const actions =
                '<button class="icon-btn mv" data-dir="-1" title="Move up" aria-label="Move up"' + (i === 0 ? ' disabled' : '') + '>&uarr;</button>' +
                '<button class="icon-btn mv" data-dir="1" title="Move down" aria-label="Move down"' + (i === draft.sections.length - 1 ? ' disabled' : '') + '>&darr;</button>';
            return '<li class="slot-item" draggable="true" data-id="' + id + '">' +
                slotItemHTML(tpl, { draggable: true, actions: actions }) + '</li>';
        }).join('');

        if (draft.sections.length === 0) {
            emptyMount.innerHTML = '<button class="slot-empty" data-goto="content">+ Add mix &amp; match sections</button>';
            emptyMount.querySelector('.slot-empty').addEventListener('click', function () {
                switchTab('library');
                setFilter('content');
                document.querySelector('.studio-panels').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        } else {
            emptyMount.innerHTML = '';
        }

        // Per-item actions
        list.querySelectorAll('.slot-item').forEach(function (item) {
            const id = item.getAttribute('data-id');
            item.querySelector('.rm').addEventListener('click', function () { toggleTemplate(id); });
            item.querySelectorAll('.mv').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    const dir = parseInt(btn.getAttribute('data-dir'), 10);
                    const at = draft.sections.indexOf(id);
                    const to = at + dir;
                    if (at === -1 || to < 0 || to >= draft.sections.length) return;
                    draft.sections.splice(to, 0, draft.sections.splice(at, 1)[0]);
                    saveAndRefresh();
                });
            });
        });
    }

    /* ---- Drag & drop reordering (mix & match sections only) ---- */

    const sectionList = document.getElementById('slotSections');

    sectionList.addEventListener('dragstart', function (e) {
        const item = e.target.closest('.slot-item');
        if (!item) return;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        // Firefox requires data to start a drag
        e.dataTransfer.setData('text/plain', item.getAttribute('data-id'));
    });

    sectionList.addEventListener('dragover', function (e) {
        e.preventDefault();
        const dragging = sectionList.querySelector('.dragging');
        if (!dragging) return;
        const siblings = Array.prototype.slice.call(sectionList.querySelectorAll('.slot-item:not(.dragging)'));
        const next = siblings.find(function (sib) {
            const box = sib.getBoundingClientRect();
            return e.clientY < box.top + box.height / 2;
        });
        if (next) {
            sectionList.insertBefore(dragging, next);
        } else {
            sectionList.appendChild(dragging);
        }
    });

    sectionList.addEventListener('drop', function (e) {
        e.preventDefault();
    });

    sectionList.addEventListener('dragend', function () {
        const dragging = sectionList.querySelector('.dragging');
        if (dragging) dragging.classList.remove('dragging');
        // Commit the visual order back into the draft
        draft.sections = Array.prototype.map.call(
            sectionList.querySelectorAll('.slot-item'),
            function (item) { return item.getAttribute('data-id'); }
        );
        saveAndRefresh();
    });

    /* ---------------- Surprise Me (theme-coherent shuffle) ---------------- */

    document.getElementById('shuffleBtn').addEventListener('click', function () {
        const hasSelection = draft.landing || draft.outro || draft.sections.length > 0;
        const gate = hasSelection
            ? vvConfirm(
                'Deal A Brand-New Website?',
                '“Surprise Me” replaces your current landing page, sections and outro with a fresh ' +
                'random design. Your personalized text, photos and song are kept.',
                'Yes, Surprise Me')
            : Promise.resolve(true);
        gate.then(function (ok) {
            if (ok) shuffleWebsite();
        });
    });

    function shuffleWebsite() {
        const themes = Object.keys(VV.THEMES);
        const theme = themes[Math.floor(Math.random() * themes.length)];
        const pool = function (cat) {
            return VV.TEMPLATES.filter(function (t) { return t.category === cat && t.theme === theme; });
        };
        const pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };

        const landing = pick(pool('landing'));
        const outro = pick(pool('outro'));
        const content = pool('content').slice();
        // Shuffle the content pool and take up to 7 sections — at most
        // one design per section type, so a surprise never repeats itself.
        for (let i = content.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = content[i]; content[i] = content[j]; content[j] = tmp;
        }
        const seenKinds = {};
        const distinct = content.filter(function (t) {
            if (seenKinds[t.kind]) return false;
            seenKinds[t.kind] = true;
            return true;
        });
        const take = distinct.slice(0, Math.min(VV.MAX_CONTENT, Math.max(4, distinct.length)));
        // Keep sections in a sensible narrative order
        const ORDER = ['couple', 'party', 'story', 'quote', 'divider', 'events', 'travel', 'stream',
            'countdown', 'gallery', 'filmstrip', 'attire', 'faq', 'gift', 'rsvp'];
        take.sort(function (a, b) { return ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind); });

        draft = store.sanitize({
            landing: landing ? landing.id : null,
            sections: take.map(function (t) { return t.id; }),
            outro: outro ? outro.id : null
        });
        saveAndRefresh();
        VV.toast('🎲 A “' + VV.THEMES[theme].label + '” website, dealt just for you. Shuffle again or preview it!');
    }

    /* ---------------- Personalize shortcut ---------------- */

    document.getElementById('goPersonalize').addEventListener('click', function () {
        switchTab('personalize');
        document.querySelector('.studio-panels').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    /* ---------------- Preview & clear ---------------- */

    document.getElementById('previewBtn').addEventListener('click', function () {
        const missing = [];
        if (!draft.landing) missing.push('a landing page');
        if (!draft.outro) missing.push('an outro page');
        if (missing.length) {
            VV.toast('Almost there — choose ' + missing.join(' and ') + ' first.');
            document.querySelectorAll('.slot-empty').forEach(function (el) {
                if (el.getAttribute('data-goto') !== 'content') {
                    el.classList.add('attn');
                    setTimeout(function () { el.classList.remove('attn'); }, 1600);
                }
            });
            return;
        }
        const id = store.publish(draft);
        window.location.href = 'preview.html?w=' + id;
    });

    document.getElementById('clearDraft').addEventListener('click', function () {
        if (!draft.landing && !draft.outro && draft.sections.length === 0) return;
        vvConfirm(
            'Clear Your Website Selection?',
            'This removes every section you have added to your website — the landing, ' +
            'all content sections and the outro. Your personalization text, photos and ' +
            'song are kept. This cannot be undone.',
            'Yes, Clear Selection'
        ).then(function (ok) {
            if (!ok) return;
            store.clearDraft();
            draft = store.getDraft();
            saveAndRefresh();
            VV.toast('Selection cleared.');
        });
    });

    /* ---------------- Floating builder shortcut (mobile) ---------------- */

    function refreshFab() {
        const n = (draft.landing ? 1 : 0) + draft.sections.length + (draft.outro ? 1 : 0);
        document.getElementById('builderFab').textContent = 'Your Website (' + n + ')';
    }

    /* ---------------- Cross-tab sync ---------------- */

    window.addEventListener('storage', function (e) {
        if (e.key === 'vv_draft') {
            draft = store.getDraft();
            renderBuilder();
            refreshLibraryButtons();
            refreshFab();
        }
        if (e.key === 'vv_details') {
            VV.refreshData();
            fillPersonalizeForm();
            renderSamples();
            renderLibrary();
        }
    });

    // Re-read state when returning via back/forward cache
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            draft = store.getDraft();
            VV.refreshData();
            renderBuilder();
            refreshLibraryButtons();
            refreshFab();
        }
    });

    /* ---------------- Backup recovery ----------------
       localStorage is the source of truth. When it holds work, we
       simply keep the IndexedDB text backup in sync. When it is empty
       but a backup exists (storage was cleared, or a partial wipe),
       ask — and require an answer — before either restoring it or
       discarding it for good. Photos & song are untouched either way:
       they already live in IndexedDB. */

    function offerBackupRecovery() {
        if (store.backup.hasLocalData()) {
            store.backup.sync();
            return;
        }
        store.backup.get().then(function (backup) {
            if (!backup) return;
            const when = backup.savedAt
                ? new Date(backup.savedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
                : null;
            const wrap = document.createElement('div');
            wrap.className = 'vv-modal';
            wrap.innerHTML =
                '<div class="vv-modal-backdrop"></div>' +
                '<div class="vv-modal-card vv-confirm-card" role="dialog" aria-modal="true" aria-label="Recover your website?">' +
                '<p class="vv-modal-eyebrow">Welcome Back</p>' +
                '<h2 class="vv-modal-title">Recover Your Website?</h2>' +
                '<p class="vv-modal-text">We found a saved copy of your website design and personalized text' +
                (when ? ' from <b>' + when + '</b>' : '') +
                ' on this device. Would you like to bring it back, or start fresh?</p>' +
                '<div class="vv-modal-actions">' +
                '<button class="ui-btn ui-btn-primary" data-yes>Yes, Recover My Work</button>' +
                '<button class="ui-btn ui-btn-ghost" data-no>No, Start Fresh</button>' +
                '</div></div>';
            document.body.appendChild(wrap);
            // Deliberately no backdrop-click or Escape handling: the
            // choice must be explicit. Focus stays trapped inside.
            const releaseTrap = VV.trapFocus(wrap.querySelector('.vv-modal-card'));
            wrap.querySelector('[data-yes]').addEventListener('click', function () {
                store.backup.restore(backup);
                // Reload so every panel (builder, forms, samples) is
                // rebuilt from the restored state in one clean pass.
                window.location.reload();
            });
            wrap.querySelector('[data-no]').addEventListener('click', function () {
                store.backup.discard().then(function () {
                    releaseTrap();
                    wrap.remove();
                    VV.toast('Saved copy deleted — you have a clean slate.');
                });
            });
        });
    }

    /* ---------------- Init ---------------- */

    buildThemeChips();
    buildKindSelect();
    buildPersonalizeForm();
    renderMediaStudio();
    renderSamples();
    renderLibrary();
    renderBuilder();
    refreshFab();
    offerBackupRecovery();

    if (window.location.hash === '#library') {
        switchTab('library');
    } else if (window.location.hash === '#personalize') {
        switchTab('personalize');
    }
})();
