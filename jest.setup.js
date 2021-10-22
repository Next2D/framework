global.next2d = {
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
        }
    },
    "events": {
        "Event": class Event {}
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

global.location = {
    "pathname": "/"
};