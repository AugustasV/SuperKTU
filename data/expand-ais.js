/* Extract url from a tr */
function getUrl(tr)
{
    var links = tr.getElementsByTagName('a');
    if (links.length < 2)
        return null;
    var url = links[1].href;
    return url.substring(url.lastIndexOf('/')+1, url.length);
}

/* Create a tr element with iframe and stuff */
function createRow(url)
{
    var tr = document.createElement('tr');
    tr.className = 'H';

    var td = document.createElement('td');
    td.colSpan = 10;

    var iframe = document.createElement('iframe');

    /* TODO: Better calculate iframe width/height */
    iframe.width = 790;
    iframe.height = 255;
    iframe.src = url;
    iframe.frameBorder = 0;

    tr.appendChild(td);
    td.appendChild(iframe);
    return tr;
}

/* Expand module rows in AIS */
function expandRows()
{
    var tr = document.querySelectorAll('tr');
    for (var i = 0; i < tr.length; i++) {
        if (tr[i].onmouseover) {
            var url = getUrl(tr[i]);
            if (!url)
                continue;

            tr[i].parentNode.insertBefore(createRow(url), tr[i+1]);
        }
    }
}

/* Remove two redundant columns */
function removeRedundantCols()
{
}

expandRows();
removeRedundantCols();
