var data = require('sdk/self').data;
var simplePrefs = require('sdk/simple-prefs').prefs;
var pageMod = require('sdk/page-mod');

pageMod.PageMod({
    include: ['https://pastas.ktu.lt/',
              'https://uais.cr.ktu.lt/ktuis/stp_prisijungimas'],
    contentScriptFile: data.url('skip-push-button.js'),
    onAttach: function(worker) {
        worker.port.emit('data', [simplePrefs.status, simplePrefs.skip]);
    }
});
