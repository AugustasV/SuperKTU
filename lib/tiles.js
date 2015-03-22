var ss = require('sdk/simple-storage');
var pageMod = require('sdk/page-mod');
var data = require('sdk/self').data;
const numOfTiles = 7;
var workers = [];
var valid = true;
var simplePrefs = require('sdk/simple-prefs');
var pm = null;
var _ = require('sdk/l10n').get;

function createTile(tid, status) {
    // unique type identifier [0; numOfTiles]
    this.id = tid;
    // is the tile shown or not?
    this.status = status;
}

if (!ss.storage.tiles) {
    ss.storage.tiles = [];
    for (var i = 0; i <= numOfTiles; i++)
        ss.storage.tiles.push(new createTile(i, true));
}

function createPageMod() {
    pm = pageMod.PageMod({
        include: ['https://uais.cr.ktu.lt/ktuis/stud.busenos*',
                  'https://uais.cr.ktu.lt/ktuis/vs.pirmas*',
                  'https://uais.cr.ktu.lt/ktuis/vs.pirmas?p_lang=ENG*',
                  'https://uais.cr.ktu.lt/ktuis/vs.pirmas?p_lang=LTU*'],
        contentScriptFile: data.url('tiles-ais.js'),
        contentScriptOptions: {'enabled': simplePrefs.prefs.tiles,
                               'tiles': ss.storage.tiles,
                               'rtext': _('reset')},
        onAttach: function(worker) {
            worker.port.on('load', function(data) {
                ss.storage.tiles = data;
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
