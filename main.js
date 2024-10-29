// ==UserScript==
// @name         prehrajto paywall bypass
// @namespace    http://tampermonkey.net/
// @version      0
// @description  try to take over the world!
// @match        https://prehraj.to/*
// @include      https://prehrajto.cz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=prehraj.to
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const modifyPlayer = () => {
        document.querySelectorAll('.video-js').forEach(player => {
            if (player._modified) return;
            const c = videojs(player.id);
            if (c) {
                c.off('timeupdate').on('timeupdate', function() {
                    dataLayer.push({ event: "action.show.premiumPromo" });
                });
            }
        });
    };

    const checkMainJsLoaded = () => {
        Array.from(document.getElementsByTagName('script')).forEach(script => {
            if (script.src.includes('/front/generated/js/main.js')) {
                console.log('main.js loaded, applying modifications...');
                clearInterval(mainJsCheckInterval);
                modifyPlayer();
                new MutationObserver(modifyPlayer).observe(document.documentElement, { childList: true, subtree: true });
            }
        });
    };

    const mainJsCheckInterval = setInterval(checkMainJsLoaded, 1000);
    checkMainJsLoaded();
})();
