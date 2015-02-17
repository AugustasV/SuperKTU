self.port.on("status", function(st) {
    var el = document.querySelector('setting[pref="extensions.jid1-wb5eyKYVTQKBOQ@jetpack.skip"]');
    if (el)
	if (st == "S")
	    el.style.display = '';
	else
	    el.style.display = 'none';
});
