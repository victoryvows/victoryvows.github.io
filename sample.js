/* ============================================================
   Sample website viewer — walk through a full sample site and
   pick individual sections into your own website draft.
   ============================================================ */

(function () {
    'use strict';

    const store = VV.store;
    store.cleanup();

    const params = new URLSearchParams(window.location.search);

    // Single-template preview mode (?tpl=<id>): render just that design
    // with the sample photos & text so it can be judged on its own.
    const singleTpl = params.get('tpl') ? VV.byId[params.get('tpl')] : null;

    const sample = singleTpl ? null : (VV.samplesById[params.get('id')] || VV.SAMPLES[0]);
    if (!singleTpl && !VV.samplesById[params.get('id')]) {
        // Unknown or missing id: show the first sample rather than a dead page
        history.replaceState(null, '', 'sample.html?id=' + sample.id);
    }

    document.title = singleTpl
        ? singleTpl.name + ' — Template Preview · Victory Vows Studio'
        : sample.name + ' — Sample Wedding Website · Victory Vows Studio';

    // Guest personalization works on samples too (?to=<name>&max=<seats>)
    VV.setGuest(params.get('to'), params.get('max'));

    let draft = store.getDraft();

    /* ---------------- Top bar: samples switch / template label ---------------- */

    if (singleTpl) {
        document.getElementById('sampleSwitch').innerHTML =
            '<span class="switch-pill active">' + singleTpl.name +
            ' · ' + VV.THEMES[singleTpl.theme].label + '</span>' +
            '<a class="switch-pill" href="generator.html#library">&larr; Back to Section Library</a>';
        const useAll = document.getElementById('useAllBtn');
        useAll.hidden = true;
    } else {
        const sw = document.getElementById('sampleSwitch');
        sw.innerHTML = VV.SAMPLES.map(function (s) {
            return '<a class="switch-pill' + (s.id === sample.id ? ' active' : '') + '" href="sample.html?id=' + s.id + '">' +
                s.name + '</a>';
        }).join('');
        // On phones the pill row scrolls horizontally — start with the
        // current sample centred so it is always in view. No-op when
        // the row fits (desktop): the browser clamps scrollLeft.
        const active = sw.querySelector('.switch-pill.active');
        if (active) {
            const delta = active.getBoundingClientRect().left - sw.getBoundingClientRect().left;
            sw.scrollLeft += delta - (sw.clientWidth - active.getBoundingClientRect().width) / 2;
        }
    }

    /* ---------------- Render the sample site ---------------- */

    function siteConfig() {
        if (!singleTpl) {
            return { landing: sample.landing, sections: sample.sections, outro: sample.outro };
        }
        if (singleTpl.category === 'landing') return { landing: singleTpl.id, sections: [], outro: null };
        if (singleTpl.category === 'outro') return { landing: null, sections: [], outro: singleTpl.id };
        return { landing: null, sections: [singleTpl.id], outro: null };
    }

    function renderSample() {
        VV.renderSite(siteConfig(), document.getElementById('siteRoot'));
        injectChips();
    }

    /* ---------------- Section picker chips ---------------- */

    function chipLabel(tpl, selected) {
        if (tpl.category === 'landing') return selected ? '✓ Your Landing' : 'Use as Landing';
        if (tpl.category === 'outro') return selected ? '✓ Your Outro' : 'Use as Outro';
        return selected ? '✓ Added' : '+ Add Section';
    }

    function isSelected(id) {
        return draft.landing === id || draft.outro === id || draft.sections.indexOf(id) !== -1;
    }

    function injectChips() {
        document.querySelectorAll('#siteRoot .tpl').forEach(function (sec) {
            const tpl = VV.byId[sec.getAttribute('data-tpl')];
            if (!tpl) return;
            const chip = document.createElement('div');
            chip.className = 'pick-chip';
            chip.innerHTML =
                '<span class="chip-cat">' + VV.CATEGORY_LABELS[tpl.category] + ' · ' + tpl.name + '</span>' +
                '<button class="pick-btn" data-id="' + tpl.id + '"></button>';
            sec.appendChild(chip);
            chip.querySelector('.pick-btn').addEventListener('click', function () {
                toggle(tpl.id);
            });
        });
        refreshChips();
    }

    function refreshChips() {
        document.querySelectorAll('.pick-btn').forEach(function (btn) {
            const tpl = VV.byId[btn.getAttribute('data-id')];
            const selected = isSelected(tpl.id);
            btn.textContent = chipLabel(tpl, selected);
            btn.classList.toggle('on', selected);
        });
    }

    function toggle(id) {
        const tpl = VV.byId[id];
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
                VV.toast('Mix & match is full (' + VV.MAX_CONTENT + '/' + VV.MAX_CONTENT + '). Remove a section in the builder first.');
                return;
            } else if (limit && VV.countKind(draft.sections, tpl.kind) >= limit) {
                VV.toast('You can add only one ' + VV.KIND_LABELS[tpl.kind].replace(/^The\s+/, '') + ' section. Remove your current one to swap designs.');
                return;
            } else {
                draft.sections.push(id);
                VV.toast('“' + tpl.name + '” added to your website.');
            }
        }
        store.saveDraft(draft);
        draft = store.getDraft();
        refreshChips();
        refreshStatus();
    }

    /* ---------------- Bottom status bar ---------------- */

    function refreshStatus() {
        const bb = document.getElementById('bbStatus');
        bb.innerHTML =
            '<span class="bb-item' + (draft.landing ? ' ok' : '') + '">Landing <b>' + (draft.landing ? '✓' : '—') + '</b></span>' +
            '<span class="bb-item' + (draft.sections.length ? ' ok' : '') + '">Mix &amp; Match <b>' + draft.sections.length + '/' + VV.MAX_CONTENT + '</b></span>' +
            '<span class="bb-item' + (draft.outro ? ' ok' : '') + '">Outro <b>' + (draft.outro ? '✓' : '—') + '</b></span>';
    }

    /* ---------------- Top/bottom bar actions ---------------- */

    document.getElementById('useAllBtn').addEventListener('click', function () {
        if (!sample) return; // hidden in single-template preview mode
        draft = store.sanitize({ landing: sample.landing, sections: sample.sections.slice(), outro: sample.outro });
        store.saveDraft(draft);
        refreshChips();
        refreshStatus();
        VV.toast('“' + sample.name + '” loaded into your website. Preview it or keep customizing.');
    });

    document.getElementById('quickPreviewBtn').addEventListener('click', function () {
        if (!draft.landing || !draft.outro) {
            VV.toast('Pick a landing page and an outro page first — or tap “Use Entire Design”.');
            return;
        }
        const id = store.publish(draft);
        window.location.href = 'preview.html?w=' + id;
    });

    /* ---------------- Cross-tab / bfcache sync ---------------- */

    window.addEventListener('storage', function (e) {
        if (e.key === 'vv_draft') {
            draft = store.getDraft();
            refreshChips();
            refreshStatus();
        }
        if (e.key === 'vv_details') {
            // Personalized text changed in another tab — re-render with it.
            renderSample();
        }
    });

    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            draft = store.getDraft();
            refreshChips();
            refreshStatus();
        }
    });

    /* ---------------- Init ---------------- */

    renderSample();
    refreshStatus();
})();
