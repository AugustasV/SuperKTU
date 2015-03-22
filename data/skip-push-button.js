var pastas = 'https://pastas.ktu.lt/';
var stp = 'https://uais.cr.ktu.lt/ktuis/stp_prisijungimas';
if (window.location.href == pastas) {
    var el;
    switch (self.options.status) {
        case false:
            el = document.querySelector('input[class="art-button"]');
            break;
        case true:
            el = document.querySelector('a[class="art-button"]');
            break;
    }
    if (el)
        el.click();
} else if (window.location.href == stp) {
    var el = document.querySelector('button[class="btn"]');
    if (el && self.options.status)
        el.click();
}
