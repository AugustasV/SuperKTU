var chromeMod = require("chrome-mod");
var data = require("sdk/self").data;
var simplePrefs = require("sdk/simple-prefs").prefs;
var pageMod = require("sdk/page-mod");
var workers_add = [];
var workers_ais = [];

function detachWorker(worker, workerArray) {
    var index = workerArray.indexOf(worker);
    if (index != -1)
      workerArray.splice(index, 1);
}

function updateStatus() {
    for (worker of workers_add)
	worker.port.emit("status", simplePrefs.status);
}

function onPrefChange(prefName) {
    if (prefName == "status")
	updateStatus();
}

chromeMod.ChromeMod({
    include: "about:addons",
    contentScriptFile: data.url("skip-set.js"),
    onAttach: function(worker) {
	workers_add.push(worker);
	worker.on("detach", function() {
	    detachWorker(this, workers_add);
	});
    }
});

pageMod.PageMod({
    include: "https://uais.cr.ktu.lt/ktuis/stp_prisijungimas",
    contentScriptFile: data.url("skip-push-button.js"),
    onAttach: function(worker) {
	workers_ais.push(worker);
	worker.port.emit("data", [simplePrefs.status, simplePrefs.skip]);
	worker.on("detach", function() {
	    detachWorker(this, workers_ais);
	});
    }
});

require("sdk/simple-prefs").on("status", onPrefChange);
