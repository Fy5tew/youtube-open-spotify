// ==UserScript==
// @name [YOS] - Open Spotify from YouTube
// @description A small extension that adds a button to open Spotify app search from Youtube video
// @version 0.0.2
// @match *://*.youtube.com/watch*
// @author fy5tew
// @homepageURL https://github.com/fy5tew/youtube-open-spotify
// @downloadURL https://raw.githubusercontent.com/fy5tew/youtube-open-spotify/master/yos.user.js
// @updateURL https://raw.githubusercontent.com/fy5tew/youtube-open-spotify/master/yos.user.js
// @supportURL https://github.com/fy5tew/youtube-open-spotify/issues
// @icon https://raw.githubusercontent.com/fy5tew/youtube-open-spotify/master/logo.png
// @namespace yos
// ==/UserScript==

(() => {
    "use strict";


    const EXTENSION_ABBR = "YOS";

    const SPOTIFY_APP_URI = "spotify";
    const SPOTIFY_APP_SEARCH_URI = "search"


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


    const main = () => {
        logInfo("Extension started");

        const youtubeVideoTitle = getYoutubeVideoTitle();
        const spotifyAppSearchURI = getSpotifyAppSearchURI(youtubeVideoTitle);

        logInfo(`Spotify uri: ${spotifyAppSearchURI}`);
    };


    main().catch((error) => logError(error));
})();
