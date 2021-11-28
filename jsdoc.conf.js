"use strict";

// init => npm install -g jsdoc
// command => jsdoc -c ./jsdoc.conf.js -r ./src

module.exports = {
    "plugins": [
        "plugins/markdown"
    ],
    "markdown": {
        "hardwrap": true
    },
    "templates": {
        "cleverLinks"   : false,
        "monospaceLinks": false,
        "applicationName": "Next2D Framework",
        "disqus": "",
        "googleAnalytics": "",
        "favicon": "",
        "openGraph": {
            "title": "Next2D Framework API Documentation",
            "type": "website",
            "image": "",
            "site_name": "Next2D Framework API Documentation",
            "url": "https://next2d.app/"
        },
        "meta": {
            "title": "Next2D Framework API Documentation",
            "description": "Next2D Framework API Documentation.",
            "keyword": "Next2D, WebGL, WebGL2, JavaScript, HTML5, MVVM"
        },
        "linenums": true,
        "default" : {
            "outputSourceFiles" : true
        }
    },
    "opts": {
        "encoding": "utf8",
        "recurse": true,
        "private": false,
        "lenient": true,
        "destination": "../next2d/docs/docs/framework/",
        "template": "node_modules/@pixi/jsdoc-template"
    }
};