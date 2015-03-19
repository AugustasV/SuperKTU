var pastas = 'https://pastas.ktu.lt/';
var stp = 'https://uais.cr.ktu.lt/ktuis/stp_prisijungimas';
self.port.on('data', function(d) {
    if (window.location.href == pastas) {
        if (d[1]) {
            var el;
            switch (d[0]) {
                case false:
                    el = document.querySelector('input[class="art-button"]');
                    break;
                case true:
                    el = document.querySelector('a[class="art-button"]');
                    break;
            }
            if (el)
                el.click();
        }
    } else if (window.location.href == stp) {
        var el = document.querySelector('button[class="btn"]');
        if (el && d[0] && d[1])
            el.click();
    }
});
