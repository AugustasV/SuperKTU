self.port.on("data", function (d) {
    var el = document.querySelector('button[class="btn"]');
    if (el)
	if (d[0] == "S" && d[1] == true)
	    el.click();
});
