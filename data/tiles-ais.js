const numOfTiles = 7;
const selector = "div[class='span4']";
const tSelector = 'h4';
var enabled, op = 0, hidden = false;
var titles = document.getElementsByTagName(tSelector);
var tiles = self.options.tiles;

/* Is the element whose id is id visible? */
function isVisible(id) {
    var el = _getNthElement(id);
    if (el && el.style.display && el.style.display == 'none')
        return false;
    return true;
}

/* Sanity check for element ids */
function checkIfGood(id) {
    if (id < 0 || id > numOfTiles)
        return false;
    return true;
}

/*
 * Function exported to other JS in browser
 * that sends messages according to the code
 * to other function in this content script
 */
function sendMsg(id, code) {
    var ret;

    if (!checkIfGood(id)) {
        window.alert('Unexpected error. Wrong id in sendMsg()');
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
}

/* String builder for clickable buttons */
function constructButton(id, code, text) {
    return "<a onclick='window.sendMsg(" + id + ', ' + code + ")' href=\"#\">" + text + '</a>';
}

/* Hide the tile whose id is id */
function hide(id) {
    var ret = _hideTile(id);
    if (ret) {
        /*
         * TODO: When we already hid some things
         * the id which user clicked may not be
         * the real id (when hiding things)
         * 
         * *** NOW THE USER CAN'T HIDE HALF OF THE TILES ***
         */
        tiles[id].status = false;
        return true;
    }
    return false;
}

/* Tile moving functions - left, right, up, down */
function left(id) {
    return switchTiles(id, id - 1);
}

function right(id) {
    return switchTiles(id, id + 1);
}

function up(id) {
    return switchTiles(id, id - 3);
}

function down(id) {
    return switchTiles(id, id + 3);
}

/* Switch tiles content and data in tiles array */
function switchTiles(id_a, id_b) {
    var ret = _switchContent(id_a, id_b);
    if (ret) {
        var temp = tiles[id_a];
        tiles[id_a] = tiles[id_b];
        tiles[id_b] = temp;
        return true;
    }
    return false;
}

/* Get Nth tile info */
function _getNthElement(id) {
    if (!checkIfGood(id))
        return false;
    var matchedTiles = document.querySelectorAll(selector);
    return matchedTiles[id];
}

/* Really switch tiles with ids id_a and id_b (the content) */
function _really_switch(id_a, id_b) {
    var el_a = _getNthElement(id_a), el_b = _getNthElement(id_b);
    titles[id_a].innerHTML = titles[id_a].innerHTML.replace('sendMsg(' + id_a, 'sendMsg(' + id_b, 'g');
    titles[id_b].innerHTML = titles[id_b].innerHTML.replace('sendMsg(' + id_b, 'sendMsg(' + id_a, 'g');
    var temp_html = el_b.innerHTML;
    el_b.innerHTML = el_a.innerHTML;
    el_a.innerHTML = temp_html;
    return true;
}

/* Switch tiles id_a and id_b contents (with sanity checks) */
function _switchContent(id_a, id_b) {
    if (!checkIfGood(id_a) || !checkIfGood(id_b))
        return false;
    if (!op && (!isVisible(id_a) || !isVisible(id_b)))
        return false;

    _really_switch(id_a, id_b);
    return true;
}

/* Hide tile whose id is id */
function _hideTile(id) {
    if (!checkIfGood(id))
        return false;

    var til = document.querySelectorAll(selector);
    var visTile = numOfTiles;
    while (visTile >= 0 && til[visTile].style.display &&
            til[visTile].style.display == 'none')
        visTile--;
    if (visTile >= 0)
        til[visTile].style.display = 'none';
    return _really_switch(id, visTile);
}

/* Stuff that only happens if the user wants this functionality */
if (self.options.enabled) {
    /* Build the user facing buttons in AIS */
    for (var i = 0; i <= numOfTiles; i++)
        // Left Right Down Up Close
        titles[i].innerHTML += '' +
        ' ' + constructButton(i, 0, '&#9668;') +
        ' ' + constructButton(i, 1, '&#9658;') +
        ' ' + constructButton(i, 2, '&#9660;') +
        ' ' + constructButton(i, 3, '&#9650;') +
        ' ' + constructButton(i, 4, '&#10005;');

    /* Export the function */
    exportFunction(sendMsg, unsafeWindow, {defineAs: 'sendMsg'});

    /* On unload please send the tiles info back */
    window.onbeforeunload = function() {
        if (tiles != null)
            self.port.emit('load', tiles);
    };

    /* Make everything like it was in the tiles array */
    var switched = [];
    for (var i = 0; i <= numOfTiles; i++) {
        var el = findEl(i);
        var log = (el != null && tiles[i].id != i && !inside(switched,tiles[i].id));
        if (log) {
            _switchContent(i, el);
            switched.push(i);
        }

        if (!tiles[i].status)
            _hideTile(tiles[i].id);
    }
}

/* HELPER FUNCTIONS */
/* Find element in tiles array whose id property is id */
function findEl(id) {
    var cur = 0;
    for (tile of tiles) {
        if (tile.id == id)
            return cur;
        cur++;
    }
    return null;
}

/* Check if sk is inside mas */
function inside(mas, sk) {
    for (var i = 0; i < mas.length; i++)
        if (mas[i] == sk)
            return true;
    return false;
}
