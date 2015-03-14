const numOfTiles = 7;
const selector = "div[class='span4']";
const tSelector = "h4";
var tiles, enabled, op = 0;
var titles = document.getElementsByTagName(tSelector);

self.port.on("load", function (data, state) {
    tiles = data;
});

function isVisible(id) {
    var el = _getNthElement(id);
    if (el.style.display && el.style.display == "none")
        return false;
    return true;
}

function checkIfGood(id) {
    if (id < 0 || id > numOfTiles)
	return false;
    return true;
}

function sendMsg(id, code) {
    var ret;

    if (!checkIfGood(id)) {
        window.alert("Unexpected error. Wrong id in sendMsg()");
        return false;
    }

    switch (code) {
    case 0:
        op = 0;
	ret = left(id);
	break;
    case 1:
        op = 0;
	ret = right(id);
	break;
    case 2:
        op = 0;
	ret = down(id);
	break;
    case 3:
        op = 0;
	ret = up(id);
	break;
    case 4:
        op = 1;
	ret = hide(id);
	break;
    }
    return ret;
};

function constructButton(id, code, text) {
    return "<a onclick='window.sendMsg(" + id + ", " + code + ")' href=\"#\">" + text + "</a>";
}

/* These functions change page content and update tiles
 * Usually these are called when user clicks something
 */
function hide(id) {
    var ret = _hideTile(id);
    if (ret) {
	tiles[id].status = false;
	self.port.emit("load", tiles);
	return true;
    }
    return false;
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
	return true;
    }
    return false;
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
    if (!op && (!isVisible(id_a) || !isVisible(id_b)))
        return false;

    var el_a = _getNthElement(id_a), el_b = _getNthElement(id_b);
    titles[id_a].innerHTML = titles[id_a].innerHTML.replace("sendMsg("+id_a, "sendMsg("+id_b, "g");
    titles[id_b].innerHTML = titles[id_b].innerHTML.replace("sendMsg("+id_b, "sendMsg("+id_a, "g");
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

if (self.options.enabled) {
    for (var i = 0; i <= numOfTiles; i++)
        // Left Right Down Up Close
        titles[i].innerHTML += "\
                               " + constructButton(i, 0, "&#9668;") + "\
                               " + constructButton(i, 1, "&#9658;") + "\
                               " + constructButton(i, 2, "&#9660;") + "\
                               " + constructButton(i, 3, "&#9650;") + "\
                               " + constructButton(i, 4, "&#10005;") + "";
    exportFunction(sendMsg, unsafeWindow, {defineAs: "sendMsg"});
}
