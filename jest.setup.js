globalThis.next2d = {
    "createRootMovieClip": function ()
    {
        return {
            "stage": {
                "addEventListener": function ()
                {
                    return undefined;
                }
            }
        };
    },
    "display": {
        "MovieClip": class MovieClip
        {
            _$sync ()
            {
                return undefined;
            }
        },
        "Loader": class Loader
        {
            constructor ()
            {
                this.event = new Map();
            }

            get contentLoaderInfo ()
            {
                return {
                    "addEventListener": (name, callback) =>
                    {
                        this.event.set(name, callback);
                    }
                };
            }

            load ()
            {
                this.event.get("complete")({
                    "currentTarget": {
                        "content": {
                            "_$loaderInfo": {
                                "_$data": {
                                    "symbols": new Map([["app", "app"]])
                                }
                            },
                            "text": "NoCode Tool content"
                        }
                    }
                });
            }
        }
    },
    "events": {
        "Event": class Event {
            static get COMPLETE () {
                return "complete";
            }
        },
        "IOErrorEvent": class IOErrorEvent {
            static get IO_ERROR () {
                return "io_error";
            }
        }
    },
    "net": {
        "URLRequest": class URLRequest
        {
            constructor()
            {
                this.method = "GET";
            }
        },
        "URLRequestHeader": class URLRequestHeader {},
        "URLRequestMethod": {
            "GET": "GET",
            "PUT": "PUT",
            "POST": "POST"
        }
    },
    "fw": {
        "loaderInfo": new Map(),
        "application": "app",
        "cache": new Map([["cache", "cache"]]),
        "config": {
            "stage": {
                "width": 240,
                "height": 240,
                "fps": 12,
                "options": {}
            }
        },
        "context": "context",
        "packages": new Map([["class", "class"]]),
        "response": new Map([["response", "response"]]),
        "variable": new Map([["variable", "variable"]]),
        "query": new Map([["query", "query"]])
    }
};

globalThis.location = {
    "pathname": "/"
};

globalThis.requestAnimationFrame = (callback) =>
{
    return callback();
};