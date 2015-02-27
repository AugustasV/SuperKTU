var ss = require("sdk/simple-storage");
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
const numOfTiles = 7;
var workers = [];
var valid = true;

function detachWorker(worker, workerArray) {
    var index = workerArray.indexOf(worker);
    if (index != -1)
	workerArray.splice(index, 1);
}

function createTile(tid, status) {
    // unique type identifier [0; numOfTiles]
    this.id = tid;
    // is the tile shown or not?
    this.status = status;
};

if (!ss.storage.tiles)
    valid = false;
else
    for (tile of ss.storage.tiles) {
	if (!(id in tile) || !(status in tile) ||
	    tile.id > numOfTiles || tile.id < 0 ||
	    typeof(tile.status) !== "boolean" ||
	    typeof(tile.id) !== "number") {
	    valid = false;
	    break;
	}
    }

if (!valid) {
    var id = 0;

    ss.storage.tiles = [];
    while (id < numOfTiles) {
	ss.storage.tiles.push(new createTile(id, true));
	id++;
    }
}

pageMod.PageMod({
    include: ["https://uais.cr.ktu.lt/ktuis/stud.busenos", "https://uais.cr.ktu.lt/ktuis/vs.pirmas"],
    contentScriptFile: data.url("tiles-ais.js"),
    onAttach: function(worker) {
	workers.push(worker);
	worker.on("detach", function () {
	    detachWorker(worker, workers);
	});
	worker.on("load", function (data) {
	    ss.storage.tiles = data;
	    for (w of workers)
		w.port.emit("load", ss.storage.tiles);
	});
	worker.port.emit("load", ss.storage.tiles);    
    }
});
