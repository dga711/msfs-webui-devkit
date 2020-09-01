/*! *****************************************************************************
    Author: dga711  in 2020

    Credits: Code is inspired by mechanisms and code found in Asobo's MSFS2020
***************************************************************************** */

// ENABLED/DISABLE Debug here
const DEBUG_ENABLED = true;

// ! don't touch these !
bLiveReload = true;
bAutoReloadCSS = true;
bDebugListeners = true;

// Credits: some of this code and concepts is Asobo's and is modified by me
class ModDebugMgr {
    constructor() {
        this.m_defaultPosRight = 4;
        this.m_defaultPosTop = 4;
        this.m_defaultLog = null;
        this.m_defaultWarn = null;
        this.m_defaultError = null;
    }

    ReloadPage() {
        var url = [location.protocol, '//', location.host, location.pathname].join('');
        let versionNum = Math.random() * 10000000;
        location.href = url + "?vs=" + Math.round(versionNum);
    }

    AddDebugButton(text, callback, autoStart = false) {
        if (this.m_debugPanel == null) {
            document.addEventListener("DebugPanelCreated", this.AddDebugButton.bind(this, text, callback, autoStart));
            this.CreateDebugPanel();
            return;
        }
        var button = document.createElement("div");
        button.innerText = text;
        button.classList.add("debugButton");
        button.addEventListener("click", callback);
        if (this.m_ConsoleCallback) {
            button.addEventListener("click", this.UpdateConsole.bind(this));
        }

        document.getElementById("debugContent").appendChild(button);
        if (autoStart) {
            requestAnimationFrame(callback);
            this.UpdateConsole();
        }
    }

    AddCustomCss() {
        // TODO: not sure if necessary
        var css = document.getElementById("debugcss");
        if (!css) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.id = "debugcss";
            link.rel = 'stylesheet';
            link.type = 'text/css';
            let versionNum = Math.random() * 10000000;
            link.href = '/SCSS/debug.css?version=' + versionNum;
            link.media = 'all';
            head.appendChild(link);
        }
        else {
            let url = new URL(css.href);
            let version = url.searchParams.get("version");
            let versionNum = Math.random() * 10000000;
            url.searchParams.set("version", (versionNum).toString());
            css.href = url.href;
        }
    }

    CreateDebugPanel() {
        if (this.m_debugPanel != null)
            return;
        if (!document.body) {
            Coherent.on("ON_VIEW_LOADED", this.CreateDebugPanel.bind(this));
            return;
        }
        this.AddCustomCss();

        // create panel
        this.m_debugPanel = document.createElement("div");
        this.m_debugPanel.id = "DebugPanel";
        this.m_debugPanel.classList.add("debugPanel");
        // TODO this could be nicer
        this.m_debugPanel.innerHTML = "<div id='debugHeader'>Debug <div style='float:right'><button id='rfrsh'>R</button>&nbsp;<button id='toggleDbg'>-</button></div></div><div id='debugContent'></div>";

        document.body.appendChild(this.m_debugPanel);
        this.setDefaultPos(this.m_defaultPosRight, this.m_defaultPosTop);
        // this.dragDropHandler = new DragDropHandler(document.getElementById("DebugPanel"));
        document.dispatchEvent(new Event("DebugPanelCreated"));

        // bind toggle button
        document.getElementById("toggleDbg").addEventListener("click", this.TogglePanel);
        document.getElementById("rfrsh").addEventListener("click", function () { window.document.location.reload(true); });
        // document.getElementById("rfrsh").addEventListener("click", this.ReloadPage);
        this.TogglePanel();
        // Window DragHandler 
        this.dragHandler = new DragHandler(this.m_debugPanel, "debugHeader")
        // hotkeys
        this.BindHotKeys();
    }

    BindHotKeys() {
        window.document.addEventListener("keydown", function (e) {
            if (e.altKey && e.which == 82) {
                // ALT + R
                window.document.location.reload(true);
                e.preventDefault();
            } else if (e.altKey && e.which == 84){
                // ALT + T
                g_modDebugMgr.TogglePanel();
                e.preventDefault();
            }
        });
    }

    TogglePanel() {
        let panel = document.getElementById("debugContent");
        panel.classList.toggle("collapsed");
        document.getElementById("DebugPanel").classList.toggle("collapsed");
        if (panel.classList.contains("collapsed"))
            document.getElementById("toggleDbg").innerHTML = "X";
        else
            document.getElementById("toggleDbg").innerHTML = "-";
    }

    UpdateConsole() {
        if (this.m_ConsoleCallback) {
            this.m_consoleElem.innerHTML = this.m_ConsoleCallback();
        }
    }
    AddConsole(callback, force = false) {
        if (this.m_debugPanel == null) {
            document.addEventListener("DebugPanelCreated", this.AddConsole.bind(this, callback));
            this.CreateDebugPanel();
            return;
        }
        this.m_consoleElem = document.createElement("div");
        this.m_consoleElem.classList.add("Console");
        this.m_consoleElem.classList.add("scrollbar");
        document.getElementById("debugContent").appendChild(this.m_consoleElem);
        this.m_ConsoleCallback = callback;
        if (!this.m_defaultLog)
            this.m_defaultLog = console.log;
        if (!this.m_defaultWarn)
            this.m_defaultWarn = console.warn;
        if (!this.m_defaultError)
            this.m_defaultError = console.error;
        console.log = this.log.bind(this);
        console.warn = this.warn.bind(this);
        console.error = this.error.bind(this);
    }
    log() {
        this.m_defaultLog.apply(console, arguments);
        this.logConsole("log", ...arguments);
    }
    warn() {
        this.m_defaultWarn.apply(console, arguments);
        this.logConsole("warn", ...arguments);
    }
    error() {
        this.m_defaultError.apply(console, arguments);
        this.logConsole("error", ...arguments);
    }
    logConsole(style, ...rest) {
        if (style === "error" && document.getElementById("DebugPanel").classList.contains("collapsed")) {
            this.TogglePanel();
        }

        var Args = Array.prototype.slice.call(arguments);
        for (var i = 1; i < Args.length; i++) {
            var node = document.createElement("div");
            node.innerText = (Args[i]);
            node.classList.add(style);
            this.m_consoleElem.appendChild(node);
            node.scrollIntoView();
        }
    }

    setDefaultPos(right, top) {
        this.m_defaultPosRight = right;
        this.m_defaultPosTop = top;
        if (this.m_debugPanel) {
            this.m_debugPanel.style.top = this.m_defaultPosTop + "%";
            this.m_debugPanel.style.right = this.m_defaultPosRight + "%";
        }
    }

}
var g_modDebugMgr;
if (DEBUG_ENABLED) {
    g_modDebugMgr = new ModDebugMgr;
}

class DragHandler {
    constructor(element, masterChildId) {
        this.element = element;
        this.pos = [0, 0];
        let dragElem = document.getElementById(masterChildId);
        if (dragElem) {
            dragElem.onmousedown = this.onMouseDown.bind(this);
        }
    }

    onMouseDown(event) {
        event.preventDefault();
        this.pos[0] = event.clientX;
        this.pos[1] = event.clientY;
        this.element.parentElement.onmouseup = this.onMouseUp.bind(this);
    }

    onMouseUp(event) {
        event.preventDefault();
        this.pos[0] = this.pos[0] - event.clientX;
        this.pos[1] = this.pos[1] - event.clientY;

        let offsetRight = this.element.parentElement.offsetWidth - this.element.offsetLeft - this.element.offsetWidth
        if (this.element.offsetTop - this.pos[1] + this.element.offsetHeight > this.element.parentElement.offsetHeight)
            this.element.style.top = (this.element.parentElement.offsetHeight - this.element.offsetHeight) + "px";
        else
            this.element.style.top = (this.element.offsetTop - this.pos[1]) + "px";
        this.element.style.right = (offsetRight + this.pos[0]) + "px";

        this.stopListening();
    }

    stopListening() {
        this.element.parentElement.onmouseup = null;
    }
}

