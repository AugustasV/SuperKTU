'use strict';

var ss = require('sdk/simple-storage');
var pageMod = require('sdk/page-mod');
var data = require('sdk/self').data;
var simplePrefs = require('sdk/simple-prefs');
var pm = null;
var _ = require('sdk/l10n').get;

if (!ss.storage.tiles)
    ss.storage.tiles = [];

function createPageMod() {
    pm = pageMod.PageMod({
        include: ['https://uais.cr.ktu.lt/ktuis/stud.busenos*',
                  'https://uais.cr.ktu.lt/ktuis/vs.pirmas*'],
        contentScriptFile: data.url('tiles-ais.js'),
        contentScriptOptions: {'tiles': ss.storage.tiles,
                               'rtext': _('reset')},
        onAttach: function(worker) {
            worker.port.on('load', function(data) {
                ss.storage.tiles = data;
                onPrefChange('load');
            });
        }
    });
}

function createIfEnabled() {
    if (simplePrefs.prefs.tiles === true)
        createPageMod();
}

function onPrefChange(prefName) {
    if (prefName == 'tiles' || prefName == 'load') {
        if (pm !== null) {
            pm.destroy();
            pm = null;
        }
        createIfEnabled();
    }
}

simplePrefs.on('tiles', onPrefChange);
createIfEnabled();
