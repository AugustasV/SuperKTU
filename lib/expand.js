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
        include: ['https://uais.cr.ktu.lt/ktuis/STUD_SS.planas_busenos*'],
        contentScriptFile: data.url('expand-ais.js')
    });
}

function createIfEnabled() {
    if (simplePrefs.prefs.expand) {
        createPM();
    } else {
        pm.destroy();
        pm = null;
    }
}

function onPrefChange(prefName) {
    if (prefName == 'expand')
        createIfEnabled();
}

simplePrefs.on('expand', onPrefChange);
createIfEnabled();
