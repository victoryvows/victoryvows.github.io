/* ============================================================
   Victory Vows — minimal QR code generator (no dependencies)
   Byte mode · error correction level M · versions 1–10
   (up to 213 bytes — far beyond any invitation link).
   Exposes VVQR.matrix(text) -> boolean[size][size]
   ============================================================ */

(function (root) {
    'use strict';

    /* ---- GF(256) arithmetic for Reed–Solomon ---- */

    const EXP = new Array(512);
    const LOG = new Array(256);
    (function () {
        let x = 1;
        for (let i = 0; i < 255; i++) {
            EXP[i] = x;
            LOG[x] = i;
            x <<= 1;
            if (x & 0x100) x ^= 0x11d;
        }
        for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
    })();

    function gfMul(a, b) {
        if (a === 0 || b === 0) return 0;
        return EXP[LOG[a] + LOG[b]];
    }

    // Generator polynomial of the given degree, leading coefficient
    // first (the long-division loop in rsEncode indexes it that way).
    function rsGenerator(degree) {
        let poly = [1];
        for (let i = 0; i < degree; i++) {
            const next = new Array(poly.length + 1).fill(0);
            for (let j = 0; j < poly.length; j++) {
                next[j] ^= gfMul(poly[j], EXP[i]);
                next[j + 1] ^= poly[j];
            }
            poly = next;
        }
        return poly.reverse();
    }

    // Reed–Solomon error-correction codewords for a data block.
    function rsEncode(data, degree) {
        const gen = rsGenerator(degree);
        const res = data.concat(new Array(degree).fill(0));
        for (let i = 0; i < data.length; i++) {
            const factor = res[i];
            if (factor === 0) continue;
            for (let j = 0; j < gen.length; j++) {
                res[i + j] ^= gfMul(gen[j], factor);
            }
        }
        return res.slice(data.length);
    }

    /* ---- Version tables (error correction level M) ----
       blocks: [count, dataCodewordsPerBlock] groups; ec: EC codewords
       per block; align: alignment pattern centre coordinates. */

    const VERSIONS = [
        null,
        { blocks: [[1, 16]], ec: 10, align: [] },
        { blocks: [[1, 28]], ec: 16, align: [6, 18] },
        { blocks: [[1, 44]], ec: 26, align: [6, 22] },
        { blocks: [[2, 32]], ec: 18, align: [6, 26] },
        { blocks: [[2, 43]], ec: 24, align: [6, 30] },
        { blocks: [[4, 27]], ec: 16, align: [6, 34] },
        { blocks: [[4, 31]], ec: 18, align: [6, 22, 38] },
        { blocks: [[2, 38], [2, 39]], ec: 22, align: [6, 24, 42] },
        { blocks: [[3, 36], [2, 37]], ec: 22, align: [6, 26, 46] },
        { blocks: [[4, 43], [1, 44]], ec: 26, align: [6, 28, 50] }
    ];

    function dataCapacity(v) {
        return VERSIONS[v].blocks.reduce(function (sum, g) { return sum + g[0] * g[1]; }, 0);
    }

    /* ---- Bit buffer ---- */

    function BitBuffer() {
        this.bits = [];
    }
    BitBuffer.prototype.put = function (value, length) {
        for (let i = length - 1; i >= 0; i--) {
            this.bits.push((value >>> i) & 1);
        }
    };

    /* ---- Encode text (UTF-8 bytes) into final codewords ---- */

    function toUtf8(text) {
        if (typeof TextEncoder !== 'undefined') {
            return Array.prototype.slice.call(new TextEncoder().encode(text));
        }
        const out = [];
        const enc = encodeURIComponent(text);
        for (let i = 0; i < enc.length; i++) {
            if (enc[i] === '%') {
                out.push(parseInt(enc.substr(i + 1, 2), 16));
                i += 2;
            } else {
                out.push(enc.charCodeAt(i));
            }
        }
        return out;
    }

    function pickVersion(byteLen) {
        for (let v = 1; v <= 10; v++) {
            const ccBits = v <= 9 ? 8 : 16;
            const needed = 4 + ccBits + byteLen * 8;
            if (needed <= dataCapacity(v) * 8) return v;
        }
        throw new Error('Text too long for a QR code (max ~213 bytes).');
    }

    function buildCodewords(bytes, v) {
        const spec = VERSIONS[v];
        const capacity = dataCapacity(v);
        const buf = new BitBuffer();
        buf.put(4, 4);                       // byte mode
        buf.put(bytes.length, v <= 9 ? 8 : 16);
        bytes.forEach(function (b) { buf.put(b, 8); });
        // Terminator + byte alignment
        const maxBits = capacity * 8;
        buf.put(0, Math.min(4, maxBits - buf.bits.length));
        while (buf.bits.length % 8 !== 0) buf.bits.push(0);
        // Pad codewords
        const PADS = [0xec, 0x11];
        let p = 0;
        while (buf.bits.length < maxBits) buf.put(PADS[(p++) % 2], 8);
        // Split into codewords
        const data = [];
        for (let i = 0; i < buf.bits.length; i += 8) {
            let b = 0;
            for (let j = 0; j < 8; j++) b = (b << 1) | buf.bits[i + j];
            data.push(b);
        }
        // Split into blocks, compute EC, interleave
        const blocks = [];
        let offset = 0;
        spec.blocks.forEach(function (g) {
            for (let i = 0; i < g[0]; i++) {
                const chunk = data.slice(offset, offset + g[1]);
                offset += g[1];
                blocks.push({ data: chunk, ec: rsEncode(chunk, spec.ec) });
            }
        });
        const out = [];
        const maxData = Math.max.apply(null, blocks.map(function (b) { return b.data.length; }));
        for (let i = 0; i < maxData; i++) {
            blocks.forEach(function (b) { if (i < b.data.length) out.push(b.data[i]); });
        }
        for (let i = 0; i < spec.ec; i++) {
            blocks.forEach(function (b) { out.push(b.ec[i]); });
        }
        return out;
    }

    /* ---- Matrix construction ---- */

    function makeMatrix(v) {
        const size = 17 + v * 4;
        const m = [];
        const fn = [];
        for (let r = 0; r < size; r++) {
            m.push(new Array(size).fill(false));
            fn.push(new Array(size).fill(false));
        }
        return { size: size, m: m, fn: fn };
    }

    function setFn(g, r, c, dark) {
        g.m[r][c] = dark;
        g.fn[r][c] = true;
    }

    function drawFinder(g, r, c) {
        for (let dr = -1; dr <= 7; dr++) {
            for (let dc = -1; dc <= 7; dc++) {
                const rr = r + dr, cc = c + dc;
                if (rr < 0 || rr >= g.size || cc < 0 || cc >= g.size) continue;
                const dark = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6 &&
                    (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
                setFn(g, rr, cc, dark);
            }
        }
    }

    function drawAlignment(g, r, c) {
        for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
                setFn(g, r + dr, c + dc,
                    Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
            }
        }
    }

    const G15 = 0x537, G18 = 0x1f25, MASK15 = 0x5412;

    function bchDigit(x) {
        let d = 0;
        while (x) { d++; x >>>= 1; }
        return d;
    }

    function bch(data, poly, shift) {
        let d = data << shift;
        while (bchDigit(d) >= bchDigit(poly)) {
            d ^= poly << (bchDigit(d) - bchDigit(poly));
        }
        return (data << shift) | d;
    }

    // Format info for EC level M (bits 00) + mask id.
    function formatBits(mask) {
        return bch(mask, G15, 10) ^ MASK15;
    }

    function drawFormat(g, mask) {
        const bits = formatBits(mask);
        const size = g.size;
        for (let i = 0; i < 15; i++) {
            const dark = ((bits >> i) & 1) === 1;
            // Around the top-left finder
            if (i < 6) setFn(g, i, 8, dark);
            else if (i < 8) setFn(g, i + 1, 8, dark);
            else setFn(g, size - 15 + i, 8, dark);
            // Along row 8
            if (i < 8) setFn(g, 8, size - i - 1, dark);
            else if (i < 9) setFn(g, 8, 15 - i - 1 + 1, dark);
            else setFn(g, 8, 15 - i - 1, dark);
        }
        setFn(g, size - 8, 8, true); // dark module
    }

    function drawVersion(g, v) {
        if (v < 7) return;
        const bits = bch(v, G18, 12);
        for (let i = 0; i < 18; i++) {
            const dark = ((bits >> i) & 1) === 1;
            setFn(g, Math.floor(i / 3), (i % 3) + g.size - 11, dark);
            setFn(g, (i % 3) + g.size - 11, Math.floor(i / 3), dark);
        }
    }

    function drawFunctionPatterns(g, v) {
        const size = g.size;
        drawFinder(g, 0, 0);
        drawFinder(g, 0, size - 7);
        drawFinder(g, size - 7, 0);
        // Alignment patterns first — they may sit ON the timing track
        // (e.g. (6,22) from version 7 up) and take precedence over it.
        // Only those overlapping a finder are omitted.
        const pos = VERSIONS[v].align;
        for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < pos.length; j++) {
                const r = pos[i], c = pos[j];
                if (g.fn[r][c]) continue;
                drawAlignment(g, r, c);
            }
        }
        // Timing patterns fill whatever the alignment left free
        for (let i = 8; i < size - 8; i++) {
            if (!g.fn[6][i]) setFn(g, 6, i, i % 2 === 0);
            if (!g.fn[i][6]) setFn(g, i, 6, i % 2 === 0);
        }
        drawVersion(g, v);
    }

    // Zigzag data placement, bottom-right upward, skipping column 6.
    function placeData(g, codewords) {
        const size = g.size;
        let bitIndex = 0;
        const totalBits = codewords.length * 8;
        let upward = true;
        for (let col = size - 1; col > 0; col -= 2) {
            if (col === 6) col--;
            for (let i = 0; i < size; i++) {
                const r = upward ? size - 1 - i : i;
                for (let dc = 0; dc < 2; dc++) {
                    const c = col - dc;
                    if (g.fn[r][c]) continue;
                    let dark = false;
                    if (bitIndex < totalBits) {
                        dark = ((codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) === 1;
                        bitIndex++;
                    }
                    g.m[r][c] = dark; // remainder bits stay light
                }
            }
            upward = !upward;
        }
    }

    const MASKS = [
        function (r, c) { return (r + c) % 2 === 0; },
        function (r) { return r % 2 === 0; },
        function (r, c) { return c % 3 === 0; },
        function (r, c) { return (r + c) % 3 === 0; },
        function (r, c) { return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0; },
        function (r, c) { return (r * c) % 2 + (r * c) % 3 === 0; },
        function (r, c) { return ((r * c) % 2 + (r * c) % 3) % 2 === 0; },
        function (r, c) { return ((r + c) % 2 + (r * c) % 3) % 2 === 0; }
    ];

    function applyMask(g, mask) {
        for (let r = 0; r < g.size; r++) {
            for (let c = 0; c < g.size; c++) {
                if (!g.fn[r][c] && MASKS[mask](r, c)) g.m[r][c] = !g.m[r][c];
            }
        }
    }

    // Standard four-rule penalty score — lower is better.
    function penalty(g) {
        const size = g.size, m = g.m;
        let score = 0;
        // Rule 1: runs of 5+ in rows and columns
        for (let axis = 0; axis < 2; axis++) {
            for (let i = 0; i < size; i++) {
                let run = 1;
                for (let j = 1; j < size; j++) {
                    const cur = axis ? m[j][i] : m[i][j];
                    const prev = axis ? m[j - 1][i] : m[i][j - 1];
                    if (cur === prev) {
                        run++;
                        if (j === size - 1 && run >= 5) score += 3 + run - 5;
                    } else {
                        if (run >= 5) score += 3 + run - 5;
                        run = 1;
                    }
                }
            }
        }
        // Rule 2: 2×2 blocks of one colour
        for (let r = 0; r < size - 1; r++) {
            for (let c = 0; c < size - 1; c++) {
                if (m[r][c] === m[r][c + 1] && m[r][c] === m[r + 1][c] && m[r][c] === m[r + 1][c + 1]) score += 3;
            }
        }
        // Rule 3: finder-like patterns
        const P1 = [true, false, true, true, true, false, true, false, false, false, false];
        const P2 = P1.slice().reverse();
        const matches = function (get, i, j, pat) {
            for (let k = 0; k < 11; k++) {
                if (j + k >= size || get(i, j + k) !== pat[k]) return false;
            }
            return true;
        };
        const row = function (i, j) { return m[i][j]; };
        const col = function (i, j) { return m[j][i]; };
        for (let i = 0; i < size; i++) {
            for (let j = 0; j <= size - 11; j++) {
                if (matches(row, i, j, P1) || matches(row, i, j, P2)) score += 40;
                if (matches(col, i, j, P1) || matches(col, i, j, P2)) score += 40;
            }
        }
        // Rule 4: dark-module balance
        let dark = 0;
        for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (m[r][c]) dark++;
        score += Math.floor(Math.abs((dark * 100) / (size * size) - 50) / 5) * 10;
        return score;
    }

    /* ---- Public API ---- */

    function matrix(text) {
        const bytes = toUtf8(text);
        const v = pickVersion(bytes.length);
        const codewords = buildCodewords(bytes, v);
        let best = null, bestScore = Infinity;
        for (let mask = 0; mask < 8; mask++) {
            const g = makeMatrix(v);
            drawFunctionPatterns(g, v);
            drawFormat(g, mask);
            placeData(g, codewords);
            applyMask(g, mask);
            const s = penalty(g);
            if (s < bestScore) {
                bestScore = s;
                best = g.m;
            }
        }
        return best;
    }

    root.VVQR = { matrix: matrix };
})(typeof window !== 'undefined' ? window : globalThis);
