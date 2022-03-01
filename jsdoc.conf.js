"use strict";

// init => npm install -g jsdoc
// command => jsdoc -c ./jsdoc.conf.js -r ./src DOCS.md

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
        "path": "../../../",
        "openGraph": {
            "title": "Framework API Documentation",
            "description": "Framework API Documentation.",
            "type": "website",
            "image": "https://next2d.app/assets/img/ogp.png",
            "url": "https://next2d.app/"
        },
        "meta": {
            "title": "Framework API Documentation",
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
        "destination": "../next2d/dist/docs/framework/",
        "template": "node_modules/@next2d/jsdoc-template"
    }
};
