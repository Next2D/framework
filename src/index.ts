import "@next2d/player";
import { Application } from "./application/Application";
import { Content } from "./application/content/Content";
import { DefaultLoading } from "./domain/screen/DefaultLoading";
import { View } from "./view/View";
import { ViewModel } from "./view/ViewModel";
import { cache } from "./application/variable/Cache";
import { query } from "./application/variable/Query";
import { response } from "./application/variable/Response";
import { loaderInfo } from "./application/variable/LoaderInfo";

// output build version
console.log("%c Next2D Framework %c 1.5.3 %c https://next2d.app",
    "color: #fff; background: #5f5f5f",
    "color: #fff; background: #4bc729",
    "");

export {
    Application,
    Content,
    DefaultLoading,
    View,
    ViewModel,
    cache,
    query,
    response,
    loaderInfo
};
