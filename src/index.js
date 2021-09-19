"use strict";

import { Application } from "./Application";
import { Context } from "./Context";
import { Content } from "./content/Content";
import { View } from "./view/View";
import { ViewModel } from "./view/ViewModel";

if (!("fw" in window.next2d)) {

    window.next2d.fw = {
        "Application": Application,
        "Content":     Content,
        "Context":     Context,
        "View":        View,
        "ViewModel":   ViewModel,
        "application": null,
        "context":     null,
        "viewModel":   null,
        "packages":    new Map(),
        "response":    new Map(),
        "loaderInfo":  new Map(),
        "config":      {}
    };

    // output build version
    console.log("%c Next2D Framework %c 1.0.0 %c https://next2d.app",
        "color: #fff; background: #5f5f5f",
        "color: #fff; background: #4bc729",
        "");

}