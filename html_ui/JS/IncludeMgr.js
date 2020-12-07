var Include;
(function (Include) {
    class ScriptDefinition {
        constructor() {
            this.requested = false;
        }
    }
    class IncludeMgr {
        constructor() {
            this.scriptList = new Array();
            this.resourceLoadedCallbacks = [];
            this.loadScriptAsync = true;
        }
        static AbsolutePath(current, relativePath) {
            let absolutePathSplit = current.split("/");
            let relativePathSplit = relativePath.split("/");
            absolutePathSplit.pop();
            for (var i = 0; i < relativePathSplit.length; i++) {
                if (relativePathSplit[i] === ".") {
                }
                else if (relativePathSplit[i] === "..") {
                    absolutePathSplit.pop();
                }
                else {
                    absolutePathSplit.push(relativePathSplit[i]);
                }
            }
            return absolutePathSplit.join("/");
        }
        addImport(path, callback = null) {
            if (path[0] !== "/" && !path.startsWith("coui://")) {
                path = IncludeMgr.AbsolutePath(window.location.pathname, path);
            }
            path = path.toLowerCase();
            var links = window.document.querySelectorAll('link[rel="import"]');
            for (let i = 0; i < links.length; i++) {
                var toTest = links[i].href;
                if (toTest !== "") {
                    toTest = toTest.toLowerCase();
                    toTest = toTest.replace("coui://html_ui", "");
                    if (toTest[0] !== "/") {
                        toTest = IncludeMgr.AbsolutePath(window.location.pathname.toLowerCase(), toTest);
                    }
                    if (toTest == path) {
                        if (callback)
                            callback();
                        return;
                    }
                }
            }
            var link = document.createElement("link");
            link.rel = "import";
            link.href = path;
            loader.addResource(path);
            if (callback) {
                this.resourceLoadedCallbacks.push(callback);
            }
            document.head.appendChild(link);
        }
        addImports(path, callback = null) {
            let length = path.length;
            let nbLoaded = 0;
            let cb = () => {
                ++nbLoaded;
                if (nbLoaded >= length) {
                    if (callback)
                        callback();
                }
            };
            for (let toImport of path) {
                if (toImport.indexOf('.html') > -1) {
                    this.addImport(toImport, cb);
                }
                else if (toImport.indexOf('.js') > -1) {
                    this.addScript(toImport, cb);
                }
            }
        }
        addScript(path, callback = null) {
            if (path[0] !== "/") {
                path = IncludeMgr.AbsolutePath(window.location.pathname, path);
            }
            path = path.toLowerCase();
            let isInScripts = false;
            var scripts = document.head.getElementsByTagName("script");
            for (let i = 0; i < scripts.length; i++) {
                var toTest = scripts[i].src;
                if (toTest !== "") {
                    toTest = toTest.toLowerCase();
                    toTest = toTest.replace("coui://html_ui", "");
                    if (toTest[0] !== "/") {
                        toTest = IncludeMgr.AbsolutePath(window.location.pathname.toLowerCase(), toTest);
                    }
                    if (toTest === path) {
                        isInScripts = true;
                        break;
                    }
                }
            }
            for (var i = 0; i < this.scriptList.length; i++) {
                if (this.scriptList[i].path == path) {
                    if (callback) {
                        this.scriptList[i].callbacks.push(callback);
                    }
                    return;
                }
            }
            if (isInScripts) {
                if (callback) {
                    callback();
                }
                return;
            }
            var def = new ScriptDefinition();
            def.path = path;
            def.callbacks = [];
            if (callback) {
                def.callbacks.push(callback);
            }
            let request;
            if (this.loadScriptAsync || this.scriptList.length == 0) {
                request = this.requestScript(def);
            }
            this.scriptList.push(def);
            if (request) {
                this.cachebustRequest(request);
                document.head.appendChild(request);
            }
        }
        requestScript(_def) {
            var scriptRequest = document.createElement("script");
            scriptRequest.type = "text/javascript";
            scriptRequest.src = "coui://html_ui" + _def.path;
            scriptRequest.onload = this.onScriptLoaded.bind(this, _def);
            scriptRequest.onerror = () => console.error("Couldn't load " + _def.path);
            _def.requested = true;
            return scriptRequest;
        }
        onScriptLoaded(_def) {
            var found = false;
            for (var i = 0; i < this.scriptList.length; i++) {
                if (this.scriptList[i].path == _def.path) {
                    if (!this.scriptList[i].requested)
                        console.error("Loaded script was not requested : " + _def.path);
                    this.scriptList.splice(i, 1);
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.error("Loaded script was not registered : " + _def.path);
            }
            if (_def.callbacks.length > 0) {
                _def.callbacks.forEach(callback => callback());
            }
            if (!this.loadScriptAsync && this.scriptList.length > 0 && !this.scriptList[0].requested) {
                let request = this.requestScript(this.scriptList[0]);
                if (request) {
                    this.cachebustRequest(request);
                    document.head.appendChild(request);
                }
            }
        }
        isLoadingScript(_pattern) {
            var pattern = _pattern.toLowerCase();
            for (var i = 0; i < this.scriptList.length; i++) {
                if (this.scriptList[i].path.indexOf(pattern) >= 0) {
                    return true;
                }
            }
            return false;
        }

        cachebustRequest(req) {
            var ignoreArr = ["Services", "dataStorage.js", "common.js", "ToolBar", "VFR", "map/svg", "shared/map", "netbingmap", "templates", "simvar.js", "sortedlist.js", "avionics.js", "wasmsimcanvas.js", "inputs.js", "animation.js"];

            function checkInput(input, words) {
                return words.some(word => new RegExp(word, "i").test(input));
            }

            if (!checkInput(req.src, ignoreArr)) {
                let versionNum = Math.round(Math.random() * 10000000);
                req.src = req.src + "?cb=" + (versionNum.toString());
            }
        }
    }
    var g_IncludeMgr = new IncludeMgr();
    function addImport(path, callback = null) {
        g_IncludeMgr.addImport(path, callback);
    }
    Include.addImport = addImport;
    function addImports(path, callback = null) {
        g_IncludeMgr.addImports(path, callback);
    }
    Include.addImports = addImports;
    function addScript(path, callback = null) {
        g_IncludeMgr.addScript(path, callback);
    }
    Include.addScript = addScript;
    function isLoadingScript(pattern) {
        return g_IncludeMgr.isLoadingScript(pattern);
    }
    Include.isLoadingScript = isLoadingScript;
    function absolutePath(current, relativePath) {
        return IncludeMgr.AbsolutePath(current, relativePath);
    }
    Include.absolutePath = absolutePath;
    function absoluteURL(current, relativePath) {
        return "coui://html_ui" + IncludeMgr.AbsolutePath(current, relativePath);
    }
    Include.absoluteURL = absoluteURL;
    function setAsyncLoading(_async) {
        g_IncludeMgr.loadScriptAsync = _async;
    }
    Include.setAsyncLoading = setAsyncLoading;
    function onAllResourcesLoaded() {
        let callbacks = [...g_IncludeMgr.resourceLoadedCallbacks];
        for (let callback of callbacks) {
            callback();
            g_IncludeMgr.resourceLoadedCallbacks.splice(g_IncludeMgr.resourceLoadedCallbacks.findIndex(cb => cb === callback), 1);
        }
    }
    Include.onAllResourcesLoaded = onAllResourcesLoaded;
})(Include || (Include = {}));