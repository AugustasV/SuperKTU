'use strict';

/* Selector for tiles, titles and buttons */
const selector = 'div[class="span4"]';
const tSelector = 'h4';
const bClass = 'nav nav-secondary';

/* Buttons */
const bLeft = '&#9668;';
const bRight = '&#9658;';
const bDown = '&#9660;';
const bUp = '&#9650;';
const bClose = '&#10005;';

/* Was the last operation a hiding op. ? */
var op = 0;

/* Live elements of tiles titles */
var titles = document.getElementsByTagName(tSelector);

/* Number of tiles (starting from 0) */
var numOfTiles = titles.length;

/* Tiles data from lib/ */
var tiles = self.options.tiles;

/* Hidden array - how hidden ids are distributed */
var hidden = [];

/* Initialize everything */
function init() {
    /* Build the user facing buttons in AIS */
    for (var i = 0; i < numOfTiles; i++)
        // Left Right Down Up Close
        titles[i].innerHTML += '<span style="float:right;">' +
            ' ' + constructButton(i, 0, bLeft) +
            ' ' + constructButton(i, 1, bRight) +
            ' ' + constructButton(i, 2, bDown) +
            ' ' + constructButton(i, 3, bUp) +
            ' ' + constructButton(i, 4, bClose) + '</span>';

    /* Export the function */
    exportFunction(sendMsg, unsafeWindow, {defineAs: 'sendMsg'});

    /* On unload please send the tiles info back */
    window.onbeforeunload = function() {
        if (tiles !== null)
            self.port.emit('load', tiles);
    };

    /* Fill the hidden array, initialize/fix tiles */
    for (i = 0; i < numOfTiles; i++)
        hidden.push(i);

    if (tiles.length != numOfTiles) {
        tiles = [];
        for (i = 0; i < numOfTiles; i++)
            tiles.push(new createTile(i, true));
        self.port.emit('load', tiles);
    }

    /* Make everything like it was in the tiles array */
    for (i = 0; i < numOfTiles; i++) {
        while (hidden[i] != tiles[i].id) {
            var el = findEl(hidden[i]);
            hidden.swap(i, el);
            _switchContent(i, el);
        }
    }

    for (i = 0; i < numOfTiles; i++) {
        if (!tiles[i].status) {
            var curVisible = _visTile();
            var index = hidden.indexOf(tiles[i].id);
            if (index <= curVisible) {
                _hideTile(index);
                hidden.swap(curVisible, index);
            }
        }
    }

    /* Export reset state function */
    exportFunction(resetState, unsafeWindow, {defineAs: 'resetState'});

    /* Add the new button */
    var buttons = document.getElementsByClassName(bClass);
    buttons[0].innerHTML += '<li><a href="#" target="_self" onclick="window.resetState()">' + self.options.rtext + '</a></li>';
}

/* Is the element whose id is id visible? */
function isVisible(id) {
    var el = _getNthElement(id);
    if (el && el.style.display && el.style.display == 'none')
        return false;
    return true;
}

/* Create a tile object */
function createTile(tid, status) {
    this.id = tid;
    this.status = status;
}

/* Sanity check for element ids */
function checkIfGood(id) {
    if (id < 0 || id >= numOfTiles)
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
        default:
            window.alert('Unknown code in sendMsg()');
            return false;
    }
    return ret;
}

/* String builder for clickable buttons */
function constructButton(id, code, text) {
    return '<a onclick="window.sendMsg(' + id + ', ' + code + ')" href="#">' + text + '</a>';
}

/* Hide the tile whose id is id */
function hide(id) {
    var curHidden = _visTile();
    var ret = _hideTile(id);
    if (ret && curHidden >= 0) {
        for (var tile of tiles)
            if (tile.id == hidden[id])
                tile.status = false;

        hidden.swap(id, curHidden);
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
        tiles.swap(id_a, id_b);
        return true;
    }
    return false;
}

/* Get Nth tile info */
function _getNthElement(id) {
    if (!checkIfGood(id))
        return null;
    var matchedTiles = document.querySelectorAll(selector);
    return matchedTiles[id];
}

/* Really switch tiles with ids id_a and id_b (the content) */
function _really_switch(id_a, id_b) {
    var el_a = _getNthElement(id_a), el_b = _getNthElement(id_b);
    if (!el_a || !el_b)
        return false;

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

/* Get the current visible tile */
function _visTile() {
    var til = document.querySelectorAll(selector);
    var visTile = numOfTiles - 1;
    while (visTile >= 0 && til[visTile].style.display &&
           til[visTile].style.display == 'none')
        visTile--;
    return visTile;
}

/* Hide tile whose id is id */
function _hideTile(id) {
    if (!checkIfGood(id))
        return false;

    var til = document.querySelectorAll(selector);
    var visTile = _visTile();
    if (visTile >= 0)
        til[visTile].style.display = 'none';
    return _really_switch(id, visTile);
}

/* Revert all stuff into original state */
function resetState() {
    /*
     * Iterate two times: over the hidden array and *then* tiles array
     *
     * hidden array changes are more important than tiles array changes
     *
     * On each iteration try very hard to make it go back to the original state
     * each tile and element in the hidden/tiles array
     * Just to be safe at the end reset every element to the original values
     */

    for (var i = 0; i < numOfTiles; i++) {
        while (hidden[i] != i) {
            for (var j = i + 1; j < numOfTiles; j++)
                if (hidden[j] == i) {
                    _really_switch(j, i);
                    hidden.swap(j, i);
                    break;
                }
        }
    }

    for (var i = 0; i < numOfTiles; i++) {
        while (tiles[i].id != i) {
            for (var j = i + 1; j < numOfTiles; j++)
                if (tiles[j].id == i) {
                    _really_switch(j, i);
                    tiles.swap(j, i);
                    break;
                }
        }
    }

    for (var i = 0; i < numOfTiles; i++) {
        tiles[i].status = true;
        _getNthElement(i).style.display = '';
        hidden[i] = i;
        tiles[i].id = i;
    }

    self.port.emit('load', tiles);
}

/* HELPER FUNCTIONS */
/* Find element in tiles array whose id property is id */
function findEl(id) {
    var cur = 0;
    var tile;
    for (tile of tiles) {
        if (tile.id == id)
            return cur;
        cur++;
    }
    return null;
}

Array.prototype.swap = function(a, b) {
    var temp = this[b];
    this[b] = this[a];
    this[a] = temp;
    return this;
};

/* Check if el is inside arr */
function inside(arr, el) {
    return arr.indexOf(el) != -1;
}

init();
