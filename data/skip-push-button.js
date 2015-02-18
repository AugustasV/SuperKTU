self.port.on("data", function (d) {
    if (window.location.href == "https://pastas.ktu.lt/") {
	if (d[1]) {
	    var el;
	    switch (d[0]) {
	    case "S":
		el = document.querySelector('input[class="art-button"]');
		break;
	    case "O":
		el = document.querySelector('a[class="art-button"]');
		break;
	    }
	    if (el)
		el.click();
	}
    } else if (window.location.href == "https://uais.cr.ktu.lt/ktuis/stp_prisijungimas") {
	var el = document.querySelector('button[class="btn"]');
	if (el && d[0] == "S" && d[1])
		el.click();
    }
});
