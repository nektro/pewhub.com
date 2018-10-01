/**
 */
//
"use strict";
//
(function() {
    function make_url(host, params) {
        return host + "?" + Object.keys(params).map((v) => encodeURIComponent(v)+"="+encodeURIComponent(params[v])).join("&");
    }
    function create_element(name, attributes, children, events) {
        const element = document.createElement(name);
        for (const attr of (attributes || new Map()).entries()) element.setAttribute(attr[0], attr[1]);
        for (const child of (children || [])) element.appendChild(child);
        for (const listener of (events || new Map()).entries()) element.addEventListener(listener[0], listener[1]);
        return element;
    }
    function dcTN(text) {
        return document.createTextNode(text);
    }
    //
    var nextPageToken = "";
    //
    window.addEventListener("load", function() {
        Promise.resolve(make_url("https://www.googleapis.com/youtube/v3/search", {
            key: "AIzaSyDLwO7qEpx9p7MXl1UejeTqHMuEo-zFwLo",
            channelId: "UC-lHJZR3Gqxm24_Vd_AJ5Yw",
            part: "snippet,id",
            order: "date",
            maxResults: "50"
        }))
        .then(x => fetch(x))
        .then(x => x.json())
        .then(x => {
            const vf = document.getElementById("video_feed");
            //
            if ("nextPageToken" in x) {
                nextPageToken = x.nextPageToken;
            }
            for (const video of x.items) {
                vf.appendChild(create_element("a", new Map().set("class","video").set("href","https://www.youtube.com/watch?v="+video.id.videoId), [
                    create_element("img", new Map().set("src",video.snippet.thumbnails.medium.url).set("height","131").set("width","233")),
                    create_element("div", undefined, [dcTN(video.snippet.title)]),
                    create_element("div", undefined, [dcTN("Posted on "+new Date(video.snippet.publishedAt).toString().substring(4, 15))])
                ]));
            }
        })
        .then(x => console.log(x));
    });
})();
