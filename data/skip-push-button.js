self.port.on("data", function (d) {
    if (window.location.href == "https://pastas.ktu.lt/") {
	if (d[1] == true) {
	    switch (d[0]) {
	    case "S":
		var el = document.querySelector('input[class="art-button"]');
		if (el)
		    el.click();
		break;
	    case "O":
		var el = document.querySelector('a[class="art-button"]');
		if (el)
		    el.click();
		break;
	    }
	}
    } else if (window.location.href == "https://uais.cr.ktu.lt/ktuis/stp_prisijungimas") {
	var el = document.querySelector('button[class="btn"]');
	if (el)
	    if (d[0] == "S" && d[1] == true)
		el.click();
    }
});
