var ss = require('sdk/simple-storage');
var pageMod = require('sdk/page-mod');
var data = require('sdk/self').data;
const numOfTiles = 7;
var workers = [];
var valid = true;
var simplePrefs = require('sdk/simple-prefs');
var pm = null;
var tileStore = ss.storage.tiles;

function createTile(tid, status) {
    // unique type identifier [0; numOfTiles]
    this.id = tid;
    // is the tile shown or not?
    this.status = status;
}

if (!tileStore)
    valid = false;
else
    for (tile of tileStore) {
        if (!(id in tile) || !(status in tile) ||
                tile.id > numOfTiles || tile.id < 0 ||
                typeof(tile.status) !== 'boolean' ||
                typeof(tile.id) !== 'number') {
            valid = false;
            break;
        }
    }

if (!valid) {
    var id = 0;

    tileStore = [];
    while (id <= numOfTiles) {
        tileStore.push(new createTile(id, true));
        id++;
    }
}

function createPageMod() {
    pm = pageMod.PageMod({
        include: ['https://uais.cr.ktu.lt/ktuis/stud.busenos',
                  'https://uais.cr.ktu.lt/ktuis/stud.busenos#',
                  'https://uais.cr.ktu.lt/ktuis/vs.pirmas',
                  'https://uais.cr.ktu.lt/ktuis/vs.pirmas#'],
        contentScriptFile: data.url('tiles-ais.js'),
        contentScriptOptions: {'enabled': simplePrefs.prefs.tiles,
                               'tiles': tileStore},
        onAttach: function(worker) {
            worker.port.on('load', function(data) {
                tileStore = data;
                onPrefChange('load');
            });
        }
    });
}

function onPrefChange(prefName) {
    if (prefName == 'tiles' || prefName == 'load') {
        if (pm != null) {
            pm.destroy();
            pm = null;
        }
        createPageMod();
    }
}

simplePrefs.on('tiles', onPrefChange);
createPageMod();
