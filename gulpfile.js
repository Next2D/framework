"use strict";

const gulp        = require("gulp");
const concat      = require("gulp-concat");
const uglify      = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const TestServer  = require("karma").Server;
const jsdoc       = require("gulp-jsdoc3");
const preprocess  = require("gulp-preprocess");
const minimist    = require("minimist");
const replace     = require("gulp-replace");
const rename      = require("gulp-rename");
const eslint      = require("gulp-eslint");

const options = minimist(process.argv.slice(2), {
    "boolean": ["prodBuild"],
    "string": ["distPath", "version"],
    "default": {
        "prodBuild": false,
        "version": "1.0.0",
        "distPath": "."
    }
});

/**
 * @description フッターの書き出し
 * @public
 */
function buildFooterVersion()
{
    return gulp
        .src("src/Footer.file")
        .pipe(replace("###BUILD_VERSION###", options.version))
        .pipe(rename("src/Footer.build.file"))
        .pipe(gulp.dest("."));
}

/**
 * @description ヘッダーの書き出し
 * @public
 */
function buildHeaderVersion()
{
    return gulp
        .src("src/Header.file")
        .pipe(replace("###BUILD_VERSION###", options.version))
        .pipe(replace("###BUILD_YEAR###", new Date().getFullYear()))
        .pipe(rename("src/Header.build.file"))
        .pipe(gulp.dest("."));
}

/**
 * @description ESLintを実行
 * @public
 */
function lint ()
{
    return gulp
        .src("src/**/*.js")
        .pipe(eslint({ "useEslintrc": true }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
}

/**
 * @description JavaScriptをまとめてminifyして出力
 * @public
 */
function buildJavaScript()
{
    // setup
    const preprocessContext = {};

    preprocessContext.DEBUG = !options.prodBuild;

    const build = gulp
        .src([
            "src/Header.build.file",
            "src/**/*.js",
            "src/Footer.build.file"
        ])
        .pipe(concat("next2d-framework.js"))
        .pipe(preprocess({ "context": preprocessContext }));

    if (options.prodBuild) {
        build
            .pipe(uglify({ "output": { "comments": /^!/ } }));
    }

    return build
        .pipe(gulp.dest(options.distPath));
}

/**
 * @description local serverを起動
 * @return {void}
 * @public
 */
function browser (done)
{
    browserSync.init({
        "server": {
            "baseDir": ".",
            "index": "index.html"
        },
        "reloadOnRestart": true
    });
    done();
}

/**
 * @description local serverを再読込
 * @return {void}
 * @public
 */
function reload (done)
{
    browserSync.reload();
    done();
}

/**
 * @description ファイルを監視、変更があればビルドしてlocal serverを再読込
 * @public
 */
function watchFiles ()
{
    return gulp
        .watch("src/**/*.js")
        .on("change", gulp.series(
            buildJavaScript,
            reload
        ));
}

/**
 * @public
 */
function createHTML (done)
{
    return gulp
        .src([
            "src/**/*.js",
            "README.md"
        ], { "read": false })
        .pipe(jsdoc({
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
                    "title": "Next2D Player API Documentation",
                    "type": "website",
                    "image": "",
                    "site_name": "Next2D Player API Documentation",
                    "url": "https://next2d.app/"
                },
                "meta": {
                    "title": "Next2D Player API Documentation",
                    "description": "Next2D Player API Documentation.",
                    "keyword": "Next2D, WebGL, WebGL2, JavaScript, HTML5"
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
                "destination": "../next2d/docs/framework/",
                "template": "node_modules/@pixi/jsdoc-template"
            }
        }, done));
}

/**
 * @description テストを実行
 * @public
 */
function test (done)
{
    new TestServer({
        "configFile": __dirname + "/karma.conf.js",
        "singleRun": true
    }, function (error)
    {
        console.log(error);
        done();
    }).start();
}

exports.default = gulp.series(
    buildHeaderVersion,
    buildFooterVersion,
    buildJavaScript,
    browser,
    watchFiles
);
exports.test  = gulp.series(test);
exports.jsdoc = gulp.series(createHTML);
exports.lint  = gulp.series(lint);
