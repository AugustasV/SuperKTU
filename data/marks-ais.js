var grades = document.querySelectorAll('td.grd');
var rating_system = {
    bad: ['NE', '00', '01', '02', '03', '04'],
    almost_bad: ['05', '06'],
    good: ['07'],
    very_good: ['08', '09', '10']
};
var st = [
    {size: '2px', type: 'solid', color: 'red'},
    {size: '2px', type: 'solid', color: 'orange'},
    {size: '2px', type: 'solid', color: 'yellow'},
    {size: '2px', type: 'solid', color: 'green'}
];

function get_category(grade)
{
    if (rating_system['bad'].indexOf(grade) > -1)
        return 0;
    else if (rating_system['almost_bad'].indexOf(grade) > -1)
        return 1;
    else if (rating_system['good'].indexOf(grade) > -1)
        return 2;
    else if (rating_system['very_good'].indexOf(grade) > -1)
        return 3;
    return -1;
}

function get_border_style(cat)
{
    if (cat >= 0 && cat < 4)
        return st[cat]['size'] + ' ' + st[cat]['type'] + ' ' + st[cat]['color'];
    else
        return '';
}

for (var item of grades) {
    var cat = get_category(item.innerHTML);
    var border_style = get_border_style(cat);
    item.style.border = border_style;
}
