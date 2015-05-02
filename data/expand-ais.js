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

    iframe.width = 790;
    iframe.height = 253;
    iframe.src = url;
    iframe.frameBorder = 0;
    iframe.style = "border: 1px solid black;";

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
/* These are all hardcoded values from the AIS */
function removeRedundantCols()
{
    var title_cells = document.getElementsByClassName('cele12');
    title_cells[0].parentNode.deleteCell(4);
    title_cells[0].parentNode.deleteCell(3);
    title_cells[5].parentNode.deleteCell(4);
    title_cells[5].parentNode.deleteCell(3);

    var highlight_cells = document.querySelectorAll('tr[onmouseover]');
    for (cell of highlight_cells) {
        cell.deleteCell(9);
        cell.deleteCell(8);
    }
}

if (expandRows())
    removeRedundantCols();
