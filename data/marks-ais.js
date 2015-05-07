var grades = document.querySelectorAll('td.grd');
var st = [
    {size: '2px', type: 'solid', color: 'red'},
    {size: '2px', type: 'solid', color: 'orange'},
    {size: '2px', type: 'solid', color: 'yellow'},
    {size: '2px', type: 'solid', color: 'green'}
];
var marks = {
    bad: 5,
    almost_bad: 6,
    good: 8,
};

function get_category(grade)
{
    if (grade.length > 4 || grade.length === 0)
        return -1;
    if (grade === 'NE')
        return 0;

    var number = parseInt(grade);
    if (isNaN(number))
        return -1;

    if (number < marks['bad'])
        return 0;
    else if (number <= marks['almost_bad'])
        return 1;
    else if (number < marks['good'])
        return 2;
    else
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

var cosmetic = {
    /* Removes task influence line */
    remove_ti: function(){
        const pos = 'relative';
        var tables = document.querySelectorAll('table');
        for (table of tables) {
            if (table.style.position === pos) {
                table.parentNode.removeChild(table);
            }
        }
    },
    /* Add a coefficient line */
    add_coef: function(){
        const cs = 4;
        const mline = 'tr.dtr';
        const clName = 'grd';

        var mark_table = document.querySelectorAll('tr.dtr')[0].parentNode;
        var cols = document.querySelector('.dtr_nb,.dtr').children.length - cs;

        var coef_line = document.createElement('tr');
        coef_line.className = 'dtr';

        var coef_col = document.createElement('td');
        coef_col.colSpan = cs;
        coef_col.innerHTML = self.options.coef_text;
        coef_col.className = clName;

        coef_line.appendChild(coef_col);

        for (var i = 0; i < cols; i++) {
            var empty_td = document.createElement('td');
            empty_td.className = clName;
            coef_line.appendChild(empty_td);
        }

        mark_table.appendChild(coef_line);
    },
}

var core = {
    init: function(){
        cosmetic['remove_ti']();
        cosmetic['add_coef']();
    },
}

//core['init']();
