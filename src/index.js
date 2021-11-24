"use strict";

import { Application } from "./Application";
import { Context } from "./Context";
import { Util } from "./Util";
import { Content } from "./content/Content";
import { View } from "./view/View";
import { ViewModel } from "./view/ViewModel";
import { Model } from "./model/common/Model";
import { MovieClip } from "./model/common/MovieClip";
import { Loading } from "./model/callback/Loading";

if (!("fw" in window.next2d)) {

    window.next2d.fw = {
        "Application": Application,
        "Content":     Content,
        "Context":     Context,
        "Model":       Model,
        "MovieClip":   MovieClip,
        "Loading":     Loading,
        "View":        View,
        "ViewModel":   ViewModel,
        "Util":        Util,
        "application": null,
        "context":     null,
        "viewModel":   null,
        "response":    new Map(),
        "loaderInfo":  new Map(),
        "config":      {}
    };

    // output build version
    console.log("%c Next2D Framework %c 0.2.1 %c https://next2d.app",
        "color: #fff; background: #5f5f5f",
        "color: #fff; background: #4bc729",
        "");

}