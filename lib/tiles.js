var ss = require("sdk/simple-storage");
var tiles = 8;

// div with exact class span4 (info-span yra tekstas)
// $("div[class='span4']").eq(SKAICIUS).whatever

function createTile(tid, status) {
    // id = unique identifier for a tile
    this.id = tid;
    // status = is the tile shown or not
    this.status = status;
};

// Initialize the array if it doesn't exist
if (!ss.storage.tiles) {
    ss.storage.tiles = [];
    var id = 1;
    while (id <= tiles) {
	ss.storage.tiles.push(new createTile(id, true));
	id++;
    }
}

/* All these functions work with the ss.storage.tiles object.
 * The parameters expect the index in the ss.storage.tiles object as arg
 * but _not_ the id inside the tile object
 */

var checkIfGood = function(rid) {
    if (rid < 0 || rid > tiles - 1)
	return false;
    return true;
}

var swap = function(rid_a, rid_b) {
    if (!checkIfGood(rid_a) || !checkIfGood(rid_a))
	return false;
    
    var temp = ss.storage.tiles[rid_b];
    ss.storage.tiles[rid_b] = ss.storage.tiles[rid_a];
    ss.storage.tiles[rid_a] = temp;
    informUpdate();
    return true;
}

var moveLeft = function(rid) {
    if (!checkIfGood(rid))
	return false;
    
    if (rid - 1 < 0) {
	return false;
    } else {
	swap(rid, rid - 1);
	return true;
    }
}

var moveRight = function(rid) {
    if (!checkIfGood(rid))
	return false;
    
    if (rid + 1 < 0) {
	return false;
    } else {
	swap(rid, rid + 1);
	return true;
    }
}

var moveDown = function(rid) {
    if (!checkIfGood(rid))
	return false;
    
    if (rid + 3 > tiles - 1) {
	return false;
    } else {
	swap(rid, rid + 3);
	return true;
    }
}

var moveUp = function(rid) {
    if (!checkIfGood(rid))
	return false;
    
    if (rid - 3 < 0) {
	return false;
    } else {
	swap(rid, rid - 3);
	return true;
    }
}

var hide = function(rid) {
    if (!checkIfGood(rid))
	return false;
    
    ss.storage.tiles[rid].status = false;
    informUpdate();
    return true;
}
