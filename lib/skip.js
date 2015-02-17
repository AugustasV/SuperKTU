var chromeMod = require("chrome-mod");
var data = require("sdk/self").data;
var simplePrefs = require("sdk/simple-prefs");
var pageMod = require("sdk/page-mod");
var workers = [];

chromeMod.ChromeMod({
    include: "about:addons",
    contentScriptFile: data.url("skip-set.js"),
    onAttach: function(worker) {
	worker.port.emit("status", simplePrefs.prefs.status);
	workers.push(worker);
    }
});

pageMod.PageMod({
    include: "https://uais.cr.ktu.lt/ktuis/stp_prisijungimas",
    contentScriptFile: data.url("skip-push-button.js"),
    contentScriptOptions: {
	status: simplePrefs.prefs.status
    }
});

function updateStatus() {
    for (worker of workers) {
	worker.port.emit("status", simplePrefs.prefs.status);
    }
}

function onPrefChange(prefName) {
    if (prefName == "status") {
	updateStatus();
    }
}

simplePrefs.on("status", onPrefChange);
