var grades = document.querySelectorAll('td.grd');
var rating_system = {
    bad: ['NE', '00', '01', '02', '03', '04'],
    almost_bad: ['05', '06'],
    good: ['07'],
    very_good: ['08', '09', '10']
};

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

function get_border_style(category)
{
    if (category === 0)
        return "2px solid red";
    else if (category === 1)
        return "2px solid orange";
    else if (category === 2)
        return "2px solid yellow";
    else if (category === 3)
        return "2px solid green";
    return "";
}

for (var item of grades) {
    var cat = get_category(item.innerHTML);
    var border_style = get_border_style(cat);
    item.style.border = border_style;
}
