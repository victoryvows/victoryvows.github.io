/* ============================================================
   Victory Vows — Red Panda Mascot
   Self-contained widget: waving red panda + speech bubble.

   Usage (script tag config):
     <script src="mascot.js"
             data-message="Psst — try our wedding website generator!"
             data-link="generator.html"      // optional: click navigates
             data-position="right"></script> // "right" (default) or "left"
   ============================================================ */

(function () {
    'use strict';

    // Read config synchronously — currentScript is null inside callbacks
    const cfg = (document.currentScript && document.currentScript.dataset) || {};
    const message = cfg.message || 'Try our wedding website generator!';
    const link = cfg.link || null;
    const position = cfg.position === 'left' ? 'left' : 'right';

    const CSS = `
.vv-mascot[hidden] {
    display: none;
}

.vv-mascot {
    position: fixed;
    bottom: 12px;
    z-index: 1800;
    display: flex;
    /* char is first in the DOM; reverse puts the bubble visually above it */
    flex-direction: column-reverse;
    gap: 6px;
    opacity: 0;
    transform: translateY(24px);
    animation: vvmIn 0.6s ease 0.9s forwards;
    /* never block the page — only the panda itself is clickable */
    pointer-events: none;
}

.vv-mascot.vvm-right { right: 18px; align-items: flex-end; }
.vv-mascot.vvm-left { left: 18px; align-items: flex-start; }

@keyframes vvmIn {
    to { opacity: 1; transform: translateY(0); }
}

.vvm-bubble {
    max-width: 200px;
    background: #fffdf8;
    color: #33261f;
    border: 1px solid rgba(60, 40, 30, 0.08);
    padding: 0.65rem 0.9rem;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.74rem;
    font-weight: 500;
    line-height: 1.55;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
    opacity: 0;
    transform: scale(0.6);
    animation: vvmPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 1.8s forwards;
    position: relative;
}

.vvm-right .vvm-bubble {
    border-radius: 14px 14px 3px 14px;
    transform-origin: bottom right;
    margin-right: 14px;
}

.vvm-left .vvm-bubble {
    border-radius: 14px 14px 14px 3px;
    transform-origin: bottom left;
    margin-left: 14px;
}

.vvm-bubble::after {
    content: '';
    position: absolute;
    bottom: -7px;
    width: 0;
    height: 0;
    border-style: solid;
}

.vvm-right .vvm-bubble::after {
    right: 12px;
    border-width: 8px 10px 0 0;
    border-color: #fffdf8 transparent transparent transparent;
}

.vvm-left .vvm-bubble::after {
    left: 12px;
    border-width: 0 10px 8px 0;
    border-color: transparent #fffdf8 transparent transparent;
}

@keyframes vvmPop {
    to { opacity: 1; transform: scale(1); }
}

.vvm-bubble-close {
    position: absolute;
    top: -9px;
    right: -9px;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 1px solid rgba(60, 40, 30, 0.2);
    border-radius: 50%;
    background: #fffdf8;
    color: #4a382e;
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    pointer-events: auto;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
    transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.vvm-bubble-close:hover {
    transform: scale(1.15);
    background: #c9a86a;
    color: #1a120e;
}

/* Once the entrance has played, the bubble toggles between these two
   states with a soft fade (no replaying the pop-in animation) */
.vvm-bubble.vvm-settled {
    animation: none;
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.35s ease, transform 0.35s ease, visibility 0.35s;
}

.vvm-bubble.vvm-hidden {
    animation: none;
    opacity: 0;
    visibility: hidden;
    transform: scale(0.85);
    transition: opacity 0.35s ease, transform 0.35s ease, visibility 0.35s;
}

.vvm-hint {
    display: block;
    margin-top: 0.45rem;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #b58a3f;
}

/* When the panda links somewhere, the whole message is clickable too */
.vvm-bubble.vvm-clickable {
    pointer-events: auto;
    cursor: pointer;
}

.vvm-bubble.vvm-clickable:hover {
    background: #fffefb;
}

.vvm-bubble.vvm-clickable:hover .vvm-hint {
    color: #c9a86a;
    text-decoration: underline;
    text-underline-offset: 2px;
}

.vvm-char {
    width: 96px;
    height: 96px;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    display: block;
    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.35));
    transition: transform 0.25s ease;
    pointer-events: auto;
}

.vvm-char:hover {
    transform: scale(1.07);
}

.vvm-char svg {
    width: 100%;
    height: 100%;
    overflow: visible;
    display: block;
}

/* Idle life: bob, wave, tail sway, blink */
.rp-all {
    animation: rpBob 3.4s ease-in-out infinite;
}

@keyframes rpBob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(2.5px); }
}

.rp-arm {
    transform-box: fill-box;
    transform-origin: 20% 92%; /* the shoulder */
    animation: rpWave 4.2s ease-in-out infinite;
}

@keyframes rpWave {
    0%, 55%, 100% { transform: rotate(0deg); }
    62% { transform: rotate(-22deg); }
    69% { transform: rotate(14deg); }
    76% { transform: rotate(-22deg); }
    83% { transform: rotate(0deg); }
}

.rp-tail {
    transform-box: fill-box;
    transform-origin: 80% 90%;
    animation: rpTail 5.2s ease-in-out infinite;
}

@keyframes rpTail {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(6deg); }
}

.rp-eyes {
    transform-box: fill-box;
    transform-origin: center;
    animation: rpBlink 4.6s infinite;
}

@keyframes rpBlink {
    0%, 91%, 96%, 100% { transform: scaleY(1); }
    93.5% { transform: scaleY(0.08); }
}

/* Happy bounce (click when there is nowhere to go) */
.vvm-char.vvm-happy {
    animation: vvmHappy 0.6s ease;
}

@keyframes vvmHappy {
    0%, 100% { transform: translateY(0) scale(1); }
    30% { transform: translateY(-18px) scale(1.06); }
    55% { transform: translateY(0) scale(0.94); }
    75% { transform: translateY(-7px) scale(1.03); }
}

/* Dismissed via the × — gently fades out, gone until the next page load */
.vv-mascot.vvm-bye {
    animation: vvmBye 0.55s ease forwards;
    pointer-events: none;
}

@keyframes vvmBye {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(8px); }
}

/* Leave animation (click-through to the generator) */
.vv-mascot.vvm-leave {
    animation: vvmLeave 0.68s ease forwards;
}

@keyframes vvmLeave {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    32% { transform: translateY(-30px) scale(1.1); }
    55% { transform: translateY(0) scale(0.96); }
    100% { opacity: 0; transform: translateY(-14px) scale(0.25); }
}

@media (max-width: 600px) {
    .vvm-char { width: 78px; height: 78px; }
    .vvm-bubble { max-width: 168px; font-size: 0.7rem; }
    .vv-mascot.vvm-right { right: 12px; }
    .vv-mascot.vvm-left { left: 12px; }
}

@media (prefers-reduced-motion: reduce) {
    .vv-mascot { animation-duration: 0.01s; animation-delay: 0s; }
    .vvm-bubble { animation-duration: 0.01s; animation-delay: 0.2s; }
    .rp-all, .rp-arm, .rp-tail, .rp-eyes { animation: none; }
}
`;

    // Chibi red panda: rust fur, cream muzzle & ear tips, ringed tail, waving paw
    const SVG = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g class="rp-all">
    <!-- ringed tail, curling out to the left -->
    <g class="rp-tail">
      <g transform="rotate(-38 44 98)">
        <rect x="36.5" y="50" width="17" height="52" rx="8.5" fill="#c96b40"/>
        <rect x="38" y="56" width="14" height="8" rx="4" fill="#f6e7d3"/>
        <rect x="38" y="70" width="14" height="8" rx="4" fill="#f6e7d3"/>
        <rect x="38" y="84" width="14" height="8" rx="4" fill="#f6e7d3"/>
      </g>
    </g>

    <!-- body -->
    <ellipse cx="58" cy="95" rx="24" ry="18" fill="#8a4b32"/>
    <ellipse cx="58" cy="99" rx="13" ry="10" fill="#a05a3b"/>

    <!-- feet -->
    <ellipse cx="45" cy="111" rx="7.5" ry="4.5" fill="#5f3423"/>
    <ellipse cx="71" cy="111" rx="7.5" ry="4.5" fill="#5f3423"/>

    <!-- head -->
    <g>
      <!-- ears -->
      <circle cx="35" cy="27" r="11" fill="#b85c36"/>
      <circle cx="35" cy="27" r="5.5" fill="#f6e7d3"/>
      <circle cx="81" cy="27" r="11" fill="#b85c36"/>
      <circle cx="81" cy="27" r="5.5" fill="#f6e7d3"/>

      <circle cx="58" cy="52" r="30" fill="#e2814f"/>

      <!-- white blaze, eyebrow spots & cheek fluff -->
      <ellipse cx="58" cy="49" rx="3.4" ry="7.5" fill="#faf3e7"/>
      <ellipse cx="47" cy="40.5" rx="4.2" ry="2.8" fill="#f9efe0"/>
      <ellipse cx="69" cy="40.5" rx="4.2" ry="2.8" fill="#f9efe0"/>
      <ellipse cx="32.5" cy="56" rx="5.5" ry="7" fill="#f6e7d3"/>
      <ellipse cx="83.5" cy="56" rx="5.5" ry="7" fill="#f6e7d3"/>

      <!-- muzzle -->
      <ellipse cx="58" cy="63" rx="12.5" ry="9.5" fill="#faf3e7"/>
      <ellipse cx="58" cy="57.5" rx="3.4" ry="2.5" fill="#3d2a22"/>
      <path d="M53.5 64.5 Q58 68.5 62.5 64.5" fill="none" stroke="#4a2e21" stroke-width="1.7" stroke-linecap="round"/>

      <!-- eyes -->
      <g class="rp-eyes">
        <circle cx="47.5" cy="50" r="3.6" fill="#2f1e18"/>
        <circle cx="48.7" cy="48.8" r="1.2" fill="#ffffff"/>
        <circle cx="69.5" cy="50" r="3.6" fill="#2f1e18"/>
        <circle cx="70.7" cy="48.8" r="1.2" fill="#ffffff"/>
      </g>

      <!-- blush -->
      <ellipse cx="42" cy="58" rx="3.6" ry="2.4" fill="#f2a181" opacity="0.85"/>
      <ellipse cx="74" cy="58" rx="3.6" ry="2.4" fill="#f2a181" opacity="0.85"/>
    </g>

    <!-- waving arm & paw, raised beside the head -->
    <g class="rp-arm">
      <g transform="rotate(26 84 90)">
        <rect x="78.5" y="54" width="11" height="38" rx="5.5" fill="#5f3423"/>
        <circle cx="84" cy="54" r="7.2" fill="#e2814f"/>
        <circle cx="84" cy="54" r="4.2" fill="#f6e7d3"/>
      </g>
    </g>
  </g>
</svg>`;

    function init() {
        const style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        const widget = document.createElement('div');
        widget.className = 'vv-mascot vvm-' + position;
        widget.id = 'vvMascot';

        const bubble = document.createElement('div');
        bubble.className = 'vvm-bubble';
        const bubbleText = document.createElement('span');
        bubbleText.textContent = message;
        const bubbleClose = document.createElement('button');
        bubbleClose.className = 'vvm-bubble-close';
        bubbleClose.setAttribute('type', 'button');
        bubbleClose.setAttribute('aria-label', 'Dismiss');
        bubbleClose.innerHTML = '&times;';
        bubble.appendChild(bubbleText);
        if (link) {
            const hint = document.createElement('span');
            hint.className = 'vvm-hint';
            hint.textContent = 'Click me →';
            bubble.appendChild(hint);
        }
        bubble.appendChild(bubbleClose);

        const char = document.createElement(link ? 'a' : 'button');
        char.className = 'vvm-char';
        if (link) {
            char.setAttribute('href', link);
            char.setAttribute('aria-label', 'Red panda says: ' + message);
        } else {
            char.setAttribute('type', 'button');
            char.setAttribute('aria-label', 'Red panda mascot — ' + message);
        }
        char.innerHTML = SVG;

        // char first: the CSS sibling selector re-shows the bubble on hover
        widget.appendChild(char);
        widget.appendChild(bubble);
        document.body.appendChild(widget);

        // Tuck the bubble away after a while so it never lingers over content.
        // Hovering or focusing the panda brings it back for a grace period —
        // long enough to travel the pointer to the × without it vanishing.
        const BUBBLE_HIDE_MS = 11000;
        const BUBBLE_PEEK_MS = 5000;
        let hideTimer = null;

        const hideBubble = function () { bubble.classList.add('vvm-hidden'); };
        const showBubbleFor = function (ms) {
            bubble.classList.remove('vvm-hidden');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hideBubble, ms);
        };

        // After the pop-in animation, switch to fade transitions for show/hide
        bubble.addEventListener('animationend', function () {
            bubble.classList.add('vvm-settled');
        }, { once: true });

        hideTimer = setTimeout(hideBubble, BUBBLE_HIDE_MS);

        char.addEventListener('mouseenter', function () {
            if (bubble.classList.contains('vvm-hidden')) showBubbleFor(BUBBLE_PEEK_MS);
        });
        char.addEventListener('focus', function () {
            if (bubble.classList.contains('vvm-hidden')) showBubbleFor(BUBBLE_PEEK_MS);
        });

        // The × dismisses panda and message for this page view;
        // nothing is stored, so the next page load brings them back.
        bubbleClose.addEventListener('click', function (e) {
            e.stopPropagation();
            clearTimeout(hideTimer);
            widget.classList.add('vvm-bye');
            setTimeout(function () { widget.hidden = true; }, 580);
        });

        let leaving = false;
        const goToLink = function () {
            if (leaving) return;
            leaving = true;
            widget.classList.add('vvm-leave');
            setTimeout(function () { window.location.href = link; }, 660);
        };

        char.addEventListener('click', function (e) {
            if (link) {
                e.preventDefault();
                goToLink();
            } else {
                // Nowhere to go — just be delighted and repeat the message
                char.classList.remove('vvm-happy');
                void char.offsetWidth; // restart the animation
                char.classList.add('vvm-happy');
                showBubbleFor(BUBBLE_HIDE_MS);
            }
        });

        // With a link, clicking the message itself ("Click me →") navigates too.
        // The × sits inside the bubble but stops propagation, so it still closes.
        if (link) {
            bubble.classList.add('vvm-clickable');
            bubble.addEventListener('click', goToLink);
        }
    }

    if (document.body) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
