'use strict';

/* Task influence page */
var ti = null;

var borders = {
    st: [
        {size: '2px', type: 'solid', color: 'red'},
        {size: '2px', type: 'solid', color: 'orange'},
        {size: '2px', type: 'solid', color: 'yellow'},
        {size: '2px', type: 'solid', color: 'green'}
    ],
    marks: {
        bad: 5,
        almost_bad: 6,
        good: 8
    },
    get_category: function(grade) {
        if (grade.length > 4 || grade.length === 0)
            return -1;
        if (grade === 'NE')
            return 0;

        var number = parseInt(grade);
        if (isNaN(number))
            return -1;

        if (number < this.marks.bad)
            return 0;
        else if (number < this.marks.almost_bad)
            return 1;
        else if (number < this.marks.good)
            return 2;
        else
            return 3;

        return -1;
    },
    get_border_style: function(cat) {
        if (cat >= 0 && cat < 4)
            return this.st[cat].size + ' ' + this.st[cat].type + ' ' + this.st[cat].color;
        else
            return '';

    },
    mark_marks: function() {
        var grades = document.querySelectorAll('td.grd');
        for (var item of grades) {
            var cat = this.get_category(item.innerHTML);
            var border_style = this.get_border_style(cat);
            item.style.border = border_style;
        }
    }
}

var cosmetic = {
    /* Removes task influence line */
    remove_ti: function(){
        const pos = 'relative';
        var table;
        var tables = document.querySelectorAll('table');
        for (table of tables) {
            if (table.style.position === pos) {
                ti = table.tBodies[0].childNodes[0].childNodes[1].childNodes[0].href;
                table.parentNode.removeChild(table);
            }
        }
    },
    /* Add a coefficient line */
    add_coef: function(){
        const cs = 4, ed = 4;
        const mline = 'tr.dtr';
        const clName = 'grd';
        const bd_style = '1px solid #C0C0C0';

        var mark_table = document.querySelector('tr.dtr').parentNode;
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

            if (i < cols-ed)
                empty_td.className = clName;
            if (i == cols-1)
                empty_td.style.borderRight = '1px solid #C0C0C0';

            coef_line.appendChild(empty_td);
        }

        mark_table.appendChild(coef_line);
    },
}

var core = {
    init: function(){
        borders.mark_marks();
        //cosmetic.remove_ti();
        //cosmetic.add_coef();
    },
}

core.init();
