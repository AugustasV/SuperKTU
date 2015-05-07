var data = require('sdk/self').data;
var simplePrefs = require('sdk/simple-prefs');
var pageMod = require('sdk/page-mod');
var pm = null;
var _ = require('sdk/l10n').get;

function createPM() {
    if (pm !== null) {
        pm.destroy();
        pm = null;
    }

    pm = pageMod.PageMod({
        include: ['https://uais.cr.ktu.lt/ktuis/ZINIARCSS3.ZINIARASTIS_STUD_MATR*'],
        contentScriptFile: data.url('marks-ais.js'),
        contentScriptOptions: {'coef_text': _('coef_text')}
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
