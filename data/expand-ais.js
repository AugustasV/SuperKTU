'use strict';

/* Extract url from a tr */
function getUrl(tr)
{
    var links = tr.getElementsByTagName('a');
    if (links.length < 2)
        return null;
    var url = links[1].href;
    return url.substring(url.lastIndexOf('/')+1, url.length);
}

/* Remove student plan line */
function remove_sp(cont)
{
    var a = cont.querySelector('a');
    a.parentNode.removeChild(a);
}

/* Remove semester line */
function remove_sl(cont)
{
    var sl = cont.querySelectorAll('td[width="25%"]')[0];
    sl.parentNode.removeChild(sl);
}

/* Create a tr element with iframe and stuff */
function createRow(url)
{
    var tr = document.createElement('tr');
    tr.className = 'H';

    var td = document.createElement('td');
    td.colSpan = 12;

    var iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = 286;
    iframe.src = url;
    iframe.frameBorder = 0;
    iframe.style = 'border: 1px solid #CFCFCF;';
    iframe.onload = function() {
        remove_sp(iframe.contentDocument);
        remove_sl(iframe.contentDocument);
        iframe.height = iframe.contentWindow.document.body.offsetHeight + 41;
    }

    tr.appendChild(td);
    td.appendChild(iframe);

    return tr;
}

/* Expand module rows in AIS */
function expandRows()
{
    var expanded = false;
    var tr = document.querySelectorAll('tr');
    for (var i = 0; i < tr.length; i++) {
        if (tr[i].onmouseover) {
            var url = getUrl(tr[i]);
            if (!url)
                continue;

            tr[i].parentNode.insertBefore(createRow(url), tr[i+1]);
            expanded = true;
        }
    }
    return expanded;
}

/* Remove two redundant columns */
function removeRedundantCols()
{
    var title_cells = document.getElementsByClassName('cele12');
    title_cells[0].parentNode.deleteCell(4);
    title_cells[0].parentNode.deleteCell(3);
    title_cells[5].parentNode.deleteCell(4);
    title_cells[5].parentNode.deleteCell(3);

    var highlight_cells = document.querySelectorAll('tr[onmouseover]');
    var cell;
    for (cell of highlight_cells) {
        cell.deleteCell(9);
        cell.deleteCell(8);
    }
}

/* Stylistical changes */
function fixStyle()
{
    /* Some tr's are used like dashes but they are out of place now
     * so remove them by setting their style to "" */
    const cs = 10, style = 'border-top:1px solid silver; font-size:4pt;';

    var trs = document.getElementsByTagName('td');
    var tr;
    for (tr of trs)
        if (tr.colSpan === cs && tr.getAttribute('style') === style)
            tr.style = "";

    /* Add "width = 100%" style to the mark table to expand it
     * and make the expanded iframes adjust to the frameset cols */
    var table = document.querySelectorAll('table[cellspacing="0"]');
    if (table[0]) {
        table[0].style.width = '100%';
        /* Adjust the cols with "Exams" text to make it more in line */
        var exams = document.querySelectorAll('td[colspan="8"][align="right"]');
        for (var el of exams)
            el.colSpan = 6;
    }

}

function init() {
    if (expandRows()) {
        removeRedundantCols();
        fixStyle();
    }
}

init();
