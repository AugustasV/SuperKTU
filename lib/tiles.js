var ss = require("sdk/simple-storage");
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var tiles = 8;
var workerArray = [];
var valid = true;

function detachWorker(worker, workerArray) {
    var index = workerArray.indexof(worker);
    if (index != -1)
	workerArray.splice(index, 1);
}

function createTile(tid, status) {
    // id = unique identifier for a tile
    this.id = tid;
    // status = is the tile shown or not
    this.status = status;
};

if (!(tiles in ss.storage))
    valid = false;
else
    for (tile of ss.storage.tiles) {
	if (!(id in tile) || !(status in tile) ||
	    tile.id > tiles || tile.id < 0 ||
	    typeof(tile.status) !== "boolean") {
	    valid = false;
	    break;
	}
    }

if (!valid) {
    ss.storage.tiles = [];
    var id = 1;
    while (id <= tiles) {
	ss.storage.tiles.push(new createTile(id, true));
	id++;
    }
}

pageMod.PageMod({
    include: "https://uais.cr.ktu.lt/ktuis/stud.busenos",
    contentScriptFile: data.url("tiles-ais.js"),
    onAttach: function(worker) {
	workerArray.push(worker);
	worker.on("detach", function () {
	    detachWorker(worker, workerArray);
	});
	worker.on("load", function (data) {
	    ss.storage.tiles = data;
	    for (worker of workerArray)
		worker.port.emit("load", ss.storage.tiles);
	});
	worker.port.emit("load", ss.storage.tiles);    
    }
});
