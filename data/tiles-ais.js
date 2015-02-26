var tiles;
const numOfTiles = 7;
const selector = "div[class='span4']";
const tSelector = "h4";

self.port.on("load", function (data) {
    tiles = data;
});

function checkIfGood(id) {
    if (id < 0 || id > numOfTiles)
	return false;
    return true;
}

function sendMsg(id, code) {
    var ret;
    window.alert(id + " " + code);
    switch (code) {
    case 0:
	ret = left(id);
	if (!ret)
	    window.alert("sendMsg()::left() failed");
	break;
    case 1:
	ret = right(id);
	if (!ret)
	    window.alert("sendMsg()::right() failed");
	break;
    case 2:
	ret = up(id);
	if (!ret)
	    window.alert("sendMsg()::up() failed");
	break;
    case 3:
	ret = down(id);
	if (!ret)
	    window.alert("sendMsg()::down() failed");
	break;
    case 4:
	ret = hide(id);
	if (!ret)
	    window.alert("sendMsg()::hide() failed");
	break;
    }
    return ret;
};

function constructButton(id, code, text) {
    return "<a onclick='window.sendMsg(" + id + ", " + code + ")'> " + text + "</a>";
}

exportFunction(sendMsg, unsafeWindow, {defineAs: "sendMsg"});

var titles = document.getElementsByTagName(tSelector);
for (var i = 0; i <= numOfTiles; i++)
    // Left Right Down Up Close
    titles[i].innerHTML += "\
" + constructButton(i, 0, "&#9668;") + "\
" + constructButton(i, 1, "&#9658;") + "\
" + constructButton(i, 2, "&#9660;") + "\
" + constructButton(i, 3, "&#9650;") + "\
" + constructButton(i, 4, "&#10005;") + "\
";

/* These functions change page content and update tiles
 * Usually these are called when user clicks something
 */
function hide(id) {
    var ret = _hideTile(id);
    if (ret) {
	tiles[id].status = false;
	self.port.emit("load", ss.storage.tiles);
    }
}

function left(id) {
    return switchTiles(id, id-1);
}

function right(id) {
    return switchTiles(id, id+1);
}

function up(id) {
    return switchTiles(id, id-3);
}

function down(id) {
    return switchTiles(id, id+3);
}

function switchTiles(id_a, id_b) {
    var ret = _switchContent(id_a, id_b);
    if (ret) {
	var temp = tiles[id_a];
	tiles[id_a] = tiles[id_b];
	tiles[id_b] = temp;
	self.port.emit("load", tiles);
	/* TODO: Exchange sendMsg lines here */
    }
}

/* These functions work with page content
 * Usually they return true on success, false otherwise
 */
function _getNthElement(id) {
    if (!checkIfGood(id))
	return false;
    var matchedTiles = document.querySelectorAll(selector);
    return matchedTiles[id];
}

function _switchContent(id_a, id_b) {
    if (!checkIfGood(id_a) || !checkIfGood(id_b))
	return false;

    var el_a = _getNthElement(id_a), el_b = _getNthElement(id_b);
    var temp_html = el_b.innerHTML;
    el_b.innerHTML = el_a.innerHTML;
    el_a.innerHTML = temp_html;
    return true;
}

function _hideTile(id) {
    if (!checkIfGood(id))
	return false;
    
    var tiles = document.querySelectorAll(selector);
    var visTile = numOfTiles;
    while (visTile >= 0 && tiles[visTile].style.display &&
	   tiles[visTile].style.display == "none")
	visTile--;
    if (visTile >= 0)
	tiles[visTile].style.display = "none";
    return _switchContent(visTile, id);
}
