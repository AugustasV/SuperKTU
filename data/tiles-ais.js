var tiles;
const numOfTiles = 7;
const selector = "div[class='span4']";

self.port.on("load", function (data) {
    tiles = data;
});

function checkIfGood(id) {
    if (id < 0 || id > numOfTiles)
	return false;
    return true;
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
