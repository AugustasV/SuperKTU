'use strict';

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
        include: ['https://pastas.ktu.lt/',
                  'https://uais.cr.ktu.lt/ktuis/stp_prisijungimas'],
        contentScriptFile: data.url('skip-push-button.js'),
        contentScriptOptions: {status: simplePrefs.prefs.status}
    });
}

function createIfEnabled() {
    if (simplePrefs.prefs.skip) {
        createPM();
    } else {
        pm.destroy();
        pm = null;
    }
}

function onPrefChange(prefName) {
    if (prefName == 'skip')
        createIfEnabled();
}

simplePrefs.on('skip', onPrefChange);
createIfEnabled();
