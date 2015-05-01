var data = require('sdk/self').data;
var simplePrefs = require('sdk/simple-prefs');
var pageMod = require('sdk/page-mod');
var pm = null;

function createPM() {
    if (pm !== null) {
        pm.destroy();
        pm = null;
    }

    pm = pageMod.PageMod({
        include: ['https://uais.cr.ktu.lt/ktuis/STUD.BUSENOS_PLANAS_FR*'],
        contentScriptFile: data.url('marks-ais.js')
    });
}

function createIfEnabled() {
    if (simplePrefs.prefs.enhance) {
        createPM();
    } else {
        pm.destroy();
        pm = null;
    }
}

function onPrefChange(prefName) {
    if (prefName == 'enhance')
        createIfEnabled();
}

simplePrefs.on('enhance', onPrefChange);
createIfEnabled();
