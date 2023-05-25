// ==UserScript==
// @name [YOS] - Open Spotify from YouTube
// @description A small extension that adds a button to open Spotify app search from Youtube video
// @version 0.0.7
// @match *://*.youtube.com/*
// @author fy5tew
// @homepageURL https://github.com/fy5tew/youtube-open-spotify
// @downloadURL https://github.com/Fy5tew/youtube-open-spotify/raw/main/yos.user.js
// @updateURL https://github.com/Fy5tew/youtube-open-spotify/raw/main/yos.user.js
// @supportURL https://github.com/fy5tew/youtube-open-spotify/issues
// @icon https://github.com/Fy5tew/youtube-open-spotify/raw/main/logo.png
// @namespace yos
// ==/UserScript==


(() => {
    "use strict";


    const EXTENSION_ABBR = "YOS";

    const SPOTIFY_APP_URI = "spotify";
    const SPOTIFY_APP_SEARCH_URI = "search"

    const MENU_BUTTONS_SELECTOR = "#actions #top-level-buttons-computed";
    const MENU_BUTTON_HTML = `
<div class="style-scope ytd-menu-renderer" 
    button-renderer="" 
    button-next=""
    style="margin-left: 8px">
    <button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading " 
        aria-label="Open Spotify" 
        style="">
        <div class="yt-spec-button-shape-next__icon" 
            aria-hidden="true">
            <div style="width: 24px; height: 24px;">
                <svg viewBox="0 0 24 24" 
                    preserveAspectRatio="xMidYMid meet" 
                    focusable="false" 
                    class="style-scope yt-icon" 
                    style="pointer-events: none; display: block; width: 100%; height: 100%;">
                    <path class="style-scope yt-icon" d="M17.259 18.094c-.142 0-.285-.04-.412-.124-2.875-1.893-6.545-2.339-10.911-1.324-.405.091-.807-.158-.9-.561-.094-.404.157-.807.561-.9 4.781-1.113 8.844-.597 12.076 1.532.346.228.441.693.214 1.039-.145.22-.385.338-.628.338zM18.364 14.532c-.123 0-.247-.03-.362-.094-2.282-1.261-5.197-1.984-8.208-2.035-1.909-.036-3.188.173-4.537.493-.404.095-.808-.155-.903-.557-.095-.403.154-.807.557-.903 1.263-.298 2.728-.568 4.908-.533 3.251.055 6.415.844 8.908 2.222.362.2.494.657.293 1.019-.136.248-.392.388-.656.388zM19.569 10.847c-.142 0-.285-.04-.412-.124-2.283-1.5-5.622-2.382-9.163-2.417-1.96-.028-3.75.212-5.305.688-.394.121-.815-.102-.937-.498-.121-.396.102-.816.498-.937 1.702-.521 3.642-.782 5.76-.753 3.821.039 7.455 1.01 9.972 2.665.346.228.442.692.214 1.039-.144.219-.383.337-.627.337z"></path>
                    <path class="style-scope yt-icon" d="m12 24c-6.617 0-12-5.383-12-12s5.383-12 12-12 12 5.383 12 12-5.383 12-12 12zm0-22.5c-5.79 0-10.5 4.71-10.5 10.5s4.71 10.5 10.5 10.5 10.5-4.71 10.5-10.5-4.71-10.5-10.5-10.5z"></path>
                </svg>
                <!--css-build:shady--><!--css-build:shady-->
            </div>
        </div>
        <div class="cbox yt-spec-button-shape-next--button-text-content">
            <span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text">Open Spotify</span>
        </div>
        <div style="border-radius: inherit;">
            <div class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response" aria-hidden="true">
                <div class="yt-spec-touch-feedback-shape__stroke" style=""></div>
                <div class="yt-spec-touch-feedback-shape__fill" style=""></div>
            </div>
        </div>
    </button>
    <div fit-to-visible-bounds="" offset="8" role="tooltip" tabindex="-1" style="inset: auto auto 36px 240.731px;">
        <!--css-build:shady-->
        <div id="tooltip" class="style-scope tp-yt-paper-tooltip hidden" style-target="tooltip">Open Spotify</div>
    </div>
</div>`;


    const addMneuButton = (button) => document.querySelector(MENU_BUTTONS_SELECTOR).appendChild(button);


    const htmlToElement = (html) => {
        const template = document.createElement('template');
        html = html.replaceAll('\n', '').trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }


    const logInfo = (message) => 
        console.log(`[${EXTENSION_ABBR}] ${message}`);


    const logError = (error) => 
        console.error(`[${EXTENSION_ABBR}]`, error);


    const encodeText = (text) => 
        encodeURI(text);


    const getURI = (...parts) => 
        parts
            .map((part) => encodeText(part))
            .join(':');


    const getSpotifyAppURI = (...parts) => 
        getURI(SPOTIFY_APP_URI, ...parts);


    const getSpotifyAppSearchURI = (searchRequest) => 
        getSpotifyAppURI(SPOTIFY_APP_SEARCH_URI, searchRequest);


    const getYoutubeVideoTitle = () => 
        ytplayer.bootstrapPlayerResponse.videoDetails.title;


    const routeWatch = () => {
        if (!document.querySelector(MENU_BUTTONS_SELECTOR)) {
            return setTimeout(main, 500);
        }

        logInfo("Extension starts");

        const youtubeVideoTitle = getYoutubeVideoTitle();
        const spotifyAppSearchURI = getSpotifyAppSearchURI(youtubeVideoTitle);

        logInfo(`Spotify app search uri: ${spotifyAppSearchURI}`);

        const menuButton = htmlToElement(MENU_BUTTON_HTML);
        menuButton.addEventListener('click', () => {
            logInfo("Open Spotify app by menu button");
            window.open(spotifyAppSearchURI, '_self');
        });
        addMneuButton(menuButton);

        logInfo("Extension launched");
    };


    const getRouter = (pageType) => {
        switch (pageType) {
        case "watch": 
            return routeWatch;
        default: 
            return () => {};
        }
    }


    document.addEventListener("yt-navigate-finish", (event) => {
        const routerFunc = getRouter(event.detail.pageType);
        try {
            routerFunc();
        }
        catch (error) {
            logError(error);
        }
    })
})();
